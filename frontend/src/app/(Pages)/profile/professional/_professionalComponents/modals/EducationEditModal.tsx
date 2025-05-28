import React, { useEffect, useState } from "react";
import EducationModalList from "./EducationComponents/EducationModalList";
import EducationModalForm from "./EducationComponents/EducationModalForm";

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface EducationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  allDegreeAndInst: any;
  getProfile: any;
}

const EducationEditModal = ({
  isOpen,
  onClose,
  profileData,
  allDegreeAndInst,
  getProfile,
}: EducationEditModalProps) => {
  const [editableEducation, setEditableEducation] = useState<Education[]>([]);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (profileData?.education) {
      setEditableEducation(profileData?.education);
    }
  }, [profileData]);

  const handleAddNew = () => {
    const newEdu: Education = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    setEditingItem(newEdu);
    setShowForm(true);
  };

  const handleEdit = (edu: Education) => {
    setEditingItem({ ...edu });
    setShowForm(true);
  };

  if (!isOpen) return null;

  if (showForm && editingItem) {
    return (
      <>
        <EducationModalForm
          setShowForm={setShowForm}
          editableEducation={editableEducation}
          editingItem={editingItem}
          allDegreeAndInst={allDegreeAndInst}
          profileData={profileData}
          getProfile={getProfile}
        />
      </>
    );
  }

  return (
    <>
      <EducationModalList
        handleAddNew={handleAddNew}
        handleEdit={handleEdit}
        editableEducation={editableEducation}
        onClose={onClose}
        allDegreeAndInst={allDegreeAndInst}
        getProfile={getProfile}
      />
    </>
  );
};

export default EducationEditModal;
