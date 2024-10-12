import { ADD_MEDIA_ASSET } from "@/clients/mutations";
import { useMutation } from "@apollo/client";
import { useCallback, useState } from "react";

type ImageUploaderProps = {
  nodeId: string;
};

function useImageUpload() {
  const [addMediaAsset] = useMutation(ADD_MEDIA_ASSET);

  const uploadImage = useCallback(async (image: File, nodeId: string) => {
    const fileName = image.name + "_" + nodeId;
    const fileType = image.type;
    const signedUrl = await addMediaAsset({
        variables: {
            fileName,
            fileType
        }
    })
    
    const s3Url = signedUrl.data["addMediaAsset"]
    console.log("Image url: " + s3Url)
    // TODO: upload image to s3, update graph node with image url
  },[])

  return uploadImage

}

export function ImageUploader(props: ImageUploaderProps): React.ReactElement {
   const [base64Images, setBase64Images] = useState<string[]>([]);
   const uploadImage = useImageUpload();
  /**
   * Handles the image upload and conversion to base64.
   * @param event {React.ChangeEvent<HTMLInputElement>} The change event.
   */
  const handleImageUpload = async function (event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(async (file) => {
        const reader = new FileReader();
        await uploadImage(file, props.nodeId)
        reader.onloadend = () => {
          setBase64Images((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

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
                onClick={() => setBase64Images(base64Images.filter((_, i) => i !== index))}
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
