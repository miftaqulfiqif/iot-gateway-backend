import {
  createService,
  getAllService,
} from "../services/api/digit-pro-baby-service.js";
const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "Digit pro baby created", data: result });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllService();
    res.status(200).json({
      message: "Success getting digit pro babies",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll };
