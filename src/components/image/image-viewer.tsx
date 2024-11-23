import { faX } from '@fortawesome/free-solid-svg-icons';

import Button from '../controls/button';
import { useNodeData } from '../graph/utils';

type ImageUploaderProps = {
  nodeId: string;
  images: { id: string; url: string }[];
};

export function ImageUploader({ nodeId, images }: ImageUploaderProps): React.ReactElement {
  const { updateNodeImages } = useNodeData(nodeId);

  const deleteImage = async (id: string) => {
    updateNodeImages(images.filter((image) => image.id !== id));
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">Uploaded Images</label>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.url} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded" />
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
    </div>
  );
}
