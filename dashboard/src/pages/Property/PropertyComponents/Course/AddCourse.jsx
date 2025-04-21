import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import { propertyCourseValidation } from "../../../../context/ValidationSchemas";
import { API } from "../../../../context/API";
import Swal from "sweetalert2";

export default function AddCourse({
  property,
  courses,
  authUser,
  getPropertyCourses,
  setIsAdding,
}) {
  const [prices, setPrices] = useState({});
  const [currency, setCurrency] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [filteredCourse, setFilteredCourse] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    if (selectedCourse) {
      const foundCourse = courses.find(
        (course) => course?.course_name === selectedCourse
      );
      setFilteredCourse(foundCourse || null);
    }
  }, [selectedCourse, courses]);

  const formik = useFormik({
    initialValues: {
      userId: authUser?.uniqueId || "",
      property_id: property?.uniqueId || "",
      course_id: filteredCourse?.uniqueId || "",
      course_type: filteredCourse?.course_type || "",
      course_name: filteredCourse?.course_name || "",
      course_short_name: filteredCourse?.course_short_name || "",
      duration_value: filteredCourse?.duration?.split(" ")?.[0] || "",
      duration_type: filteredCourse?.duration?.split(" ")?.[1] || "",
      course_level: filteredCourse?.course_level || "",
      certification_type: filteredCourse?.certification_type || "",
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: propertyCourseValidation,
    onSubmit: async (values) => {
      const data = {
        ...values,
        prices,
        duration: `${values.duration_value} ${values.duration_type}`,
      };
      try {
        const response = await API.post(`/property-course`, data);
        Swal.fire({
          icon: "success",
          title: "Successfull",
          text: response.data.message || "Successfully added",
        });
        getPropertyCourses();
        setIsAdding(false);
        formik.resetForm();
        setPrices({});
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error.response.data.error || "failed to add course",
          title: "Error",
        });
      }
    },
  });

  const handleAddPrice = () => {
    if (currency && priceInput) {
      setPrices({ ...prices, [currency]: priceInput });
      setCurrency("");
      setPriceInput("");
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a currency and enter a price.",
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Add New Course</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <h5 className="mb-3 text-dark">Course Details</h5>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Select
                  name="course_name"
                  value={formik.values.course_name}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    formik.handleChange(e);
                  }}
                  isInvalid={formik.errors.course_name}
                >
                  <option value="">Select Course</option>
                  {courses?.map((course, index) => (
                    <option value={course?.course_name} key={index}>
                      {course?.course_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.course_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course Type</Form.Label>
                <Form.Select
                  name="course_type"
                  value={formik.values.course_type}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.course_type}
                >
                  <option value="">Select Type</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Retreat">Retreat</option>
                  <option value="Teacher Training">Teacher Training</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.course_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Short Name</Form.Label>
                <Form.Control
                  type="text"
                  name="course_short_name"
                  placeholder="e.g. WD101"
                  value={formik.values.course_short_name}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.course_short_name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.course_short_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="number"
                  name="duration_value"
                  placeholder="e.g. 3"
                  value={formik.values.duration_value}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.duration_value}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.duration_value}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Duration Type</Form.Label>
                <Form.Select
                  name="duration_type"
                  value={formik.values.duration_type}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.duration_type}
                >
                  <option value="">Select</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.duration_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course Level</Form.Label>
                <Form.Select
                  name="course_level"
                  value={formik.values.course_level}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.course_level}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
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
                  value={formik.values.certification_type}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.certification_type}
                >
                  <option value="">Select Certification</option>
                  <option value="Degree">Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Bachlore">Bachlore</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.certification_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-end mb-3">
            <Col md={6}>
              <Form.Label>Currency</Form.Label>
              <InputGroup>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="">Select Currency</option>
                  <option value="INR">₹ INR</option>
                  <option value="DOLLAR">$ Dollar</option>
                  <option value="EURO">€ Euro</option>
                </Form.Select>
                <Form.Control
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="Enter price"
                />
                <Button onClick={handleAddPrice} variant="success">
                  <i className="fe fe-plus-circle me-1"></i>Add Price
                </Button>
              </InputGroup>
            </Col>
            <Col md={6}>
              {" "}
              {Object.keys(prices).length > 0 && (
                <div className="tags">
                  {Object.entries(prices).map(([currency, value]) => (
                    <div
                      key={currency}
                      className="tag shadow-sm"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span>
                        {currency === "INR" && "₹"}
                        {currency === "DOLLAR" && "$"}
                        {currency === "EURO" && "€"}
                        {value}
                      </span>
                      <button
                        type="button"
                        className="tag-addon btn"
                        onClick={() =>
                          setPrices((prev) => {
                            const updated = { ...prev };
                            delete updated[currency];
                            return updated;
                          })
                        }
                      >
                        <i className="fe fe-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>

          <Button type="submit" variant="primary">
            <i className="fe fe-check-circle me-1"></i>Add Course
          </Button>
          <Button
            variant="danger"
            className="ms-1"
            onClick={() => setIsAdding(false)}
          >
            <i className="fe fe-x me-1"></i>Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
