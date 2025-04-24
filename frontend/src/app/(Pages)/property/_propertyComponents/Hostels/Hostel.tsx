"use client";

import API from "@/service/API/API";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";

interface Property {
  uniqueId: string;
}

interface HostelItem {
  _id: string;
  accomodation_name: string;
  accomodation_description: string;
  accomodation_images: string[];
  accomodation_price: {
    INR?: number;
    DOLLAR?: number;
    EURO?: number;
  }[];
}

interface PropertyBannerProps {
  property: Property | null;
}

export default function Hostel({ property }: PropertyBannerProps) {
  const [hostels, setHostels] = useState<HostelItem[]>([]);

  useEffect(() => {
    const getHostels = async () => {
      if (!property) return;
      try {
        const response = await API.get(`/accomodation/${property.uniqueId}`);
        setHostels(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    getHostels();
  }, [property]);

  return (
    <>
      <h5 className="subs-title mb-4">Hostels</h5>
      <div className="row g-4">
        {hostels.map((hostel) => (
          <div className="col-12" key={hostel._id}>
            <div className="card shadow-sm overflow-hidden rounded-4">
              {hostel.accomodation_images?.length > 0 && (
                <Carousel interval={4000} indicators={true} controls={true}>
                  {hostel.accomodation_images
                    ?.filter((img) => img.toLowerCase().endsWith(".webp"))
                    .map((img, idx) => (
                      <Carousel.Item key={idx}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${img}`}
                          alt={hostel.accomodation_name}
                          className="d-block w-100"
                          style={{
                            height: "420px",
                            objectFit: "cover",
                          }}
                        />
                      </Carousel.Item>
                    ))}
                </Carousel>
              )}

              <div className="card-body bg-light px-4 py-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <h4 className="fw-semibold mb-2 mb-md-0 text-dark">
                    {hostel.accomodation_name}
                  </h4>
                  {hostel.accomodation_price?.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(hostel.accomodation_price[0])
                        .filter(
                          ([currency]) => currency.toLowerCase() === "dollar"
                        )
                        .map(([currency, value]) => (
                          <span
                            key={currency}
                            className="badge bg-primary-subtle text-primary-emphasis px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                          >
                            <span className="fw-semibold">USD</span>
                            <span className="fs-6">$</span>
                            <span className="fw-bold">{value}</span>
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {hostel.accomodation_description && (
                  <p
                    className="mt-3 text-muted small"
                    dangerouslySetInnerHTML={{
                      __html: hostel.accomodation_description,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
