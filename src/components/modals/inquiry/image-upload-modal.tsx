import { useAddAlert } from '@/providers/alert-provider';
import { canvasPreview } from '@/utils/images/canvas-preview';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';

import Button from '../../controls/button';
import Input from '../../controls/input';
import CustomModal from '../modal';

import 'react-image-crop/dist/ReactCrop.css';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface Props {
  defaultAspectRatio?: number;
  toggleAspectRatioEnabled?: boolean;
  onUpload?: (blob: Blob) => Promise<void>;
}

export default function ImageUploadModal(props: Props) {
  const addAlert = useAddAlert();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (open) {
      setLoading(false);
      setImgSrc('');
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
    }
  }, [open]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, props.defaultAspectRatio ?? 1));
  }

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      // We use canvasPreview as it's much faster than imgPreview.
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
    }
  }, [completedCrop, scale, rotate]);

  function onSubmit() {
    if (!previewCanvasRef.current) {
      return;
    }

    // Take the image from the canvas and convert it to a Blob
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        addAlert('Failed to upload image', 'error');
        return;
      }

      // Create a FormData object to hold the file data
      const formData = new FormData();

      // Replace 'image.png' with the desired filename
      formData.append('image', blob, 'image.png');

      setLoading(true);

      // TODO: Upload the image to the server
      props
        .onUpload?.(blob)
        .then(() => {
          addAlert('Image uploaded successfully', 'success');
          setOpen(false);
        })
        .catch(() => {
          addAlert('Failed to upload image', 'error');
        });
    });
  }

  return (
    <>
      <Button type="button" icon={faUpload} className="w-full" onClick={() => setOpen(true)}>
        Upload Image
      </Button>
      <CustomModal
        title="Upload Image"
        size="xl"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        buttons={
          <>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="transparentPrimary"
              size="medium"
              className="ml-auto"
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="primary" size="medium" className="ml-2">
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </>
        }
      >
        {/* Add an upload photo button */}
        <div className="pointer">
          <Input name="image" type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <div className="flex w-full mt-2 justify-center">
          <div className="rounded-xl overflow-hidden relative">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={props.defaultAspectRatio}
                style={{
                  display: 'block',
                }}
              >
                <picture>
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                    }}
                    onLoad={onImageLoad}
                  />
                </picture>
              </ReactCrop>
            )}
          </div>
          {completedCrop && <canvas ref={previewCanvasRef} className="hidden" />}
        </div>
      </CustomModal>
    </>
  );
}
