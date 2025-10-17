import { createService } from "../../services/api/devices-model/ptb-digi-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "PTB Digi created", data: result });
  } catch (error) {
    next(error);
  }
};

export default { create };
