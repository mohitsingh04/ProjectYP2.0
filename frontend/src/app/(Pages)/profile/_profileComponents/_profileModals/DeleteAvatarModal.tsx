import React, { useState } from "react";
import "react-advanced-cropper/dist/style.css";
import { Image } from "lucide-react";
import API from "@/service/API/API";
import { toast } from "react-toastify";

interface DeleteAvatarModalProps {
  profile: any;
  onClose: any;
}

const DeleteAvatarModal: React.FC<DeleteAvatarModalProps> = ({
  profile,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      const response = await API.delete(
        `/profile/user/avatar/${profile?.uniqueId}`
      );
      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error || "Internal Server Error"
      );
    } finally {
      setIsDeleting(false);
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
          <div className="modal-header bg-opacity-10 border-0 p-3">
            <div className="d-flex align-items-center">
              <Image className="me-2 text-primary" size={20} />
              <h5 className="modal-title text-primary mb-0">
                Change Profile Picture
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="px-4 py-4">
            <p className="text-muted mb-3">
              You're about to delete your avatar:
            </p>
            <p className="text-muted small">
              This action will remove your current avatar. You can upload a new
              one later from your account settings.
            </p>
          </div>

          {/* Modal footer */}
          <div className="modal-footer border-0 bg-opacity-10">
            <button
              onClick={onClose}
              type="button"
              className="btn btn-outline-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDeleteProfile}
              disabled={isDeleting}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAvatarModal;
