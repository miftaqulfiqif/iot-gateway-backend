import {
  getBabiesService,
  getBabyByPatientIdService,
} from "../services/api/baby-service.js";

const getAll = async (req, res, next) => {
  try {
    const result = await getBabiesService();
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

const getByPatientId = async (req, res, next) => {
  try {
    const result = await getBabyByPatientIdService(req.params.patient_id);
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getByPatientId };
