"use client";
import API from "@/service/API/API";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";

interface Course {
  course_name?: string;
  course_level?: string;
  duration?: string;
  course_type?: string;
  course_short_name?: string;
  description?: string;
  image?: string[];
  uniqueId?: string;
  course_id: string;
}

export default function page() {
  const { uniqueId, course_name } = useParams();
  const [courese, setCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [merged, setMerged] = useState(false);
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

  const name = typeof course_name === "string" ? course_name.toLowerCase() : "";
  useEffect(() => {
    if (courese?.course_name) {
      const formattedName = courese.course_name
        ?.toLowerCase()
        ?.replace(/[^a-z0-9]+/g, "-")
        ?.replace(/-+/g, "-")
        ?.replace(/^-|-$/g, "");

      if (formattedName !== name) {
        notFound();
      }
    }
  }, [courese?.course_name]);
  const getCourse = async () => {
    const response = await API.get(`/property-course/uniqueId/${uniqueId}`);
    setCourse(response.data);
  };

  useEffect(() => {
    getCourse();
  }, []);

  const getAllCourse = useCallback(async () => {
    try {
      const response = await API.get("/course");
      setAllCourses(response.data);
    } catch (error) {
      console.error((error as any)?.message);
    }
  }, []);

  useEffect(() => {
    getAllCourse();
  }, [getAllCourse]);

  useEffect(() => {
    if (!merged && courese && allCourses.length > 0) {
      const matchedCourse = allCourses.find(
        (item) => item.uniqueId === courese.course_id
      );

      if (matchedCourse) {
        setCourse((prev) => ({
          ...matchedCourse,
          ...prev,
        }));
      }

      const filtered = allCourses.filter(
        (item) => item.uniqueId !== courese.uniqueId
      );
      setAllCourses(filtered.sort(() => 0.5 - Math.random()).slice(0, 5));

      setMerged(true);
    }
  }, [courese, allCourses, merged]);

  return (
    <>
      <section className="page-content">
        <div className="breadcrumb-bar">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="breadcrumb-list">
                  <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                      </li>
                      <li className="breadcrumb-item" aria-current="page">
                        Courses
                      </li>
                      <li className="breadcrumb-item" aria-current="page">
                        {courese?.course_name}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="course-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="blog">
                  <div className="blog-image">
                    <img
                      className="img-fluid"
                      src={
                        courese?.image?.[0]
                          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/course/${
                              courese?.image?.[0] || ""
                            }`
                          : "/Images/CourseBanner.webp"
                      }
                      style={{
                        maxHeight: "250px",
                        objectFit: "cover",
                      }}
                      alt="Post Image"
                    />
                  </div>
                  <div className="blog-info clearfix">
                    <div className="post-left">
                      <ul>
                        <li>
                          <div className="post-author">
                            <img
                              src="/img/icon/icon-01.svg"
                              alt="Post Author"
                            />{" "}
                            <span>
                              {getCategoryById(courese?.course_level)}
                            </span>
                          </div>
                        </li>
                        <li>
                          <img
                            className="img-fluid"
                            src="/img/icon/icon-22.svg"
                            alt="Img"
                          />
                          {courese?.duration}
                        </li>
                        <li>
                          <img
                            className="img-fluid"
                            src="/img/icon/icon-23.svg"
                            alt="Img"
                          />
                          {getCategoryById(courese?.course_type)}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h3 className="blog-title">
                    {courese?.course_name}{" "}
                    {courese?.course_short_name &&
                      `(${courese?.course_short_name})`}
                  </h3>
                  <div className="blog-content">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: courese?.description ?? "",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-12 sidebar-right theiaStickySidebar">
                <div className="card post-widget blog-widget">
                  <div className="card-header">
                    <h4 className="card-title">Related Courses</h4>
                  </div>
                  <div className="card-body">
                    <Table responsive borderless>
                      <tbody>
                        {allCourses.map((suggestion, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex">
                                <img
                                  src={
                                    suggestion?.image?.[0]
                                      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${suggestion?.image?.[0]}`
                                      : "/Images/CourseBanner.webp"
                                  }
                                  width={50}
                                  style={{
                                    aspectRatio: "4/4",
                                    objectFit: "cover",
                                  }}
                                  className="rounded"
                                  alt=""
                                />
                                <div className="ps-3">
                                  <Link
                                    href={`/course/${
                                      suggestion?.uniqueId
                                    }/${suggestion?.course_name
                                      ?.replace(/\s+/g, "-")
                                      ?.toLowerCase()}`}
                                    style={{ textWrap: "wrap" }}
                                  >
                                    {suggestion?.course_name}
                                  </Link>

                                  <h6 className="text-muted m-0">
                                    {getCategoryById(suggestion?.course_type)}
                                  </h6>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
