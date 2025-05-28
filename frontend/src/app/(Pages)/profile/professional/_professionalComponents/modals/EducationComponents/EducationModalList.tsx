import RandomPixelLogo from "@/components/ImageGenerator/RandomPixelLogo";
import API from "@/service/API/API";
import { Edit, Plus, XIcon } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

interface EducationListProps {
  onClose: any;
  handleAddNew: any;
  editableEducation: any;
  handleEdit: any;
  allDegreeAndInst: any;
  getProfile: any;
}

export default function EducationModalList({
  onClose,
  handleAddNew,
  editableEducation,
  handleEdit,
  getProfile,
  allDegreeAndInst,
}: EducationListProps) {
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

  const handleDelete = async (id: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmDelete) return;

    try {
      const response = await API.delete(`/profile/education/${id}`);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error((error as any).response.data.error);
    } finally {
      getProfile();
    }
  };
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header p-3">
              <h5 className="modal-title">Edit Education</h5>
              <button type="button" className="btn-close" onClick={onClose}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 me-2" />
                Add Education
              </button>

              <div className="overflow-auto" style={{ maxHeight: "384px" }}>
                {editableEducation?.map((edu: any, index: any) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex gap-3">
                      <div
                        className="rounded-3 overflow-hidden bg-light flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      >
                        <RandomPixelLogo
                          rows={8}
                          cols={8}
                          density={0.5}
                          size={48}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="fw-medium mb-1">
                          {getDegreeById(edu.degree)}
                        </h4>
                        <p className="text-secondary mb-1">
                          {getInstituteById(edu.institute)}
                        </p>
                        <p className="small text-muted">
                          {new Date(edu.start_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {edu.currentlyStuding
                            ? "Present"
                            : new Date(edu.end_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                        </p>
                      </div>
                      <div className="d-flex gap-2 flex-column">
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleEdit(edu)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="btn btn-light btn-sm text-danger"
                          onClick={() => handleDelete(edu.uniqueId)}
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
}
