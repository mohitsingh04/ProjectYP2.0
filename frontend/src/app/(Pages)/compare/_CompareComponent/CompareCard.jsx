import API from "@/service/API/API";
import React, { useEffect, useState } from "react";

export default function CompareCard({
  property,
  openModal,
  index,
  getCategoryToRelatedId,
}) {
  const [course, setCourse] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [location, setLocation] = useState({});
  const [certification, setCertification] = useState({});
  const [review, setreview] = useState([]);
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!property) return;

      try {
        const [
          teacherRes,
          courseRes,
          accommodationRes,
          locationRes,
          certRes,
          reviewRes,
        ] = await Promise.all([
          API.get(`/teacher/property/${property.uniqueId}`),
          API.get(`/property/property-course/${property.uniqueId}`),
          API.get(`/accomodation/${property.uniqueId}`),
          API.get(`/property/location/${property.uniqueId}`),
          API.get(`/certifications/${property.uniqueId}`),
          API.get(`/review/property/${property?.uniqueId}`),
        ]);

        setTeachers(teacherRes.data);
        setCourse(courseRes.data);
        setAccommodation(accommodationRes.data);
        setLocation(locationRes.data);
        setCertification(certRes.data);
        setreview(reviewRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [property]);
  useEffect(() => {
    const total = review.reduce((acc, item) => acc + item.rating, 0);
    setRating(total / review.length);
  }, [review]);

  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        <div className="card-body">
          {property ? (
            <img
              src={
                property?.property_logo?.[0]
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${property.property_logo[0]}`
                  : `/Images/PropertyBanner.png`
              }
              alt={property.property_name}
              className="w-100"
              style={{
                aspectRatio: "4/4",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            <h5 className="card-title text-center">Compare #{index + 1}</h5>
          )}

          {property ? (
            <div className="my-3">
              <h5 className="fw-bold">{property.property_name}</h5>
              <p>
                <strong>Academic Type:</strong>{" "}
                {getCategoryToRelatedId(property.category)}
              </p>
              <p>
                <strong>Courses:</strong> {course?.length || 0}
              </p>
              <p>
                <strong>Teachers:</strong> {teachers.length}
              </p>
              <p>
                <strong>Review:</strong> {`${rating}/5 (${review.length})`}
              </p>
              <p>
                <strong>Accommodation:</strong>{" "}
                {accommodation?.length > 0 ? "Available" : "Not Available"}
              </p>
              {location?.property_country && (
                <p>
                  <strong>Country:</strong> {location.property_country}
                </p>
              )}
              {location?.property_state && (
                <p>
                  <strong>State:</strong> {location.property_state}
                </p>
              )}
              {location?.property_city && (
                <p>
                  <strong>City:</strong> {location.property_city}
                </p>
              )}
              <p>
                <strong>Certifications:</strong>{" "}
                {Math.floor(certification?.certifications?.length / 2) || 0}
              </p>
            </div>
          ) : (
            <p className="text-muted text-center">No property selected</p>
          )}

          <div className="d-grid">
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => openModal(index)}
            >
              {property ? "Change" : "Select"} Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
