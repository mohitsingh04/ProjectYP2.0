import ProfileLocation from "../ProfileModel/ProfileLocation.js";

export const addProfileLocation = async (req, res) => {
  try {
    const { userId, address, pincode, city, state, country } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const updatedLocation = await ProfileLocation.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          address,
          pincode,
          city,
          state,
          country,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      message: "Profile location saved successfully.",
      data: updatedLocation,
    });
  } catch (error) {
    console.error("Error saving profile location:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
