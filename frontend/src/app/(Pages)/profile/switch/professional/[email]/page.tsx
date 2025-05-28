"use client";
import API from "@/service/API/API";
import { useParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProps {}

export default function ProfileSwitchSwal() {
  const { email }: { email: string } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const [isRunning, setIsRunning] = useState(true);
  const [timer, setTimer] = useState(60);
  const [user, setUser] = useState<UserProps | any>("");
  const [isSending, setIsSending] = useState(false);

  const getUsers = async () => {
    try {
      const response = await API.get("/profile/users");
      const data = response.data;
      const filterdUser = data.find((user: any) => user.email === decodedEmail);
      setUser(filterdUser);
    } catch (error) {
      console.error((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleResendMail = useCallback(async () => {
    setIsSending(true);
    try {
      const response = await API.post(`/profile/user/switch/${user?.uniqueId}`);
      toast.success(response.data.message);
      setTimer(60);
      setIsRunning(true);
    } catch (error) {
      toast.error((error as any).response?.data?.error);
    } finally {
      setIsSending(false);
    }
  }, [user]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="login-img">
        <div className="page">
          <Fragment>
            <div className="col-login mx-auto text-center">
              {/* Logo can be placed here if needed */}
            </div>

            <div className="container-login100 d-flex justify-content-center align-items-center">
              <div
                className="card shadow"
                style={{ height: "300px", width: "500px" }}
              >
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <h4>Switch Your Account</h4>
                  <p className="my-4">
                    A email has been sent to your email address. The Link will
                    expire after 24 hours.
                  </p>
                  {isRunning ? (
                    <p>
                      You can resend Email after{" "}
                      <span className="text-danger">{timer} sec</span>
                    </p>
                  ) : (
                    <p>
                      Didn’t receive an email?{" "}
                      {isSending ? (
                        <span className="text-primary">Sending....</span>
                      ) : (
                        <span
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={handleResendMail}
                        >
                          Resend the verification email
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </div>
  );
}
