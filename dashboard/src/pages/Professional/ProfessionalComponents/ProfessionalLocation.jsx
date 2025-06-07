import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../context/API";

export default function ProfessionalLocation() {
  const { objectId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [location, setLocation] = useState(null);

  const getProfessional = useCallback(async () => {
    try {
      const response = await API.get(`/profile/user/${objectId}`);
      setProfessional(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [objectId]);

  const getLocation = useCallback(async () => {
    try {
      if (!professional?.uniqueId) return;
      const response = await API.get(
        `/profile/location/${professional?.uniqueId}`
      );
      setLocation(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [professional]);

  useEffect(() => {
    getProfessional();
  }, [getProfessional]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Location</Card.Title>
            </Card.Header>
            <Card.Body>
              {location ? (
                <>
                  <Row className="mb-2">
                    <Col md={6}>
                      <strong>Address:</strong> {location.address}
                    </Col>
                    <Col md={6}>
                      <strong>City:</strong> {location.city}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6}>
                      <strong>State:</strong> {location.state}
                    </Col>
                    <Col md={6}>
                      <strong>Country:</strong> {location.country}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <strong>Pincode:</strong> {location.pincode}
                    </Col>
                  </Row>
                </>
              ) : (
                <p>No location data found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
