import React from "react";
import { Card } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProfileScoreSectionProps {
  profileScore: number;
}

const ProfileScoreSection = ({ profileScore }: ProfileScoreSectionProps) => {
  const totalSegments = 10;
  const completedSegments = Math.floor((profileScore / 100) * totalSegments);
  const segmentsData = Array(totalSegments).fill(1);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "goldenrod"; // Gold
    if (score >= 50) return "purple"; // Purple
    if (score >= 25) return "blue"; // Blue
    return "red"; // Red
  };

  const scoreColor = getScoreColor(profileScore);

  const getSegmentColors = () =>
    Array.from({ length: totalSegments }, (_, i) =>
      i < completedSegments ? scoreColor : "#e9ecef"
    );

  const data = {
    datasets: [
      {
        data: segmentsData,
        backgroundColor: getSegmentColors(),
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: "80%",
    rotation: -90,
    circumference: 360,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  return (
    <Card>
      <Card.Body className="p-4 text-center">
        <h2 className="fs-4 fw-semibold mb-3">Profile Score</h2>
        <div
          style={{
            width: 96,
            height: 96,
            position: "relative",
            margin: "0 auto 1rem auto",
          }}
        >
          <Doughnut data={data} options={options} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "700",
              fontSize: "1.25rem",
              color: scoreColor,
            }}
          >
            {profileScore}%
          </div>
        </div>
        <p className="small text-muted">
          Complete your profile to improve your score
        </p>
      </Card.Body>
    </Card>
  );
};

export default ProfileScoreSection;
