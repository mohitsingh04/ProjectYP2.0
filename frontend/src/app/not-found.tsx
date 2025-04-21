import React from "react";
import Link from "next/link";

export default function Error404() {
  return (
    <div className="error-page">
      <div className="error-box">
        <div className="error-logo">
          <img src={"/Images/logo.png"} className="img-fluid" alt="Logo" />
        </div>
        <div className="error-box-img">
          <img src={"/img/error-01.png"} alt="Img" className="img-fluid" />
        </div>
        <h3 className="h2 mb-3"> Oh No! Error 404</h3>
        <p className="h4 font-weight-normal">
          This page you requested counld not found. May the force be with you!
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
