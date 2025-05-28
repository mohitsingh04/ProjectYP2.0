import React, { useState } from "react";
import "react-advanced-cropper/dist/style.css";
import { Image } from "lucide-react";
import API from "@/service/API/API";
import { toast } from "react-toastify";

interface VerifyEmailModalProps {
  email: any;
  onClose: any;
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  email,
  onClose,
}) => {
  const [isSending, setIsSending] = useState(false);
  const handleResendMail = async () => {
    setIsSending(true);
    try {
      const response = await API.post(`/profile/verify-email/${email}`);
      toast.success(response.data.message);
      window.location.href = `/verify-email/send/${email}`;
    } catch (error) {
      toast.error((error as any).response?.data?.error);
    } finally {
      setIsSending(false);
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
              We'll send a verification link to your email address:
            </p>

            <div className="bg-light border border-secondary rounded p-3 mb-4">
              <p className="fw-medium text-dark p-0 m-0">{email}</p>
            </div>

            <p className="text-muted small">
              After clicking the link in the email, your account will be
              verified, and you'll have full access to all features.
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
              onClick={handleResendMail}
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

export default VerifyEmailModal;
