"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import API from "@/service/API/API";
import CreatableSelect from "react-select/creatable";
import { XIcon } from "lucide-react";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface FormProps {
  editableExperiences: any;
  setShowForm: any;
  editingItem: any;
  profileData: any;
  properties: any;
  getProfile: any;
}

export default function ExpereninceModalForm({
  editableExperiences,
  setShowForm,
  editingItem,
  profileData,
  properties,
  getProfile,
}: FormProps) {
  const [companySelectOptions, setCompanySelectOptions] = useState([]);
  const [companyError, setCompanyError] = useState("");

  useEffect(() => {
    if (properties) {
      const formattedOptions = properties?.map((property: any) => ({
        label: property.property_name,
        value: property.property_name,
        id: property.uniqueId,
      }));
      setCompanySelectOptions(formattedOptions);
    }
  }, [properties]);

  const formatToMonthInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const formik = useFormik({
    initialValues: {
      uniqueId: editingItem?.uniqueId || "",
      userId: profileData?.uniqueId || "",
      position: editingItem?.position || "",
      property_id: editingItem?.property_id || null,
      property_name: editingItem?.property_name || "",
      location: editingItem?.location || "",
      currentlyWorking: editingItem?.currentlyWorking || false,
      start_date: formatToMonthInput(editingItem?.start_date),
      end_date: formatToMonthInput(editingItem?.end_date),
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      position: Yup.string().required("Position is required"),

      property_id: Yup.string().nullable(),

      property_name: Yup.string()
        .nullable()
        .when("property_id", (property_id, schema) =>
          !property_id
            ? schema.required("Company is required")
            : schema.nullable()
        ),
      location: Yup.string().required("Location is required"),

      start_date: Yup.string()
        .required("Start date is required")
        .matches(/^\d{4}-\d{2}$/, "Start date must be in YYYY-MM format"),

      end_date: Yup.string()
        .nullable()
        .matches(/^\d{4}-\d{2}$/, "End date must be in YYYY-MM format")
        .test(
          "required-if-not-currently",
          "End date is required if not currently working",
          function (value) {
            const { currentlyWorking } = this.parent;
            return currentlyWorking || !!value;
          }
        )
        .test(
          "end-after-start",
          "End date must be after start date",
          function (value) {
            const { start_date, currentlyWorking } = this.parent;
            if (currentlyWorking || !value || !start_date) return true;
            return new Date(value + "-01") > new Date(start_date + "-01");
          }
        ),

      currentlyWorking: Yup.boolean(),
    }),

    onSubmit: async (values) => {
      if (!values?.property_id && !values.property_name) {
        setCompanyError("Have To Select Company");
        return;
      }
      const payload = {
        ...values,
        property_id: values.property_id || null,
        property_name: values.property_id ? "" : values.property_name,
      };

      try {
        const response = await API.post(`/profile/experience`, payload);
        toast.success(response.data.message);
      } catch (error) {
        toast.error((error as any).response.data.error);
      } finally {
        setShowForm(false);
        getProfile();
      }
    },
  });

  useEffect(() => {
    if (formik.values.currentlyWorking && formik.values.end_date) {
      formik.setFieldValue("end_date", "");
    }
  }, [formik.values.currentlyWorking]);

  const handleCompanyChange = (option: any) => {
    if (option && option.id) {
      formik.setFieldValue("property_name", "");
      formik.setFieldValue("property_id", option.id);
    } else if (option) {
      formik.setFieldValue("property_name", option.value);
      formik.setFieldValue("property_id", null);
    } else {
      formik.setFieldValue("property_name", "");
      formik.setFieldValue("property_id", null);
    }
  };

  const handleCompanyCreate = (inputValue: string) => {
    formik.setFieldValue("property_name", inputValue);
    formik.setFieldValue("property_id", null);
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header p-3">
              <h5 className="modal-title">
                {editableExperiences?.find(
                  (exp: any) => exp?.uniqueId === editingItem?.uniqueId
                )
                  ? "Edit Experience"
                  : "Add Experience"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForm(false)}
              >
                <XIcon />
              </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Software Engineer"
                      {...formik.getFieldProps("position")}
                    />
                    {formik.touched.position &&
                      typeof formik.errors.position === "string" && (
                        <small className="text-danger">
                          {formik.errors.position}
                        </small>
                      )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company</label>
                    <CreatableSelect
                      options={companySelectOptions.filter(
                        (opt: any) =>
                          !formik.values.property_name ||
                          opt.value !== formik.values.property_name
                      )}
                      onChange={handleCompanyChange}
                      onCreateOption={handleCompanyCreate}
                      value={
                        formik.values.property_id
                          ? companySelectOptions.find(
                              (option: any) =>
                                option?.id === formik.values.property_id
                            ) || null
                          : formik.values.property_name
                          ? {
                              label: formik.values.property_name,
                              value: formik.values.property_name,
                            }
                          : null
                      }
                      isClearable
                    />{" "}
                    {companyError && (
                      <small className="text-danger">{companyError}</small>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      {...formik.getFieldProps("location")}
                      placeholder="San Francisco, CA"
                    />
                    {formik.touched.location &&
                      typeof formik.errors.location === "string" && (
                        <small className="text-danger">
                          {formik.errors.location}
                        </small>
                      )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      type="month"
                      className="form-control"
                      {...formik.getFieldProps("start_date")}
                    />
                    {formik.touched.start_date &&
                      typeof formik.errors.start_date === "string" && (
                        <small className="text-danger">
                          {formik.errors.start_date}
                        </small>
                      )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      type="month"
                      className="form-control"
                      {...formik.getFieldProps("end_date")}
                      disabled={formik.values.currentlyWorking}
                    />
                    {formik.touched.end_date &&
                      typeof formik.errors.end_date === "string" && (
                        <small className="text-danger">
                          {formik.errors.end_date}
                        </small>
                      )}
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="current"
                        checked={formik.values.currentlyWorking}
                        {...formik.getFieldProps("currentlyWorking")}
                      />
                      <label className="form-check-label" htmlFor="current">
                        I currently work here
                      </label>
                      {formik.touched.currentlyWorking &&
                        typeof formik.errors.currentlyWorking === "string" && (
                          <small className="text-danger">
                            {formik.errors.currentlyWorking}
                          </small>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
