import {
  createPatient,
  getDetailPatientService,
  getPatient,
  getPatientByUserService,
  getPatientsService,
  showBarcodeTestService,
  updatePatientService,
} from "../services/api/patient-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createPatient(req.user, req.body);
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

// Get patients
const getPatients = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await getPatientsService(page, limit, skip, query);

    res.status(200).json({
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      critical_patient: result.critical_patient,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Update
const update = async (req, res, next) => {
  try {
    const result = await updatePatientService(req.params.id, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get patients by user
const getPatientsByUser = async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await getPatientByUserService(
      userId,
      page,
      limit,
      skip,
      query,
    );
    res.status(200).json({
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Show barcode test
const showBarcodeTest = async (req, res, next) => {
  try {
    const result = await showBarcodeTestService(req.params.id);
    res.set("Content-Type", "image/png");
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getDetailPatient = async (req, res, next) => {
  const patientId = req.params.patient_id;

  try {
    const result = await getDetailPatientService(patientId);
    res
      .status(200)
      .json({ message: "Get detail patient successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  update,
  get,
  getPatients,
  getPatientsByUser,
  showBarcodeTest,
  getDetailPatient,
};
