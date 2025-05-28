import ProfileProperties from "../ProfileModel/ProfileProperties.js";

export const GetProfileProperties = async (req, res) => {
  try {
    const Properties = await ProfileProperties.find();
    return res.status(200).json(Properties);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
