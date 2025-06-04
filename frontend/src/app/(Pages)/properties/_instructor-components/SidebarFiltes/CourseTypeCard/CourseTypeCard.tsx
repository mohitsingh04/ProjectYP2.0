import API from "@/service/API/API";
import React, { useCallback, useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

interface Course {
  course_type: string;
  property_id: number;
}

interface Property {
  uniqueId: number;
}

interface CourseTypeCardProps {
  selectedType: string[];
  setSelectedType: React.Dispatch<React.SetStateAction<any[]>>;
  properties: Property[];
  courses: Course[];
  allCourses: Course[];
}

const CourseTypeCard: React.FC<CourseTypeCardProps> = ({
  selectedType = [],
  setSelectedType,
  properties = [],
  courses = [],
  allCourses = [],
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState([]);

  const getCategory = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const getCategoryById = (id: any) => {
    const numId = Number(id);

    // Check if id is a valid number
    if (!isNaN(numId)) {
      const category: any = categories.find(
        (item: any) => Number(item.uniqueId) === numId
      );
      return category?.category_name || "";
    }

    return id;
  };

  const types = [...new Set(allCourses.map((item) => item.course_type))];
  const typeCounts: Record<string, number> = types?.reduce((acc, type) => {
    acc[type?.toLowerCase()] = 0;
    return acc;
  }, {} as Record<string, number>);

  courses.forEach((course) => {
    const lowerCaseType = course?.course_type?.toLowerCase();
    const isMatchingProperty = properties.some(
      (property) => Number(property?.uniqueId) === course?.property_id
    );

    if (isMatchingProperty && typeCounts.hasOwnProperty(lowerCaseType)) {
      typeCounts[lowerCaseType]++;
    }
  });

  const handleTypeChange = (type: string) => {
    const lowerCaseType = type.toLowerCase();
    setSelectedType((prev) =>
      prev.includes(lowerCaseType)
        ? prev.filter((t) => t !== lowerCaseType)
        : [...prev, lowerCaseType]
    );
  };

  const filteredTypes = types.filter((type) =>
    type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="card search-filter">
      <div className="card-body">
        <div className="filter-widget mb-0">
          <div className="categories-head d-flex align-items-center">
            <h4>Course Type</h4>
            <FaAngleDown className="icon" />
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search Type"
            style={{ minHeight: "20px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            className="overflow-auto"
            style={{ maxHeight: "150px", scrollbarWidth: "thin" }}
          >
            {filteredTypes.length > 0 ? (
              filteredTypes.map((type, idx) => {
                const lowerCaseType = type.toLowerCase();
                return (
                  <div key={idx}>
                    <label className="custom_check">
                      <input
                        type="checkbox"
                        name="state_filter"
                        value={lowerCaseType}
                        checked={selectedType.includes(lowerCaseType)}
                        onChange={() => handleTypeChange(lowerCaseType)}
                      />
                      <span className="checkmark"></span>{" "}
                      {getCategoryById(type)} ({typeCounts[lowerCaseType]})
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">No types found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTypeCard;
