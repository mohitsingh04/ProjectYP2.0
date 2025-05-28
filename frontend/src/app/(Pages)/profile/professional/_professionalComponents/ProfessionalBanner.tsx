import React from "react";

const ProfileBanner = ({ profileData }: { profileData: any }) => {
  return (
    <div
      className="banner-bg position-relative"
      style={{
        height: "300px",
        background: profileData?.banner?.[0]
          ? `url(${process.env.NEXT_PUBLIC_MEDIA_URL}${profileData.banner[0]})`
          : "/img/banner.png",
      }}
    >
      <div className="banner-overlay"></div>
      {/* Geometric Pattern Overlay */}
      <div className="banner-blur">
        <div className="blur-1"></div>
        <div className="blur-2"></div>
        <div className="blur-3"></div>
      </div>
      {/* Grid Pattern */}
      <div className="banner-pattern"></div>
    </div>
  );
};

export default ProfileBanner;
