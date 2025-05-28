import React from "react";
import { Card } from "react-bootstrap";

interface ProfileScoreSectionProps {
  profileScore: number;
}

const ProfileScoreSection = ({ profileScore }: ProfileScoreSectionProps) => {
  const getScoreColorClass = () => {
    if (profileScore >= 80) return "profile-score-high";
    if (profileScore >= 60) return "profile-score-medium";
    return "profile-score-low";
  };

  const scoreColorClass = getScoreColorClass();

  return (
    <Card>
      <Card.Body className="p-4">
        <h2 className="fs-4 fw-semibold mb-3">Profile Score</h2>
        <div className="d-flex flex-column align-items-center">
          <div
            className="position-relative mb-3"
            style={{ width: "96px", height: "96px" }}
          >
            <svg
              className="circle-progress"
              width="96"
              height="96"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-light"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - profileScore / 100)
                }`}
                className={scoreColorClass}
                strokeLinecap="round"
              />
            </svg>
            <div
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{ inset: 0 }}
            >
              <span className={`fs-5 fw-bold ${scoreColorClass}`}>
                {profileScore}%
              </span>
            </div>
          </div>
          <p className="small text-muted text-center">
            Complete your profile to improve your score
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileScoreSection;
