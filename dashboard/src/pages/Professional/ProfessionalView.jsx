import { useCallback, useEffect, useRef, useState } from "react";
import { Breadcrumb, Card, Col, Nav, Row, Tab } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { API } from "../../context/API";
import ALLImages from "../../common/Imagesdata";
import ProfessionalBasicDetails from "./ProfessionalComponents/ProfessionalBasicDetails";
import ProfessionalExperience from "./ProfessionalComponents/ProfessionalExperience";
import ProfessionalEducation from "./ProfessionalComponents/ProfessionalEducation";
import ProfessionalSkillAndLanguage from "./ProfessionalComponents/ProfessionalSkillAndLanguage";
import ViewProfileSkeleton from "../../components/Skeletons/ViewProfileSkeleton";
import ProfessionalLocation from "./ProfessionalComponents/ProfessionalLocation";
const tabsData = [
  {
    key: "basic",
    label: "Basic Details",
    icon: "ri-user-line",
    component: <ProfessionalBasicDetails />,
    online: true,
  },
  {
    key: "location",
    label: "Location",
    icon: "ri-map-pin-line",
    component: <ProfessionalLocation />,
    online: true,
  },
  {
    key: "experience",
    label: "Experience",
    icon: "ri-briefcase-line",
    component: <ProfessionalExperience />,
    online: true,
  },
  {
    key: "education",
    label: "Education",
    icon: "ri-book-open-line",
    component: <ProfessionalEducation />,
    online: true,
  },
  {
    key: "skill-languages",
    label: "Skills & Languages",
    icon: "ri-cpu-line",
    component: <ProfessionalSkillAndLanguage />,
    online: true,
  },
];

export default function ProfessionalView() {
  const navigator = useNavigate();
  const { objectId } = useParams();
  const [authUser, setAuthUser] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [professional, setProfessional] = useState("");
  const [professionalLoading, setProfessionalLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "basic";

  const getProfessional = useCallback(async () => {
    setProfessionalLoading(true);
    try {
      const [basicRes, docRes] = await Promise.all([
        API.get(`/profile/user/${objectId}`),
        API.get(`/profile/doc/resume`),
      ]);
      const basicDetails = basicRes.data;
      const docDetails = docRes.data;

      const filteredDoc = docDetails.find(
        (item) => item.userId === basicDetails.uniqueId
      );

      const finalData = {
        ...basicDetails,
        resume: filteredDoc?.resume,
      };

      setProfessional(finalData);
    } catch (error) {
      console.log(error);
    } finally {
      setProfessionalLoading(false);
    }
  }, [objectId]);

  useEffect(() => {
    getProfessional();
  }, [getProfessional]);

  const getAuhtUser = async () => {
    setAuthLoading(true);
    try {
      const response = await API.get(`/profile`);
      setAuthUser(response.data);
    } catch (error) {
      console.error(
        error.response.data.error ||
          error.response.data.message ||
          error.message
      );
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getAuhtUser();
  }, []);

  if (!authLoading) {
    if (!authUser?.permissions?.some((item) => item === "Read Professional")) {
      navigator("/dashboard/access-denied");
    }
  }

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };
  return (
    <div>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Professionals</h1>
          <div>
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: "/dashboard/professionals" }}
              >
                Professionals
              </Breadcrumb.Item>
              <Breadcrumb.Item>View</Breadcrumb.Item>
              <Breadcrumb.Item active>{""}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="ms-auto pageheader-btn">
          <button className="btn btn-primary" onClick={() => navigator(-1)}>
            <i className="fe fe-arrow-left"></i> Back
          </button>
        </div>
      </div>
      {!professionalLoading ? (
        <Row>
          <Col>
            <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="wideget-user">
                    <Row>
                      <Col lg={12} md={12} xl={6}>
                        <div className="wideget-user-desc d-sm-flex">
                          <div className="wideget-user-img">
                            <img
                              className="profile-ratio profile-100"
                              src={
                                professional?.avatar?.[0]
                                  ? professional?.isGoogleLogin
                                    ? professional?.avatar?.[0]
                                    : `${import.meta.env.VITE_MEDIA_URL}/${
                                        professional?.avatar?.[0]
                                      }`
                                  : ALLImages("face8")
                              }
                              alt="img"
                            />
                          </div>
                          <div className="user-wrap mt-auto">
                            <h4>{professional?.username}</h4>
                            <h6 className="text-muted mb-3">
                              {professional?.role}
                            </h6>
                            <a
                              href={`${import.meta.env.VITE_MEDIA_URL}/${
                                professional?.resume
                              }`}
                              target="_blank"
                              className="btn btn-primary mt-1 mb-1 me-1"
                            >
                              <i className="fe fe-download"></i> View CV
                            </a>
                            <a
                              href={`to:${professional?.email}`}
                              className="btn btn-secondary mt-1 mb-1"
                            >
                              <i className="fe fe-mail me-1"></i>
                              E-mail
                            </a>
                          </div>
                        </div>
                      </Col>
                      <Col lg={12} md={12} xl={6}>
                        <div className="mt-4">
                          <div
                            className={`main-profile-contact-list float-lg-end d-lg-flex`}
                          >
                            <div className="me-5">
                              <div className="media">
                                <div className="media-icon bg-primary  me-3 mt-1">
                                  <i className="fe fe-file-plus fs-20"></i>
                                </div>
                                <div className="media-body">
                                  <span className="text-muted">Posts</span>
                                  <div className="fw-semibold fs-25">328</div>
                                </div>
                              </div>
                            </div>
                            <div className="me-5 mt-5 mt-md-0">
                              <div className="media">
                                <div className="media-icon bg-success me-3 mt-1">
                                  <i className="fe fe-users  fs-20"></i>
                                </div>
                                <div className="media-body">
                                  <span className="text-muted">Followers</span>
                                  <div className="fw-semibold fs-25">937k</div>
                                </div>
                              </div>
                            </div>
                            <div className="me-0 mt-5 mt-md-0">
                              <div className="media">
                                <div className="media-icon bg-orange me-3 mt-1">
                                  <i className="fe fe-wifi fs-20"></i>
                                </div>
                                <div className="media-body">
                                  <span className="text-muted">Following</span>
                                  <div className="fw-semibold fs-25">2,876</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>{" "}
                <Card.Footer>
                  <Nav
                    variant="pills"
                    className="tab-style-2 nav-style-2 nav-pills"
                  >
                    {tabsData.map((tab, index) => (
                      <Nav.Item key={index}>
                        {tab.key ? (
                          <Nav.Link
                            className="text-nowrap text-center p-2"
                            eventKey={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                          >
                            <i
                              className={`${tab.icon} me-1 align-middle text-center`}
                            ></i>
                            {tab.label}
                          </Nav.Link>
                        ) : (
                          <Nav.Item className="mt-2">
                            <Nav.Link
                              as={Link}
                              to={tab?.link}
                              className="text-nowrap text-center p-2"
                            >
                              <i
                                className={`${tab.icon} me-1 align-middle text-center`}
                              ></i>
                              {tab?.label}
                            </Nav.Link>
                          </Nav.Item>
                        )}
                      </Nav.Item>
                    ))}
                  </Nav>
                </Card.Footer>
              </Card>
              <Row>
                <Col>
                  <Tab.Content className="mb-3">
                    {tabsData.map((tab) => (
                      <Tab.Pane
                        eventKey={tab.key}
                        key={tab.key}
                        className="p-0 border-0"
                      >
                        {tab.component}
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      ) : (
        <ViewProfileSkeleton />
      )}
    </div>
  );
}
