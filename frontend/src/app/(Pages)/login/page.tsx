"use client";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/service/API/API";
import Link from "next/link";
import GetToken from "@/service/Callback/GetToken";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const token = GetToken();

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await API.post("/profile/login", values);
        window.location.reload();
      } catch (error) {
        console.log(error);
        toast.error((error as any)?.response?.data?.error);
      }
    },
  });

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-sm rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>

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
                placeholder="Email"
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

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger small mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-end mb-3">
            <Link
              href="/forgot-password"
              className="text-decoration-none text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          {/* Create Account Link */}
          <p className="text-center mt-3 mb-0">
            Not a member?{" "}
            <Link
              href="/register"
              className="text-decoration-none text-primary"
            >
              Create an Account
            </Link>
          </p>

          {/* Sign in with Google */}
          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
            >
              <Lock size={18} className="me-2" />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
