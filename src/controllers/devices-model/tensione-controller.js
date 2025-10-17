import { createService } from "../../services/api/devices-model/tensione-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res
      .status(200)
      .json({ message: "Pulse Oximeter FOX 1 created", data: result });
  } catch (error) {
    next(error);
  }
};

export default { create };
