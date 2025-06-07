import RandomPixelLogo from "@/components/ImageGenerator/RandomPixelLogo";
import { Edit, Plus, XIcon } from "lucide-react";
import React from "react";

interface listProps {
  onClose: any;
  handleAddNew: any;
  editableExperiences: any;
  handleEdit: any;
  properties: any;
  profileProperties: any;
}

export default function ExpereninceModalList({
  onClose,
  handleAddNew,
  editableExperiences,
  handleEdit,
  properties,
  profileProperties,
}: listProps) {
  const getPropertyDetails = (id: number) => {
    const property = properties.find(
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
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header p-3">
              <h5 className="modal-title">Edit Experience</h5>
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
                Add Experience
              </button>

              <div className="overflow-auto" style={{ maxHeight: "384px" }}>
                {editableExperiences?.map((exp: any, index: number) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex gap-3">
                      <div
                        className="rounded-3 overflow-hidden bg-light flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      >
                        {exp?.property_id ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${
                              getPropertyDetails(exp?.property_id)
                                ?.property_logo?.[0]
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
                      <div className="flex-grow-1">
                        <h4 className="fw-medium mb-1">{exp?.position}</h4>
                        <p className="text-secondary mb-1">
                          {exp.property_id
                            ? getPropertyDetails(exp.property_id)?.property_name
                            : getProfilePropertyDetails(exp.property_name_id)
                                ?.property_name}
                        </p>
                        <p className="small text-muted mb-1">{exp.location}</p>
                        <p className="small text-muted">
                          {new Date(exp.start_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : new Date(exp.end_date).toLocaleDateString(
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
                          onClick={() => handleEdit(exp)}
                        >
                          <Edit className="w-4 h-4" />
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
