"use client";
import API from "@/service/API/API";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
interface BlogType {
  uniqueId: number;
  title: string;
  blog: string;
  author: number;
  featured_image?: string[];
  createdAt: string;
  category: number[];
  tags: number[];
}

interface UserType {
  uniqueId: number;
  name: string;
}

interface TagType {
  uniqueId: number;
  blog_tag: string;
}

interface BlogCategoryType {
  uniqueId: number;
  blog_category: string;
}

export default function Blog() {
  const { title } = useParams();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [blogCategory, setBlogCategory] = useState<BlogCategoryType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [allBlogs, setAllBlogs] = useState([]);

  const getAllBlogs = useCallback(async () => {
    try {
      const response = await API.get(`/blog`);
      setAllBlogs(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);

  useEffect(() => {
    if (title && allBlogs.length > 0) {
      const selected = allBlogs.find((item: BlogType) => {
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/gi, "")
          .replace(/\s+/g, "-");
        return slug === title;
      });
      setBlog(selected || null);
    }
  }, [title, allBlogs]);

  const getUsers = useCallback(async () => {
    try {
      const response = await API.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getTags = useCallback(async () => {
    try {
      const response = await API.get("/blog/tag/all");
      setTags(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getBlogCategory = useCallback(async () => {
    try {
      const response = await API.get(`/blog/category/all`);
      setBlogCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getTags();
  }, [getTags]);
  useEffect(() => {
    getBlogCategory();
  }, [getBlogCategory]);

  const getUserToRelatedId = (id: number) => {
    const val = users.find((item) => item.uniqueId === Number(id));
    return val ? val?.name : "Unknown";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCategoryToRelatedId = (id: number) => {
    const category = blogCategory.find((item) => item.uniqueId === Number(id));
    return category ? category?.blog_category : id;
  };

  const getTagToRelatedId = (id: number) => {
    const tag = tags.find((item) => item.uniqueId === Number(id));
    return tag ? tag?.blog_tag : id;
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
                        <Link href="/blog">Blogs</Link>
                      </li>
                      <li className="breadcrumb-item" aria-current="page">
                        {blog?.title}
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
                        blog?.featured_image?.[0]
                          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/blogs/${
                              blog?.featured_image?.[0] || ""
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
                    <div className="post-left float-end">
                      <ul>
                        <li>
                          <div className="post-author">
                            <span className="badge bg-primary">
                              {blog?.author && getUserToRelatedId(blog?.author)}
                            </span>
                          </div>
                        </li>
                        <li>
                          <div className="post-author">
                            <span className="badge bg-secondary">
                              {blog?.createdAt && formatDate(blog?.createdAt)}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h3 className="blog-title">
                    {/* {courese?.course_name}{" "}
                    {courese?.course_short_name &&
                      `(${courese?.course_short_name})`} */}
                  </h3>
                  <div className="blog-content">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: blog?.blog ?? "",
                      }}
                    />
                  </div>
                  <div>
                    <h6>Categories</h6>
                    {blog?.category?.map((item, index) => (
                      <p
                        key={index}
                        className="badge bg-danger-subtle text-dark me-1"
                      >
                        {getCategoryToRelatedId(item)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <h6>Tags</h6>
                    {blog?.tags?.map((item, index) => (
                      <p
                        key={index}
                        className="badge bg-danger-subtle text-dark me-1"
                      >
                        {getTagToRelatedId(item)}
                      </p>
                    ))}
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
