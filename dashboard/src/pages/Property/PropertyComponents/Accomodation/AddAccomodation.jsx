import React, { useMemo, useState } from "react";
import { Card, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import JoditEditor from "jodit-react";
import { API } from "../../../../context/API";
import Swal from "sweetalert2";
import { accomodationValidation } from "../../../../context/ValidationSchemas";
import { getEditorConfig } from "../../../../context/getEditorConfig";

export default function AddAccomodation({
  property,
  authUser,
  getAccomodation,
}) {
  const [prices, setPrices] = useState({});
  const [currency, setCurrency] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [btnResponse, setBtnResponse] = useState(false);
  const editorConfig = useMemo(() => getEditorConfig(), []);

  const formik = useFormik({
    initialValues: {
      userId: authUser?.uniqueId || "",
      property_id: property?.uniqueId || "",
      accomodation_name: "Co. Ed.",
      accomodation_description: "",
    },
    validationSchema: accomodationValidation,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setBtnResponse(true);
      const finalData = {
        ...values,
        accomodation_price: Object.keys(prices).length > 0 ? prices : {},
      };

      try {
        const response = await API.post(`/accomodation`, finalData);

        Swal.fire({
          icon: "success",
          title: "Accomodation Added",
          text:
            response.data.message ||
            "The Accomodation has been added successfully!",
          timer: 2000,
        });

        resetForm();
        setPrices({});
        getAccomodation();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text:
            error.response?.data?.error ||
            "Something went wrong while adding the Accomodation.",
        });
      } finally {
        setBtnResponse(false);
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
            <Card.Header>
              <Card.Title>Add Accomodation</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* Accomodation Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Accomodation Name</Form.Label>
                  <Form.Select
                    disabled
                    name="accomodation_name"
                    onChange={formik.handleChange}
                    value={formik.values.accomodation_name}
                    isInvalid={!!formik.errors.accomodation_name}
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
                  </Col>
                  <Col md={6} className="align-content-center">
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
                {/* Accomodation Description */}
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

                {/* Submit */}
                <Button type="submit" variant="success" disabled={btnResponse}>
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
