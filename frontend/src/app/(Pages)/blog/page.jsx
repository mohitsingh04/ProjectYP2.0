"use client";
import API from "@/service/API/API";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const getBlogs = useCallback(async () => {
    try {
      const resposnse = await API.get(`/blog`);
      const data = resposnse.data;
      setBlogs(data.filter((item) => item.status === "Active"));
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const getUsers = useCallback(async () => {
    try {
      const response = await API.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const getUserToRelatedId = (id) => {
    const val = users.find((item) => item.uniqueId === Number(id));
    return val ? val?.name : "Unknown";
  };

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
                        Blogs
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section py-5">
          <div className="container">
            <div className="row">
              {blogs.map((blog, index) => (
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="course-box d-flex aos" data-aos="fade-up">
                    <div className="product">
                      <div className="product-img">
                        <img
                          className="img-fluid"
                          alt="Course"
                          src={
                            blog?.featured_image?.[0]
                              ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/blogs/${blog?.featured_image?.[0]}`
                              : "/Images/CourseBanner.webp"
                          }
                          style={{ aspectRatio: "3/2", objectFit: "cover" }}
                        />
                      </div>
                      <div className="product-content">
                        <div className="course-group">
                          <div className="course-group-img">
                            <div className="course-name w-100 d-flex justify-content-between align-items-center">
                              <p className="ms-auto">
                                {getUserToRelatedId(blog?.author)}
                              </p>
                            </div>
                          </div>
                          <div className="course-share d-flex align-items-center justify-content-center"></div>
                        </div>
                        <h3 className="title instructor-text">
                          <Link
                            href={`/blog/${blog?.title
                              ?.toLowerCase()
                              ?.replace(/[^a-z0-9\s]/gi, "")
                              ?.replace(/\s+/g, "-")}`}
                          >
                            {blog?.title}
                          </Link>
                        </h3>
                        {/* <div className="course-info d-flex align-items-center border-0">
                          <div className="rating-img d-flex align-items-center">
                            <p>ll</p>
                          </div>
                          <div className="course-view d-flex align-items-center">
                            <p>ll</p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
