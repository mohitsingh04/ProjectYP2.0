"use client";
import React, { useCallback, useEffect, useState } from "react";
import BreadCrumbs from "./_instructor-components/BreadCrumbs";
import { FaFilter } from "react-icons/fa";
import PropertyCard from "./_instructor-components/SidebarFiltes/PropertyCards/PropertyCard";
import Pagination from "./_instructor-components/Pagination/Pagination";
import Serachbar from "./_instructor-components/SeachBar/Serachbar";
import StatesCard from "./_instructor-components/SidebarFiltes/StatesCard/StatesCard";
import CityCard from "./_instructor-components/SidebarFiltes/CityCard/CityCard";
import CourseCard from "./_instructor-components/SidebarFiltes/CourseCard/CourseCard";
import { useRouter } from "next/navigation";
import LevelCard from "./_instructor-components/SidebarFiltes/LevelCard/LevelCard";
import FilterTags from "./_instructor-components/SidebarFiltes/FilterTags/FilterTags";
import CourseTypeCard from "./_instructor-components/SidebarFiltes/CourseTypeCard/CourseTypeCard";
import API from "@/service/API/API";
import CategoryCard from "./_instructor-components/SidebarFiltes/CategoryCard/CategoryCard";

interface Property {
  property_name: string;
  category: string;
  property_state: string;
  property_city: string;
  uniqueId: number;
  status: string;
}
interface Course {
  course_name: string;
  course_level: string;
  course_type: string;
  property_id: number;
  status: string;
}

interface Filters {
  searchQuery?: string;
  selectedCategory: string[];
  selectedState: string[];
  selectedCity: string[];
  selectedCourses: Set<string>;
  selectedLevel: string[];
  selectedType: string[];
}

