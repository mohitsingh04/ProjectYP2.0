import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../context/API";

export default function ProfessionalEducation() {
  const { objectId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [education, setEducation] = useState([]);
  const [degreeList, setDegreeList] = useState([]);
  const [instituteList, setInsituteList] = useState([]);

  const getDegreeList = useCallback(async () => {
    try {
      const response = await API.get("profile/degree");
      setDegreeList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getDegreeList();
  }, [getDegreeList]);
  const getInstituteList = useCallback(async () => {
    try {
      const response = await API.get("profile/institute");
      setInsituteList(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getInstituteList();
  }, [getInstituteList]);

  const getDegreeById = (id) => {
    const degree = degreeList.find((item) => item.uniqueId === id);
    return degree.degree_name;
  };
  const getInstituteById = (id) => {
    const institute = instituteList.find((item) => item.uniqueId === id);
    return institute.institute_name;
  };

  const getProfessional = useCallback(async () => {
    try {
      const response = await API.get(`/profile/user/${objectId}`);
      setProfessional(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [objectId]);

  useEffect(() => {
    getProfessional();
  }, [getProfessional]);

  const getEducation = useCallback(async () => {
    try {
      const response = await API.get(
        `profile/education/${professional.uniqueId}`
      );
      setEducation(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [professional]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);
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
              <Card.Title>Education</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                {education.map((edu, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h5>{getDegreeById(edu.degree)}</h5>
                        <p className="mb-1">
                          <strong>Institute:</strong>{" "}
                          {getInstituteById(edu.institute)}
                        </p>
                        <p className="mb-0">
                          <strong>Duration:</strong>{" "}
                          {formatDate(edu.start_date)} to{" "}
                          {edu.currentlyStuding
                            ? "Present"
                            : formatDate(edu.end_data)}
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
