import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Edit } from "lucide-react";

interface LanguagesSectionProps {
  languages: string[];
  allLanguages: any;
  openModal: () => void;
}

const LanguagesSection = ({
  languages,
  openModal,
  allLanguages,
}: LanguagesSectionProps) => {
  const getLanguageNameById = (id: number) => {
    const language = allLanguages?.find(
      (item: any) => Number(item.uniqueId) === Number(id)
    );
    return language?.language;
  };
  return (
    <Card>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fs-4 fw-semibold">Languages</h2>
          <Button variant="light" size="sm" onClick={openModal}>
            <Edit size={16} />
          </Button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {languages?.map((language, index) => (
            <Badge
              key={index}
              bg="light"
              text="dark"
              className="py-2 px-3 border"
              style={{ textTransform: "capitalize" }}
            >
              {getLanguageNameById(Number(language))}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LanguagesSection;
