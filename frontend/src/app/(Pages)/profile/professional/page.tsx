"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Edit, Eye, Upload } from "lucide-react";
import ProfileBanner from "./_professionalComponents/ProfessionalBanner";
import ProfileInfo from "./_professionalComponents/ProfileInfo";
import EducationSection from "./_professionalComponents/EducationSection";
import ExperienceSection from "./_professionalComponents/ExperienceSection";
import SkillsSection from "./_professionalComponents/SkillsSection";
import LanguagesSection from "./_professionalComponents/LanguagesSection";
import ProfileScoreSection from "./_professionalComponents/ProfileScoreSection";
import ContactInfoSection from "./_professionalComponents/ContactInfoSection";
import EducationEditModal from "./_professionalComponents/modals/EducationEditModal";
import ExperienceEditModal from "./_professionalComponents/modals/ExperienceEditModal";
import AboutEditModal from "./_professionalComponents/modals/AboutEditModal";
import LanguageEditModal from "./_professionalComponents/modals/LanguageEditModal";
import SkillEditModal from "./_professionalComponents/modals/SkillEditModal";
import API from "@/service/API/API";
import Link from "next/link";
import ResumeUploadModal from "./_professionalComponents/modals/ResumeUploadModal";

const ProfessionalProfile = () => {
  const [profileData, setProfileData] = useState<any>({});
  const [isOpenResumeModal, setIsOpenResumeModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [profileProperties, setProfileProperties] = useState([]);
  const [allSKills, setAllSkills] = useState([]);
  const [allLanguages, SetAllLanguages] = useState([]);
  const [allDegreeAndInstitute, setAllDegreeAndInstitute] = useState<any>([]);

  const getAllDegreeAndInstitute = useCallback(async () => {
    try {
      const [degreeRes, instRes] = await Promise.all([
        API.get(`/profile/degree`),
        API.get(`/profile/institute`),
      ]);
      const finalData = {
        degree: degreeRes.data || [],
        institute: instRes.data || [],
      };

      setAllDegreeAndInstitute(finalData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllDegreeAndInstitute();
  }, [getAllDegreeAndInstitute]);

  const getAllSkillAndLanuages = useCallback(async () => {
    try {
      const [skillsRes, langRes] = await Promise.all([
        API.get(`/profile/skill/all/list`),
        API.get(`/profile/language/all/list`),
      ]);
      setAllSkills(skillsRes.data);
      SetAllLanguages(langRes.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllSkillAndLanuages();
  }, [getAllSkillAndLanuages]);

  const getProfileProperties = useCallback(async () => {
    try {
      const response = await API.get(`/profile/properties`);
      setProfileProperties(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProfileProperties();
  }, [getProfileProperties]);

  const getProperty = useCallback(async () => {
    try {
      const response = await API.get(`/property`);
      setProperties(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProperty();
  }, [getProperty]);

  const getProfile = useCallback(async () => {
    try {
      const { data: profile } = await API.get("/profile/detail");

      if (!profile || profile.role !== "Professional" || !profile.uniqueId) {
        console.warn("Invalid profile or unauthorized role.");
        window.location.href = "/";
        return;
      }

      const uniqueId = profile.uniqueId;

      const [
        bioResult,
        skillResult,
        languageResult,
        resumeResult,
        expResult,
        eduResult,
        scoreResult,
      ] = await Promise.allSettled([
        API.get(`/profile/bio/${uniqueId}`),
        API.get(`/profile/skill/${uniqueId}`),
        API.get(`/profile/language/${uniqueId}`),
        API.get(`/profile/doc/resume/${uniqueId}`),
        API.get(`/profile/experience/${uniqueId}`),
        API.get(`/profile/education/${uniqueId}`),
        API.get(`/profile/score/${uniqueId}`),
      ]);

      const getData = (result: PromiseSettledResult<any>, fallback: any) =>
        result.status === "fulfilled" ? result.value.data : fallback;

      const finalData = {
        ...profile,
        heading: getData(bioResult, {}).heading || "",
        about: getData(bioResult, {}).about || "",
        skills: getData(skillResult, {}).skills || [],
        skillsId: getData(skillResult, {}).uniqueId,
        languages: getData(languageResult, {}).languages || [],
        languageId: getData(languageResult, {}).uniqueId,
        resume: getData(resumeResult, {}).resume,
        experiences: getData(expResult, []),
        education: getData(eduResult, []),
        score: getData(scoreResult, {}).score,
      };

      setProfileData(finalData);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      window.location.href = "/";
    } finally {
      getAllSkillAndLanuages();
      getAllDegreeAndInstitute();
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const [modals, setModals] = useState({
    skills: false,
    languages: false,
    about: false,
    experience: false,
    education: false,
  });

  const openModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div className="bg-light min-vh-100">
      <ProfileBanner profileData={profileData} />

      <Container className="pb-4">
        <ProfileInfo profileData={profileData} />

        <Row className="g-4">
          <Col lg={8} className="d-flex flex-column gap-4">
            <Card className="position-relative mb-4 shadow-sm rounded">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="fs-4 fw-semibold">About</h2>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => openModal("about")}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                <div>
                  <h3 className="fw-medium">{profileData.heading}</h3>
                  <p className="text-secondary">{profileData.about}</p>
                </div>
              </Card.Body>
            </Card>

            <ExperienceSection
              properties={properties}
              experiences={profileData?.experiences}
              openModal={() => openModal("experience")}
              profileProperties={profileProperties}
            />

            <EducationSection
              education={profileData.education}
              openModal={() => openModal("education")}
              allDegreeAndInst={allDegreeAndInstitute}
            />

            <SkillsSection
              skills={profileData.skills}
              allSKills={allSKills}
              openModal={() => openModal("skills")}
            />

            <LanguagesSection
              languages={profileData?.languages}
              openModal={() => openModal("languages")}
              allLanguages={allLanguages}
            />
          </Col>

          {/* Right Column */}
          <Col lg={4} className="d-flex flex-column gap-4">
            {/* CV Section */}
            <Card className="position-relative mb-4 shadow-sm rounded">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="fs-4 fw-semibold">Resume/CV</h2>
                </div>
                <div className="d-flex flex-column gap-2">
                  {profileData?.resume && (
                    <Link
                      href={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${profileData?.resume}`}
                      target="_blank"
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                    >
                      <Eye size={16} />
                      View CV
                    </Link>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => setIsOpenResumeModal(true)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <Upload size={16} />
                    {profileData?.resume ? "Update CV" : "Upload CV"}
                  </Button>
                </div>
              </Card.Body>
              {isOpenResumeModal && (
                <ResumeUploadModal
                  profileData={profileData}
                  onUpload={getProfile}
                  onClose={() => setIsOpenResumeModal(false)}
                />
              )}
            </Card>

            <ProfileScoreSection profileScore={profileData.score || 0} />

            <ContactInfoSection profileData={profileData} />
          </Col>
        </Row>
      </Container>

      {/* Modals */}
      <SkillEditModal
        allSKills={allSKills}
        isOpen={modals.skills}
        onClose={() => closeModal("skills")}
        profileData={profileData}
        getProfile={getProfile}
      />

      <LanguageEditModal
        isOpen={modals.languages}
        onClose={() => closeModal("languages")}
        profileData={profileData}
        getProfile={getProfile}
        allLanguages={allLanguages}
      />

      <AboutEditModal
        isOpen={modals.about}
        onClose={() => closeModal("about")}
        profileData={profileData}
        onSave={getProfile}
      />

      <ExperienceEditModal
        isOpen={modals.experience}
        onClose={() => closeModal("experience")}
        getProfile={getProfile}
        properties={properties}
        profileProperties={profileProperties}
        profileData={profileData}
      />

      <EducationEditModal
        isOpen={modals.education}
        onClose={() => closeModal("education")}
        profileData={profileData}
        getProfile={getProfile}
        allDegreeAndInst={allDegreeAndInstitute}
      />
    </div>
  );
};

export default ProfessionalProfile;
