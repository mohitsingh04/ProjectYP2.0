import React, { useState, useEffect } from "react";
import { X, Plus, XIcon } from "lucide-react";
import API from "@/service/API/API";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

interface LanguageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  getProfile: any;
  allLanguages: any;
}

const LanguageEditModal = ({
  isOpen,
  onClose,
  profileData,
  getProfile,
  allLanguages,
}: LanguageEditModalProps) => {
  const [newLanguage, setNewLanguage] = useState<any>(null);
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (profileData?.languages) {
      setLanguages(profileData.languages);
    }
  }, [profileData]);

  const options = allLanguages?.map((lang: any) => ({
    label: lang.language,
    value: lang.uniqueId,
  }));

  const addLanguage = async () => {
    if (!newLanguage) return;

    const existingOption = allLanguages?.find(
      (lang: any) => lang.uniqueId === newLanguage.value
    );

    const payload = {
      userId: profileData?.uniqueId,
      ...(existingOption
        ? { languageId: newLanguage.value }
        : { language: newLanguage.label }),
    };

    try {
      const response = await API.patch(`/profile/language`, payload);
      toast.success(response.data.message);
      setNewLanguage(null);
    } catch (error) {
      toast.error((error as any).response?.data?.error || "Failed to add language.");
    } finally {
      getProfile();
    }
  };

  const removeLanguage = async (language: string) => {
    try {
      const response = await API.patch(
        `/profile/language/remove/${profileData?.languageId}`,
        { language: language }
      );
      toast.success(response.data.message);

      // Update local state
      setLanguages((prev) => prev.filter((lang) => lang !== language));
    } catch (error) {
      toast.error(
        (error as any).response?.data?.error || "Failed to remove language."
      );
    }
  };

  const getLanguageNameById = (id: number) => {
    const language = allLanguages?.find(
      (item: any) => Number(item.uniqueId) === Number(id)
    );
    return language?.language;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Languages</h5>
              <button type="button" className="btn-close" onClick={onClose}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3 d-flex gap-2">
                <div className="flex-grow-1">
                  <CreatableSelect
                    options={options}
                    onChange={(selected) => setNewLanguage(selected)}
                    value={newLanguage}
                    placeholder="Add or type a language"
                    isClearable
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={addLanguage}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-auto" style={{ maxHeight: "256px" }}>
                {languages.map((language: string, index: number) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2"
                  >
                    <span style={{ textTransform: "capitalize" }}>
                      {getLanguageNameById(Number(language)) || language}
                    </span>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeLanguage(language)}
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

export default LanguageEditModal;
