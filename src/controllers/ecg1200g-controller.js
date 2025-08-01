import { uploadEcgService } from "../services/api/ecg-service.js";

const uploadEcg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const file = await uploadEcgService(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      file: file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export default { uploadEcg };
