import { createService } from "../../services/api/devices-model/mtr-baby-002-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "MTR Baby 002 created", data: result });
  } catch (error) {
    next(error);
  }
};

export default { create };
