import ApplyHiring from "../models/ApplyHiring.js";

export const applyForHiring = async (req, res) => {
  try {
    const { userId, hiringId } = req.body;

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

    return res.status(200).json({ message: "Your Application is Submitted" });
  } catch (error) {
    console.log(error);
  }
};
