"use client";
import React, { useCallback, useEffect, useState } from "react";
import API from "@/service/API/API";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface Profile {}

const EditProfile = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | any>("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const response = await API.get(`/profile/detail`);
      setProfile(response.data);
      setSelectedCountry(response.data.country);
      setSelectedState(response.data.state);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: profile.username || "",
      name: profile.name || "",
      email: profile.email || "",
      mobile_no: profile.mobile_no || "",
      alt_mobile_no: profile.alt_mobile_no || "",
      address: profile.address || "",
      pincode: profile.pincode || "",
      country: profile.country || "",
      state: profile.state || "",
      city: profile.city || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile_no: Yup.string().required("Mobile number is required"),
      address: Yup.string().required("Address is required"),
      pincode: Yup.string().required("Pincode is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: async (values) => {
      setBtnLoading(true);
      try {
        const userPayload = {
          username: values.username,
          name: values.name,
          email: values.email,
          mobile_no: values.mobile_no,
          alt_mobile_no: values.alt_mobile_no,
        };
        const locationPayload = {
          userId: profile?.uniqueId,
          address: values.address,
          pincode: values.pincode,
          city: values.city,
          state: values.state,
          country: values.country,
        };

        const userRes = await API.patch(
          `/profile/user/${profile._id}`,
          userPayload
        );
        const locationRes = await API.patch(
          `/profile/location`,
          locationPayload
        );
        if (userRes && locationRes) {
          toast.success(userRes.data.message);
        }
      } catch (err) {
        console.error("Submit error:", err);
        toast.error((err as any)?.response?.data?.error);
      } finally {
        setBtnLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countryRes, stateRes, cityRes] = await Promise.all([
          API.get("/countries"),
          API.get("/states"),
          API.get("/cities"),
        ]);
        setCountries(countryRes.data);
        setStates(stateRes.data);
        setCities(cityRes.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = states.filter(
      (item: { country_name: string }) => item.country_name === selectedCountry
    );
    setFilteredStates(filtered);
  }, [selectedCountry, states]);

  useEffect(() => {
    const filtered = cities.filter(
      (c: { state_name: string }) => c.state_name === selectedState
    );
    setFilteredCities(filtered);
  }, [cities, selectedState]);

  return (
    <div className="container py-5">
      <div className="card shadow-sm mt-5 overflow-hidden rounded-4">
        <div className="card-header text-white">
          <h4 className="card-title text-primary">Edit Profile</h4>
        </div>
        <form onSubmit={formik.handleSubmit} className="card-body">
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${
                formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Username"
            />
            {typeof formik.errors.username === "string" &&
              formik.touched.username &&
              formik.errors.username && (
                <div className="invalid-feedback">{formik.errors.username}</div>
              )}
          </div>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${
                formik.touched.name && formik.errors.name ? "is-invalid" : ""
              }`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Full Name"
            />
            {typeof formik.errors.name === "string" &&
              formik.touched.name &&
              formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email"
            />
            {typeof formik.errors.email === "string" &&
              formik.touched.email &&
              formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
          </div>

          {/* Mobile No */}
          <div className="mb-3">
            <label className="form-label">Mobile No</label>
            <PhoneInput
              country={"in"}
              value={formik.values.mobile_no}
              onChange={(value) => formik.setFieldValue("mobile_no", value)}
              inputProps={{
                name: "mobile_no",
                onBlur: formik.handleBlur,
              }}
              inputClass="w-100 border"
              inputStyle={{ maxHeight: "44px" }}
              enableSearch
              buttonClass=" input-group-text"
            />
            {typeof formik.errors.mobile_no === "string" &&
              formik.touched.mobile_no &&
              formik.errors.mobile_no && (
                <div className="text-danger mt-1">
                  {formik.errors.mobile_no}
                </div>
              )}
          </div>
          {/* Mobile No */}
          <div className="mb-3">
            <label className="form-label">Alt. Mobile No</label>
            <PhoneInput
              country={"in"}
              value={formik.values.alt_mobile_no}
              onChange={(value) => formik.setFieldValue("alt_mobile_no", value)}
              inputProps={{
                name: "alt_mobile_no",
                onBlur: formik.handleBlur,
              }}
              inputClass="w-100 border"
              inputStyle={{ maxHeight: "44px" }}
              enableSearch
              buttonClass=" input-group-text"
            />
            {typeof formik.errors.alt_mobile_no === "string" &&
              formik.touched.alt_mobile_no &&
              formik.errors.alt_mobile_no && (
                <div className="text-danger mt-1">
                  {formik.errors.alt_mobile_no}
                </div>
              )}
          </div>

          {/* Address & Pincode */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className={`form-control ${
                  formik.touched.address && formik.errors.address
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Address"
              />
              {typeof formik.errors.address === "string" &&
                formik.touched.address &&
                formik.errors.address && (
                  <div className="invalid-feedback">
                    {formik.errors.address}
                  </div>
                )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                className={`form-control ${
                  formik.touched.pincode && formik.errors.pincode
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Pincode"
              />
              {typeof formik.errors.pincode === "string" &&
                formik.touched.pincode &&
                formik.errors.pincode && (
                  <div className="invalid-feedback">
                    {formik.errors.pincode}
                  </div>
                )}
            </div>
          </div>

          {/* Country */}
          <div className="mb-3">
            <label className="form-label">Country</label>
            <select
              name="country"
              className={`form-select ${
                formik.touched.country && formik.errors.country
                  ? "is-invalid"
                  : ""
              }`}
              value={formik.values.country}
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedCountry(e.target.value);
              }}
              onBlur={formik.handleBlur}
            >
              <option value="">-- Select Country --</option>
              {countries.map((c: any, idx) => (
                <option key={idx} value={c.country_name}>
                  {c.country_name}
                </option>
              ))}
            </select>
            {typeof formik.errors.country === "string" &&
              formik.touched.country &&
              formik.errors.country && (
                <div className="invalid-feedback">{formik.errors.country}</div>
              )}
          </div>

          {/* State & City */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">State</label>
              <select
                name="state"
                className={`form-select ${
                  formik.touched.state && formik.errors.state
                    ? "is-invalid"
                    : ""
                }`}
                value={formik.values.state}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedState(e.target.value);
                }}
                onBlur={formik.handleBlur}
              >
                <option value="">-- Select State --</option>
                {filteredStates.map((s: any, idx) => (
                  <option key={idx} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {typeof formik.errors.state === "string" &&
                formik.touched.state &&
                formik.errors.state && (
                  <div className="invalid-feedback">{formik.errors.state}</div>
                )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <select
                name="city"
                className={`form-select ${
                  formik.touched.city && formik.errors.city ? "is-invalid" : ""
                }`}
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">-- Select City --</option>
                {filteredCities.map((c: any, idx) => (
                  <option key={idx} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {typeof formik.errors.city === "string" &&
                formik.touched.city &&
                formik.errors.city && (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                )}
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            {btnLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
