import { createService } from "../../services/api/devices-model/thermogun-mft01-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "Thermogun MFT-01 created", data: result });
  } catch (error) {
    next(error);
  }
};

export default { create };
