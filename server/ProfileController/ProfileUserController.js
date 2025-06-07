import { ProfileMainImageMover } from "../helper/FolderCleaners/ProfileImageMover.js";
import RegularUser from "../ProfileModel/RegularUser.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendSwitchingEmail } from "../email/profileEmail.js";
import { addProfileScore } from "./ProfileScoreController.js";

dotenv.config();

export const GetAllProfileUser = async (req, res) => {
  try {
    const users = await RegularUser.find();
    if (!users) {
      return res.status(404).json({ error: "Users Not Found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetProfileUserByObjectId = async (req, res) => {
  try {
    const { objectId } = req.params;
    const users = await RegularUser.findOne({ _id: objectId });
    if (!users) {
      return res.status(404).json({ error: "Users Not Found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateProfileUser = async (req, res) => {
  try {
    const { objectId } = req.params;

    if (!objectId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const { username, name, email, mobile_no, alt_mobile_no } = req.body;

    const user = await RegularUser.findById(objectId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isExistingUsername = await RegularUser.findOne({
      username: username,
      _id: { $ne: objectId },
    });
    if (isExistingUsername) {
      return res
        .status(400)
        .json({ error: "Username is Already Exist for another user." });
    }

    const isExistingEmail = await RegularUser.findOne({
      email: email,
      _id: { $ne: objectId },
    });
    if (isExistingEmail) {
      return res
        .status(400)
        .json({ error: "Email is Already Exist for another user." });
    }

    const isExistingContact = await RegularUser.findOne({
      mobile_no: `+${mobile_no}`,
      _id: { $ne: objectId },
    });
    if (isExistingContact) {
      return res
        .status(400)
        .json({ error: "Mobile No. is Already Exist for another user." });
    }

    if (alt_mobile_no) {
      if (`+${alt_mobile_no}` === user.mobile_no) {
        return res
          .status(400)
          .json({ error: "Mobile No. and Alt Mobile No. Can Not be Same" });
      }

      const isExistingAltContact = await RegularUser.findOne({
        _id: { $ne: objectId },
        $or: [
          { mobile_no: `+${alt_mobile_no}` },
          { alt_mobile_no: `+${alt_mobile_no}` },
        ],
      });

      if (isExistingAltContact) {
        return res
          .status(400)
          .json({ error: "Alternate mobile number is already in use." });
      }
    }

    // Normalize phone numbers
    let updatedMobileNo = mobile_no || user.mobile_no;
    if (mobile_no && !mobile_no.startsWith("+")) {
      updatedMobileNo = `+${mobile_no}`;
    }

    let updatedAltMobileNo = alt_mobile_no || user.alt_mobile_no;
    if (alt_mobile_no && !alt_mobile_no.startsWith("+")) {
      updatedAltMobileNo = `+${alt_mobile_no}`;
    }

    // Check if this is the first time alt_mobile_no is being added
    const isNewAltMobile = !user.alt_mobile_no && alt_mobile_no;

    const updatedFields = {
      username: username || user.username,
      name: name || user.name,
      email: email || user.email,
      mobile_no: updatedMobileNo,
      alt_mobile_no: updatedAltMobileNo,
    };

    await RegularUser.findByIdAndUpdate(objectId, { $set: updatedFields });

    if (isNewAltMobile) {
      await addProfileScore({ userId: user?.uniqueId, score: 2 });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ProfileAvatarChange = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileImage = req.files.avatar?.[0];

    if (!profileImage) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Find the user first to check if avatar exists
    const user = await RegularUser.findOne({ uniqueId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hadAvatarBefore = user.avatar && user.avatar.length > 0;

    const updatedUser = await RegularUser.findOneAndUpdate(
      { uniqueId: userId },
      { avatar: [profileImage.webpFilename, profileImage.originalFilename] },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (profileImage) {
      await ProfileMainImageMover(req, res, updatedUser.uniqueId, "avatar");
    }

    if (!hadAvatarBefore) {
      await addProfileScore({ userId: updatedUser.uniqueId, score: 2 });
    }

    return res
      .status(200)
      .json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ProfileBannerChange = async (req, res) => {
  try {
    const { userId } = req.params;
    const bannerImage = req.files.banner?.[0];

    if (!bannerImage) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Find user to check if banner exists already
    const user = await RegularUser.findOne({ uniqueId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hadBannerBefore = user.banner && user.banner.length > 0;

    const updatedUser = await RegularUser.findOneAndUpdate(
      { uniqueId: userId },
      { banner: [bannerImage.webpFilename, bannerImage.originalFilename] },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (bannerImage) {
      await ProfileMainImageMover(req, res, updatedUser.uniqueId, "banner");
    }

    // Award 2 points only if banner didn't exist before
    if (!hadBannerBefore) {
      await addProfileScore({ userId: updatedUser.uniqueId, score: 2 });
    }

    return res
      .status(200)
      .json({ message: "Profile banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const DeleteProfileAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    // Find user to check if avatar exists before deletion
    const user = await RegularUser.findOne({ uniqueId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hadAvatarBefore = user.avatar && user.avatar.length > 0;

    const updatedUser = await RegularUser.findOneAndUpdate(
      { uniqueId: userId },
      { $unset: { avatar: "" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove 2 points only if avatar existed before
    if (hadAvatarBefore) {
      await addProfileScore({ userId: updatedUser.uniqueId, score: -2 });
    }

    return res
      .status(200)
      .json({ message: "Profile avatar deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteProfileBanner = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    // Find user to check if banner exists before deletion
    const user = await RegularUser.findOne({ uniqueId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hadBannerBefore = user.banner && user.banner.length > 0;

    const updatedUser = await RegularUser.findOneAndUpdate(
      { uniqueId: userId },
      { $unset: { banner: "" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (hadBannerBefore) {
      await addProfileScore({ userId: updatedUser.uniqueId, score: -2 });
    }

    return res
      .status(200)
      .json({ message: "Profile banner deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const SwitchProfessionalMail = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User Id is Required." });
    }

    const isExisting = await RegularUser.findOne({ uniqueId: userId });
    if (!isExisting) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (!isExisting.verified) {
      return res.status(400).json({ error: "Your Are Not Verified" });
    }

    if (isExisting.role === "Professional") {
      return res.status(400).json({ error: "You are Already Professional" });
    }

    const professionalToken = await jwt.sign(
      { userId },
      process.env.JWT_SECRET_VALUE
    );

    const TokenSet = await RegularUser.findOneAndUpdate(
      { uniqueId: userId },
      {
        $set: {
          professionalToken: professionalToken,
          professionalTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
      { new: true }
    );

    if (TokenSet) {
      await sendSwitchingEmail(TokenSet, res);

      return res.status(200).json({ message: "Mail has Been Sent" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const confirmSwitchProfessional = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required." });
    }

    const user = await RegularUser.findOne({ professionalToken: token });

    if (!user) {
      return res.status(400).json({ error: "Invalid token." });
    }

    if (new Date(user.professionalTokenExpiry).getTime() < Date.now()) {
      return res.status(400).json({ error: "Token has been Expired" });
    }

    const switchedUser = await RegularUser.findOneAndUpdate(
      { uniqueId: user.uniqueId },
      {
        $set: { role: "Professional" },
        $unset: { professionalToken: "", professionalTokenExpiry: "" },
      },
      { new: true }
    );

    if (!switchedUser) {
      return res.status(500).json({ error: "Failed to verify email." });
    }

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
