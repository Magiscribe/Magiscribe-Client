import { ADD_MEDIA_ASSET } from '@/clients/mutations';
import { GET_MEDIA_ASSET } from '@/clients/queries';
import { AddMediaAssetMutation, GetMediaAssetQuery } from '@/graphql/graphql';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { ImageMetadata } from '@/types/conversation';
import { uploadImageToS3 } from '@/utils/s3';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import Button from '../../controls/button';
import ImageUploadModal from '../../modals/inquiry/image-upload-modal';
import { useNodeData } from '../utils';

type ImageUploaderProps = {
  nodeId: string;
  images: ImageMetadata[];
};

export function S3ImageNodeUploader({ nodeId, images }: ImageUploaderProps): React.ReactElement {
  const { updateNodeImages } = useNodeData(nodeId);

  // Inquiry
  const { updateMetadata, metadata } = useInquiryBuilder();

  // State
  const [displayImages, setDisplayImages] = useState<{ id: string; url: string }[]>([]);

  // Apollo
  const [addMediaAsset] = useMutation<AddMediaAssetMutation>(ADD_MEDIA_ASSET);
  const [getMediaAsset] = useLazyQuery<GetMediaAssetQuery>(GET_MEDIA_ASSET);

  useEffect(() => {
    const fetchImages = async () => {
      if (!images) return;

      const signedImages = await Promise.all(
        images.map(async (image) => {
          const result = await getMediaAsset({
            variables: {
              id: image.id,
            },
          });

          return {
            id: image.id,
            url: result.data?.getMediaAsset,
          };
        }),
      );

      setDisplayImages(signedImages.filter((image) => image.url !== undefined) as { id: string; url: string }[]);
    };

    fetchImages();
  }, [images, getMediaAsset]);

  /**
   * Uploads an image to S3 and updates node metadata and display images
   *
   * @param {Blob} image - The image blob to be uploaded
   * @throws {Error} If failed to generate signed URL or upload fails
   * @returns {Promise<void>}
   */
  const uploadImage = async (image: Blob): Promise<void> => {
    const { data } = await addMediaAsset();
    if (!data?.addMediaAsset) throw new Error('Failed to generate signed s3 url for image');

    // Extract URL and ID from response and upload image to S3
    const { signedUrl, id } = data.addMediaAsset;
    await uploadImageToS3(signedUrl, image);

    // Update metadata with new image
    const updatedMetadataImages = [...metadata.images, { id }];
    updateMetadata({
      ...metadata,
      images: updatedMetadataImages,
    });

    // Update display images array
    const updatedDisplayImages = displayImages ? [...displayImages, { id }] : [{ id }];
    updateNodeImages(updatedDisplayImages);
  };

  const deleteImage = async (id: string) => {
    updateNodeImages(images.filter((image) => image.id !== id));
  };

  return (
    <>
      {images?.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Uploaded Images</label>
          <div className="flex flex-wrap gap-2">
            {displayImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded-sm" />
                <Button
                  icon={faX}
                  type="button"
                  variant="transparentDanger"
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-0 right-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ImageUploadModal
        onUpload={async (blob) => {
          await uploadImage(blob);
        }}
      />
    </>
  );
}
