import { createService } from "../services/api/digit-pro-ida-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "Digit pro ida created", data: result });
  } catch (error) {
    next(error);
  }
};

export default { create };
