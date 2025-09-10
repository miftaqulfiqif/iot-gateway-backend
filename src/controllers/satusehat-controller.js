import { updateSatuSehatService, getSatuSehatService } from "../services/api/satusehat-service.js";

const get = async (req, res, next) => {
    try {
        const result = await getSatuSehatService(req.user.hospital_id);
        res.status(200).json({
            message: "Satus Sehat Service",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

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

export default { get, update };
