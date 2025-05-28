import React from "react";
import { Card, Button } from "react-bootstrap";
import { Edit, Briefcase } from "lucide-react";
import RandomPixelLogo from "../../../../../components/ImageGenerator/RandomPixelLogo";

interface Experience {
  property_id: string;
  position: string;
  property_name_id: string;
  location: string;
  start_date: string;
  end_date: string;
  currentlyWorking: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  openModal: () => void;
  properties: any;
  profileProperties: any;
}

const ExperienceSection = ({
  experiences,
  openModal,
  profileProperties,
  properties,
}: ExperienceSectionProps) => {
  const getPropertyDetails = (id: string) => {
    const property = properties?.find(
      (item: any) => Number(item?.uniqueId) === Number(id)
    );
    return property;
  };
  const getProfilePropertyDetails = (id: string) => {
    const property = profileProperties?.find(
      (item: any) => Number(item?.uniqueId) === Number(id)
    );
    return property;
  };
  return (
    <Card>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-semibold d-flex align-items-center">
            <Briefcase size={20} className="me-2" />
            Experience
          </h2>
          <Button variant="light" size="sm" onClick={openModal}>
            <Edit size={16} />
          </Button>
        </div>
        <div className="d-flex flex-column gap-4">
          {experiences?.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="d-flex gap-3">
                {/* Company Image */}
                <div
                  className="rounded-3 overflow-hidden bg-light flex-shrink-0"
                  style={{ width: "48px", height: "48px" }}
                >
                  {exp?.property_id ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${
                        getPropertyDetails(exp?.property_id)?.property_logo?.[0]
                      }`}
                      alt={exp.position}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <RandomPixelLogo
                      rows={8}
                      cols={8}
                      density={0.5}
                      size={48}
                    />
                  )}
                </div>
                <div>
                  <h3 className="fw-semibold mb-1">{exp.position}</h3>
                  <p className="text-secondary mb-1">
                    {exp.property_id
                      ? getPropertyDetails(exp.property_id)?.property_name
                      : getProfilePropertyDetails(exp.property_name_id)
                          ?.property_name}
                  </p>{" "}
                  <p className="small text-muted mb-1">{exp.location}</p>
                  <p className="small text-muted">
                    {new Date(exp.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : new Date(exp.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                  </p>{" "}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExperienceSection;
