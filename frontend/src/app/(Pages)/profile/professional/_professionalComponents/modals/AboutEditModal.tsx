import React from "react";
import { useFormik } from "formik";
import API from "@/service/API/API";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface AboutEditModalProps {
  isOpen: boolean;
  onClose: any;
  profileData: any;
  onSave: any;
}

const AboutEditModal = ({
  isOpen,
  onClose,
  profileData,
  onSave,
}: AboutEditModalProps) => {
  const formik = useFormik({
    initialValues: {
      userId: profileData?.uniqueId || "",
      heading: profileData?.heading || "",
      about: profileData?.about || "",
    },
    validationSchema: Yup.object({
      heading: Yup.string().max(200, "Heading must be at most 200 characters"),
      about: Yup.string().max(600, "About must be at most 600 characters"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await API.patch(`/profile/bio`, values);
        toast.success(response.data.message);
      } catch (error) {
        toast.error((error as any).response.data.error);
      } finally {
        onSave();
        onClose();
      }
    },
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Edit About Section</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    className="form-control"
                    placeholder="Your professional headline"
                    value={formik.values.heading}
                    maxLength={200}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.heading &&
                    typeof formik.errors.heading === "string" && (
                      <p className="text-danger">{formik.errors.heading}</p>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">About Description</label>
                  <textarea
                    name="about"
                    className="form-control"
                    placeholder="Tell us about yourself..."
                    rows={6}
                    maxLength={600}
                    value={formik.values.about}
                    onChange={formik.handleChange}
                  />
                  <small className="text-muted float-end">
                    {formik?.values?.about?.length}/600
                  </small>
                  {formik.touched.about &&
                    typeof formik.errors.about === "string" && (
                      <p className="text-danger">{formik.errors.about}</p>
                    )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AboutEditModal;
