import React from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { API } from "../../context/API";

export default function CreateKeyOutComes({ onAfterCreate }) {
  const formik = useFormik({
    initialValues: {
      key_outcome: "",
    },
    validationSchema: Yup.object({
      key_outcome: Yup.string()
        .trim()
        .required("Key Outcome is required")
        .min(2, "Must be at least 2 characters"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.post("/key-outcome", values);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data?.message || "Key Outcome created successfully!",
        });

        resetForm();
        onAfterCreate();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            error.message ||
            "Failed to create Key Outcome. Please try again.",
        });
      }
    },
  });

  return (
    <div>
      <Row>
        <Col md={12} className="mx-auto">
          <Card>
            <Card.Header>
              <Card.Title>Create Key Outcome</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="key_outcome">
                  <Form.Label>Key Outcome</Form.Label>
                  <Form.Control
                    type="text"
                    name="key_outcome"
                    placeholder="Enter Key Outcome name"
                    value={formik.values.key_outcome}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.key_outcome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.key_outcome}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
