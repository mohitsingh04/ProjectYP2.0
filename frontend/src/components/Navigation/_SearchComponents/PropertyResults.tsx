import Link from "next/link";
import React from "react";
import { ListGroup } from "react-bootstrap";
import { FaPeopleRoof } from "react-icons/fa6";

interface PropertyItem {
  uniqueId: string;
  property_name: string;
  property_city: string;
  property_state: string;
  property_logo?: string[];
}

interface PropertyResultsProps {
  Results: PropertyItem[];
  handleClose: () => void;
  handleStoreSearch: () => void;
}

export default function PropertyResults({
  Results,
  handleClose,
  handleStoreSearch,
}: PropertyResultsProps) {
  return (
    <div>
      <ListGroup>
        {Results.map((item, index) => (
          <ListGroup.Item
            key={index}
            className="border-0 p-0"
            style={{ fontSize: "18px" }}
          >
            <Link
              href={`/property/${item.uniqueId}/${item?.property_name
                ?.replace(/\s+/g, "-")
                ?.toLowerCase()}`}
              onClick={async () => {
                handleStoreSearch();
                handleClose();
              }}
            >
              <div className="bg-light p-2 border d-flex justify-content-between">
                <div className="d-flex">
                  <img
                    src={
                      item?.property_logo?.[0]
                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${item?.property_logo?.[0]}`
                        : "/Images/PropertyBanner.png"
                    }
                    className="me-2 rounded"
                    width={"50px"}
                    style={{ aspectRatio: "4/4", objectFit: "cover" }}
                    alt=""
                  />
                  <div>
                    <p className="m-0">{item.property_name}</p>
                    <span className="text-muted fs-6 me-2">
                      {item?.property_city}
                    </span>
                    <span className="text-muted fs-6">
                      {item?.property_state}
                    </span>
                  </div>
                </div>
                <div className="align-content-center">
                  <span className="text-muted me-3 fs-6">
                    <FaPeopleRoof /> Institute
                  </span>
                </div>
              </div>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
