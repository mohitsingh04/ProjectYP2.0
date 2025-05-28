import { useState } from "react";
import { User, Edit, Trash2 } from "lucide-react";
import DeleteAvatarModal from "./_profileModals/DeleteAvatarModal";

const ProfileHeader = ({
  profile,
  handleFileChange,
}: {
  profile: any;
  handleFileChange: any;
}) => {
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  return (
    <div
      className="position-relative text-white"
      style={{
        backgroundImage: "url(/img/banner.png)",
        padding: "4rem 2rem",
        overflow: "hidden",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ zIndex: 1 }}
      ></div>

      <div className="position-relative d-flex flex-column align-items-center z-3">
        <div className="position-relative group text-center">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center border border-4 border-white shadow-sm overflow-hidden"
            style={{ width: "144px", height: "144px", marginBottom: "1.5rem" }}
          >
            {profile?.avatar?.[0] ? (
              <img
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${profile?.avatar?.[0]}`}
                alt={profile?.username || "User"}
                className="w-100 h-100 object-fit-cover"
                style={{ transition: "opacity 0.3s" }}
              />
            ) : (
              <User size={80} className="text-primary" />
            )}
          </div>

          <div
            className="position-absolute top-0 start-0 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "144px",
              height: "144px",
              transition: "opacity 0.2s",
              backgroundColor: "rgba(0,0,0,0.4)",
              opacity: 0,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
              e.currentTarget.style.opacity = "0";
            }}
          >
            <div className="d-flex gap-2 z-3">
              <label className="btn btn-light btn-sm rounded-circle p-2 shadow-sm">
                <input
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Edit size={16} className="text-dark" />
              </label>
              {profile?.avatar?.[0] && (
                <button
                  onClick={() => setIsDeletingProfile(true)}
                  className="btn btn-light btn-sm rounded-circle p-2 shadow-sm"
                >
                  <Trash2 size={16} className="text-danger" />
                </button>
              )}
            </div>
          </div>
        </div>

        <h1 className="h3 fw-bold mt-2 text-primary">
          {profile.username || "User"}
        </h1>

        {profile?.verified ? (
          <span className="badge bg-success bg-opacity-75 mt-2">
            Verified Account
          </span>
        ) : (
          <span className="badge bg-warning bg-opacity-75 mt-2">
            Unverified Account
          </span>
        )}
      </div>

      {isDeletingProfile && (
        <DeleteAvatarModal profile={profile} onClose={setIsDeletingProfile} />
      )}
    </div>
  );
};

export default ProfileHeader;
