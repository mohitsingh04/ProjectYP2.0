import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import ALLImages from "../../../../common/Imagesdata";
import Swal from "sweetalert2";
import { API } from "../../../../context/API";

export default function ViewCourse({
  course,
  setIsViewing,
  setIsEditing,
  getPropertyCourses,
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
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

  const description = course?.description || "";
  const isLongDescription = description.length > 300;
  const mediaUrl = import.meta.env.VITE_MEDIA_URL || "";

  const handleDelete = async (id) => {
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
        const response = await API.delete(`/property-course/${id}`);
        Swal.fire({
          title: "Deleted!",
          text: response?.data?.message || "Course deleted successfully.",
          icon: "success",
        });
        setIsViewing("");
        getPropertyCourses();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.error || "Failed to delete course!",
          icon: "error",
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">View Course</Card.Title>
              <div>
                <Button
                  variant="success"
                  className="me-1"
                  onClick={() => setIsEditing(course)}
                >
                  <i className="fe fe-edit me-1"></i>Edit
                </Button>
                <Button
                  variant="danger"
                  className="me-1"
                  onClick={() => handleDelete(course?._id)}
                >
                  <i className="fe fe-trash-2 me-1"></i>Delete
                </Button>
                <Button onClick={() => setIsViewing("")}>
                  <i className="fe fe-arrow-left me-1"></i>Back
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col md={4}>
                  <div className="text-center">
                    <img
                      src={
                        course?.image?.[0]
                          ? `${mediaUrl}/course/${course.image[0]}`
                          : ALLImages("face8")
                      }
                      alt={course?.course_name}
                      className="img-fluid rounded shadow-sm"
                      style={{
                        height: "300px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="mt-3 text-primary">{course?.course_name}</h5>
                  </div>
                </Col>

                <Col md={8}>
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
                              // Handle array of objects (like prices)
                              if (
                                value.length &&
                                typeof value[0] === "object" &&
                                value[0] !== null
                              ) {
                                displayValue = (
                                  <ul>
                                    {value.map((obj, idx) => (
                                      <li key={idx}>
                                        {Object.entries(obj).map(
                                          ([k, v], i) => (
                                            <div key={i}>
                                              <strong>
                                                {k.replace(/_/g, " ")}:
                                              </strong>{" "}
                                              {String(v || "N/A")}
                                            </div>
                                          )
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                );
                              } else {
                                displayValue = (
                                  <ul>
                                    {value.length ? (
                                      value.map((item, idx) => (
                                        <li key={idx}>{String(item)}</li>
                                      ))
                                    ) : (
                                      <li>None</li>
                                    )}
                                  </ul>
                                );
                              }
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

            {description && (
              <Card.Footer>
                <div
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription
                      ? description
                      : description?.slice(0, 300) + "...",
                  }}
                />
                {description.length > 300 && (
                  <Button
                    className="p-0"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show Less" : "Show More"}
                  </Button>
                )}
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
