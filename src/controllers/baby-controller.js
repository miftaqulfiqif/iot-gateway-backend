import {
  createBabyService,
  getBabiesService,
  getBabyByNikService,
  getBabyByPatientIdService,
} from "../services/api/baby-service.js";

// get all babies
const getAll = async (req, res, next) => {
  try {
    const result = await getBabiesService();
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

// get baby by patient id
const getByNikParent = async (req, res, next) => {
  const nikParent = req.params.nik;

  try {
    const result = await getBabyByNikService(nikParent);
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

const getByPatientId = async (req, res, next) => {
  const patientId = req.params.patient_id;

  try {
    const result = await getBabyByPatientIdService(patientId);
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

// Create baby
const create = async (req, res, next) => {
  try {
    const result = await createBabyService(req.body);
    res.status(200).json({ message: "Success creating baby", data: result });
  } catch (error) {
    next(error);
  }
};

export default { getAll, getByNikParent, getByPatientId, create };
