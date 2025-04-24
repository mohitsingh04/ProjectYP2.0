import { addPropertyScore } from "../AnalyticController/PropertyScoreController.js";
import { MainImageMover } from "../helper/FolderCleaners/PropertyImageMover.js";
import Certifications from "../models/Certifications.js";
import Amenities from "../models/Ameniteis.js";
import ArchiveEnquiry from "../models/ArchiveEnquiry.js";
import BusinessHour from "../models/BusinessHour.js";
import Enquiry from "../models/Enquiry.js";
import Faqs from "../models/Faqs.js";
import Gallery from "../models/Gallery.js";
import Location from "../models/Location.js";
import Property from "../models/Property.js";
import PropertyCourse from "../models/PropertyCourse.js";
import Review from "../models/Reviews.js";
import Seo from "../models/Seo.js";
import Teachers from "../models/Teachers.js";
import * as fs from "node:fs";
import path from "node:path";
import Rank from "../AnalyticModel/Rank.js";
import Traffic from "../AnalyticModel/Traffic.js";
import EnquiryCount from "../AnalyticModel/EnquiryCount.js";
import PropertyScore from "../AnalyticModel/PropertyScore.js";
import SeoScore from "../AnalyticModel/SeoScore.js";
import { downloadImageAndReplaceSrc } from "../helper/FolderCleaners/EditorImagesController.js";

