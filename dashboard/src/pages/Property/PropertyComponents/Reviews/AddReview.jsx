import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { Rating } from "@mui/material";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";
import { reviewValidation } from "../../../../context/ValidationSchemas";
import { API } from "../../../../context/API";

export default function AddReview({ property, getReview }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    API.get("/profile")
      .then((res) => setUserData(res.data))
      .catch((error) => console.log("User Data Error:", error));
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: userData?.uniqueId || "",
      property_id: property?.uniqueId || "",
      name: "",
      email: "",
      phone_number: "",
      gender: "",
      review: "",
      rating: 0,
    },
    enableReinitialize: true,
    validationSchema: reviewValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await API.post(`/review`, values);
        Swal.fire({
          icon: "success",
          title: "Review Submitted",
          text:
            response.data.message ||
            "Your review has been submitted successfully!",
        });
        formik.resetForm();
        getReview();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            error.response.data.error ||
            "Something went wrong! Please try again later.",
        });
      }
    },
  });

  return (
    <div>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="m-0">Add Review</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        {...formik.getFieldProps("name")}
                      />
                      {formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone_number">
                      <Form.Label>Phone Number</Form.Label>
                      <PhoneInput
                        country={"in"}
                        value={formik.values.phone_number}
                        inputClass="w-100 border"
                        buttonClass="border bg-white"
                        onChange={(value) =>
                          formik.setFieldValue("phone_number", value)
                        }
                      />
                      {formik.errors.phone_number && (
                        <div className="text-danger">
                          {formik.errors.phone_number}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Male"
                          id="gender-male"
                          name="gender"
                          value="male"
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="gender-female"
                          label="Female"
                          name="gender"
                          value="female"
                          onChange={formik.handleChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="gender-other"
                          label="Other"
                          name="gender"
                          value="other"
                          onChange={formik.handleChange}
                        />
                      </div>
                      {formik.errors.gender && (
                        <div className="text-danger">
                          {formik.errors.gender}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <div>
                        <Rating
                          name="rating"
                          value={formik.values.rating}
                          onChange={(event, newValue) =>
                            formik.setFieldValue("rating", newValue)
                          }
                        />
                      </div>
                      {formik.errors.rating && (
                        <div className="text-danger">
                          {formik.errors.rating}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="review">
                      <Form.Label>Review</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        maxLength={500}
                        placeholder="Write your review..."
                        {...formik.getFieldProps("review")}
                      />
                      <div className="text-muted">
                        {formik.values.review.length} / 500
                      </div>
                      {formik.errors.review && (
                        <div className="text-danger">
                          {formik.errors.review}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit">
                  <i className="fe fe-check-circle me-1"></i>Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
