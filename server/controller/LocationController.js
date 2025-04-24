import { addPropertyScore } from "../AnalyticController/PropertyScoreController.js";
import Location from "../models/Location.js";

export const addLocation = async (req, res) => {
  try {
    const {
      property_id,
      property_address,
      property_pincode,
      property_country,
      property_state,
      property_city,
    } = req.body;

    if (
      !property_id ||
      !property_address ||
      !property_pincode ||
      !property_country ||
      !property_state ||
      !property_city
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingLocation = await Location.findOne({
      property_id,
      property_address,
      property_pincode,
      property_country,
      property_state,
      property_city,
    });

    if (existingLocation) {
      return res
        .status(400)
        .json({ error: "Location already exists for this property." });
    }

    const newLocation = new Location({
      property_id,
      property_address,
      property_pincode,
      property_country,
      property_state,
      property_city,
    });

    await newLocation.save();

    addPropertyScore({
      property_id: property_id,
      property_score: 10,
    });

    return res.status(201).json({ message: "Location added successfully." });
  } catch (err) {
    console.error("Add location error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const UpdateLocation = async (req, res) => {
  try {
    const { property_id } = req.params;

    if (!property_id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    let PropertyScore = 0;

    const existingLocation = await Location.findOne({
      property_id: property_id,
    });
    if (!existingLocation) {
      return res.status(404).json({ error: "Property Not Found" });
    }

    const {
      property_address,
      property_pincode,
      property_country,
      property_state,
      property_city,
    } = req.body;

    if (
      !property_address &&
      !property_pincode &&
      !property_country &&
      !property_state &&
      !property_city
    ) {
      return res.status(400).json({ error: "No data provided to update" });
    }

    if (property_country) {
    }

    if (!existingLocation?.property_address && property_address) {
      PropertyScore += 2;
    }
    if (!existingLocation?.property_city && property_city) PropertyScore += 2;
    if (!existingLocation?.property_country && property_country)
      PropertyScore += 2;
    if (!existingLocation?.property_pincode && property_pincode)
      PropertyScore += 2;
    if (!existingLocation?.property_state && property_state) PropertyScore += 2;

    const updateData = {};
    const unsetData = {};
    if (property_address) updateData.property_address = property_address;
    if (property_pincode) updateData.property_pincode = property_pincode;
    if (property_country) {
      updateData.property_country = property_country;
      if (existingLocation?.property_state) {
        unsetData.property_state = "";
        PropertyScore -= 2;
      }
      if (existingLocation?.property_city) {
        unsetData.property_city = "";
        PropertyScore -= 2;
      }
    }
    if (property_state) {
      updateData.property_state = property_state;
      if (existingLocation?.property_city) {
        unsetData.property_city = "";
        PropertyScore -= 2;
      }
    }
    if (property_city) updateData.property_city = property_city;

    const updatedLocation = await Location.findOneAndUpdate(
      { property_id },
      { $set: updateData, $unset: unsetData },
      { new: true }
    );

    addPropertyScore({
      property_id: property_id,
      property_score: PropertyScore,
    });

    if (!updatedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      data: updatedLocation,
    });
  } catch (error) {
    console.error("UpdateLocation Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLocation = async (req, res) => {
  try {
    const { property_id } = req.params;

    if (!property_id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const location = await Location.findOne({ property_id });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    return res.status(200).json(location);
  } catch (error) {
    console.error("getLocation Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const location = await Location.find();
    if (!location) {
      return res.status(404).json({ error: "Locations not Found" });
    }

    return res.status(200).json(location);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
