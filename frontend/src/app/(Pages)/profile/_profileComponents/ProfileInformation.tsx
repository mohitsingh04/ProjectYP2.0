import React, { useState } from "react";
import { Mail, Phone, MapPin, Edit } from "lucide-react";
import Link from "next/link";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";
import SwitchProfessionalModal from "./_profileModals/SwitchProfessionalModal";

function ProfileInformation({ profile }: { profile: any }) {
  const [isSwitching, setIsSwitching] = useState(false);
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Profile Information</h2>
        <div className="d-flex gap-2">
          <Link
            href={`/profile/edit`}
            className="btn btn-link text-decoration-none d-flex align-items-center"
          >
            <Edit size={16} className="me-2" />
            Edit Profile
          </Link>
          {profile?.role !== "Professional" ? (
            <button
              onClick={() => setIsSwitching(true)}
              className="btn btn-link text-decoration-none d-flex align-items-center"
            >
              <FaUserShield size={16} className="me-2" />
              Switch Professional
            </button>
          ) : (
            <Link
              className="btn btn-link text-decoration-none d-flex align-items-center"
              href={`/profile/professional`}
            >
              <FaUserGraduate /> Professional Profile
            </Link>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <label className="form-label text-muted">Full Name</label>
              <p className="h6 mb-0">{profile?.name || "Not provided"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="card mt-3">
            <div className="card-body d-flex align-items-center">
              <Mail size={20} className="text-primary me-3" />
              <div>
                <label className="form-label text-muted">Email</label>
                <p className="h6 mb-0">{profile.email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="card mt-3">
            <div className="card-body d-flex align-items-center">
              <Phone size={20} className="text-primary me-3" />
              <div>
                <label className="form-label text-muted">Phone</label>
                <p className="h6 mb-0">{profile.mobile_no || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {profile?.address &&
          profile.city &&
          profile.state &&
          profile.pincode &&
          profile.country && (
            <div className="col-md-6">
              {/* Address */}
              <div className="card">
                <div className="card-body d-flex">
                  <MapPin size={20} className="text-primary me-3 mt-1" />
                  <div>
                    <label className="form-label text-muted">Address</label>
                    <p className="h6 mb-1">{profile.address}</p>
                    <p className="mb-0 text-secondary">
                      {profile.city}, {profile.state} {profile.pincode}
                    </p>
                    <p className="mb-0 text-secondary">{profile.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {isSwitching && (
        <SwitchProfessionalModal
          onClose={() => setIsSwitching(false)}
          profile={profile}
        />
      )}
    </div>
  );
}

export default ProfileInformation;
