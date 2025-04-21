import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import { API } from "../../../../context/API";
import Swal from "sweetalert2";
import { accomodationValidation } from "../../../../context/ValidationSchemas";
import { getEditorConfig } from "../../../../context/getEditorConfig";

export default function EditAccomodation({
  accomodation,
  getAccomodation,
  setIsUpdating,
}) {
  const [prices, setPrices] = useState({});
  const [currency, setCurrency] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const editorConfig = useMemo(() => getEditorConfig(), []);

  useEffect(() => {
    if (accomodation?.accomodation_price) {
      setPrices(accomodation.accomodation_price[0]);
    }
  }, [accomodation]);

  const formik = useFormik({
    initialValues: {
      property_id: accomodation?.property_id || "",
      accomodation_name: accomodation?.accomodation_name || "CoEd.",
      accomodation_description: accomodation?.accomodation_description || "",
    },
    validationSchema: accomodationValidation,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const updatedData = {
        ...values,
        ...(Object.keys(prices).length > 0 && { accomodation_price: prices }), // Only include prices if not empty
      };

      try {
        const response = await API.patch(
          `/accomodation/${accomodation?.uniqueId}`,
          updatedData
        );

        Swal.fire({
          icon: "success",
          title: "Accomodation Updated",
          text:
            response.data.message ||
            "The Accomodation details have been updated successfully!",
          timer: 2000,
        });
        setIsUpdating("");
        getAccomodation();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text:
            error.response?.data?.error ||
            "Something went wrong while updating the Accomodation.",
        });
      }
    },
  });

  const addPrice = () => {
    if (currency && priceInput) {
      setPrices((prev) => ({
        ...prev,
        [currency]: Number(priceInput),
      }));
      setPriceInput("");
      setCurrency("");
    }
  };

  const removePrice = (key) => {
    const newPrices = { ...prices };
    delete newPrices[key];
    setPrices(newPrices);
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Title>Edit Accomodation</Card.Title>
              <div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setIsUpdating("")}
                >
                  <i className="fe fe-x me-1"></i>Cancel
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* Accomodation Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Accomodation Name</Form.Label>
                  <Form.Select
                    name="accomodation_name"
                    onChange={formik.handleChange}
                    value={formik.values.accomodation_name}
                    isInvalid={!!formik.errors.accomodation_name}
                    disabled
                  >
                    <option value="">Select Accomodation</option>
                    <option value="Co. Ed.">Co. Ed.</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.accomodation_name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Accomodation Price */}
                <Row>
                  <Col md={6}>
                    <Form.Label>Accomodation Price</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ maxWidth: "200px" }}
                      >
                        <option value="">--select currency--</option>
                        <option value="INR">₹ INR</option>
                        <option value="DOLLAR">$ DOLLAR</option>
                        <option value="EURO">€ EURO</option>
                      </Form.Select>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                      />
                      <Button variant="primary" onClick={addPrice}>
                        <i className="fe fe-plus me-1"></i>Add
                      </Button>
                    </InputGroup>
                  </Col>{" "}
                  <Col md={6} className="align-content-center">
                    {prices && Object.keys(prices).length > 0 && (
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
                              onClick={() => removePrice(currency)}
                            >
                              <i className="fe fe-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Accomodation Description</Form.Label>
                  <JoditEditor
                    value={formik.values.accomodation_description}
                    onBlur={() =>
                      formik.setFieldTouched("accomodation_description", true)
                    }
                    onChange={(newContent) =>
                      formik.setFieldValue(
                        "accomodation_description",
                        newContent
                      )
                    }
                    config={editorConfig}
                  />
                  {formik.touched.accomodation_description &&
                    formik.errors.accomodation_description && (
                      <div className="text-danger mt-1">
                        {formik.errors.accomodation_description}
                      </div>
                    )}
                </Form.Group>

                <Button type="submit" variant="warning">
                  <i className="fe fe-check-circle me-1"></i>Update Accomodation
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
