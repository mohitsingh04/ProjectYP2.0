"use client";
import API from "@/service/API/API";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  const getEvent = useCallback(async () => {
    try {
      const response = await API.get(`/event/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }, [id]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (!event) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-light p-2 rounded">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/events">Events</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {event?.event_title}
          </li>
        </ol>
      </nav>

      {/* Banner Image */}
      <div className="mb-4">
        <img
          src="/Images/CourseBanner.webp"
          className="img-fluid rounded"
          alt="Event Banner"
          style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
        />
      </div>

      {/* Event Content */}
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-3">{event?.event_title}</h2>

          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>Duration:</strong>
              <span>{event?.duration}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>Entrance Type:</strong>
              <span>{event?.entrance_type}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>Yoga Type:</strong>
              <span>{event?.yoga_type}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>Difficulty:</strong>
              <span>{event?.event_difficulty_level}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>Start Date:</strong>
              <span>{formatDate(event?.event_start_date)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <strong>End Date:</strong>
              <span>{formatDate(event?.event_end_date)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center text-danger">
              <strong>Last Date to Book Tickets:</strong>
              <span>{formatDate(event?.visibility_end_date)}</span>
            </li>
          </ul>

          {/* Description */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Event Description</h5>
              <p
                className="card-text"
                dangerouslySetInnerHTML={{
                  __html: event?.event_description ?? "",
                }}
              />
            </div>
          </div>
        </div>

        {/* Optional Sidebar / Future Components */}
        <div className="col-lg-4"></div>
      </div>
    </div>
  );
}
