"use client";

import API from "@/service/API/API";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Property {
  uniqueId: string;
}

interface Course {
  uniqueId: string;
  image?: string[];
  price: number;
  course_short_name: string;
  course_type: string;
  course_name: string;
  course_level: string;
  duration: string;
}

interface PropertyCourseOverrides extends Partial<Course> {
  course_id: string;
}

type MergedCourse = Course & Partial<PropertyCourseOverrides>;

export default function Courses({ property }: { property: Property | null }) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [propertyCoursesRaw, setPropertyCoursesRaw] = useState<
    PropertyCourseOverrides[]
  >([]);
  const [propertyCourses, setPropertyCourses] = useState<MergedCourse[]>([]);

  const getAllCourses = async () => {
    try {
      const response = await API.get(`/course`);
      setAllCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPropertyCourses = async () => {
    try {
      const response = await API.get(
        `/property/property-course/${property?.uniqueId}`
      );
      setPropertyCoursesRaw(response.data);
    } catch (error) {
      console.error((error as any)?.message);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  useEffect(() => {
    if (property) {
      getPropertyCourses();
    }
  }, [property]);

  useEffect(() => {
    if (!allCourses.length || !propertyCoursesRaw.length) return;

    const merged = propertyCoursesRaw.map((propertyCourse) => {
      const matchedCourse = allCourses.find(
        (course) => course.uniqueId === propertyCourse.course_id
      );
      if (matchedCourse) {
        return {
          ...matchedCourse,
          ...propertyCourse, // propertyCourse fields override matchedCourse
        };
      }
      return propertyCourse as MergedCourse; // fallback
    });

    setPropertyCourses(merged);
  }, [allCourses, propertyCoursesRaw]);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="subs-title">Courses</h5>
        <div className="row">
          {propertyCourses.map((course, index) => (
            <div className="col-md-6 d-flex" key={index}>
              <div className="course-box d-flex aos" data-aos="fade-up">
                <div className="product">
                  <div className="product-img">
                    <Link href={`/course/${course?.uniqueId}`}>
                      <img
                        className="img-fluid"
                        alt="Course"
                        src={
                          course.image?.[0]
                            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/course/${course.image[0]}`
                            : "/Images/CourseBanner.webp"
                        }
                        style={{ aspectRatio: "4/3", objectFit: "cover" }}
                      />
                    </Link>
                  </div>
                  <div className="product-content">
                    <div className="course-group ">
                      <div className="course-group-img">
                        <div className="course-name d-flex justify-content-between">
                          <h4>{course.course_short_name}</h4>
                          <p>{course.course_type}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="title instructor-text">
                      <Link
                        href={`/property-course/${
                          course?.uniqueId
                        }/${course?.course_name
                          ?.toLowerCase()
                          ?.replace(/[^a-z0-9]+/g, "-")
                          ?.replace(/-+/g, "-")
                          ?.replace(/^-|-$/g, "")}`}
                      >
                        {course.course_name}
                      </Link>
                    </h3>
                    <div className="course-info border-0 d-flex align-items-center">
                      <div className="rating-img d-flex align-items-center">
                        <img src="/img/icon/icon-01.svg" alt="Lessons" />
                        <p>{course.course_level}</p>
                      </div>
                      <div className="course-view d-flex align-items-center">
                        <img src="/img/icon/icon-02.svg" alt="Duration" />
                        <p>{course.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
