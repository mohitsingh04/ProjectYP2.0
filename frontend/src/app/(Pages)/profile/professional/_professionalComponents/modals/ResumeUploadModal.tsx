import React, { useState, useRef } from "react";
import { FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import API from "@/service/API/API";
import { toast } from "react-toastify";

interface ResumeUploadModalProps {
  onClose: () => void;
  onUpload: any;
  profileData: any;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  onClose,
  onUpload,
  profileData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("userId", profileData?.uniqueId);
      formData.append("resume", file);

      const response = await API.post(`/profile/doc/resume`, formData);
      toast.success(response.data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      onUpload();
      setIsLoading(false);
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <FileText className="me-2" size={20} />
              <h5 className="modal-title">Upload Your Resume</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center mb-3"
                style={{ width: "96px", height: "96px" }}
              >
                <FileText className="text-white" size={36} />
              </div>
              <h5>Enhance Your Profile with Your Resume</h5>
              <p className="text-muted">
                Uploading your resume helps us understand your skills and match
                you with opportunities.
              </p>
            </div>
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="d-none"
                onChange={handleFileChange}
              />

              <button
                onClick={triggerFileInput}
                className="btn btn-light text-dark border-dark"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </button>

              {file && (
                <div className="mt-3 flex items-center text-sm text-gray-700">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="truncate max-w-xs">{file.name}</span>
                </div>
              )}

              <p className="text-danger small mt-2">
                Only PDF files under 5MB are accepted.
              </p>
            </div>

            {error && (
              <div className="mt-3 text-danger d-flex align-items-center small">
                <AlertCircle className="me-2" size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={handleUpload}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Uploading...
                </>
              ) : (
                "Upload Resume"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadModal;
