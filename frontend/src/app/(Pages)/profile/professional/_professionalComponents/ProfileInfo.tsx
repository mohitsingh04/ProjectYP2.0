import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Edit, BadgeCheck, Award } from "lucide-react";
import Link from "next/link";
import ImageCropper from "../../_profileComponents/_profileModals/ImageCropper";
import BannerCropper from "./modals/BannerCropper";

interface ProfileInfoProps {
  profileData: {
    name: string;
    username: string;
    heading: string;
    verified: boolean;
    avatar: any;
    score?: number;
  };
}

const ProfileInfo = ({ profileData }: ProfileInfoProps) => {
  const [showCropper, setShowCropper] = useState(false);
  const [showBannerCropper, setShowBannerCropper] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setOriginalFileName(file.name);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setOriginalFileName(file.name);
          setShowBannerCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getBadgeColor = (score: number) => {
    if (score < 25) return "red";
    if (score < 50) return "blue";
    if (score < 75) return "purple";
    return "goldenrod";
  };

  const getBadgeBackground = (score: number) => {
    if (score < 25) return "rgba(255, 0, 0, 0.1)";
    if (score < 50) return "rgba(0, 0, 255, 0.1)";
    if (score < 75) return "rgba(128, 0, 128, 0.1)";
    return "rgba(218, 165, 32, 0.1)";
  };

  return (
    <Card
      className="position-relative mb-4 shadow-sm rounded"
      style={{ marginTop: "-80px" }}
    >
      <Card.Body className="p-4">
        <div className="d-flex justify-content-end mb-3 gap-1">
          <Link href={`/profile/edit`} className="btn btn-outline-primary">
            <Edit size={16} className="me-2" />
            Edit Profile
          </Link>
          <label className="btn btn-outline-primary m-0">
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleBannerChange}
            />
            <Edit size={16} className="me-2" />
            Edit Banner
          </label>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end gap-4">
          {/* Avatar */}
          <div className="position-relative">
            <div className="profile-image">
              {!profileData?.avatar?.[0] ? (
                profileData.name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("")
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${profileData?.avatar?.[0]}`}
                  className="profile-image"
                  alt=""
                />
              )}
            </div>
            <label className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle">
              <input
                type="file"
                className="d-none"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Edit size={12} />
            </label>
          </div>

          {/* Basic Info */}
          <div className="flex-grow-1">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 mb-2">
              <h1 className="fs-2 fw-bold mb-0">{profileData.name}</h1>

              {profileData.verified && (
                <div className="verified-badge d-flex align-items-center ms-2">
                  <BadgeCheck size={16} className="me-1" />
                  <span>Verified</span>
                </div>
              )}

              {/* Professional Badge */}
              {typeof profileData.score === "number" && (
                <div
                  className="d-flex align-items-center ms-3"
                  title={`Professional Score: ${profileData.score}`}
                  style={{
                    backgroundColor: getBadgeBackground(profileData.score),
                    border: `1px solid ${getBadgeColor(profileData.score)}`,
                    borderRadius: "20px",
                    padding: "4px 10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: getBadgeColor(profileData.score),
                  }}
                >
                  <Award size={16} color={getBadgeColor(profileData.score)} className="me-1" />
                  Professional
                </div>
              )}
            </div>
            <p className="text-muted mb-2">@{profileData.username}</p>
            <p className="fs-5 mb-3">
              {profileData.heading || "This is User Heading"}
            </p>
          </div>
        </div>
      </Card.Body>

      {showCropper && (
        <ImageCropper
          originalFileName={originalFileName}
          image={image}
          setImage={setImage}
          profile={profileData}
          setShowCropper={setShowCropper}
        />
      )}
      {showBannerCropper && (
        <BannerCropper
          originalFileName={originalFileName}
          image={image}
          setImage={setImage}
          profile={profileData}
          setShowCropper={setShowBannerCropper}
        />
      )}
    </Card>
  );
};

export default ProfileInfo;
