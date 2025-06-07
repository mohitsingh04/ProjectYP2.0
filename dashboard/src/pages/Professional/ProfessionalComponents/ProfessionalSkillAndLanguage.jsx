import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../context/API";

export default function ProfessionalSkillAndLanguage() {
  const { objectId } = useParams();
  const [professional, setProfessional] = useState(null);
  const [professionalSkills, setProfessionalSkills] = useState(null);
  const [professionalLanguages, setProfessionalLanguages] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

  const getAllSKills = useCallback(async () => {
    try {
      const response = await API.get(`/profile/skill/all/list`);
      setAllSkills(response.data);
    } catch (error) {
      console.log(error);
    }
  });
  const getAllLangugages = useCallback(async () => {
    try {
      const response = await API.get(`/profile/language/all/list`);
      setAllLanguages(response.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getAllLangugages();
  }, [getAllLangugages]);

  useEffect(() => {
    getAllSKills();
  }, [getAllSKills]);

  const getSkillById = (id) => {
    const skill = allSkills?.find((item) => item.uniqueId === id);
    return skill?.skill;
  };
  const getLanguageById = (id) => {
    const language = allLanguages?.find((item) => item.uniqueId === id);
    return language?.language;
  };

  const getProfessional = useCallback(async () => {
    try {
      const response = await API.get(`/profile/user/${objectId}`);
      setProfessional(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [objectId]);

  const getProfessionalSkills = useCallback(async () => {
    if (!professional?.uniqueId) return;
    try {
      const response = await API.get(`profile/skill/${professional.uniqueId}`);
      setProfessionalSkills(response.data);
    } catch (error) {
      console.log(error);
      setProfessionalSkills({ skills: [] });
    }
  }, [professional]);

  const getProfessionalLanguages = useCallback(async () => {
    if (!professional?.uniqueId) return;
    try {
      const response = await API.get(
        `profile/language/${professional.uniqueId}`
      );
      setProfessionalLanguages(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [professional]);

  useEffect(() => {
    getProfessional();
  }, [getProfessional]);

  useEffect(() => {
    getProfessionalSkills();
    getProfessionalLanguages();
  }, [getProfessionalSkills, getProfessionalLanguages]);

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Skills</Card.Title>
            </Card.Header>
            <Card.Body>
              {professionalSkills?.skills?.length > 0 ? (
                <div className="tags">
                  {professionalSkills.skills.map((item, index) => (
                    <div key={index} className="tag">
                      <span>{getSkillById(item)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills found for this user.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Languages</Card.Title>
            </Card.Header>
            <Card.Body>
              {professionalLanguages?.languages?.length > 0 ? (
                <div className="tags">
                  {professionalLanguages.languages.map((item, index) => (
                    <div key={index} className="tag">
                      <span>{getLanguageById(item)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No languages found for this user.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
