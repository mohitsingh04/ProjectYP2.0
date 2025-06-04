"use client";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "@/context/API";
import GetToken from "@/CallBacks/GetToken";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  let token = GetToken();
  const [showPassword, setShowPassword] = useState(false);

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
        alert(error.response.data.error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        {/* <Image src="/logo.png" alt="Yog Prerna" width={150} height={100} /> */}
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-1">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-400 mr-2">
              <Mail />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full py-2 outline-none"
              placeholder="Email"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <label htmlFor="password" className="block text-gray-600 mb-1">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <span className="text-gray-400 mr-2">
              <Lock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full py-2 outline-none"
              placeholder="Password"
            />
            <button
              type="button"
              className="text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right text-sm mb-4">
          <Link href="#" className="text-purple-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Login
        </button>

        {/* Create Account Link */}
        <p className="mt-4 text-center text-sm">
          Not a member?{" "}
          <Link href="#" className="text-purple-600 hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Sign in with Google */}
        <div className="mt-6">
          <button
            type="button"
            className="w-full border flex items-center justify-center py-2 rounded hover:bg-gray-100 transition"
          >
            <span className="mr-2">
              <Lock />
            </span>{" "}
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
}
