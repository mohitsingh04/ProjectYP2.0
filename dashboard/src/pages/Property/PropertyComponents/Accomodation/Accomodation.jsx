import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../../../context/API";
import { Button, Card, Col, Row } from "react-bootstrap";

import Lightbox from "yet-another-react-lightbox";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import RemoveAccomodationImages from "./RemoveAccomodationImages";
import AddAccomodation from "./AddAccomodation";
import AddAccomodationImages from "./AddAccomodationImages";
import EditAccomodation from "./EditAccomodation";

export default function Accomodation() {
  const { objectId } = useParams();
  const [property, setProperty] = useState("");
  const [authuser, setAuthUser] = useState("");
  const [accomodation, setAccomodation] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isUpdating, setIsUpdating] = useState("");
  const [addingImages, setAddingImages] = useState();
  const [removing, setRemoving] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);

  const getProperty = useCallback(async () => {
    try {
      const response = await API.get(`/property/${objectId}`);
      setProperty(response.data);
    } catch (error) {
      console.error(
        error.response.data.error ||
          error.response.data.message ||
          error.message
      );
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
        setAccomodation(response.data);
      }
    } catch (error) {
      console.error(
        error.response.data.error ||
          error.response.data.message ||
          error.message
      );
    }
  }, [property]);

  useEffect(() => {
    getAccomodation();
  }, [getAccomodation]);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getTruncatedHTML = (html, isExpanded) => {
    const plainText = html?.replace(/<[^>]+>/g, "");
    const words = plainText?.split(" ");

    if (words?.length <= 300 || isExpanded) {
      return html;
    }

    const truncatedText = words?.slice(0, 300).join(" ") + "...";
    return `<p>${truncatedText}</p>`;
  };

  return (
    <div>
      {accomodation?.length > 0 ? (
        !isUpdating ? (
          !removing ? (
            !addingImages ? (
              accomodation.map((item, index) => {
                const isExpanded = expandedDescriptions[index] || false;
                const wordCount = item?.accomodation_description
                  ?.replace(/<[^>]+>/g, "")
                  .split(" ").length;

                const webpImages =
                  item?.accomodation_images?.filter((img) =>
                    img.endsWith(".webp")
                  ) || [];

                return (
                  <Row key={index} className="mb-4">
                    <Col>
                      <Card>
                        <Card.Header className="d-flex justify-content-between">
                          <Card.Title>{item?.accomodation_name}</Card.Title>
                          <div>
                            <Button
                              size="sm"
                              onClick={() => setAddingImages(item)}
                            >
                              <i className="fe fe-plus me-1"></i>Add Images
                            </Button>
                            {item.accomodation_images.length > 0 && (
                              <Button
                                size="sm"
                                variant="danger"
                                className="ms-1"
                                onClick={() => setRemoving(item)}
                              >
                                <i className="fe fe-x me-1"></i>Remove Images
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="success"
                              className="ms-1"
                              onClick={() => setIsUpdating(item)}
                            >
                              <i className="fe fe-edit me-1"></i>Edit
                              Accomodation
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col>
                              <div>
                                {item.accomodation_price &&
                                  item.accomodation_price.map(
                                    (priceObj, index) => (
                                      <div key={index} className="tags">
                                        {priceObj.INR !== undefined && (
                                          <div className="tag">
                                            ₹ {priceObj.INR}
                                          </div>
                                        )}
                                        {priceObj.DOLLAR !== undefined && (
                                          <div className="tag">
                                            $ {priceObj.DOLLAR}
                                          </div>
                                        )}
                                        {priceObj.EURO !== undefined && (
                                          <div className="tag">
                                            € {priceObj.EURO}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                              </div>
                            </Col>
                          </Row>

                          <Row className="my-4">
                            <Col md={12}>
                              <div
                                className="px-2"
                                dangerouslySetInnerHTML={{
                                  __html: getTruncatedHTML(
                                    item?.accomodation_description,
                                    isExpanded
                                  ),
                                }}
                              />
                              {wordCount > 300 && (
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => toggleDescription(index)}
                                >
                                  {isExpanded ? (
                                    <p>
                                      <i className="fe fe-chevron-down me-1"></i>
                                      Show Less
                                    </p>
                                  ) : (
                                    <p>
                                      <i className="fe fe-chevron-up me-1"></i>
                                      Show More
                                    </p>
                                  )}
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>

                        {item.accomodation_images.length > 0 && (
                          <Card.Footer>
                            {webpImages.length > 0 ? (
                              <>
                                <Row>
                                  {webpImages.map((img, i) => (
                                    <Col
                                      key={i}
                                      xs={6}
                                      md={3}
                                      className="mb-2 position-relative"
                                    >
                                      <img
                                        src={`${
                                          import.meta.env.VITE_MEDIA_URL
                                        }/${img}`}
                                        alt={`Accomodation Image ${i + 1}`}
                                        className="w-100 rounded profile-ratio"
                                        onClick={() => {
                                          setLightboxImages(
                                            webpImages.map((src) => ({
                                              src: `${
                                                import.meta.env.VITE_MEDIA_URL
                                              }/${src}`,
                                            }))
                                          );
                                          setLightboxIndex(i);
                                        }}
                                      />
                                    </Col>
                                  ))}
                                </Row>

                                <Lightbox
                                  open={lightboxIndex !== null}
                                  close={() => setLightboxIndex(null)}
                                  index={lightboxIndex}
                                  slides={lightboxImages}
                                  plugins={[
                                    Fullscreen,
                                    Slideshow,
                                    Thumbnails,
                                    Zoom,
                                  ]}
                                />
                              </>
                            ) : (
                              <p className="text-muted">
                                No WebP images found for this Accomodation.
                              </p>
                            )}
                          </Card.Footer>
                        )}
                      </Card>
                    </Col>
                  </Row>
                );
              })
            ) : (
              <AddAccomodationImages
                setAddingImages={setAddingImages}
                accomodation={addingImages}
                getAccomodation={getAccomodation}
              />
            )
          ) : (
            <RemoveAccomodationImages
              accomodation={removing}
              getAccomodationData={getAccomodation}
              setRemoving={setRemoving}
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
