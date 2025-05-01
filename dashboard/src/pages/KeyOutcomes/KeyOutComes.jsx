import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import CreateKeyOutComes from "./CreateKeyOutComes";
import { API } from "../../context/API";

export default function KeyOUtComes() {
  const [keyOutcomes, setKeyOutComes] = useState([]);
  const [filteredKeyOutcomes, setFilteredKeyOutcomes] = useState([]);
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
  const fetchKeyOutcomes = useCallback(async () => {
    try {
      const response = await API.get("/key-outcome/all");
      setKeyOutComes(response.data);
      setFilteredKeyOutcomes(response.data);
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch Key Outcomes:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchKeyOutcomes();
  }, [fetchKeyOutcomes]);

  useEffect(() => {
    if (keyOutcomes) {
      setFilteredKeyOutcomes(
        keyOutcomes.filter((item) =>
          Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    }
  }, [search, keyOutcomes]);
  const deleteCourse = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This key Outcomes will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/key-outcome/${id}`);
        fetchKeyOutcomes();
        Swal.fire("Deleted!", "The keyOutcomes has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete keyOutcomes:", error);
        Swal.fire(
          "Error",
          "Failed to delete keyOutcomes. Please try again.",
          "error"
        );
      }
    }
  };

  const columns = [
    {
      name: "Key Outcome",
      selector: (row) => row.key_outcome,
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
          <h1 className="page-title fw-semibold fs-20 mb-0">Key Outcomes</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Key Outcomes</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Button variant="primary" onClick={() => window.history.back()}>
            <i className="fe fe-arrow-left"></i> Back
          </Button>
        </div>
      </div>

      <CreateKeyOutComes onAfterCreate={fetchKeyOutcomes} />

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title>Key Outcomes List</Card.Title>
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
                data={filteredKeyOutcomes}
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
