import API from "@/service/API/API";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaAngleDown } from "react-icons/fa";

interface Course {
  property_id: number;
  course_level: string;
}

interface Property {
  uniqueId: number;
}

interface LevelCardProps {
  selectedLevel: string[];
  setSelectedLevel: React.Dispatch<React.SetStateAction<string[]>>;
  properties: Property[];
  courses: Course[];
}

const LevelCard: React.FC<LevelCardProps> = ({
  selectedLevel = [],
  setSelectedLevel,
  properties = [],
  courses = [],
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

  // Get unique levels from courses
  const levels = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.course_level?.toLowerCase())
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  // Count number of unique properties per level
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    levels.forEach((level) => {
      const uniquePropertyIds = new Set<number>();
      courses.forEach((course) => {
        if (
          course.course_level?.toLowerCase() === level &&
          properties.some((p) => p.uniqueId === course.property_id)
        ) {
          uniquePropertyIds.add(course.property_id);
        }
      });
      counts[level] = uniquePropertyIds.size;
    });
    return counts;
  }, [levels, courses, properties]);

  const handleLevelChange = (level: string) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const filteredLevels = levels.filter((level) =>
    level.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card search-filter">
      <div className="card-body">
        <div className="filter-widget mb-0">
          <div className="categories-head d-flex align-items-center">
            <h4>Course Level</h4>
            <FaAngleDown className="icon" />
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search Level"
            style={{ minHeight: "20px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            className="overflow-auto"
            style={{ maxHeight: "150px", scrollbarWidth: "thin" }}
          >
            {filteredLevels.length > 0 ? (
              filteredLevels.map((level, idx) => (
                <div key={idx}>
                  <label className="custom_check">
                    <input
                      type="checkbox"
                      name="level_filter"
                      value={level}
                      checked={selectedLevel.includes(level)}
                      onChange={() => handleLevelChange(level)}
                    />
                    <span className="checkmark"></span>{" "}
                    {getCategoryById(
                      level.charAt(0).toUpperCase() + level.slice(1)
                    )}{" "}
                    ({levelCounts[level] || 0})
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted">No levels found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;
