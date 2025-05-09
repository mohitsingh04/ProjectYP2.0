import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import { API } from "../../../../context/API";
import EditAccomodation from "./EditAccomodation";
import AddAccomodation from "./AddAccomodation";
import AddAccomodationImages from "./AddAccomodationImages";

export default function Accomodation() {
  const { objectId } = useParams();
  const [property, setProperty] = useState("");
  const [authuser, setAuthUser] = useState("");
  const [accomodation, setAccomodation] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [isAddingImages, setIsAddingImages] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getProperty = useCallback(async () => {
    try {
      const response = await API.get(`/property/${objectId}`);
      setProperty(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [objectId]);

  useEffect(() => {
    getProperty();
  }, [getProperty]);

  const getAuthUser = useCallback(async () => {
    try {
      const response = await API.get("/profile");
      setAuthUser(response.data);
    } catch (error) {
      console.error(
        error.response.data.error ||
          error.response.data.message ||
          error.message
      );
    }
  }, []);

  useEffect(() => {
    getAuthUser();
  }, [getAuthUser]);

  const getAccomodation = useCallback(async () => {
    try {
      if (property) {
        const response = await API.get(`/accomodation/${property?.uniqueId}`);
        setAccomodation(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [property]);

  useEffect(() => {
    getAccomodation();
  }, [getAccomodation]);

  return (
    <div>
      {accomodation.length > 0 ? (
        !isUpdating ? (
          !isAddingImages ? (
            <Row>
              <Col md={12}>
                {accomodation?.map((item, index) => (
                  <Card key={index}>
                    <Card.Header className="d-flex justify-content-between">
                      <Card.Title>{item?.accomodation_name}</Card.Title>
                      <div className="d-flex gap-1">
                        {/* <Button
                          size="sm"
                          onClick={() => setIsAddingImages(item)}
                        >
                          Add Images
                        </Button>
                        <Button size="sm" variant="danger">
                          Remove Images
                        </Button> */}
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => setIsUpdating(item)}
                        >
                          Edit Accomodation
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <div className="tags py-2">
                            {Object.entries(item?.accomodation_price?.[0]).map(
                              ([key, value]) => (
                                <div className="tag" key={key}>
                                  <span>
                                    {key === "DOLLAR"
                                      ? "$"
                                      : key === "INR"
                                      ? "₹"
                                      : key === "EURO" && "€"}
                                    {value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div>
                            <div
                              className="description-text"
                              dangerouslySetInnerHTML={{
                                __html: showFullDescription
                                  ? item?.accomodation_description
                                  : item?.accomodation_description
                                      ?.split(" ")
                                      .slice(0, 300)
                                      .join(" ") +
                                    (item?.accomodation_description?.split(" ")
                                      .length > 300
                                      ? "..."
                                      : ""),
                              }}
                            />
                            {item?.accomodation_description?.split(" ").length >
                              300 &&
                              !showFullDescription && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => setShowFullDescription(true)}
                                >
                                  Show More
                                </Button>
                              )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                    {item?.accomodation_images?.length > 0 && (
                      <Card.Footer>
                        <Row>
                          {item.accomodation_images
                            .filter((item) => item.endsWith(".webp"))
                            .map((item, index) => (
                              <Col md={3} key={index}>
                                <img
                                  src={`${
                                    import.meta.env.VITE_MEDIA_URL
                                  }/${item}`}
                                  alt={item}
                                />
                              </Col>
                            ))}
                        </Row>
                      </Card.Footer>
                    )}
                  </Card>
                ))}
              </Col>
            </Row>
          ) : (
            <AddAccomodationImages
              setAddingImages={setIsAddingImages}
              accomodation={isAddingImages}
              getAccomodation={getAccomodation}
            />
          )
        ) : (
          <EditAccomodation
            accomodation={isUpdating}
            getAccomodation={getAccomodation}
            setIsUpdating={setIsUpdating}
          />
        )
      ) : (
        <AddAccomodation
          property={property}
          authUser={authuser}
          getAccomodation={getAccomodation}
        />
      )}
    </div>
  );
}
