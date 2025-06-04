"use client";
import API from "@/service/API/API";
import { useState, useCallback, useEffect } from "react";
import ProfileHeader from "./_profileComponents/ProfileHeader";
import ProfileInformation from "./_profileComponents/ProfileInformation";
import ProfileActions from "./_profileComponents/ProfileActions";
import ImageCropper from "./_profileComponents/_profileModals/ImageCropper";

function Profile() {
  const [profile, setProfile] = useState<any>("");
  const [showCropper, setShowCropper] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const response = await API.get(`/profile/detail`);
      setProfile(response.data);
      setOriginalFileName("");
    } catch (error) {
      console.error(error);
      if ((error as any)?.response?.data?.error === "Access Denied") {
        window.location.href = "/";
      }
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile?.role === "Professional") {
      window.location.href="/profile/professional"
    }
  }, [profile]);

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

  return (
    <div className="bg-light py-5" style={{ minHeight: "100vh" }}>
      <div className="container pt-5">
        <div className="mx-auto shadow-sm rounded-4 overflow-hidden bg-white">
          <ProfileHeader
            profile={profile}
            handleFileChange={handleFileChange}
          />
          <ProfileInformation profile={profile} />
          <ProfileActions profile={profile} />
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          originalFileName={originalFileName}
          image={image}
          setImage={setImage}
          profile={profile}
          setShowCropper={setShowCropper}
        />
      )}
    </div>
  );
}

export default Profile;
