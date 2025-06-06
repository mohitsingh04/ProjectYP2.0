"use client";
import API from "@/service/API/API";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

interface Course {
  uniqueId: string;
  course_name: string;
  course_short_name: string;
  course_type: string;
  course_level: string;
  duration: string;
  image?: string[];
}

export default function FeaturesCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState([]);

  const getCategory = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const getCategoryById = (id: any) => {
    const numId = Number(id);

    // Check if id is a valid number
    if (!isNaN(numId)) {
      const category: any = categories.find(
        (item: any) => Number(item.uniqueId) === numId
      );
      return category?.category_name || "";
    }

    return id;
  };

  const shuffleArray = (array: Course[]): Course[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const getCourses = async () => {
    try {
      const response = await API.get("/course");
      setCourses(shuffleArray(response.data).slice(0, 6));
    } catch (error) {
      console.error((error as any)?.message);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <section className="section py-5">
      <div className="container">
        <div className="section-header aos" data-aos="fade-up">
          <div className="section-sub-head">
            <h2>Start Your Yoga Journey Today</h2>
          </div>
          <div className="all-btn all-category d-flex align-items-center"></div>
        </div>
        <div className="section-text aos" data-aos="fade-up">
          <p className="mb-0">
            Join thousands of happy students who have transformed their lives
            through yoga. Enroll now and take the first step towards a
            healthier, more balanced life.
          </p>
        </div>
        <div className="course-feature">
          <div className="row">
            {courses.map((course, index) => (
              <div key={index} className="col-lg-4 col-md-6 d-flex">
                <div className="course-box d-flex aos" data-aos="fade-up">
                  <div className="product">
                    <div className="product-img">
                      <img
                        className="img-fluid"
                        alt="Course"
                        src={
                          course?.image?.[0]
                            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/course/${course?.image?.[0]}`
                            : "/Images/CourseBanner.webp"
                        }
                      />
                    </div>
                    <div className="product-content">
                      <div className="course-group">
                        <div className="course-group-img">
                          <div className="course-name w-100 d-flex justify-content-between align-items-center">
                            <h4>{course?.course_short_name}</h4>
                            <p className="ms-auto">
                              {getCategoryById(course?.course_type)}
                            </p>
                          </div>
                        </div>
                        <div className="course-share d-flex align-items-center justify-content-center"></div>
                      </div>
                      <h3 className="title instructor-text">
                        <Link
                          href={`/course/${
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
                      <div className="course-info d-flex align-items-center border-0">
                        <div className="rating-img d-flex align-items-center">
                          <img src="/img/icon/icon-01.svg" alt="Lessons" />
                          <p>{getCategoryById(course?.course_level)}</p>
                        </div>
                        <div className="course-view d-flex align-items-center">
                          <img src="/img/icon/icon-02.svg" alt="Duration" />
                          <p>{course?.duration}</p>
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
    </section>
  );
}
