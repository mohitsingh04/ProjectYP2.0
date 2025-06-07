import { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../context/API";

export default function ProfessionalBasicDetails() {
  const { objectId } = useParams();
  const [professional, setProfessional] = useState(null);

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
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Professional Basic Details</Card.Title>
            </Card.Header>
            <Card.Body>
              {professional ? (
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Username:</strong> {professional.username}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Name:</strong> {professional.name}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Email:</strong> {professional.email}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Mobile No:</strong> {professional.mobile_no}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge bg-${getStatusVariant(
                          professional.status
                        )}`}
                      >
                        {professional.status}
                      </span>
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Login:</strong>{" "}
                      <span
                        className={`badge bg-${
                          professional.isGoogleLogin ? "success" : "secondary"
                        }`}
                      >
                        {professional.isGoogleLogin ? "Google" : "Email"}
                      </span>
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Role:</strong> {professional.role}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Verified:</strong>{" "}
                      <span
                        className={`badge bg-${
                          professional.verified ? "success" : "danger"
                        }`}
                      >
                        {professional.verified ? "Verified" : "UnVerified"}
                      </span>
                    </p>
                  </Col>
                </Row>
              ) : (
                <p>Loading...</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