export const addProperty = async (req, res) => {
  try {
    let {
      userId,
      property_name,
      property_email,
      property_mobile_no,
      category,
      property_type,
      property_description,
    } = req.body;

    let score = 3;

    if (property_description) score += 1;
    if (category) score += 1;
    if (property_type) score += 1;

    if (property_name) {
      property_name = property_name.trim().replace(/\s+/g, " ");
    }

    const existingProperty = await Property.findOne({
      $or: [
        { property_email },
        { property_mobile_no: `+${property_mobile_no}` },
      ],
    });

    if (existingProperty) {
      if (existingProperty.property_email === property_email) {
        return res.status(400).json({
          error: "Property with the same email already exists.",
        });
      }
      if (existingProperty.property_mobile_no === `+${property_mobile_no}`) {
        return res.status(400).json({
          error: "Property with the same mobile number already exists.",
        });
      }
    }

    let baseSlug = property_name.toLowerCase().replace(/ /g, "-");
    let slug = baseSlug;
    let count = 2;

    while (await Property.findOne({ property_slug: slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const lastProperty = await Property.findOne().sort({ _id: -1 }).limit(1);
    const uniqueId = lastProperty ? lastProperty.uniqueId + 1 : 100000;

    let updatedDescription = property_description;
    if (property_description) {
      updatedDescription = await downloadImageAndReplaceSrc(
        property_description,
        uniqueId
      );
    }

    const newProperty = new Property({
      uniqueId,
      userId,
      property_name,
      property_email,
      property_mobile_no: `+${property_mobile_no}`,
      category,
      property_type,
      property_logo: [],
      featured_image: [],
      property_description: updatedDescription,
      property_slug: slug,
    });

    await newProperty.save();
    await addPropertyScore({ property_id: uniqueId, property_score: score });

    return res.status(200).json({ message: "Property added successfully." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await Property.find();
    return res.status(200).json(property);
  } catch (err) {
    return res.send({ error: "Internal Server Error." });
  }
};

export const getPropertyByUniqueId = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const property = await Property.findOne({ uniqueId: uniqueId });
    return res.status(200).json(property);
  } catch (err) {
    return res.send({ error: "Internal Server Error." });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const property = await Property.findOne({ _id: objectId });
    return res.status(200).json(property);
  } catch (err) {
    return res.send({ error: "Internal Server Error." });
  }
};

export const getPropertyBySlug = async (req, res) => {
  try {
    const property_slug = req.params.property_slug;
    const property = await Property.findOne({ property_slug: property_slug });
    return res.status(200).json(property);
  } catch (err) {
    return res.send({ error: "Internal Server Error." });
  }
};
export const updateProperty = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    let score = 0;

    if (!objectId) {
      return res.status(400).json({ error: "Missing objectId." });
    }

    const {
      property_alt_mobile_no,
      property_description,
      est_year,
      category,
      status,
      property_type,
      property_website,
    } = req.body;

    const existProperty = await Property.findById(objectId);
    if (!existProperty) {
      return res.status(404).json({ error: "Property not found." });
    }

    const formattedAltMobile = property_alt_mobile_no
      ? `+${property_alt_mobile_no}`
      : null;

    // ✅ Validation: Alt phone number must be unique and not match any existing phone number
    if (formattedAltMobile) {
      const phoneConflict = await Property.findOne({
        _id: { $ne: objectId },
        $or: [
          { property_mobile_no: formattedAltMobile },
          { property_alt_mobile_no: formattedAltMobile },
        ],
      });

      if (phoneConflict) {
        return res
          .status(400)
          .json({
            error:
              "Alternate mobile number already exists in another property.",
          });
      }

      // ✅ Validation: Alt phone must not match current property's own primary phone
      if (existProperty.property_mobile_no === formattedAltMobile) {
        return res.status(400).json({
          error:
            "Alternate mobile number cannot be the same as the property's primary mobile number.",
        });
      }
    }

    // 🖼️ Description Image Replacement
    let updatedDescription = property_description;
    if (property_description) {
      updatedDescription = await downloadImageAndReplaceSrc(
        property_description,
        existProperty?.uniqueId
      );
    }

    // 🎯 Score calculation
    if (!existProperty?.property_alt_mobile_no && property_alt_mobile_no)
      score += 1;
    if (!existProperty?.property_website && property_website) score += 1;
    if (!existProperty?.property_description && property_description)
      score += 1;
    if (!existProperty?.category && category) score += 1;
    if (!existProperty?.est_year && est_year) score += 1;
    if (!existProperty?.property_type && property_type) score += 1;

    // 🧱 Prepare update fields
    const updatedFields = {
      property_description: updatedDescription,
      est_year,
      category,
      status,
      property_type,
      property_website,
    };

    if (formattedAltMobile) {
      updatedFields.property_alt_mobile_no = formattedAltMobile;
    }

    // 🧹 Remove undefined/null fields
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] === undefined || updatedFields[key] === null) {
        delete updatedFields[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    // 📝 Update property
    const updatedProperty = await Property.findOneAndUpdate(
      { _id: objectId },
      { $set: updatedFields },
      { new: true }
    );

    // 📊 Update property score
    await addPropertyScore({
      property_id: existProperty?.uniqueId,
      property_score: score,
    });

    return res.json({
      message: "Property updated successfully.",
      result: updatedProperty,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const property = await Property.findById(objectId);

    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    const uniqueId = property.uniqueId;
    const propertyFolder = path.join(__dirname, `../../media/${uniqueId}`);

    await Promise.all([
      Property.findByIdAndDelete(objectId),
      Teachers.deleteMany({ property_id: uniqueId }),
      Gallery.deleteMany({ propertyId: uniqueId }),
      Review.deleteMany({ property_id: uniqueId }),
      PropertyCourse.deleteMany({ property_id: uniqueId }),
      Seo.deleteMany({ property_id: uniqueId }),
      Faqs.deleteMany({ property_id: uniqueId }),
      Certifications.deleteMany({ property_id: uniqueId }),
      BusinessHour.deleteMany({ property_id: uniqueId }),
      Enquiry.deleteMany({ property_id: uniqueId }),
      ArchiveEnquiry.deleteMany({ property_id: uniqueId }),
      Amenities.deleteMany({ propertyId: uniqueId }),
      Location.deleteMany({ property_id: uniqueId }),
      Rank.deleteMany({ property_id: uniqueId }),
      Traffic.deleteMany({ property_id: uniqueId }),
      EnquiryCount.deleteMany({ property_id: uniqueId }),
      PropertyScore.deleteMany({ property_id: uniqueId }),
      SeoScore.deleteMany({ property_id: uniqueId }),
    ]);

    try {
      const folderExists = await fs
        .stat(propertyFolder)
        .then(() => true)
        .catch(() => false);

      if (folderExists) {
        await fs.rm(propertyFolder, { recursive: true, force: true });
      }
    } catch (fsError) {
      console.error("Error while deleting folder:", fsError.message);
    }

    return res.json({
      message: "Property and all associated data deleted successfully.",
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const updatePropertyImages = async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const property = await Property.findById(objectId);
    let score = 0;

    if (!property) {
      return res.status(404).send({ error: "Property not found!" });
    }

    const iconFile = req.files?.["property_logo"]?.[0];
    const featuredFile = req.files?.["featured_image"]?.[0];

    if (property?.property_logo.length === 0 && iconFile) {
      score += 1;
    }
    if (property?.featured_image.length === 0 && featuredFile) {
      score += 1;
    }
    const updates = {};

    if (iconFile) {
      updates.property_logo = [
        iconFile.webpFilename,
        iconFile.originalFilename,
      ];
    }

    if (featuredFile) {
      updates.featured_image = [
        featuredFile.webpFilename,
        featuredFile.originalFilename,
      ];
    }

    if (Object.keys(updates).length > 0) {
      await Property.findByIdAndUpdate(objectId, { $set: updates });
    }

    if (iconFile) {
      await MainImageMover(req, res, property.uniqueId, "property_logo");
    }

    if (featuredFile) {
      await MainImageMover(req, res, property.uniqueId, "featured_image");
    }

    await addPropertyScore({
      property_id: property?.uniqueId,
      property_score: score,
    });

    return res.status(200).send({ message: "Images updated successfully." });
  } catch (err) {
    console.error("Error updating property images:", err);
    return res.status(500).send({ error: "Internal Server Error." });
  }
};
