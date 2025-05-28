"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/service/API/API";

export default function ForgotPasswordConfirm() {
  const { email }: { email: string } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const [isRunning, setIsRunning] = useState(true);
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isRunning || timer <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleResendMail = async () => {
    setIsSending(true);
    try {
      const response = await API.post("/profile/forgot-password", {
        email: decodedEmail,
      });
      setMessage(
        response.data?.message ||
          "A password reset link has been sent to your email."
      );
      setError("");
      setTimer(60);
      setIsRunning(true);
    } catch (err) {
      setMessage("");
      setError(
        (err as any)?.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-sm rounded p-4 text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h4 className="mb-3">Forgot Password</h4>
        <p>
          A password reset email has been sent to{" "}
          <strong>{decodedEmail}</strong>. <br />
          Follow the instructions in the email to reset your password. This link
          will expire in 24 hours.
        </p>

        {isRunning ? (
          <p>
            You can request a new reset link in{" "}
            <span className="text-danger">{timer} sec</span>.
          </p>
        ) : (
          <p>
            Didn’t receive the email?{" "}
            {isSending ? (
              <span className="text-primary">Sending...</span>
            ) : (
              <span
                className="text-primary"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={handleResendMail}
              >
                Click here to resend
              </span>
            )}
          </p>
        )}

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <a href="/login" className="btn btn-link text-primary mt-3">
          Back to Login
        </a>
      </div>
    </div>
  );
}
