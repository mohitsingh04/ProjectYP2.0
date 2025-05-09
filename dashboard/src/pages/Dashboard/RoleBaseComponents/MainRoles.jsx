import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { API } from "../../../context/API";
import CounterCards from "../DashboardComponents/CounterCards";
import RankTable from "../DashboardComponents/RankTable";

export default function MainRoles({ authUser, properties }) {
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState([]);
  const [profile, setProfile] = useState("");

  const getProfile = useCallback(async () => {
    try {
      const response = await API.get(`/profile`);
      setProfile(response.data);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }, []);
  const getUsers = useCallback(async () => {
    try {
      const response = await API.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }, []);

  const getCourse = useCallback(async () => {
    try {
      const response = await API.get(`/course`);
      setCourse(response.data);
    } catch (error) {
      console.log(error);
    }
  });
  const getCategory = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  useEffect(() => {
    getCourse();
  }, [getCourse]);
  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const data = [
    {
      title: "Total Users",
      count: users.length || 0,
      icon: "fe-users",
      color: "primary",
      roles: ["Super Admin"],
    },
    {
      title: "Super Admin",
      count: users.filter((item) => item.role === "Super Admin").length || 0,
      icon: "fe-shield",
      color: "secondary",
      roles: ["Super Admin"],
    },
    {
      title: "Editor",
      count: users.filter((item) => item.role === "Editor").length || 0,
      icon: "fe-edit",
      color: "success",
      roles: ["Super Admin"],
    },
    {
      title: "Property Manager",
      count:
        users.filter((item) => item.role === "Property Manager").length || 0,
      icon: "fe-home",
      color: "danger",
      roles: ["Super Admin"],
    },
    {
      title: "User",
      count: users.filter((item) => item.role === "User").length || 0,
      icon: "fe-user",
      color: "warning",
      roles: ["Super Admin"],
    },
    {
      title: "Properties",
      count: properties?.length || 0,
      icon: "fe-layers",
      color: "info",
      roles: ["Super Admin", "Editor"],
    },
    {
      title: "Your Properties",
      count:
        properties.filter((item) => item?.userId === profile?.uniqueId)
          ?.length || 0,
      icon: "fe-briefcase",
      color: "primary",
      roles: ["Super Admin", "Editor"],
    },
    {
      title: "Course",
      count: course?.length || 0,
      icon: "fe-book-open",
      color: "dark",
      roles: ["Super Admin", "Editor"],
    },
    {
      title: "Category",
      count: category?.length || 0,
      icon: "fe-database",
      color: "light",
      roles: ["Super Admin", "Editor"],
    },
  ];

  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row className="total-sales-card-section">
            {data?.map(
              (item, index) =>
                item?.roles?.some((role) => role == authUser?.role) && (
                  <Col lg={6} md={6} sm={12} xl={3} key={index}>
                    <CounterCards cardData={item} />
                  </Col>
                )
            )}
          </Row>
        </Col>
      </Row>

      {/* <Graphs /> */}
      {/* <KeywordCards /> */}
      <RankTable properties={properties} />
    </div>
  );
}
