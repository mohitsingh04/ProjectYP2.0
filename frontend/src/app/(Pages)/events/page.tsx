"use client";
import API from "@/service/API/API";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState<any>([]);
  const getEvent = useCallback(async () => {
    try {
      const response = await API.get(`/events`);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

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
                        Events
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
              {events?.map((event: any, index: number) => (
                <div className="col-lg-4 col-md-6 d-flex" key={index}>
                  <div className="course-box d-flex aos" data-aos="fade-up">
                    <div className="product">
                      <div className="product-img">
                        <img
                          className="img-fluid"
                          alt="Course"
                          src={
                            event?.featured_image?.[0]
                              ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/events/${event?.featured_image?.[0]}`
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
                                {/* {getUserToRelatedId(event?.author)} */}
                              </p>
                            </div>
                          </div>
                          <div className="course-share d-flex align-items-center justify-content-center"></div>
                        </div>
                        <h3 className="title instructor-text">
                          <Link
                            href={`/event/${event?.event_title
                              ?.toLowerCase()
                              ?.replace(/[^a-z0-9\s]/gi, "")
                              ?.replace(/\s+/g, "-")}/${event?._id}`}
                          >
                            {event?.event_title}
                          </Link>
                        </h3>
                        <div className="course-info d-flex align-items-center border-0">
                          <div className="rating-img d-flex align-items-center">
                            <p>{event?.entrance_type}</p>
                          </div>
                          <div className="course-view d-flex align-items-center">
                            <p>
                              {event?.event_start_date &&
                                new Date(
                                  event.event_start_date
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                            </p>
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
    </>
  );
}
