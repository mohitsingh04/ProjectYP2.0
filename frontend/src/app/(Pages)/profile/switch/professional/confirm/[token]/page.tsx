"use client";
import API from "@/service/API/API";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SwtichConfirm() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(
          `/profile/user/switch/professional/${token}`
        );
        if (response.data?.message) {
          setVerified(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        } else {
          throw new Error(response.data?.error || "Invalid token.");
        }
      } catch (err) {
        const errorMessage =
          (err as any)?.response?.data?.error || "Something went wrong.";
        setError(errorMessage);

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="login-img">
        <div className="page">
          <div className="position-absolute top-50 start-50 translate-middle text-light text-center">
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Verifying...</span>
              </div>
            ) : verified ? (
              <div className="alert alert-success fs-4">
                Your email has been verified successfully! <br />
                <small>Redirecting to home...</small>
              </div>
            ) : (
              <div className="alert alert-danger fs-4">
                {error || "Invalid or expired token!"} <br />
                <small>Redirecting to home...</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
