import { useState } from "react";
import { LogOut, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { handleLogout } from "@/service/Callback/Callback";
import VerifyEmailModal from "./_profileModals/VerifyEmailModal";
import { FaUserSlash } from "react-icons/fa";
import DeleteAccountModal from "./_profileModals/DeleteAccountModal";
// import VerifyEmailModal from "./Modals/VerifyEmailModal";

const ProfileActions = ({ profile }: { profile: any }) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="px-4 pb-4">
      <div className="border-top pt-4">
        <h3 className="h5 text-dark mb-3">Account Actions</h3>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <Link
              href={`/forgot-password`}
              className="btn btn-warning d-flex align-items-center justify-content-center gap-2 w-100"
            >
              <Lock size={18} />
              Reset Password
            </Link>
          </div>

          <div className="col-12 col-md-4">
            <button
              onClick={handleLogout}
              className="btn btn-light text-dark d-flex align-items-center justify-content-center gap-2 w-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
          <div className="col-12 col-md-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100"
            >
              <FaUserSlash size={18} />
              Delete Account
            </button>
          </div>

          {!profile.verified && (
            <div className="col-12 col-md-4">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="btn btn-warning d-flex align-items-center justify-content-center gap-2 w-100"
              >
                <Mail size={18} />
                Verify Email
              </button>
            </div>
          )}
        </div>
      </div>

      {showVerifyModal && (
        <VerifyEmailModal
          email={profile?.email}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteAccountModal
          profile={profile}
          onClose={() => console.log("object")}
        />
      )}
    </div>
  );
};

export default ProfileActions;
