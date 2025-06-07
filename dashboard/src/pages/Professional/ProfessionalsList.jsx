import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { API } from "../../context/API";
import ALLImages from "../../common/Imagesdata";
import DataTableSkeleton from "../../components/Skeletons/DataTableSkeleton";

export default function Professionalslist() {
  const navigator = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

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

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/profile/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value
          ? value.toString().toLowerCase().includes(search.toLowerCase())
          : false
      )
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const columns = [
    {
      name: "Profile",
      selector: (row) => row.profile,
      cell: (row) => (
        <img
          src={
            row?.profile?.[0]
              ? row?.isGoogleLogin
                ? row?.profile?.[0]
                : `${import.meta.env.VITE_MEDIA_URL}/user/${row?.profile?.[0]}`
              : ALLImages("face8")
          }
          alt={row?.profile?.[0] || "Profile"}
          className="rounded-circle"
          width="40"
          height="40"
        />
      ),
      sortable: false,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => row.email,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => row.role,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`badge ${row.verified ? "bg-success" : "bg-danger"}`}>
          {row.verified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "Active"
              ? "bg-success"
              : row.status === "Suspended"
              ? "bg-danger"
              : "bg-warning"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          {!authLoading && (
            <>
              {authUser?.permissions?.some(
                (item) => item === "Read Professional"
              ) && (
                <Link
                  to={`/dashboard/professionals/view/${row._id}`}
                  className="btn btn-primary btn-sm"
                >
                  <i className="fe fe-eye"></i>
                </Link>
              )}
            </>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Professionals</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Professionals</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button variant="primary" onClick={() => navigator(-1)}>
            <i className="fe fe-arrow-left"></i> Back
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between py-3">
              <h5 className="mb-0">Professionals List</h5>
            </Card.Header>
            {!loading ? (
              <Card.Body>
                <Row className="mb-3">
                  <Col lg={4}>
                    <div className="position-relative">
                      <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
                        <i className="fe fe-search text-primary"></i>
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search by Name, Email, City, or Role"
                        value={search}
                        className="ps-5 border-bottom border-0 border-primary rounded-0"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <DataTable
                  columns={columns}
                  data={loading ? Array(10).fill({}) : filteredUsers}
                  pagination
                  highlightOnHover
                  responsive
                  striped
                />
              </Card.Body>
            ) : (
              <DataTableSkeleton />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
