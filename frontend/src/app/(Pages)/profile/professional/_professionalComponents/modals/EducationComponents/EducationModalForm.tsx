import React, { useEffect } from "react";
import { useFormik } from "formik";
import CreatableSelect from "react-select/creatable";
import API from "@/service/API/API";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface EducationFormProps {
  editableEducation: any;
  editingItem: any;
  setShowForm: any;
  allDegreeAndInst: any;
  profileData: any;
  getProfile: any;
}

export default function EducationModalForm({
  editableEducation,
  editingItem,
  setShowForm,
  allDegreeAndInst,
  profileData,
  getProfile,
}: EducationFormProps) {
  const formatToMonthInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const degreeOptions = (allDegreeAndInst?.degree || []).map((deg: any) => ({
    value: deg.uniqueId,
    label: deg.degree_name,
    uniqueId: deg.uniqueId,
  }));

  const instituteOptions = (allDegreeAndInst?.institute || []).map(
    (inst: any) => ({
      value: inst.uniqueId,
      label: inst.institute_name,
      uniqueId: inst.uniqueId,
    })
  );

  const getInitialDegreeOption = () => {
    return (
      degreeOptions.find((opt: any) => opt.uniqueId === editingItem?.degree) ||
      null
    );
  };

  const getInitialInstituteOption = () => {
    return (
      instituteOptions.find(
        (opt: any) => opt.uniqueId === editingItem?.institute
      ) || null
    );
  };

  const formik = useFormik({
    initialValues: {
      userId: profileData.uniqueId || "",
      uniqueId: editingItem?.uniqueId || "",
      degreeSelect: getInitialDegreeOption(),
      instituteSelect: getInitialInstituteOption(),
      start_date: formatToMonthInput(editingItem?.start_date),
      end_date: formatToMonthInput(editingItem?.end_date),
      currentlyStuding: editingItem?.currentlyStuding || false,
    },
    validationSchema: Yup.object().shape({
      degreeSelect: Yup.object()
        .shape({
          value: Yup.string(),
          label: Yup.string().required("Degree is required"),
        })
        .nullable()
        .required("Degree is required"),

      instituteSelect: Yup.object()
        .shape({
          value: Yup.string(),
          label: Yup.string().required("Institute is required"),
        })
        .nullable()
        .required("Institute is required"),

      start_date: Yup.string()
        .required("Start date is required")
        .matches(/^\d{4}-\d{2}$/, "Start date must be in YYYY-MM format"),

      end_date: Yup.string()
        .nullable()
        .matches(/^\d{4}-\d{2}$/, "End date must be in YYYY-MM format")
        .test(
          "end-date-check",
          "End date is required if not currently studying",
          function (value) {
            const { currentlyStuding } = this.parent;
            if (currentlyStuding) return true;
            return !!value;
          }
        )
        .test(
          "end-after-start",
          "End date must be after start date",
          function (value) {
            const { start_date, currentlyStuding } = this.parent;
            if (currentlyStuding || !value || !start_date) return true;
            const start = new Date(start_date + "-01");
            const end = new Date(value + "-01");
            return end > start;
          }
        ),

      currentlyStuding: Yup.boolean(),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload: any = {
        start_date: values.start_date,
        end_date: values.currentlyStuding ? null : values.end_date,
        currentlyStuding: values.currentlyStuding,
        userId: values?.userId,
        uniqueId: values?.uniqueId,
      };

      // Degree logic
      const selectedDegree = values.degreeSelect;
      if (selectedDegree) {
        const isExistingDegree = degreeOptions.find(
          (opt: any) => opt.value == selectedDegree.value // loose equality
        );
        if (isExistingDegree) {
          payload.degreeId = selectedDegree.value;
        } else {
          payload.degree = selectedDegree.label;
        }
      }

      // Institute logic
      const selectedInstitute = values.instituteSelect;
      if (selectedInstitute) {
        const isExistingInstitute = instituteOptions.find(
          (opt: any) => opt.value === selectedInstitute.value
        );
        if (isExistingInstitute) {
          payload.instituteId = selectedInstitute.value;
        } else {
          payload.institute = selectedInstitute.label;
        }
      }

      try {
        const response = await API.post(`/profile/education`, payload);
        toast.success(response.data.message);
      } catch (error) {
        console.error(error);
        toast.error((error as any)?.response?.data?.error || "Something went wrong");
      } finally {
        getProfile();
        setShowForm(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.currentlyStuding && formik.values.end_date) {
      formik.setFieldValue("end_date", "");
    }
  }, [formik.values.currentlyStuding]);

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editableEducation?.find(
                  (edu: any) => edu.id === editingItem?.id
                )
                  ? "Edit Education"
                  : "Add Education"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForm(false)}
              ></button>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Degree</label>
                    <CreatableSelect
                      isClearable
                      options={degreeOptions}
                      value={formik.values.degreeSelect}
                      onChange={(option) =>
                        formik.setFieldValue("degreeSelect", option)
                      }
                    />
                    {formik.touched.degreeSelect &&
                      typeof formik.errors.degreeSelect === "string" && (
                        <p className="text-danger">
                          {formik.errors.degreeSelect}
                        </p>
                      )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Institution</label>
                    <CreatableSelect
                      isClearable
                      options={instituteOptions}
                      value={formik.values.instituteSelect}
                      onChange={(option) =>
                        formik.setFieldValue("instituteSelect", option)
                      }
                    />
                    {formik.touched.instituteSelect &&
                      typeof formik.errors.instituteSelect === "string" && (
                        <p className="text-danger">
                          {formik.errors.instituteSelect}
                        </p>
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
                        <p className="text-danger">
                          {formik.errors.start_date}
                        </p>
                      )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      type="month"
                      className="form-control"
                      {...formik.getFieldProps("end_date")}
                      disabled={formik.values.currentlyStuding}
                    />
                    {formik.touched.end_date &&
                      typeof formik.errors.end_date === "string" && (
                        <p className="text-danger">{formik.errors.end_date}</p>
                      )}
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="current-study"
                        checked={formik.values.currentlyStuding}
                        {...formik.getFieldProps("currentlyStuding")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="current-study"
                      >
                        I currently study here
                      </label>
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
