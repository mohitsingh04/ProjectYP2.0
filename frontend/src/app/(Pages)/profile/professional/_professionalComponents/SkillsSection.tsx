import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Edit } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  openModal: () => void;
  allSKills: any;
}

const SkillsSection = ({
  skills,
  openModal,
  allSKills,
}: SkillsSectionProps) => {
  const getSkillNameById = (id: number) => {
    const skill = allSKills?.find(
      (item: any) => Number(item.uniqueId) === Number(id)
    );
    return skill?.skill;
  };
  return (
    <Card>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-semibold">Skills</h2>
          <Button variant="light" size="sm" onClick={openModal}>
            <Edit size={16} />
          </Button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {skills?.map((skill, index) => (
            <Badge
              key={index}
              bg="secondary"
              className="py-2 px-3"
              style={{ textTransform: "capitalize" }}
            >
              {getSkillNameById(Number(skill))}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkillsSection;
