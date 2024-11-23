import { GET_MEDIA_ASSET } from '@/clients/queries';
import { GetMediaAssetQuery } from '@/graphql/graphql';
import { ImageMetadata } from '@/types/conversation';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

type ImageLoaderProps = {
  images: ImageMetadata[];
};

export function ImageLoader(props: ImageLoaderProps): React.ReactElement {
  const [images, setImages] = useState<string[]>([]);

  const [getMediaAsset] = useLazyQuery<GetMediaAssetQuery>(GET_MEDIA_ASSET);

  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await Promise.all(
        props.images.map(async (image) => {
          const result = await getMediaAsset({
            variables: {
              id: image.id,
            },
          });

          return result.data?.getMediaAsset;
        }),
      );

      setImages(imageUrls.filter((url) => url !== undefined) as string[]);
    };

    fetchImages();
  }, [props.images, getMediaAsset]);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={image} className="w-full object-cover rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
