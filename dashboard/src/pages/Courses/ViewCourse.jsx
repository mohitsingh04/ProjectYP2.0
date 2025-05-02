import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { API } from "../../context/API";
import Swal from "sweetalert2";

export default function ViewCourse() {
  const { objectId } = useParams();
  const navigator = useNavigate();
  const [course, setCourse] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [authUser, setAuthUser] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [requirmentOptions, setRequirmentOptions] = useState([]);
  const [keyOutcomes, setKeyOutcomesOptions] = useState([]);

  const fetchData = async () => {
    try {
      const [requrimentResponse, keyOutcomeRes] = await Promise.all([
        API.get("/requirment/all"),
        API.get("/key-outcome/all"),
      ]);
      setRequirmentOptions(requrimentResponse.data);
      setKeyOutcomesOptions(keyOutcomeRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRequirmentToRelatedId = (id) => {
    const requirments = requirmentOptions.find(
      (item) => item.uniqueId === Number(id)
    );
    return requirments ? requirments.requirment : id;
  };

  const getKeyOutcomesToRelatedId = (id) => {
    const outcome = keyOutcomes.find((item) => item.uniqueId === Number(id));
    return outcome ? outcome.key_outcome : id;
  };

  const getAuthUser = async () => {
    setAuthLoading(true);
    try {
      const response = await API.get(`/profile`);
      setAuthUser(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message
      );
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getAuthUser();
  }, []);

  if (!authLoading) {
    if (!authUser?.permissions?.some((item) => item.value === "Read Course")) {
      navigator("/dashboard/access-denied");
    }
  }

  const deleteCourse = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await API.delete(`/course/${id}`);
        Swal.fire(
          "Deleted!",
          response?.data?.message || "Course removed.",
          "success"
        );
        navigator(`/dashboard/course`);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "Failed to delete!",
          "error"
        );
      }
    }
  };

  const getCourse = useCallback(async () => {
    try {
      const response = await API.get(`/course/${objectId}`);
      setCourse(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message
      );
    }
  }, [objectId]);

  useEffect(() => {
    getCourse();
  }, [getCourse]);

  return (
    <div>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Courses</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: "/dashboard/course" }}
            >
              Courses
            </Breadcrumb.Item>
            <Breadcrumb.Item>View</Breadcrumb.Item>
            <Breadcrumb.Item active>{course?.course_name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button variant="primary" onClick={() => navigator(-1)}>
            <i className="fe fe-arrow-left"></i> Back
          </Button>
        </div>
      </div>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5 className="mb-0">Course Details</h5>
              {!authLoading && (
                <div>
                  {authUser?.permissions?.some(
                    (item) => item.value === "Update Course"
                  ) && (
                    <Link
                      to={`/dashboard/course/edit/${objectId}`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fe fe-cpu me-1"></i>Edit Course
                    </Link>
                  )}
                  {authUser?.permissions?.some(
                    (item) => item.value === "Delete Course"
                  ) && (
                    <button
                      onClick={() => deleteCourse(objectId)}
                      className="btn btn-danger ms-1 btn-sm"
                    >
                      <i className="fe fe-trash-2 me-1"></i>Delete Course
                    </button>
                  )}
                </div>
              )}
            </Card.Header>

            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <img
                    src={
                      course?.image?.[0]
                        ? `${import.meta.env.VITE_MEDIA_URL}/course/${
                            course?.image?.[0]
                          }`
                        : ALLImages("face8")
                    }
                    alt="Course"
                    className="img-fluid profile-ratio w-100 h-100"
                  />
                </Col>
                <Col md={6}>
                  <Row className="mt-4">
                    <Col>
                      <Table striped>
                        <tbody>
                          {Object.entries(course).map(([key, value]) => {
                            if (
                              [
                                "userId",
                                "uniqueId",
                                "createdAt",
                                "updatedAt",
                                "_id",
                                "__v",
                                "image",
                                "description",
                                "isDeleted"
                              ].includes(key)
                            )
                              return null;

                            const formatKey = key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase());

                            let displayValue;

                            if (
                              key === "requirements" &&
                              Array.isArray(value)
                            ) {
                              const items = value.map((id) =>
                                getRequirmentToRelatedId(id)
                              );
                              displayValue = (
                                <ul>
                                  {items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              );
                            } else if (
                              key === "key_outcomes" &&
                              Array.isArray(value)
                            ) {
                              const items = value.map((id) =>
                                getKeyOutcomesToRelatedId(id)
                              );
                              displayValue = (
                                <ul>
                                  {items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              );
                            } else if (Array.isArray(value)) {
                              displayValue = (
                                <ul>
                                  {value.length ? (
                                    value.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))
                                  ) : (
                                    <li>None</li>
                                  )}
                                </ul>
                              );
                            } else if (typeof value === "boolean") {
                              displayValue = value ? "true" : "false";
                            } else {
                              displayValue = value;
                            }

                            return (
                              <tr key={key}>
                                <th className="align-content-start">{formatKey}</th>
                                <td>{displayValue}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>

            {course.description && (
              <Card.Footer>
                <div className="mt-4">
                  <h5>Course Description</h5>
                  {(() => {
                    const words = course.description.split(" ");
                    const shortDescription = words.slice(0, 300).join(" ");
                    const isLong = words.length > 300;
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFullDescription
                              ? course.description
                              : shortDescription + (isLong ? "..." : ""),
                          }}
                        />
                        {isLong && (
                          <Button
                            className="btn btn-secondary mt-2"
                            onClick={() =>
                              setShowFullDescription(!showFullDescription)
                            }
                          >
                            {showFullDescription ? "Show Less" : "Show More"}
                          </Button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
