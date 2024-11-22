import { Metadata } from '@/providers/inquiry-builder-provider';
import { ImageMetadata } from '@/types/conversation';
import { Node } from '@xyflow/react';
import { Dispatch, SetStateAction } from 'react';

/**
 * Uploads a file to Amazon S3 using a pre-signed URL
 * @param {string} presignedUrl - The pre-signed URL generated for S3 upload
 * @param {File} file - The file object to be uploaded
 * @throws {Error} Throws an error if the upload fails
 * @returns {Promise<void>} A promise that resolves when the upload is successful
 */
export const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) throw new Error('Upload failed');
};

/**
 * Custom hook that returns a function to clean up orphaned images from S3 and metadata
 *
 * @param {Object} params - The parameters object
 * @param {Array<{ data?: { images?: { uuid: string } } }>} params.nodes - Graph nodes containing image data
 * @param {Object} params.metadata - Current metadata state with optional images array
 * @param {Function} params.setMetadata - Function to update metadata state
 * @param {Function} params.deleteMediaAsset - Mutation function to delete S3 assets
 * @returns {() => Promise<void>} Async function that performs the cleanup
 *
 * @example
 * const cleanupImages = useRemoveDeletedImagesFromS3({
 *   nodes: graph.nodes,
 *   metadata,
 *   setMetadata,
 *   deleteMediaAsset
 * });
 */
export const removeDeletedImagesFromS3 = async ({
  nodes,
  metadata,
  setMetadata,
  deleteImage,
}: {
  nodes: Node[];
  metadata: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
  deleteImage: (uuid: string) => Promise<void>;
}) => {
  // Extract all images from graph nodes
  const graphImages = nodes
    .filter((node) => node.data?.images)
    .map((node) => node.data.images)
    .flat() as ImageMetadata[];

  console.log('Graph images:', graphImages);
  console.log('Graph images:', metadata.images);

  // Find images that exist in metadata but not in graph
  const imagesToDelete =
    metadata.images?.filter((metadataImage) => !graphImages.some((graphImage) => graphImage.id === metadataImage.id)) ??
    [];

  console.log('Images to delete:', imagesToDelete);

  // Delete images from S3 in parallel
  await Promise.all(imagesToDelete.map((image) => deleteImage(image.id)));

  // Update metadata by filtering out deleted images
  setMetadata({
    ...metadata,
    images:
      metadata.images?.filter((image) => !imagesToDelete.some((deletedImage) => deletedImage.id === image.id)) ?? [],
  });
};