export default function InstructorList() {
  const [property, setProperty] = useState<Property[]>([]);
  const [filteredProperty, setFilteredProperty] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<Property[]>([]);
  const [stateData, setStateData] = useState<Property[]>([]);
  const [cityData, setCityData] = useState<Property[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<any>>(new Set());
  const itemsPerPage = 10;
  const [allcourse, setAllCourse] = useState([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [rawCourses, setRawCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<any[]>([]);

  const getProperty = async () => {
    try {
      const response = await API.get(`/property`);
      const locationRes = await API.get(`/locations`);

      const data = response.data;
      const locData = locationRes.data;

      // Filter active properties
      const activeProperties = data.filter(
        (item: { status: string }) => item.status === "Active"
      );

      // Merge with corresponding location
      const mergedData = activeProperties.map((property: any) => {
        const location = locData.find(
          (loc: any) => loc.property_id === property.uniqueId.toString()
        );

        // Prefix property fields
        const prefixedProperty = Object.fromEntries(
          Object.entries(property).map(([key, value]) => [
            key === "_id"
              ? "property__id"
              : key === "createdAt"
              ? "property_createdAt"
              : key === "__v"
              ? "property_version"
              : key,
            value,
          ])
        );

        // Prefix location fields
        const prefixedLocation = location
          ? Object.fromEntries(
              Object.entries(location).map(([key, value]) => [
                key === "_id"
                  ? "location__id"
                  : key === "createdAt"
                  ? "location_createdAt"
                  : key === "updatedAt"
                  ? "location_updatedAt"
                  : key === "__v"
                  ? "location_version"
                  : key,
                value,
              ])
            )
          : {};

        return {
          ...prefixedProperty,
          ...prefixedLocation,
        };
      });

      setProperty(mergedData);
      setFilteredProperty(mergedData);
      setCategoryData(mergedData);
      setCityData(mergedData);
      setStateData(mergedData);
    } catch (error) {
      console.error((error as any)?.message);
    }
  };

  const getCourses = async () => {
    try {
      const response = await API.get("/course");
      const data = response.data;
      const activeCourses = data;
      setAllCourse(activeCourses);
    } catch (error) {
      console.error((error as any)?.message);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const getPropertyCourses = useCallback(async () => {
    try {
      const response = await API.get("/property-course");
      const data = response.data;
      const activeCourses = data.filter(
        (course: { status: string }) => course.status === "Active"
      );
      setRawCourses(activeCourses);
      setFilteredCourses(activeCourses);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getPropertyCourses();
  }, [getPropertyCourses]);

  useEffect(() => {
    if (rawCourses && allcourse) {
      const mergedCourses = rawCourses.map((cour: any) => {
        const matched: any = allcourse.find(
          (item: any) => item?.uniqueId === cour?.course_id
        );
        return matched ? { ...matched, ...cour } : cour;
      });
      setFilteredCourses(mergedCourses);
      setCourses(mergedCourses);
    }
  }, [rawCourses, allcourse]);

  useEffect(() => {
    let filtered = courses;
    if (selectedLevel.length > 0) {
      filtered = courses.filter((item) =>
        selectedLevel.some((level: string) => {
          console.log(level, item);
          level.toLowerCase() === item?.course_level?.toLowerCase();
        })
      );
    }
    if (selectedType.length > 0) {
      filtered = courses.filter((item) =>
        selectedType.some(
          (type: string) =>
            type.toLowerCase() === item?.course_type?.toLowerCase()
        )
      );
    }

    setFilteredCourses(filtered);
  }, [selectedLevel, selectedType]);

  useEffect(() => {
    getProperty();
  }, []);
  const router = useRouter();

  const updateQueryParams = (newFilters: Filters) => {
    const params = new URLSearchParams();
    if (newFilters.searchQuery)
      params.set("search", newFilters.searchQuery.toLowerCase());
    if (newFilters.selectedCategory.length)
      params.set(
        "category",
        newFilters.selectedCategory.map((cat) => cat.toLowerCase()).join(",")
      );
    if (newFilters.selectedState.length)
      params.set(
        "state",
        newFilters.selectedState.map((state) => state.toLowerCase()).join(",")
      );
    if (newFilters.selectedCity.length)
      params.set(
        "city",
        newFilters.selectedCity.map((city) => city.toLowerCase()).join(",")
      );
    if (Array.from(newFilters.selectedCourses).length)
      params.set(
        "courses",
        Array.from(newFilters.selectedCourses)
          .map((course) => course.toLowerCase())
          .join(",")
      );
    if (newFilters.selectedLevel.length)
      params.set(
        "level",
        newFilters.selectedLevel.map((level) => level.toLowerCase()).join(",")
      );
    if (newFilters.selectedType.length)
      params.set(
        "type",
        newFilters.selectedType.map((type) => type.toLowerCase()).join(",")
      );
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    updateQueryParams({
      searchQuery,
      selectedCategory,
      selectedState,
      selectedCity,
      selectedCourses,
      selectedLevel,
      selectedType,
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedState,
    selectedCity,
    selectedCourses,
    selectedLevel,
    selectedType,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const getParamArray = (key: string) =>
      params.get(key) ? params.get(key)!.toLowerCase().split(",") : [];

    const getParamSet = (key: string) =>
      params.get(key)
        ? new Set(params.get(key)!.toLowerCase().split(","))
        : new Set();

    setSearchQuery(params.get("search")?.toLowerCase() || "");
    setSelectedCategory(getParamArray("category"));
    setSelectedState(getParamArray("state"));
    setSelectedCity(getParamArray("city"));
    setSelectedCourses(getParamSet("courses"));
    setSelectedLevel(getParamArray("level"));
    setSelectedType(getParamArray("type"));
  }, []);

  useEffect(() => {
    let filtered = property.filter(
      (item: {
        property_name: string;
        category: string;
        property_city: string;
        uniqueId: number;
        property_state: string;
      }) => {
        const matchesSearch = searchQuery
          ? item.property_name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesCategory =
          selectedCategory.length > 0
            ? selectedCategory.some(
                (category) =>
                  category.toLowerCase() === item.category.toLowerCase()
              )
            : true;

        const matchesState =
          selectedState.length > 0
            ? selectedState.some(
                (state) =>
                  state?.toLowerCase() === item?.property_state?.toLowerCase()
              )
            : true;

        const matchesCity =
          selectedCity.length > 0
            ? selectedCity.some(
                (city) =>
                  city?.toLowerCase() === item?.property_city?.toLowerCase()
              )
            : true;

        const matchesCourses =
          selectedCourses.size > 0
            ? courses.some(
                (course: { property_id: any; course_name: string }) =>
                  selectedCourses.has(course?.course_name?.toLowerCase()) &&
                  course.property_id === item.uniqueId
              )
            : true;

        const matchesLevel =
          selectedLevel.length > 0
            ? courses.some(
                (course: { property_id: any; course_level: string }) =>
                  selectedLevel.includes(course.course_level?.toLowerCase()) &&
                  course.property_id === item.uniqueId
              )
            : true;
        const matchesTypes =
          selectedType.length > 0
            ? courses.some(
                (course: { property_id: any; course_type: string }) =>
                  selectedType.includes(course.course_type?.toLowerCase()) &&
                  course.property_id === item.uniqueId
              )
            : true;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesState &&
          matchesCity &&
          matchesCourses &&
          matchesLevel &&
          matchesTypes
        );
      }
    );

    setFilteredProperty(filtered);
    setCurrentPage(1);
  }, [
    searchQuery,
    property,
    selectedState,
    selectedCategory,
    selectedCity,
    selectedCourses,
    selectedLevel,
    selectedType,
    courses,
  ]);

  useEffect(() => {
    let filtered = property;
    if (selectedState.length > 0) {
      filtered = filtered.filter((item: { property_state: string }) =>
        selectedState.some(
          (state) =>
            state?.toLowerCase() === item?.property_state?.toLowerCase()
        )
      );
    }
    if (selectedCity.length > 0) {
      filtered = filtered.filter((item: { property_city: string }) =>
        selectedCity.some(
          (city) => city?.toLowerCase() === item?.property_city?.toLowerCase()
        )
      );
    }
    setCategoryData(filtered);
  }, [selectedCity, selectedState]);
  useEffect(() => {
    let filtered = property;
    if (selectedCategory.length > 0) {
      filtered = filtered.filter((item: { category: string }) =>
        selectedCategory.some(
          (category) => category.toLowerCase() === item.category.toLowerCase()
        )
      );
    }
    if (selectedCity.length > 0) {
      filtered = filtered.filter((item: { property_city: string }) =>
        selectedCity.some(
          (city) => city?.toLowerCase() === item?.property_city?.toLowerCase()
        )
      );
    }
    setStateData(filtered);
  }, [selectedCity, selectedCategory]);

  useEffect(() => {
    let filtered = property;
    if (selectedState.length > 0) {
      filtered = filtered.filter((item: { property_state: string }) =>
        selectedState.some(
          (state) =>
            state?.toLowerCase() === item?.property_state?.toLowerCase()
        )
      );
    }
    if (selectedCategory.length > 0) {
      filtered = filtered.filter((item: { category: string }) =>
        selectedCategory.some(
          (category) => category.toLowerCase() === item.category.toLowerCase()
        )
      );
    }
    setCityData(filtered);
  }, [selectedCategory, selectedState]);

  const totalPages = Math.ceil(filteredProperty.length / itemsPerPage);

  const paginatedData = filteredProperty.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory([]);
    setSelectedCity([]);
    setSelectedState([]);
    setSelectedCourses(new Set());
    setSelectedLevel([]);
    setSelectedType([]);
    setSearchQuery("");
    router.push("?", { scroll: false });
  };

  return (
    <>
      <div className="page-content">
        <BreadCrumbs />
        <div className="course-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="filter-clear">
                  <div className="clear-filter d-flex align-items-center">
                    <h4>
                      <FaFilter /> Filters
                    </h4>
                    <div className="clear-text">
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={handleClearFilters}
                      >
                        CLEAR
                      </p>
                    </div>
                  </div>
                  <FilterTags
                    selectedCategory={selectedCategory}
                    selectedCity={selectedCity}
                    selectedCourses={selectedCourses}
                    selectedLevel={selectedLevel}
                    selectedState={selectedState}
                    selectedType={selectedType}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedCity={setSelectedCity}
                    setSelectedLevel={setSelectedLevel}
                    setSelectedCourses={setSelectedCourses}
                    setSelectedType={setSelectedType}
                    setSelectedState={setSelectedState}
                  />

                  <CategoryCard
                    filteredProperty={filteredProperty}
                    property={categoryData}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  <CourseCard
                    properties={filteredProperty}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    setFilteredProperty={setFilteredProperty}
                    courses={filteredCourses}
                  />
                  <LevelCard
                    properties={filteredProperty}
                    courses={filteredCourses}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                  />
                  <CourseTypeCard
                    allCourses={courses}
                    properties={filteredProperty}
                    courses={filteredCourses}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                  />
                  <StatesCard
                    filteredProperty={filteredProperty}
                    property={stateData}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                  />
                  <CityCard
                    filteredProperty={filteredProperty}
                    property={cityData}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                  />
                </div>
              </div>
              <div className="col-lg-9 ">
                <div className="showing-list">
                  <Serachbar
                    itemsPerPage={itemsPerPage}
                    filteredProperty={filteredProperty}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage}
                  />
                </div>
                <div className="row">
                  {paginatedData.map((item, index) => (
                    <PropertyCard property={item} key={index} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  changePage={changePage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
