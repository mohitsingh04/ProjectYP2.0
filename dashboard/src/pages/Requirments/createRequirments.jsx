import React from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { API } from "../../context/API";

export default function CreateRequirments({ onAfterCreate }) {
  const formik = useFormik({
    initialValues: {
      requirment: "",
    },
    validationSchema: Yup.object({
      requirment: Yup.string()
        .trim()
        .required("Requirment is required")
        .min(2, "Must be at least 2 characters"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.post("/requirment", values);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data?.message || "Requirment created successfully!",
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
            "Failed to create Requirment. Please try again.",
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
              <Card.Title>Create Requirment</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="requirment">
                  <Form.Label>Requirment</Form.Label>
                  <Form.Control
                    type="text"
                    name="requirment"
                    placeholder="Enter Requirment name"
                    value={formik.values.requirment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.errors.requirment}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.requirment}
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
