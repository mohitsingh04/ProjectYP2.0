import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { API } from "../../../../../context/API";
import { cityValidation } from "../../../../../context/ValidationSchemas";

export default function PropertyCity({
  cities,
  property,
  getProperty,
  location,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const formik = useFormik({
    initialValues: {
      property_city: location?.property_city || "",
    },
    validationSchema: cityValidation,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await API.patch(
          `/property/location/${property.uniqueId}`,
          {
            property_city: values.property_city,
          }
        );

        if (response?.status === 200) {
          Swal.fire("Updated!", "City updated successfully.", "success");
          setIsUpdating(false);
        } else {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message || "Failed to update city.";
        Swal.fire("Error", errorMsg, "error");
      } finally {
        setIsLoading(false);
        getProperty();
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsUpdating(false);
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>City</Form.Label>

        {!isUpdating ? (
          <div className="input-group">
            <Form.Control
              value={location?.property_city || "N/A"}
              disabled
              readOnly
            />
            <Button onClick={() => setIsUpdating(true)}>
              <i className="fe fe-edit"></i>
            </Button>
          </div>
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <Form.Select
                name="property_city"
                value={formik.values.property_city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!formik.errors.property_city}
              >
                <option value="">Select City</option>

                {!loadingCities &&
                  cities
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
              </Form.Select>

              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="fe fe-check-circle"></i>
                )}
              </Button>

              <Button variant="danger" onClick={handleCancel}>
                <i className="fe fe-x"></i>
              </Button>
            </div>

            {formik.errors.property_city && (
              <Form.Text className="text-danger">
                {formik.errors.property_city}
              </Form.Text>
            )}
          </Form>
        )}
      </Form.Group>
    </div>
  );
}
