import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../context/API";
import ALLImages from "../../../common/Imagesdata";

export default function ProfessionalExperience() {
  const { objectId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [experience, setExperience] = useState([]);

  const [properties, setProperties] = useState([]);
  const getProperties = useCallback(async () => {
    try {
      const response = await API.get(`/property`);
      setProperties(response.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getProperties();
  }, [getProperties]);

  const getPropertyById = (id) => {
    const property = properties.find((item) => item.uniqueId === id);
    return property;
  };

  const getProfessional = useCallback(async () => {
    try {
      const response = await API.get(`/profile/user/${objectId}`);
      setProfessional(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [objectId]);

  const getExperience = useCallback(async () => {
    try {
      if (!professional?.uniqueId) return;
      const response = await API.get(
        `/profile/experience/${professional.uniqueId}`
      );
      setExperience(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [professional]);

  useEffect(() => {
    getProfessional();
  }, [getProfessional]);

  useEffect(() => {
    getExperience();
  }, [getExperience]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Experience</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {experience.map((exp, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card>
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          {exp.property_id && (
                            <Image
                              src={
                                getPropertyById(exp.property_id)
                                  ?.property_logo?.[0]
                                  ? `${import.meta.env.VITE_MEDIA_URL}${
                                      getPropertyById(exp.property_id)
                                        ?.property_logo?.[0]
                                    }`
                                  : ALLImages("face8")
                              }
                              alt={
                                getPropertyById(exp.property_id)?.property_name
                              }
                              width={50}
                              height={50}
                              roundedCircle
                              className="me-3"
                            />
                          )}
                          <div>
                            <h5 className="mb-0">
                              {getPropertyById(exp.property_id)?.property_name}
                            </h5>
                            <small>{exp.position}</small>
                          </div>
                        </div>
                        <p className="mb-1">
                          <strong>Duration:</strong>{" "}
                          {formatDate(exp.start_date)} to{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : formatDate(exp.end_date)}
                        </p>
                        <p className="mb-0">
                          <strong>Location:</strong> {exp.location}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
