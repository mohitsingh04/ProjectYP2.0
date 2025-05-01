import { addPropertyScore } from "../AnalyticController/PropertyScoreController.js";
import Course from "../models/Courses.js";
import PropertyCourse from "../models/PropertyCourse.js";

export const addPropertyCourse = async (req, res) => {
  try {
    const {
      userId,
      course_name,
      course_type,
      course_short_name,
      prices,
      course_level,
      duration,
      course_id,
      certification_type,
      property_id,
      description,
      final_requirement,
      cerification_info,
      best_for,
      languages,
      course_format,
      final_key_outcomes,
    } = req.body;

    if (!userId || !course_name || !property_id || !course_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const existingCourse = await PropertyCourse.findOne({
      property_id,
      course_name,
    });

    if (existingCourse) {
      return res.status(400).json({ error: "This course already exists." });
    }

    const baseCourse = await Course.findOne({ uniqueId: course_id });
    if (!baseCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in Course collection." });
    }

    const image = baseCourse.image || [];

    const lastCourse = await PropertyCourse.findOne()
      .sort({ _id: -1 })
      .limit(1);
    const nextUniqueId = lastCourse ? lastCourse.uniqueId + 1 : 1;

    const existingCourseCount = await PropertyCourse.countDocuments({
      property_id,
    });

    const newCourse = new PropertyCourse({
      userId,
      uniqueId: nextUniqueId,
      course_name,
      course_type,
      course_short_name,
      prices,
      course_level,
      duration,
      course_id,
      certification_type,
      property_id,
      description,
      image,
      requirements: final_requirement,
      best_for,
      cerification_info,
      languages,
      course_format,
      key_outcomes: final_key_outcomes,
    });

    await newCourse.save();

    if (existingCourseCount === 0) {
      await addPropertyScore({
        property_score: 10,
        property_id: property_id,
      });
    }

    return res.status(200).json({ message: "Course added successfully." });
  } catch (error) {
    console.error("Error adding course:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getPropertyCourse = async (req, res) => {
  try {
    const propertyCourse = await PropertyCourse.find();
    return res.status(200).json(propertyCourse);
  } catch (err) {
    return res.send({ error: "Internal Server Error" });
  }
};

export const getPropertyCourseById = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const propertyCourse = await PropertyCourse.findOne({ _id: objectId });
    return res.status(200).json(propertyCourse);
  } catch (err) {
    return res.send({ error: "Internal Server Error" });
  }
};
export const getPropertyCourseByUniqueId = async (req, res) => {
  try {
    const uniqueId = req.params.uniqueId;
    const propertyCourse = await PropertyCourse.findOne({ uniqueId: uniqueId });
    return res.status(200).json(propertyCourse);
  } catch (err) {
    return res.send({ error: "Internal Server Error" });
  }
};
export const getPropertyCourseByPropertyId = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const propertyCourse = await PropertyCourse.find({
      property_id: propertyId,
    });
    return res.status(200).json(propertyCourse);
  } catch (err) {
    return res.send({ error: "Internal Server Error" });
  }
};

export const updatePropertyCourse = async (req, res) => {
  try {
    const objectId = req.params.objectId;

    const {
      course_name,
      course_type,
      course_short_name,
      status,
      prices,
      course_level,
      duration,
      course_id,
      certification_type,
      description,
      final_requirement,
      cerification_info,
      best_for,
      languages,
      course_format,
      final_key_outcomes,
    } = req.body;

    if (!course_name || !objectId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let updateData = {
      course_name,
      course_type,
      course_short_name,
      prices,
      course_level,
      duration,
      course_id,
      status,
      certification_type,
      description,
      cerification_info,
      requirements: final_requirement,
      best_for,
      languages,
      course_format,
      key_outcomes: final_key_outcomes,
    };

    if (course_id) {
      const baseCourse = await Course.findOne({ uniqueId: course_id });
      if (!baseCourse) {
        return res.status(404).json({ error: "Base course not found." });
      }
      updateData.image = baseCourse.image || [];
    }

    const updatedCourse = await PropertyCourse.findByIdAndUpdate(
      objectId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    return res
      .status(200)
      .json({ message: "Course updated successfully.", updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
export const deletePropertyCourse = async (req, res) => {
  try {
    const { objectId } = req.params;

    const course = await PropertyCourse.findById(objectId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const property_id = course.property_id;

    const courseCount = await PropertyCourse.countDocuments({ property_id });

    const delCourse = await PropertyCourse.findOneAndDelete({ _id: objectId });

    if (delCourse) {
      if (courseCount === 1) {
        await addPropertyScore({
          property_score: -10,
          property_id: property_id,
        });
      }

      return res
        .status(200)
        .json({ message: "Property Course Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ error: "Course not found during deletion." });
    }
  } catch (error) {
    console.error("Error deleting property course:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
