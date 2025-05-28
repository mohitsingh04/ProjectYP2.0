import bodyParser from "body-parser";
import express from "express";
import {
  changeProfilePassword,
  DeleteAccountConfirm,
  getProfileEmailVerification,
  getProfileResetToken,
  getProfileToken,
  ProfileAccountDeletionOtp,
  profileDetails,
  profileForgotPassword,
  profileLogin,
  profileLogout,
  profilePostResetToken,
  profileRegister,
  verifyProfileEmail,
} from "../ProfileController/ProfileController.js";
import {
  confirmSwitchProfessional,
  DeleteProfileAvatar,
  DeleteProfileBanner,
  GetAllProfileUser,
  ProfileAvatarChange,
  ProfileBannerChange,
  SwitchProfessionalMail,
  UpdateProfileUser,
} from "../ProfileController/ProfileUserController.js";
import { addProfileLocation } from "../ProfileController/ProfileLocationController.js";
import {
  processImage,
  ProfileResuemUploadMulter,
  upload,
} from "../multer/index.js";
import {
  addProfileBio,
  getProfileBioByUserId,
} from "../ProfileController/ProfileBioController.js";
import {
  GetProfileResumeByUserId,
  SaveProfileResume,
} from "../ProfileController/ProfileDocController.js";
import {
  AddProfileSkill,
  GetSkillList,
  GetSkillsByUserId,
  RemoveProfileSkill,
} from "../ProfileController/ProfileSkillController.js";
import {
  AddProfileLanguage,
  GetLanguageByUserId,
  GetLanguagesList,
  RemoveProfileLanguage,
} from "../ProfileController/ProfileLanguagesController.js";
import {
  AddAndUpdateProfileExperience,
  DeleteExperienceById,
  GetExperienceByUserId,
} from "../ProfileController/ProfileExperienceController.js";
import { GetProfileProperties } from "../ProfileController/ProfilePropertiesController.js";
import {
  AddAndUpdateProfileEducation,
  DeleteEducationById,
  GetAllProfieDegree,
  GetAllProfieInstitute,
  GetEducationByUserId,
} from "../ProfileController/ProfileEducationController.js";

const profileRoutes = express.Router();
profileRoutes.use(bodyParser.json());
profileRoutes.use(bodyParser.urlencoded({ extended: true }));

profileRoutes.post(`/profile/register`, profileRegister);
profileRoutes.post(`/profile/login`, profileLogin);
profileRoutes.get(`/profile/verify-email/:token`, getProfileEmailVerification);
profileRoutes.post(`/profile/verify-email/:email`, verifyProfileEmail);
profileRoutes.get(`/profile/detail`, profileDetails);
profileRoutes.get(`/profile/logout`, profileLogout);
profileRoutes.get(`/profile/token`, getProfileToken);
profileRoutes.post(`/profile/forgot-password`, profileForgotPassword);
profileRoutes.get("/profile/reset/:token", getProfileResetToken);
profileRoutes.post("/profile/reset", profilePostResetToken);
profileRoutes.post("/profile/change-password", changeProfilePassword);
profileRoutes.post(
  "/profile/delete/account/:uniqueId",
  ProfileAccountDeletionOtp
);
profileRoutes.get(
  `/profile/delete/account/:uniqueId/:token`,
  DeleteAccountConfirm
);

const avatarUpload = upload.fields([{ name: "avatar", maxCount: 1 }]);
profileRoutes.get(`/profile/users`, GetAllProfileUser);
profileRoutes.patch(`/profile/user/:objectId`, UpdateProfileUser);
profileRoutes.patch(
  `/profile/user/avatar/:userId`,
  avatarUpload,
  processImage,
  ProfileAvatarChange
);
profileRoutes.delete(`/profile/user/avatar/:userId`, DeleteProfileAvatar);
profileRoutes.post(`/profile/user/switch/:userId`, SwitchProfessionalMail);
profileRoutes.get(
  `/profile/user/switch/professional/:token`,
  confirmSwitchProfessional
);

profileRoutes.patch(`/profile/location`, addProfileLocation);

const bannerUpload = upload.fields([{ name: "banner", maxCount: 1 }]);
profileRoutes.patch(
  "/profile/professional/banner/:userId",
  bannerUpload,
  processImage,
  ProfileBannerChange
);
profileRoutes.delete(
  `/profile/professional/banner/:userId`,
  DeleteProfileBanner
);

profileRoutes.patch(`/profile/bio`, addProfileBio);
profileRoutes.get(`/profile/bio/:userId`, getProfileBioByUserId);

const resumeUpload = ProfileResuemUploadMulter.fields([
  { name: "resume", maxCount: 1 },
]);
profileRoutes.post("/profile/doc/resume", resumeUpload, SaveProfileResume);
profileRoutes.get("/profile/doc/resume/:userId", GetProfileResumeByUserId);

profileRoutes.patch(`/profile/skill`, AddProfileSkill);
profileRoutes.patch(`/profile/skill/remove/:uniqueId`, RemoveProfileSkill);
profileRoutes.get(`/profile/skill/:userId`, GetSkillsByUserId);
profileRoutes.get(`/profile/skill/all/list`, GetSkillList);

profileRoutes.patch(`/profile/language`, AddProfileLanguage);
profileRoutes.patch(
  `/profile/language/remove/:uniqueId`,
  RemoveProfileLanguage
);
profileRoutes.get(`/profile/language/:userId`, GetLanguageByUserId);
profileRoutes.get(`/profile/language/all/list`, GetLanguagesList);

profileRoutes.post(`/profile/experience`, AddAndUpdateProfileExperience);
profileRoutes.get(`/profile/experience/:userId`, GetExperienceByUserId);
profileRoutes.delete(`/profile/experience/:uniqueId`, DeleteExperienceById);

profileRoutes.get(`/profile/properties`, GetProfileProperties);

profileRoutes.post(`/profile/education`, AddAndUpdateProfileEducation);
profileRoutes.get(`/profile/education/:userId`, GetEducationByUserId);
profileRoutes.delete(`/profile/education/:uniqueId`, DeleteEducationById);

profileRoutes.get(`/profile/degree`, GetAllProfieDegree);
profileRoutes.get(`/profile/institute`, GetAllProfieInstitute);

export default profileRoutes;
