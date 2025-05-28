import React, { useState } from "react";
import "react-advanced-cropper/dist/style.css";
import API from "@/service/API/API";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeleteAccountModalProps {
  profile: any;
  onClose: any;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  profile,
  onClose,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleDeleteProfile = async () => {
    setIsSending(true);
    try {
      const response = await API.post(
        `/profile/delete/account/${profile?.uniqueId}`
      );
      toast.success(response.data.message);
      window.location.href = `/profile/delete/account/send/${profile.email}`;
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error || "Internal Server Error"
      );
    } finally {
      setIsSending(false);
      onClose();
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
              <FaUserShield className="me-2 text-danger" size={20} />
              <h5 className="modal-title text-danger mb-0">Delete Account</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="px-4 py-4">
            <p className="text-muted mb-3">
              You're about to Delete Your account:
            </p>
            <p className="text-muted small">
              If you wish to permanently Delete your account, please click
              "Confirm" to proceed.
            </p>
          </div>

          {/* Modal footer */}
          <div className="modal-footer border-0 bg-opacity-10">
            <button
              onClick={onClose}
              type="button"
              className="btn btn-outline-danger"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteProfile}
              disabled={isSending}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
