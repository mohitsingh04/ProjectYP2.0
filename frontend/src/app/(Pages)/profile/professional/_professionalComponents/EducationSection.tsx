import React from "react";
import { Card, Button } from "react-bootstrap";
import { Edit, GraduationCap } from "lucide-react";
import RandomPixelLogo from "@/components/ImageGenerator/RandomPixelLogo";

interface Education {
  id: string;
  degree: string;
  institute: string;
  location: string;
  start_date: string;
  end_date: string;
  currentlyStuding: boolean;
  institutionImage: string;
}

interface EducationSectionProps {
  education: Education[];
  openModal: () => void;
  allDegreeAndInst: any;
}

const EducationSection = ({
  education,
  openModal,
  allDegreeAndInst,
}: EducationSectionProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDegreeById = (id: any) => {
    const degree = allDegreeAndInst?.degree?.find(
      (item: any) => Number(item?.uniqueId) === Number(id)
    );
    return degree?.degree_name;
  };
  const getInstituteById = (id: any) => {
    const institute = allDegreeAndInst?.institute?.find(
      (item: any) => Number(item?.uniqueId) === Number(id)
    );
    return institute?.institute_name;
  };

  return (
    <Card>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-semibold d-flex align-items-center">
            <GraduationCap size={20} className="me-2" />
            Education
          </h2>
          <Button variant="light" size="sm" onClick={openModal}>
            <Edit size={16} />
          </Button>
        </div>
        <div className="d-flex flex-column gap-4">
          {education?.map((edu, index) => (
            <div key={index} className="timeline-item-education">
              <div className="d-flex gap-3">
                <div
                  className="rounded-3 overflow-hidden bg-light flex-shrink-0"
                  style={{ width: "48px", height: "48px" }}
                >
                  <RandomPixelLogo rows={8} cols={8} density={0.5} size={48} />
                </div>
                <div>
                  <h3 className="fw-semibold mb-1">
                    {getDegreeById(edu.degree)}
                  </h3>
                  <p className="fw-medium mb-1">
                    {getInstituteById(edu.institute)}
                  </p>
                  <p className="small text-muted">
                    {formatDate(edu.start_date)} -{" "}
                    {edu.currentlyStuding
                      ? "Present"
                      : formatDate(edu.end_date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EducationSection;
