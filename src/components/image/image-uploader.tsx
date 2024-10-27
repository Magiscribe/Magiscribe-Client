import { ADD_MEDIA_ASSET, DELETE_MEDIA_ASSET, GET_MEDIA_ASSET } from '@/clients/mutations';
import { ImageMetadata } from '@/types/conversation';
import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ImageUploaderProps = {
  nodeId: string;
  images: ImageMetadata[];
  handleUpdateNodeImages: (images: ImageMetadata[]) => void;
};

type FileWithS3Key = {
  file: File;
  s3Key: string;
};

function useImageUpload() {
  const [addMediaAsset] = useMutation(ADD_MEDIA_ASSET);

  const uploadImage = useCallback(async (image: File, s3Key: string) => {
    const signedUrl = await addMediaAsset({
      variables: {
        s3Key,
      },
    });

    const s3Url = signedUrl.data['addMediaAsset'];
    console.log('Image url: ' + s3Url);
    await uploadImageToS3(s3Url, image);
    console.log(`Successfully uploaded ${image.name} to s3 via signed url ${s3Url}`);
    // Load: In survey, get s3 signed url and load / render image if applicable in each node. Auto download images corresponding to each node
    // When an image is deleted, delete it from s3
    // Bonus: Option to select already uploaded images for survey?
    // Will need to update buildout / terraform to add cors policy to the s3 bucket in each environment
  }, []);

  return uploadImage;
}

export function useImageDownload() {
  const [getMediaAsset] = useMutation(GET_MEDIA_ASSET);

  const downloadImage = useCallback(
    async (image: ImageMetadata) => {
      const signedUrl = await getMediaAsset({
        variables: {
          s3Key: image.s3Key,
        },
      });

      const s3Url = signedUrl.data?.['getMediaAsset'];
      console.log('Image download url: ' + s3Url);
      const response = await downloadImageFromS3(s3Url);

      return response;
    },
    [getMediaAsset],
  );
  return downloadImage;
}

type IUseImageDelete = {
  deleteImage: (s3KeyToDelete: string) => Promise<void>;
  deleteImages: (images: ImageMetadata[]) => Promise<void>;
}

export function useImageDelete(): IUseImageDelete {
  const [deleteMediaAsset] = useMutation(DELETE_MEDIA_ASSET);
  const deleteImage = useCallback(async (s3KeyToDelete: string) => {
    await deleteMediaAsset({
      variables: {
        s3Key: s3KeyToDelete,
      },
     })
  },[deleteMediaAsset])

  const deleteImages = useCallback(async (images: ImageMetadata[]) => {
    await Promise.all(images?.map(async (image) => await deleteImage(image.s3Key)));
  }, [deleteImage])

  return {deleteImage, deleteImages};
}

async function uploadImageToS3(presignedUrl: string, file: File) {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function downloadImageFromS3(presignedUrl: string) {
  try {
    // Download the image from s3 using the pre-signed url
    const response = await fetch(presignedUrl);

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Convert the image from s3 into the data url format
    const responseBlob = await response.blob();
    let dataUrl = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(responseBlob);
    });
    return dataUrl as string;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export function ImageUploader(props: ImageUploaderProps): React.ReactElement {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const uploadImage = useImageUpload();
  const downloadImage = useImageDownload();
  const {deleteImage} = useImageDelete();

  useEffect(() => {
    // Download the node images from s3
    (async () => {
      if (props.images) {
        try {
          const images = await Promise.all(props.images?.map(async (image) => await downloadImage(image)));
          setBase64Images(images);
        } catch (exception) {
          console.log('Image load failed: ' + exception);
        }
      } else if (base64Images.length > 0) {
        // If the only image on a node was deleted, then set the images state to empty
        setBase64Images([]);
      }
    })();
  }, [props.images]);

  const handleImageDelete = async function (imageIndex: number) {
    // TODO: Verify that image deletion was successful before removing the image from the graph
    props.handleUpdateNodeImages(props.images.filter((_, i) => i !== imageIndex));
    const s3KeyToDelete = props.images[imageIndex].s3Key;
    await deleteImage(s3KeyToDelete) 
  };

  /**
   * Handles the image upload and conversion to base64.
   * @param event {React.ChangeEvent<HTMLInputElement>} The change event.
   */
  const handleImageUpload = async function (event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      // Generate an s3 key for each image to upload
      const filesWithS3Key = Array.from(files).map((file) => {
        const fileWithS3Key: FileWithS3Key = {
          file,
          s3Key: `${file.type}/${uuidv4()}.${file.name + '_' + props.nodeId}`,
        };
        return fileWithS3Key;
      });
      // Upload each file to s3
      await Promise.all(Array.from(filesWithS3Key).map(async (fileWithS3Key) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Images((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(fileWithS3Key.file);
        return await uploadImage(fileWithS3Key.file, fileWithS3Key.s3Key);
      }));

      // Save image metadata to the graph node
      const newImageMetadata = Array.from(filesWithS3Key).map((file) => {
        const metadata: ImageMetadata = {
          s3Key: file.s3Key,
        };
        return metadata;
      });
      props.handleUpdateNodeImages(props.images ? [...props.images, ...newImageMetadata] : newImageMetadata);
    }
  };

  // Handle image delete

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="image-upload">
          Upload Images
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="border-2 border-gray-200 p-2 rounded-lg w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Uploaded Images</label>
        <div className="flex flex-wrap gap-2">
          {base64Images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleImageDelete(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
