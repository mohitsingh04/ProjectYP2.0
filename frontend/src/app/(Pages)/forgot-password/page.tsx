"use client";
import { Mail } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API from "@/service/API/API";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [message, setMessage] = useState({ type: "", text: "" });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setMessage({ type: "", text: "" });
      try {
        const response = await API.post("/profile/forgot-password", values);
        setMessage({ type: "success", text: response.data.message });

        if (response) {
          router.push(`/forgot-password/send/${values.email}`);
        }

        resetForm();
      } catch (error: any) {
        setMessage({
          type: "error",
          text: error?.response?.data?.error || "Something went wrong",
        });
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-sm rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        <p className="text-center text-muted mb-4">
          Enter your registered email address to receive reset instructions.
        </p>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={18} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger small mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <p className="text-center mt-3 mb-0">
            <a href="/login" className="text-decoration-none text-primary">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
