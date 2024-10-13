import { ImageMetadata } from '@/types/conversation';
import { useImageDownload } from './image-uploader';
import { useEffect, useState } from 'react';

type ImageLoaderProps = {
  images: ImageMetadata[];
};

export function ImageLoader(props: ImageLoaderProps): React.ReactElement {
  const downloadImage = useImageDownload();
  const [base64Images, setBase64Images] = useState<string[]>([]);
  useEffect(() => {
    // Download the node images from s3
    (async () => {
      if (props.images) {
        const images = await Promise.all(props.images?.map(async (image) => await downloadImage(image)));
        setBase64Images(images);
      }
    })();
  }, [props.images]);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {base64Images.map((image, index) => (
          <div key={index} className="relative">
            <img src={image} alt={`image ${index + 1}`} className="w-40 h-40 object-cover rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
