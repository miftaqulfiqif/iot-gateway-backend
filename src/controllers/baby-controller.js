import {
  createBabyService,
  getBabiesService,
  getBabyByNikService,
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
  try {
    const result = await getBabyByNikService(req.query.nik);
    res.status(200).json({ message: "Success getting babies", data: result });
  } catch (error) {
    next(error);
  }
};

const getByPatientId = async (req, res, next) => {
  try {
    const result = await getBabyByPatientId(req.params.nik);
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
