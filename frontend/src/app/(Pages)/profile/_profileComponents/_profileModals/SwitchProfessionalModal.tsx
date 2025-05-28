import React, { useState } from "react";
import "react-advanced-cropper/dist/style.css";
import API from "@/service/API/API";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";

interface SwitchProfessionalModalProps {
  profile: any;
  onClose: any;
}

const SwitchProfessionalModal: React.FC<SwitchProfessionalModalProps> = ({
  profile,
  onClose,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSwitchProfile = async () => {
    setIsSending(true);
    try {
      const response = await API.post(
        `/profile/user/switch/${profile?.uniqueId}`
      );
      toast.success(response.data.message);
      window.location.href = `/profile/switch/professional/${profile.email}`;
    } catch (error) {
      toast.error((error as any)?.response?.data?.error || "Internal Server Error");
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
              <FaUserShield className="me-2 text-primary" size={20} />
              <h5 className="modal-title text-primary mb-0">
                Professional Account
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
              You're about to Switch Your account to Professional:
            </p>
            <p className="text-muted small">
              If you wish to permanently switch to a professional account,
              please click "Confirm" to proceed.
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
              onClick={handleSwitchProfile}
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

export default SwitchProfessionalModal;
