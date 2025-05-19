import ApplyHiring from "../models/ApplyHiring.js";
import { SaveResume } from "./UserDocController.js";

export const applyForHiring = async (req, res) => {
  try {
    const { userId, hiringId } = req.body;

    const resume = req.files?.resume;

    const isApplied = await ApplyHiring.findOne({ userId, hiringId });
    if (isApplied) {
      return res
        .status(400)
        .json({ error: "You are already applied for this job" });
    }

    const lastDoc = await ApplyHiring.findOne().sort({ uniqueId: -1 });
    const uniqueId = lastDoc ? lastDoc?.uniqueId + 1 : 1;

    const newApplication = ApplyHiring({ uniqueId, userId, hiringId });

    await newApplication.save();
    if (resume) {
      await SaveResume(req, res);
    }

    return res.status(200).json({ message: "Your Application is Submitted" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getApplyHiringByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await ApplyHiring.find({ userId: userId });
    if (!applications) {
      return res
        .status(404)
        .json({ error: "There Are Not Applications for this User" });
    }

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
