import API from "@/service/API/API";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";

interface Property {
  uniqueId: number;
  property_name: string;
  category?: string;
  featured_image?: string[];
  property_logo?: string[];
  property_address?: string;
  property_city?: string;
  property_state?: string;
  property_country?: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const [rating, setRating] = useState<number>(0);
  const [ratingLength, setRatingLength] = useState<number>(0);
  const [coursesLength, setCoursesLength] = useState<number>(0);
  const [allCategories, setAllCategories] = useState([]);

  const getAllCategories = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setAllCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const getCategoryToRelatedId = (id: any) => {
    const category: any = allCategories.find(
      (item: any) => item.uniqueId === Number(id)
    );
    return category ? category?.category_name : "Unknown";
  };

  useEffect(() => {
    if (!property?.uniqueId) return;

    const getCourses = async () => {
      if (property) {
        try {
          const { data } = await API.get(
            `/property/property-course/${property?.uniqueId}`
          );
          setCoursesLength(data.length);
        } catch (error) {
          console.error((error as any)?.message);
        }
      }
    };

    const getReviews = async () => {
      if (property) {
        try {
          const response = await API.get(
            `/review/property/${property?.uniqueId}`
          );
          const data = response?.data;
          const totalRating = data.reduce(
            (sum: number, review: { rating?: number }) =>
              sum + (review.rating || 0),
            0
          );

          setRatingLength(data.length);
          setRating(totalRating);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getCourses();
    getReviews();
  }, [property?.uniqueId]);

  const averageRating =
    ratingLength > 0 ? (rating / ratingLength).toFixed(1) : "0.0";
  const filledStars = ratingLength > 0 ? Math.round(rating / ratingLength) : 0;

  return (
    <div className="col-lg-12 d-flex">
      <div className="instructor-list flex-fill">
        <div className="instructor-img">
          <img
            src={
              property?.featured_image?.[0]
                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${property.featured_image[0]}`
                : "/Images/PropertyBanner.png"
            }
            alt={property?.property_name || "Property Image"}
            style={{ aspectRatio: "1/1", objectFit: "cover" }}
            className="img-fluid"
          />
        </div>
        <div className="instructor-content">
          <div className="d-flex mb-2">
            <img
              src={
                property?.property_logo?.[0]
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${property.property_logo[0]}`
                  : "/Images/PropertyBanner.png"
              }
              alt={property?.property_name || "Property Image"}
              width={"50px"}
              style={{ aspectRatio: "1/1", objectFit: "cover" }}
              className="img-fluid m-1 rounded-circle"
            />
            <div className="align-content-center">
              <h5>
                <Link
                  href={`/property/${
                    property.uniqueId
                  }/${property?.property_name
                    ?.replace(/\s+/g, "-")
                    ?.toLowerCase()}`}
                >
                  {property?.property_name}
                </Link>
              </h5>
              <h6 className="m-0">
                {getCategoryToRelatedId(property?.category)}
              </h6>
            </div>
          </div>
          <div className="instructor-info">
            <div className="rating-img d-flex align-items-center">
              <img src="/img/icon/icon-01.svg" className="me-1" alt="Courses" />
              <p>{coursesLength}+ Courses</p>
            </div>
            <div className="rating">
              {[...Array(filledStars)].map((_, i) => (
                <FaStar key={`filled-${i}`} className="star filled" />
              ))}
              {[...Array(5 - filledStars)].map((_, i) => (
                <FaStar key={`empty-${i}`} className="star" />
              ))}
              <span className="d-inline-block average-rating">
                <span>{averageRating}</span> ({ratingLength})
              </span>
            </div>
            <a href="/" className="rating-count">
              <FaRegHeart />
            </a>
          </div>
          <div className="instructor-badge gap-1 d-flex">
            {property?.property_city && (
              <span className="web-badge">{property?.property_city}</span>
            )}
            {property?.property_state && (
              <span className="web-badge">{property?.property_state}</span>
            )}
            {property?.property_country && (
              <span className="web-badge">{property?.property_country}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
