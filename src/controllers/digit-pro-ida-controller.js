import {
  createService,
  getAllService,
  getByPatientIdService,
  getByDeviceIdService,
  getByUserIdService,
} from "../services/api/digit-pro-ida-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "Digit pro ida created", data: result });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllService();
    res
      .status(200)
      .json({ message: "Success getting digit pro idas", data: result });
  } catch (error) {
    next(error);
  }
};

const getByPatientId = async (req, res, next) => {
  try {
    const result = await getByPatientIdService(req.params.patient_id);
    res.status(200).json({
      message: `Success getting digit pro idas by patient id : ${req.params.patient_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getByDeviceId = async (req, res, next) => {
  try {
    const result = await getByDeviceIdService(req.params.device_id);
    res.status(200).json({
      message: `Success getting digit pro idas by device id : ${req.params.device_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const result = await getByUserIdService(req.params.user_id);
    res.status(200).json({
      message: `Success getting digit pro idas by device id : ${req.params.user_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, getByPatientId, getByDeviceId, getByUserId };
