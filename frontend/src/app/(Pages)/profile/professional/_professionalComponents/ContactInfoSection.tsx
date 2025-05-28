import React from "react";
import { Card } from "react-bootstrap";
import { Edit, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { PiPhonePlus } from "react-icons/pi";

interface ContactInfoSectionProps {
  profileData: {
    email: string;
    mobile_no: string;
    alt_mobile_no: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

const ContactInfoSection = ({ profileData }: ContactInfoSectionProps) => {
  return (
    <Card>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-semibold">Contact Info</h2>
          <Link href={`/profile/edit`} className="btn btn-light btn-sm">
            <Edit size={16} />
          </Link>
        </div>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex text-secondary">
            <Mail size={16} className="me-3 text-muted" />
            <span className="small">{profileData.email}</span>
          </div>
          <div className="d-flex text-secondary">
            <Phone size={16} className="me-3 text-muted" />
            <span className="small">{profileData.mobile_no}</span>
          </div>
          {profileData?.alt_mobile_no && (
            <div className="d-flex text-secondary">
              <PiPhonePlus size={16} className="me-3 text-muted" />
              <span className="small">{profileData.alt_mobile_no}</span>
            </div>
          )}
          <div className="d-flex text-secondary">
            <MapPin size={16} className="me-3 text-muted mt-1" />
            <div className="small">
              <div>{profileData.address}</div>
              <div>
                {profileData.city}, {profileData.state} {profileData.pincode}
              </div>
              <div>{profileData.country}</div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ContactInfoSection;
