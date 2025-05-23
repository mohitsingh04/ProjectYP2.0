import API from "@/service/API/API";
import React, { useCallback, useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";

interface FilterTagsProps {
  selectedCategory: string[];
  selectedCity: string[];
  selectedState: string[];
  selectedCourses: Set<string>;
  selectedLevel: string[];
  selectedType: string[];
  setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCity: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedState: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCourses: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  selectedCategory,
  selectedCity,
  selectedState,
  selectedCourses,
  selectedLevel,
  selectedType,
  setSelectedType,
  setSelectedCategory,
  setSelectedCity,
  setSelectedState,
  setSelectedCourses,
  setSelectedLevel,
}) => {
  const tagStyle =
    "d-flex align-items-center bg-white text-dark rounded px-3 py-1 border";
  const closeBtnStyle =
    "btn btn-sm border-0 btn-light ms-2 me-0 d-flex align-items-center justify-content-center";

  const [allCategories, setAllCategories] = useState([]);

  const getAllCategories = useCallback(async () => {
    try {
      const response = await API.get(`/category`);
      setAllCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const getCategoryToRelatedId = (id: any) => {
    const category: any = allCategories.find(
      (item: any) => item.uniqueId === Number(id)
    );
    return category ? category?.category_name : "Unknown";
  };
  return (
    <div
      className="d-flex w-100 gap-2 overflow-auto flex-nowrap pb-2 flex-grow"
      style={{ scrollbarWidth: "thin", paddingBottom: "8px" }}
    >
      {selectedCategory.map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{getCategoryToRelatedId(item)}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedCategory((prev) =>
                prev.filter((category) => category !== item)
              )
            }
          >
            <FaX />
          </button>
        </div>
      ))}
      {selectedCity.map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{item}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedCity((prev) => prev.filter((city) => city !== item))
            }
          >
            <FaX />
          </button>
        </div>
      ))}
      {selectedState.map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{item}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedState((prev) => prev.filter((state) => state !== item))
            }
          >
            <FaX />
          </button>
        </div>
      ))}
      {[...selectedCourses].map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{item}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedCourses((prev) => {
                const updatedSet = new Set(prev);
                updatedSet.delete(item);
                return new Set(updatedSet);
              })
            }
          >
            <FaX />
          </button>
        </div>
      ))}
      {selectedLevel.map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{item}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedLevel((prev) => prev.filter((level) => level !== item))
            }
          >
            <FaX />
          </button>
        </div>
      ))}
      {selectedType.map((item, index) => (
        <div key={index} className={tagStyle}>
          <span className="text-truncate">{item}</span>
          <button
            className={closeBtnStyle}
            onClick={() =>
              setSelectedType((prev) => prev.filter((type) => type !== item))
            }
          >
            <FaX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterTags;
