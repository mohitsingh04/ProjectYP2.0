import KeyOutComes from "../models/KeyOutcomes.js";

export const CreateKeyOutComeController = async (req, res) => {
  try {
    const { key_outcome } = req.body;

    const existingOutCome = await KeyOutComes.findOne({ key_outcome });

    if (existingOutCome) {
      return res.status(400).json({ error: "Key Outcome already exists." });
    }

    const lastDoc = await KeyOutComes.findOne().sort({ uniqueId: -1 });
    const uniqueId = lastDoc ? lastDoc?.uniqueId + 1 : 1;

    const newKeyOutcome = new KeyOutComes({
      uniqueId,
      key_outcome,
    });

    await newKeyOutcome.save();

    return res
      .status(201)
      .json({ message: "Key Outcome created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllKeyOutComes = async (req, res) => {
  try {
    const outcomes = await KeyOutComes.find();

    if (!outcomes) {
      return res.status(404).json({ error: "Key Outcome Not Found" });
    }

    return res.status(200).json(outcomes);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getKeyOutComeById = async (req, res) => {
  try {
    const { objectId } = req.params;
    const outcomes = await KeyOutComes.findById(objectId);

    if (!outcomes) {
      return res.status(404).json({ error: "Key Outcome Not Found" });
    }

    return res.status(200).json(outcomes);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteKeyOutCome = async (req, res) => {
  try {
    const { objectId } = req.params;
    const outcomes = await KeyOutComes.findById(objectId);

    if (!outcomes) {
      return res.status(404).json({ error: "Key Outcome Not Found" });
    }

    await KeyOutComes.findOneAndDelete({ _id: objectId });

    return res
      .status(200)
      .json({ message: "Key Outcome Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
