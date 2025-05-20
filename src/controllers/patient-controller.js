import { createPatient } from "../services/api/patient-service.js";

const create = async (req, res, next) => {
  try {
    const patient = req.body;
    const patientCreating = await createPatient(patient);
    res.status(200).json({ message: "Patient created", data: patientCreating });
  } catch (error) {
    next(error);
  }
};

export default { create };
