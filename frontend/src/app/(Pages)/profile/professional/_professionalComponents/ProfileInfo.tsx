import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Edit, BadgeCheck } from "lucide-react";
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
                <div className="verified-badge">
                  <BadgeCheck size={16} className="me-1" />
                  <span>Verified</span>
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
          setShowCropper={setShowCropper}
        />
      )}
    </Card>
  );
};

export default ProfileInfo;
