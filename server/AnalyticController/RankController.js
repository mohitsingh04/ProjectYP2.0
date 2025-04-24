import EnquiryCount from "../AnalyticModel/EnquiryCount.js";
import PropertyScore from "../AnalyticModel/PropertyScore.js";
import Rank from "../AnalyticModel/Rank.js";
import SeoScore from "../AnalyticModel/SeoScore.js";
import Traffic from "../AnalyticModel/Traffic.js";
import Property from "../models/Property.js";

export const getAllTimeClicks = async (property_id) => {
  if (!property_id) return 0;

  try {
    const allTrafficDocs = await Traffic.find({ property_id });

    let totalClicks = 0;

    allTrafficDocs.forEach((doc) => {
      doc.daily.forEach((entry) => {
        totalClicks += entry.clicks;
      });
    });

    return totalClicks;
  } catch (error) {
    console.error("Error getting all-time clicks:", error);
    return 0;
  }
};
export const getAllTimeEnquiries = async (property_id) => {
  if (!property_id) return 0;

  try {
    const allTrafficDocs = await EnquiryCount.find({ property_id });

    let totalClicks = 0;

    allTrafficDocs.forEach((doc) => {
      doc.daily.forEach((entry) => {
        totalClicks += entry.enquiries;
      });
    });

    return totalClicks;
  } catch (error) {
    console.error("Error getting all-time clicks:", error);
    return 0;
  }
};
export const CalculateOverAllScore = async ({ property_id }) => {
  try {
    const clicks = await getAllTimeClicks(property_id);
    const enquiries = await getAllTimeEnquiries(property_id);
    const propertyScoreDoc = await PropertyScore.findOne({ property_id });
    const seoScoreDoc = await SeoScore.findOne({ property_id });

    const propertyScore = propertyScoreDoc?.property_score || 0;
    const seoScore = seoScoreDoc?.seo_score || 0;

    const totalScore =
      (Number(propertyScore) +
        Number(seoScore) +
        Number(clicks) +
        Number(enquiries)) /
      4;

    let existingRank = await Rank.findOne({ property_id });

    if (existingRank) {
      await Rank.findOneAndUpdate(
        { property_id: property_id },
        {
          $set: { overallScore: totalScore },
        }
      );
    } else {
      const newRank = new Rank({
        overallScore: totalScore,
        property_id,
      });

      await newRank.save();
    }

    return totalScore;
  } catch (error) {
    console.log("Error in CalculateOverAllScore:", error);
    return 0;
  }
};
export const AssignRankToAllProperties = async (req, res) => {
  try {
    const allProperties = await Property.find();

    for (const property of allProperties) {
      await CalculateOverAllScore({ property_id: property.uniqueId });
    }

    const allRanks = await Rank.find();
    const rankDetails = [];

    for (const rank of allRanks) {
      const property_id = rank.property_id;

      const clicks = await getAllTimeClicks(property_id);
      const enquiries = await getAllTimeEnquiries(property_id);
      const propertyScoreDoc = await PropertyScore.findOne({ property_id });
      const seoScoreDoc = await SeoScore.findOne({ property_id });

      rankDetails.push({
        property_id,
        overallScore: rank.overallScore,
        clicks,
        enquiries,
        property_score: propertyScoreDoc?.property_score || 0,
        seo_score: seoScoreDoc?.seo_score || 0,
        previousRank: rank.rank || null,
      });
    }

    rankDetails.sort((a, b) => {
      if (b.overallScore !== a.overallScore)
        return b.overallScore - a.overallScore;
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      if (b.enquiries !== a.enquiries) return b.enquiries - a.enquiries;
      if (b.property_score !== a.property_score)
        return b.property_score - a.property_score;
      return b.seo_score - a.seo_score;
    });

    for (let i = 0; i < rankDetails.length; i++) {
      const newRank = i + 1;
      const { property_id, previousRank } = rankDetails[i];

      const updateFields = {
        rank: newRank,
      };

      if (previousRank !== newRank) {
        updateFields.lastRank = previousRank;
      }

      await Rank.updateOne({ property_id }, { $set: updateFields });
    }

    res.status(200).json({ message: "Ranks assigned successfully" });
  } catch (error) {
    console.error("Error assigning ranks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRankByPropertyId = async (req, res) => {
  try {
    const { property_id } = req.params;
    if (!property_id) {
      return res.status(400).json({ error: "Property Id is Required" });
    }

    const propertyRank = await Rank.findOne({ property_id: property_id });
    if (!propertyRank) {
      return res
        .status(404)
        .json({ error: "Rank not found for this Property" });
    }

    return res.status(200).json(propertyRank);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllRanks = async (req, res) => {
  try {
    const ranks = await Rank.find().sort({ rank: 1 });
    if (!ranks) {
      return res.status(404).json({ error: "Ranks Not Found" });
    }

    return res.status(200).json(ranks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
