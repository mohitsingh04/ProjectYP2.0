import ProfileSkills from "../ProfileModel/ProfileSkills.js";
import ProfileSkillList from "../ProfileModel/ProfileSkillList.js";

export const AddProfileSkill = async (req, res) => {
  try {
    const { userId, skill, skillId } = req.body;

    if (!userId || (!skill && !skillId)) {
      return res
        .status(400)
        .json({ error: "userId and either skill or skillId is required." });
    }

    let finalSkillId;

    if (skillId) {
      finalSkillId = skillId;
    } else if (skill) {
      const skillLower = skill.toLowerCase();

      // Check if skill exists in master list
      let existingSkill = await ProfileSkillList.findOne({ skill: skillLower });

      if (!existingSkill) {
        const lastSkill = await ProfileSkillList.findOne().sort({
          uniqueId: -1,
        });
        const newSkillId = lastSkill?.uniqueId ? lastSkill.uniqueId + 1 : 1;

        const newSkill = new ProfileSkillList({
          uniqueId: newSkillId,
          skill: skillLower,
        });

        await newSkill.save();
        finalSkillId = newSkillId;
      } else {
        finalSkillId = existingSkill.uniqueId;
      }
    }

    if (!finalSkillId) {
      return res.status(400).json({ error: "Could not resolve skill ID." });
    }

    // Get or create profile skills entry
    const lastProfileSkills = await ProfileSkills.findOne().sort({
      uniqueId: -1,
    });
    const newProfileUniqueId = lastProfileSkills?.uniqueId
      ? lastProfileSkills.uniqueId + 1
      : 1;

    const updatedDoc = await ProfileSkills.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          uniqueId: newProfileUniqueId,
        },
        $addToSet: {
          skills: finalSkillId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({ message: "Skill added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const RemoveProfileSkill = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { skill } = req.body;

    if (!uniqueId || !skill) {
      return res
        .status(400)
        .json({ error: "uniqueId and skill are required." });
    }

    const isExisting = await ProfileSkills.findOne({ uniqueId });
    if (!isExisting.skills.some((item) => item === skill)) {
      return res.status(404).json({ error: "Skill Not Found" });
    }

    const updatedDoc = await ProfileSkills.findOneAndUpdate(
      { uniqueId: parseInt(uniqueId) },
      {
        $pull: { skills: skill },
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "Profile not found." });
    }

    return res.status(200).json({ message: "Skill removed successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetSkillsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const skills = await ProfileSkills.findOne({ userId });
    if (!skills) {
      return res.status(404).json({ error: "Skills Not Found" });
    }

    return res.status(200).json(skills);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const GetSkillList = async (req, res) => {
  try {
    const allSkill = await ProfileSkillList.find();

    if (allSkill.length === 0) {
      return res.status(404).json({ error: "No Skill Found" });
    }

    return res.status(200).json(allSkill);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
