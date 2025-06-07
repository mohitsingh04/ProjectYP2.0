import React, { useEffect, useState } from "react";
import ExpereninceModalList from "./ExpereinceComponents/ExpereninceModalList";
import ExpereninceModalForm from "./ExpereinceComponents/ExpereninceModalForm";

interface Experience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  properties: any;
  profileProperties: any;
  getProfile: any;
}

const ExperienceEditModal = ({
  isOpen,
  onClose,
  profileData,
  properties,
  profileProperties,
  getProfile,
}: ExperienceEditModalProps) => {
  const [editableExperiences, setEditableExperiences] = useState<Experience[]>(
    []
  );
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setEditableExperiences(profileData.experiences);
  }, [profileData]);

  const handleAddNew = () => {
    const newExp: Experience = {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setEditingItem(newExp);
    setShowForm(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditingItem({ ...exp });
    setShowForm(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {showForm && editingItem ? (
        <ExpereninceModalForm
          editableExperiences={editableExperiences}
          editingItem={editingItem}
          setShowForm={setShowForm}
          profileData={profileData}
          getProfile={getProfile}
          properties={properties}
        />
      ) : (
        <ExpereninceModalList
          editableExperiences={editableExperiences}
          onClose={onClose}
          profileProperties={profileProperties}
          handleAddNew={handleAddNew}
          handleEdit={handleEdit}
          properties={properties}
        />
      )}
    </>
  );
};

export default ExperienceEditModal;
