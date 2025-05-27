import { logger } from "../applications/logging.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createPatient,
  getPatient,
  getPatientByHospitalService,
  getPatients,
  showBarcodeTestService,
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

const getAll = async (req, res, next) => {
  try {
    const patients = await getPatients();
    res.status(200).json({ data: patients });
  } catch (error) {
    next(error);
  }
};

// Get patients by hospital
const getPatientsByHospital = async (req, res, next) => {
  const hospital = req.user.hospital_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await getPatientByHospitalService(
      hospital,
      page,
      limit,
      skip,
      query
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

export default { create, get, getAll, getPatientsByHospital, showBarcodeTest };
