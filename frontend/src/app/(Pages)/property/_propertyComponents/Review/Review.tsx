import { FaStar } from "react-icons/fa";

interface ReviewProps {
  review: {
    name: string;
    rating: number;
    review: string;
  };
}

const bgColors = [
  "bg-primary-subtle text-primary-emphasis",
  "bg-success-subtle text-success-emphasis",
  "bg-info-subtle text-info-emphasis",
  "bg-warning-subtle text-warning-emphasis",
  "bg-danger-subtle text-danger-emphasis",
  "bg-secondary-subtle text-secondary-emphasis",
];

export default function Review({ review }: ReviewProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase());
    return initials.slice(0, 2).join("");
  };

  const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className="card-body">
      <div className="instructor-wrap d-flex align-items-center justify-content-between">
        <div className="about-instructor d-flex align-items-center gap-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center overflow-hidden p-3 fw-bold fs-4 ${randomColor} text-truncate`}
          >
            {getInitials(review.name)}
          </div>
          <div className="instructor-detail">
            <h5 className="mb-0">{review.name}</h5>
          </div>
        </div>
        <div className="rating text-end">
          {Array(review.rating)
            .fill(null)
            .map((_, index) => (
              <FaStar className="star filled text-warning" key={index} />
            ))}
          {Array(5 - review.rating)
            .fill(null)
            .map((_, index) => (
              <FaStar className="star text-muted" key={index} />
            ))}
          <div className="average-rating small text-secondary">
            {review.rating}/5 Rating
          </div>
        </div>
      </div>
      <p className="rev-info mt-3">“ {review.review} “</p>
    </div>
  );
}
