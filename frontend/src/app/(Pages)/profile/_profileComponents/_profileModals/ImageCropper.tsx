import React, { useRef, useState } from "react";
import { Cropper } from "react-advanced-cropper";
import { Image } from "lucide-react";
import API from "@/service/API/API";
import { toast } from "react-toastify";

interface ImageCropperProps {
  image: any;
  setShowCropper: (show: boolean) => void;
  setImage: (image: string | null) => void;
  originalFileName: string;
  profile: any;
  username?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  setShowCropper,
  setImage,
  originalFileName,
  profile,
}) => {
  const cropperRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowCropper(false);
    setImage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        canvas.toBlob(async (blob: Blob) => {
          const formData = new FormData();
          formData.append("avatar", blob, originalFileName);

          try {
            await API.patch(
              `/profile/user/avatar/${profile?.uniqueId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            window.location.reload();
          } catch (error) {
            console.error(error);
            toast.error((error as any).response.data.error);
          } finally {
            setIsLoading(false);
          }
        });
      }
    }
  };
  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0">
          {/* Modal header */}
          <div className="modal-header bg-opacity-10 border-0 p-3">
            <div className="d-flex align-items-center">
              <Image className="me-2 text-success" size={20} />
              <h5 className="modal-title text-success mb-0">
                Change Profile Picture
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Cropper area */}
          <div className="modal-body p-0 bg-light">
            <div style={{ height: "400px" }}>
              <Cropper
                ref={cropperRef}
                src={image}
                className="h-100"
                stencilProps={{
                  aspectRatio: 1,
                }}
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="modal-footer border-0 bg-opacity-10">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
