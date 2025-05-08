"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import API from "@/service/API/API";
import CompareCard from "./_CompareComponent/CompareCard";
import { useRouter, useSearchParams } from "next/navigation";

type Property = {
  _id: string;
  property_name: string;
  property_slug: string;
  property_email: string;
  property_mobile_no: string;
  property_alt_mobile_no: string;
  property_description: string;
  category: string;
  status: string;
  property_type: string;
  sponsered: boolean;
  property_logo?: string;
};

export default function ComparePage() {
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [category, setCategory] = useState([]);
  const [selectedPropertyName, setSelectedPropertyName] = useState<
    string | null
  >(null);
  const [assignedProperties, setAssignedProperties] = useState<
    Record<number, Property | null>
  >({
    0: null,
    1: null,
    2: null,
    3: null,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const getCategory = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const getCategoryToRelatedId = (id: any) => {
    const outCome: any = category.find(
      (item: any) => item.uniqueId === Number(id)
    );
    return outCome ? outCome?.category_name : "Unknown";
  };

  // Fetch all properties and populate from query params
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await API.get("/property");
        const allProps = res.data;
        setProperties(allProps);
        setFilteredProperties(allProps);
        setLoading(false);

        // Assign from query params using property_name
        const newAssignments: Record<number, Property | null> = {
          0: null,
          1: null,
          2: null,
          3: null,
        };
        [0, 1, 2, 3].forEach((index) => {
          const name = searchParams.get(`comp${index}`);
          if (name) {
            const found = allProps.find(
              (p: Property) => p.property_name === name
            );
            if (found) newAssignments[index] = found;
          }
        });
        setAssignedProperties(newAssignments);
      } catch (err) {
        console.error("Failed to fetch properties", err);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const openModal = (sectionIndex: number) => {
    setActiveSection(sectionIndex);
    setSelectedPropertyName(
      assignedProperties[sectionIndex]?.property_name || null
    );
    setSearchTerm("");

    // Filter out already assigned property names (except current)
    const assignedNames = Object.entries(assignedProperties)
      .filter(([key, val]) => val && Number(key) !== sectionIndex)
      .map(([_, val]) => val!.property_name);

    const filtered = properties.filter(
      (p) => !assignedNames.includes(p.property_name)
    );
    setFilteredProperties(filtered);
    setShowModal(true);
  };

  const confirmSelection = () => {
    if (activeSection !== null && selectedPropertyName) {
      const selected = properties.find(
        (p) => p.property_name === selectedPropertyName
      );
      if (selected) {
        const updatedAssignments = {
          ...assignedProperties,
          [activeSection]: selected,
        };

        setAssignedProperties(updatedAssignments);

        // Build route with query params
        const params = new URLSearchParams();
        Object.entries(updatedAssignments).forEach(([index, prop]) => {
          if (prop) params.set(`comp${index}`, prop.property_name);
        });

        router.push(`/compare?${params.toString()}`);
      }
    }
    setShowModal(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const assignedNames = Object.entries(assignedProperties)
      .filter(([key, value]) => value && Number(key) !== activeSection)
      .map(([_, value]) => value!.property_name);

    const filtered = properties.filter(
      (p) =>
        !assignedNames.includes(p.property_name) &&
        p.property_name.toLowerCase().includes(value)
    );

    setFilteredProperties(filtered);
  };

  return (
    <section className="page-content course-sec">
      <div className="container py-5">
        <div className="row">
          {[0, 1, 2, 3].map((index) => {
            const property = assignedProperties[index];
            return (
              <CompareCard
                openModal={openModal}
                property={property}
                index={index}
                key={index}
                getCategoryToRelatedId={getCategoryToRelatedId}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Form.Control
                type="text"
                placeholder="Search by property name..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3"
              />
              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((prop) => (
                    <div
                      className="form-check d-flex align-items-center gap-3 mb-3"
                      key={prop._id}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="selectedProperty"
                        id={prop._id}
                        checked={selectedPropertyName === prop.property_name}
                        onChange={() =>
                          setSelectedPropertyName(prop.property_name)
                        }
                      />
                      {prop.property_logo && (
                        <img
                          src={
                            prop?.property_logo?.[0]
                              ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${prop.property_logo[0]}`
                              : `/Images/PropertyBanner.png`
                          }
                          alt={prop.property_name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <label className="form-check-label" htmlFor={prop._id}>
                        {prop.property_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No properties available.</p>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmSelection}
            disabled={!selectedPropertyName}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
