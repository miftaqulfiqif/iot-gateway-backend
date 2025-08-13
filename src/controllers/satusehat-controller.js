import { updateSatuSehatService } from "../services/api/satusehat-service.js";

const update = async (req, res, next) => {
  try {
    const result = await updateSatuSehatService(req.user.hospital_id, req.body);
    res.status(200).json({
      message: "Satu sehat updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { update };
