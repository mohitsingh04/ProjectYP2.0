"use client";
import API from "@/service/API/API";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // ✅
  const blogsPerPage = 12; // ✅

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

  const totalPages = Math.ceil(blogs.length / blogsPerPage); // ✅
  const paginatedBlogs = blogs.slice(
    // ✅
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
              {paginatedBlogs.map((blog, index) => (
                <div className="col-lg-4 col-md-6 d-flex" key={index}>
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="row">
              <div className="col-md-12">
                <ul className="pagination lms-page lms-pagination">
                  <li
                    className={`page-item prev ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageClick(currentPage - 1)}
                    >
                      <i className="fas fa-angle-left"></i>
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => handlePageClick(i + 1)}
                      >
                        {i + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`page-item next ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => handlePageClick(currentPage + 1)}
                    >
                      <i className="fas fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
