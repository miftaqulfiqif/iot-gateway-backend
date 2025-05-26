import {
  createPatient,
  getPatient,
  getPatients,
} from "../services/api/patient-service.js";

const create = async (req, res, next) => {
  try {
    const patient = req.body;
    const result = await createPatient(patient);
    res.status(200).json({ message: "Patient created", data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const patient = await getPatient(id);
    res.status(200).json({ data: patient });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const patients = await getPatients();
    res.status(200).json({ data: patients });
  } catch (error) {
    next(error);
  }
};

export default { create, get, getAll };
