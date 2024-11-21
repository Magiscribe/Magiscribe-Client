import { ADD_MEDIA_ASSET } from '@/clients/mutations';
import { GET_MEDIA_ASSET } from '@/clients/queries';
import { AddMediaAssetMutation, GetMediaAssetQuery } from '@/graphql/graphql';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { ImageMetadata } from '@/types/conversation';
import { uploadImageToS3 } from '@/utils/s3';
import { useLazyQuery, useMutation } from '@apollo/client';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';
import Button from '../controls/button';
import Input from '../controls/input';
import { useNodeData } from '../graph/utils';

type ImageUploaderProps = {
  nodeId: string;
  images: ImageMetadata[];
};

export function ImageUploader({ nodeId, images }: ImageUploaderProps): React.ReactElement {
  const { updateNodeImages } = useNodeData(nodeId);

  const [displayImages, setDisplayImages] = useState<{ id: string; url: string }[]>([]);

  // Inquiry
  const { updateMetadata, metadata } = useInquiryBuilder();

  // Apollo
  const [addMediaAsset] = useMutation<AddMediaAssetMutation>(ADD_MEDIA_ASSET);
  const [getMediaAsset] = useLazyQuery<GetMediaAssetQuery>(GET_MEDIA_ASSET);

  useEffect(() => {
    const fetchImages = async () => {
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

  const uploadImage = useCallback(
    async (image: File) => {
      const { data } = await addMediaAsset();
      if (!data?.addMediaAsset) throw new Error('Failed to generate signed s3 url for image');
      const { signedUrl, id } = data.addMediaAsset;
      await uploadImageToS3(signedUrl, image);
      updateMetadata({ ...metadata, images: [...metadata.images, { id }] });
      return id;
    },
    [addMediaAsset],
  );

  const deleteImage = async (id: string) => {
    updateNodeImages(images.filter((image) => image.id !== id));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileIds = await Promise.all(
        Array.from(files).map(async (file) => {
          return await uploadImage(file);
        }),
      );
      const newImageMetadata = fileIds.map((file) => ({ id: file }));
      updateNodeImages(images ? [...images, ...newImageMetadata] : newImageMetadata);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          label="Upload Images"
          name="image-upload"
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>
      {displayImages.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Uploaded Images</label>
          <div className="flex flex-wrap gap-2">
            {displayImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                <Button
                  iconLeft={faX}
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
    </div>
  );
}
