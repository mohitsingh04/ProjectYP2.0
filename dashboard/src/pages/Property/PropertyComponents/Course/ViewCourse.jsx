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
  allCourse,
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

  const courseFinder = (row) => {
    const item = allCourse?.find((item) => item?.uniqueId === row.course_id);
    return item;
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
                  </div>
                </Col>

                <Col md={8}>
                  <Table striped>
                    <tbody>
                      <tr>
                        <th>Course Name</th>
                        <td>{courseFinder(course)?.course_name}</td>
                      </tr>
                      <tr>
                        <th>Course Short Name</th>
                        <td>
                          {course?.course_short_name ||
                            courseFinder(course)?.course_short_name}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Type</th>
                        <td>
                          {course?.course_type ||
                            courseFinder(course)?.course_type}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Level</th>
                        <td>
                          {course?.course_level ||
                            courseFinder(course)?.course_level}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Duration</th>
                        <td>
                          {course?.duration || courseFinder(course)?.duration}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Certification Type</th>
                        <td>
                          {course?.certification_type ||
                            courseFinder(course)?.certification_type}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Certification Info</th>
                        <td>{course?.certification_info ? "true" : "false"}</td>
                      </tr>
                      <tr>
                        <th>Course Requirments</th>
                        <td>
                          {(course?.requirements?.length
                            ? course.requirements
                            : courseFinder(course) || []
                          )?.map((item, index) => (
                            <p key={index}>{getRequirmentToRelatedId(item)}</p>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Key Outcomes</th>
                        <td>
                          {" "}
                          {(course?.key_outcomes?.length
                            ? course.key_outcomes
                            : courseFinder(course) || []
                          )?.map((item, index) => (
                            <p key={index}>{getKeyOutcomesToRelatedId(item)}</p>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Best For</th>
                        <td>
                          {(course?.best_for?.length
                            ? course.best_for
                            : courseFinder(course) || []
                          )?.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Languages</th>
                        <td>
                          {(course?.languages?.length
                            ? course.languages
                            : courseFinder(course) || []
                          )?.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th>Course Prices</th>
                        <td>
                          {course?.prices?.length > 0 &&
                            Object.entries(course.prices[0]).map(
                              ([currency, amount]) => {
                                const symbolMap = {
                                  INR: "₹",
                                  DOLLAR: "$",
                                  EURO: "€",
                                };

                                return symbolMap[currency] ? (
                                  <div key={currency}>
                                    <strong>
                                      {symbolMap[currency]}
                                      {amount}
                                    </strong>
                                  </div>
                                ) : null;
                              }
                            )}
                        </td>
                      </tr>

                      <tr>
                        <th>Course Format</th>
                        <td>{course?.course_format}</td>
                      </tr>
                      <tr>
                        <th>Course Status</th>
                        <td>
                          <Badge
                            bg={
                              course.status === "Active"
                                ? "success"
                                : course.status === "Suspended"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {course?.status}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
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
