import ProfileLanguage from "../ProfileModel/ProfileLanguage.js";
import ProfileLanguagesList from "../ProfileModel/ProfileLanguagesList.js";

export const AddProfileLanguage = async (req, res) => {
  try {
    const { userId, language, languageId } = req.body;

    if (!userId || (!language && !languageId)) {
      return res
        .status(400)
        .json({
          error: "userId and either language or languageId is required.",
        });
    }

    let finalLanguageId;

    if (languageId) {
      finalLanguageId = languageId;
    } else if (language) {
      const langLower = language.toLowerCase();

      // Check if language exists in master list
      let existingLanguage = await ProfileLanguagesList.findOne({
        language: langLower,
      });

      if (!existingLanguage) {
        const lastLang = await ProfileLanguagesList.findOne().sort({
          uniqueId: -1,
        });
        const newLangId = lastLang?.uniqueId ? lastLang.uniqueId + 1 : 1;

        const newLanguage = new ProfileLanguagesList({
          uniqueId: newLangId,
          language: langLower,
        });

        await newLanguage.save();
        finalLanguageId = newLangId;
      } else {
        finalLanguageId = existingLanguage.uniqueId;
      }
    }

    if (!finalLanguageId) {
      return res.status(400).json({ error: "Could not resolve language ID." });
    }

    // Get or create profile language entry
    const lastProfileLanguage = await ProfileLanguage.findOne().sort({
      uniqueId: -1,
    });
    const newProfileUniqueId = lastProfileLanguage?.uniqueId
      ? lastProfileLanguage.uniqueId + 1
      : 1;

    const updatedDoc = await ProfileLanguage.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          uniqueId: newProfileUniqueId,
        },
        $addToSet: {
          languages: finalLanguageId,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({ message: "Language added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const RemoveProfileLanguage = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { language } = req.body;

    if (!uniqueId || !language) {
      return res
        .status(400)
        .json({ error: "uniqueId and language are required." });
    }

    const isExisting = await ProfileLanguage.findOne({ uniqueId });
    if (!isExisting) {
      return res.status(404).json({ error: "Profile not found." });
    }

    if (!isExisting.languages.some((item) => item === language)) {
      return res.status(404).json({ error: "Language Not Found" });
    }

    const updatedDoc = await ProfileLanguage.findOneAndUpdate(
      { uniqueId: parseInt(uniqueId) },
      {
        $pull: { languages: language },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Language removed successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetLanguageByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const languages = await ProfileLanguage.findOne({ userId });
    if (!languages) {
      return res.status(404).json({ error: "languages Not Found" });
    }

    return res.status(200).json(languages);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetLanguagesList = async (req, res) => {
  try {
    const allLanguages = await ProfileLanguagesList.find();

    if (!allLanguages) {
      return res.status(404).json({ error: "No Languages Found" });
    }

    return res.status(200).json(allLanguages);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
