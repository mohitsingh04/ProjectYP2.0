import React, { useState, useEffect } from "react";
import { X, Plus, XIcon } from "lucide-react";
import API from "@/service/API/API";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  getProfile: any;
  allSKills: any;
}

const SkillEditModal = ({
  isOpen,
  onClose,
  profileData,
  getProfile,
  allSKills,
}: SkillEditModalProps) => {
  const [newSkill, setNewSkill] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);

  // Sync skills from profileData when modal opens
  useEffect(() => {
    if (profileData?.skills) {
      setSkills(profileData.skills);
    }
  }, [profileData]);

  // Convert allSkills to react-select format
  const options = allSKills?.map((skill: any) => ({
    label: skill.skill,
    value: skill.uniqueId,
  }));

  const addSkill = async () => {
    if (!newSkill) return;

    const existingOption = allSKills?.find(
      (skill: any) => skill.uniqueId === newSkill.value
    );

    const payload = {
      userId: profileData?.uniqueId,
      ...(existingOption
        ? { skillId: newSkill.value }
        : { skill: newSkill.label }),
    };

    try {
      const response = await API.patch(`/profile/skill`, payload);
      toast.success(response.data.message);

      setSkills((prev) => [
        ...prev,
        existingOption ? newSkill.value : newSkill.label,
      ]);
      setNewSkill(null);
    } catch (error) {
      toast.error((error as any).response?.data?.error || "Failed to add skill.");
    } finally {
      getProfile();
    }
  };

  const removeSkill = async (skill: string) => {
    try {
      const response = await API.patch(
        `/profile/skill/remove/${profileData?.skillsId}`,
        { skill: skill }
      );
      toast.success(response.data.message);

      // Update local state
      setSkills((prev) => prev.filter((s) => s !== skill));
    } catch (error) {
      toast.error((error as any).response?.data?.error || "Failed to remove skill.");
    }
  };

  const getSkillNameById = (id: number) => {
    const skill = allSKills?.find(
      (item: any) => Number(item.uniqueId) === Number(id)
    );
    return skill?.skill;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-3">
              <h5 className="modal-title">Edit Skills</h5>
              <button type="button" className="btn-close" onClick={onClose}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3 d-flex gap-2">
                <div className="flex-grow-1">
                  <CreatableSelect
                    options={options}
                    onChange={(selected) => setNewSkill(selected)}
                    value={newSkill}
                    placeholder="Add or type a skill"
                    isClearable
                  />
                </div>
                <button className="btn btn-primary btn-sm" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-auto" style={{ maxHeight: "256px" }}>
                {skills.map((skill: string, index: number) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2"
                  >
                    <span style={{ textTransform: "capitalize" }}>
                      {getSkillNameById(Number(skill)) || skill}
                    </span>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default SkillEditModal;
