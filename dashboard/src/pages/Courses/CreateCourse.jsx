import Swal from "sweetalert2";
import Dropdown from "react-dropdown-select";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { API } from "../../context/API";
import { createCourseValidation } from "../../context/ValidationSchemas";
import { getEditorConfig } from "../../context/getEditorConfig";

export default function CreateCourse() {
  const navigator = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [authUser, setAuthUser] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const editorConfig = useMemo(() => getEditorConfig(), []);
  const [bestFor, setBestFor] = useState([]);
  const [bestForInput, setBestForInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [requirmentOptions, setRequirmentOptions] = useState([]);
  const [KeyOutComesOption, setKeyOutcomesOptions] = useState([]);

  const fetchData = async () => {
    try {
      const [requrimentResponse, keyOutcomeRes, categoryRes] =
        await Promise.all([
          API.get("/requirment/all"),
          API.get("/key-outcome/all"),
          API.get("/category"),
        ]);

      const allRequirments = requrimentResponse.data.map((requirment) => ({
        label: requirment.requirment,
        value: requirment.uniqueId,
      }));
      const keyOutceData = keyOutcomeRes.data.map((keyOpt) => ({
        label: keyOpt.key_outcome,
        value: keyOpt.uniqueId,
      }));
      setCategories(categoryRes.data);
      setRequirmentOptions(allRequirments);
      setKeyOutcomesOptions(keyOutceData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAuhtUser = async () => {
    setAuthLoading(true);
    try {
      const response = await API.get(`/profile`);
      setAuthUser(response.data);
    } catch (error) {
      console.error(
        error.response.data.error ||
          error.response.data.message ||
          error.message
      );
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getAuhtUser();
  }, []);

  if (!authLoading) {
    if (!authUser?.permissions?.some((item) => item === "Create Course")) {
      navigator("/dashboard/access-denied");
    }
  }

  const initialValues = {
    course_name: "",
    duration_value: "",
    duration_type: "",
    course_type: "",
    certification_type: "",
    status: "",
    course_level: "",
    course_short_name: "",
    requirements: [],
    key_outcomes: [],
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("userId", authUser?.uniqueId);
    formData.append("course_name", values.course_name);
    formData.append("course_short_name", values.course_short_name);
    formData.append("course_type", values.course_type);
    formData.append("course_level", values.course_level);
    formData.append("certification_type", values.certification_type);
    formData.append("description", content);
    formData.append(
      "duration",
      `${values.duration_value} ${values.duration_type}`
    );
    if (values.image) {
      formData.append("image", values.image);
    }
    values.requirements.forEach((item, index) => {
      formData.append(`requirements[${index}]`, item.value);
    });
    values.key_outcomes.forEach((item, index) => {
      formData.append(`key_outcomes[${index}]`, item.value);
    });
    bestFor.map((item) => {
      formData.append("best_for", item);
    });
    setBtnLoading(true);

    try {
      const response = await API.post(`/course`, formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message || "Course added successfully.",
      }).then(() => {
        navigator(`/dashboard/course`);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response.data.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setBtnLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createCourseValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleBestFor = () => {
    if (bestFor.includes(bestForInput.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate Entry",
        text: `"${bestForInput}" is already in the list.`,
      });
    } else if (bestForInput.trim() !== "") {
      setBestFor((prev) => [...prev, bestForInput.trim()]);
      setBestForInput("");
    }
  };

  const handleBestForRemove = (indexToRemove) => {
    setBestFor((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Courses</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: "/dashboard/course" }}
            >
              Courses
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Create</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button variant="primary" onClick={() => navigator(-1)}>
            <i className="fe fe-arrow-left"></i> Back
          </Button>
        </div>
      </div>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Create Course</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course Type</Form.Label>
                      <Form.Select
                        name="course_type"
                        value={formik.values.course_type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.errors.course_type}
                      >
                        <option value="" disabled>
                          Select Course
                        </option>
                        {categories
                          .filter(
                            (item) =>
                              item?.parent_category?.toLowerCase() ===
                              "course type"
                          )
                          .map((item) => (
                            <option value={item?.uniqueId}>
                              {item.category_name}
                            </option>
                          ))}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {formik.errors.course_type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="course_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.course_name}
                        placeholder="Enter course name"
                        isInvalid={formik.errors.course_name}
                      />
                    </Form.Group>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.course_name}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course Short Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="course_short_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.course_short_name}
                        placeholder="Enter short name"
                        isInvalid={formik.errors.course_short_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.course_short_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Duration</Form.Label>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            name="duration_value"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.duration_value}
                            placeholder="Enter duration"
                            isInvalid={formik.errors.duration_value}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.duration_value}
                          </Form.Control.Feedback>
                        </Col>
                        <Col md={6}>
                          <Form.Select
                            name="duration_type"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.duration_type}
                            isInvalid={formik.errors.duration_type}
                          >
                            <option value="">Select</option>
                            <option value="Hours">Hours</option>
                            <option value="Days">Days</option>
                            <option value="Weeks">Weeks</option>
                            <option value="Months">Months</option>
                            <option value="Years">Years</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.duration_type}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course Difficulty Level</Form.Label>
                      <Form.Select
                        name="course_level"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.course_level}
                        isInvalid={formik.errors.course_level}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {categories
                          .filter(
                            (item) =>
                              item?.parent_category?.toLowerCase() ===
                              "difficulty level"
                          )
                          .map((item) => (
                            <option value={item?.uniqueId}>
                              {item.category_name}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.course_level}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Certification Type</Form.Label>
                      <Form.Select
                        name="certification_type"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.certification_type}
                        isInvalid={formik.errors.certification_type}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {categories
                          .filter(
                            (item) =>
                              item?.parent_category?.toLowerCase() ===
                              "certification type"
                          )
                          .map((item) => (
                            <option value={item?.uniqueId}>
                              {item.category_name}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.certification_type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Course Description</Form.Label>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={editorConfig}
                        className="overflow-auto"
                        onChange={(newContent) => setContent(newContent)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <div className="d-flex justify-content-between align-items-center">
                      <p>
                        <strong>Course Image</strong>
                      </p>
                      <Form.Label
                        htmlFor="course_image"
                        className="btn btn-primary btn-sm"
                      >
                        <i className="fe fe-upload me-1"></i> Upload Course
                        Image
                      </Form.Label>
                    </div>
                    <img
                      src={previewImage ? previewImage : ALLImages("face8")}
                      className="img-fluid w-100 mb-2"
                      width={`350px`}
                      alt=""
                    />
                    <Form.Group className="text-end">
                      <Form.Control
                        type="file"
                        onChange={handleImageChange}
                        accept=".jpg,.png"
                        id={`course_image`}
                        className="d-none"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Pre-requisites
                        <OverlayTrigger
                          placement={`top-start`}
                          overlay={
                            <Tooltip
                              className="tooltip-light"
                              style={{ fontSize: "10px" }}
                            >
                              Yoga mat required", "No prior experience needed"
                            </Tooltip>
                          }
                          key={Math.random()}
                        >
                          <i className="fe fe-info ms-1"></i>
                        </OverlayTrigger>
                      </Form.Label>
                      <Dropdown
                        options={requirmentOptions}
                        multi
                        keepSelectedInList={false}
                        placeholder="Choose Requirments"
                        values={formik.values.requirements}
                        onChange={(value) =>
                          formik.setFieldValue("requirements", value)
                        }
                        labelField="label"
                        valueField="value"
                        searchable={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.requirements}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Key Outcomes (What Will You Learn)
                        <OverlayTrigger
                          placement={`top-start`}
                          overlay={
                            <Tooltip
                              className="tooltip-light"
                              style={{ fontSize: "10px" }}
                            >
                              Bullet list of learning outcomes, e.g. improved
                              flexibility, stress relief techniques
                            </Tooltip>
                          }
                          key={Math.random()}
                        >
                          <i className="fe fe-info ms-1"></i>
                        </OverlayTrigger>
                      </Form.Label>
                      <Dropdown
                        options={KeyOutComesOption}
                        multi
                        keepSelectedInList={false}
                        placeholder="Choose Key Outcomes"
                        values={formik.values.key_outcomes}
                        onChange={(value) =>
                          formik.setFieldValue("key_outcomes", value)
                        }
                        labelField="label"
                        valueField="value"
                        searchable={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.key_outcomes}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col>
                        <Form.Group>
                          <Form.Label>
                            Best For People{" "}
                            <OverlayTrigger
                              placement={`top-start`}
                              overlay={
                                <Tooltip
                                  className="tooltip-light"
                                  style={{ fontSize: "10px" }}
                                >
                                  "People with back pain", "Busy professionals",
                                  "Pregnant women", etc.
                                </Tooltip>
                              }
                              key={Math.random()}
                            >
                              <i className="fe fe-info ms-1"></i>
                            </OverlayTrigger>
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              onChange={(e) => setBestForInput(e.target.value)}
                              value={bestForInput}
                              placeholder="Enter Pre Requirements"
                            />
                            <Button onClick={() => handleBestFor()}>Add</Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        {bestFor.length > 0 && (
                          <div className="tags">
                            {bestFor.map((item, index) => (
                              <div
                                key={index}
                                className="tag shadow-sm"
                                style={{ fontSize: "0.9rem" }}
                              >
                                <span>{item}</span>
                                <button
                                  type="button"
                                  className="tag-addon btn"
                                  onClick={() => handleBestForRemove(index)}
                                >
                                  <i className="fe fe-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>

                  <Col md={12}>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={btnLoading}
                    >
                      <i className="fe fe-check-circle me-1"></i>
                      {btnLoading ? "Saving..." : "Submit"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
