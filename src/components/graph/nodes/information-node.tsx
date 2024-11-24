import { ADD_MEDIA_ASSET } from '@/clients/mutations';
import { GET_MEDIA_ASSET } from '@/clients/queries';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { ImageUploader } from '@/components/image/image-viewer';
import ImageUploadModal from '@/components/modals/inquiry/image-upload-modal';
import { AddMediaAssetMutation, GetMediaAssetQuery } from '@/graphql/graphql';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { ImageMetadata } from '@/types/conversation';
import { uploadImageToS3 } from '@/utils/s3';
import { useLazyQuery, useMutation } from '@apollo/client';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import React, { useCallback, useEffect, useState } from 'react';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

type InformationNodeProps = NodeProps & {
  data: {
    text: string;
    dynamicGeneration: boolean;
    images: ImageMetadata[];
  };
};

export default function InformationNode({ id, data }: InformationNodeProps) {
  const { handleInputChange, updateNodeImages } = useNodeData<InformationNodeProps>(id);

  const [displayImages, setDisplayImages] = useState<{ id: string; url: string }[]>([]);

  // Inquiry
  const { updateMetadata, metadata } = useInquiryBuilder();

  // Apollo
  const [addMediaAsset] = useMutation<AddMediaAssetMutation>(ADD_MEDIA_ASSET);
  const [getMediaAsset] = useLazyQuery<GetMediaAssetQuery>(GET_MEDIA_ASSET);

  useEffect(() => {
    const fetchImages = async () => {
      if (!data.images) return;

      const signedImages = await Promise.all(
        data.images.map(async (image) => {
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
  }, [data.images, getMediaAsset]);

  const handleUpdate = useCallback(
    (updates: Partial<InformationNodeProps['data']>) => {
      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange],
  );

  const uploadImage = async (image: Blob) => {
    const { data } = await addMediaAsset();
    if (!data?.addMediaAsset) throw new Error('Failed to generate signed s3 url for image');
    const { signedUrl, id } = data.addMediaAsset;
    await uploadImageToS3(signedUrl, image);
    updateMetadata({ ...metadata, images: [...metadata.images, { id }] });
    updateNodeImages(displayImages ? [...displayImages, { id }] : [{ id }]);
  };

  return (
    <>
      <NodeContainer title="Information" faIcon={faExclamationCircle} id={id}>
        <div className="space-y-4 my-4">
          <Input
            label="Dynamic Generation"
            name={`dynamicGeneration_${id}`}
            type="checkbox"
            checked={data.dynamicGeneration}
            onChange={(e) => handleUpdate({ dynamicGeneration: (e.target as HTMLInputElement).checked })}
            className="nodrag"
          />

          <Textarea
            label="Message"
            name="text"
            subLabel={
              data.dynamicGeneration
                ? 'Prompt for an AI to generate information'
                : 'Information displayed directly to the user'
            }
            value={data.text}
            onChange={(e) => handleUpdate({ text: e.target.value })}
            placeholder="Enter your text here..."
            className="resize-none overflow-hidden nodrag"
            rows={3}
          />

          <ImageUploader nodeId={id} images={displayImages} />
          <ImageUploadModal
            onUpload={async (blob) => {
              await uploadImage(blob);
            }}
          />
        </div>
        <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-green-500" />
        <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 !bg-green-500" />
      </NodeContainer>
    </>
  );
}
