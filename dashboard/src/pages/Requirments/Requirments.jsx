import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { API } from "../../context/API";
import CreateRequirments from "./createRequirments";

export default function Requirments() {
  const [requirments, setRequirments] = useState([]);
  const [filteredRequirments, setFilteredRequirments] = useState([]);
  const [search, setSearch] = useState("");
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
  const fetchRequirments = useCallback(async () => {
    try {
      const response = await API.get("/requirment/all");
      setRequirments(response.data);
      setFilteredRequirments(response.data);
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch Requirment:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchRequirments();
  }, [fetchRequirments]);

  useEffect(() => {
    if (requirments) {
      setFilteredRequirments(
        requirments.filter((item) =>
          Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    }
  }, [search, requirments]);
  const deleteCourse = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Requirments will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/requirment/${id}`);
        fetchRequirments();
        Swal.fire("Deleted!", "The requirments has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete requirments:", error);
        Swal.fire(
          "Error",
          "Failed to delete requirments. Please try again.",
          "error"
        );
      }
    }
  };

  const columns = [
    {
      name: "Requirment",
      selector: (row) => row.requirment,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          {!authLoading && (
            <>
              {authUser?.permissions?.some(
                (item) => item.value === "Delete Blog Tags"
              ) && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteCourse(row._id)}
                >
                  <i className="fe fe-trash-2"></i>
                </Button>
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
          <h1 className="page-title fw-semibold fs-20 mb-0">Requirment</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Requirment</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button variant="primary" onClick={() => window.history.back()}>
            <i className="fe fe-arrow-left"></i> Back
          </Button>
        </div>
      </div>

      <CreateRequirments onAfterCreate={fetchRequirments} />

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Requirment List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col lg={4}>
                  <div className="position-relative">
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
                      <i className="fe fe-search text-primary"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Search Blogs"
                      value={search}
                      className="ps-5 border-bottom border-0 border-primary rounded-0"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <DataTable
                columns={columns}
                data={filteredRequirments}
                progressPending={loading}
                pagination
                highlightOnHover
                striped
                responsive
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
