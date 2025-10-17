import {
  createService,
  getAllMeasurementService,
  getMeasurementsByPatientIDService,
  getMeasurementsService,
} from "../services/api/histories-measurement-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.body);
    res.status(200).json({
      message: "Measurement created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await getMeasurementsService(page, limit, skip, query);
    res.status(200).json({
      current_page: page,
      total_items: result.total ?? 0,
      total_pages: Math.ceil(result.total / limit) || 1,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByPatientID = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";
  const patientID = req.query.patient_id;

  try {
    if (!patientID) {
      res.status(404).json({
        message: "No patient ID",
      });
    }

    const result = await getMeasurementsByPatientIDService(
      page,
      limit,
      skip,
      query,
      patientID,
    );
    res.status(200).json({
      current_page: page,
      total_items: result.total ?? 0,
      total_pages: Math.ceil(result.total / limit) || 1,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  getByPatientID,
};
