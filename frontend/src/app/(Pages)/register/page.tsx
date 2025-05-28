"use client";
import { Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import API from "@/service/API/API";
import Link from "next/link";
import GetToken from "@/service/Callback/GetToken";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  mobile_no: Yup.string()
    .required("Contact is required")
    .min(10, "Contact must be valid"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = GetToken();

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      mobile_no: "",
      email: "",
      password: "",
      confirm_password: "",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await API.post("/profile/register", values);
        toast.success(response?.data?.message || "Registration successful");
        window.location.href = `/verify-email/send/${values.email}`;
      } catch (error) {
        toast.error(
          (error as any).response?.data?.error || "Registration failed"
        );
      }
    },
  });

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <User size={18} />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Your Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="text-danger small mt-1">
                {formik.errors.username}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <User size={18} />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Your Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger small mt-1">{formik.errors.name}</div>
            )}
          </div>

          {/* Contact */}
          <div className="mb-3">
            <label htmlFor="mobile_no" className="form-label">
              Contact
            </label>
            <PhoneInput
              country={"in"}
              value={formik.values.mobile_no}
              onChange={(value) => formik.setFieldValue("mobile_no", value)}
              inputProps={{
                name: "mobile_no",
                onBlur: formik.handleBlur,
              }}
              inputClass="w-100 border"
              inputStyle={{ maxHeight: "44px" }}
              enableSearch
              buttonClass=" input-group-text"
            />
            {formik.touched.mobile_no && formik.errors.mobile_no && (
              <div className="text-danger small mt-1">
                {formik.errors.mobile_no}
              </div>
            )}
          </div>

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

          {/* Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
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
          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="form-check-input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.terms}
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-decoration-none text-primary"
                target="_blank"
              >
                Terms and Conditions
              </Link>
            </label>
            {formik.touched.terms && formik.errors.terms && (
              <div className="text-danger small mt-1">
                {formik.errors.terms}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link href="/login" className="text-decoration-none text-primary">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
