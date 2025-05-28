"use client";

import { Eye, EyeClosed, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/service/API/API";
import { useParams, useRouter } from "next/navigation";

const ResetPasswordValidation = Yup.object({
  new_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      try {
        await API.get(`/profile/reset/${token}`);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.error || "Invalid or expired token."
        );
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
    verifyToken();
  }, [token, router]);

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
      token,
    },
    validationSchema: ResetPasswordValidation,
    onSubmit: async (values) => {
      setApiError("");
      try {
        const response = await API.post("/profile/reset", values);
        if (response) {
          router.push("/");
        }
      } catch (error: any) {
        setApiError(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p>Verifying token...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-sm rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>

        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        {!apiError && (
          <form onSubmit={formik.handleSubmit}>
            {/* New Password */}
            <div className="mb-3">
              <label htmlFor="new_password" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="new_password"
                  name="new_password"
                  className="form-control"
                  placeholder="New Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.new_password}
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.new_password && formik.errors.new_password && (
                <div className="text-danger small mt-1">
                  {formik.errors.new_password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirm_password}
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {formik.touched.confirm_password &&
                formik.errors.confirm_password && (
                  <div className="text-danger small mt-1">
                    {formik.errors.confirm_password}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={formik.isSubmitting}
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
