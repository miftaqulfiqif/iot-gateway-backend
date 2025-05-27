import {
  createMeasurementHistoryService,
  getMeasurementHistoriesByDeviceService,
  getMeasurementHistoryByIdService,
  getMeasurementHistoryByUserService,
  getMeasurementHistoryService,
} from "../services/api/measurement-histories-service.js";

// Create measurement history
const createMeasurementHistory = async (req, res, next) => {
  try {
    const result = await createMeasurementHistoryService(req.user, req.body);
    res
      .status(200)
      .json({ message: "Measurement history created", data: result });
  } catch (error) {
    next(error);
  }
};

// Get measurement histories
const getMeasurementHistories = async (req, res, next) => {
  try {
    const result = await getMeasurementHistoryService(req.user.hospital_id);
    res.status(200).json({ message: "Measurement histories", data: result });
  } catch (error) {
    next(error);
  }
};

// Get measurement history by patient id
const getMeasurementHistoryByPatientId = async (req, res, next) => {
  try {
    const result = await getMeasurementHistoryByIdService(req.params.id);
    res.status(200).json({
      message: `Measurement history by patient id : ${req.params.id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// Get measurement history by user id
const getMeasurementHistoryByUser = async (req, res, next) => {
  try {
    const result = await getMeasurementHistoryByUserService(req.user.id);
    res.status(200).json({
      message: `Measurement history by user id : ${req.user.id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get measurement history by device
const getMeasurementHistoryByDevice = async (req, res, next) => {
  try {
    const result = await getMeasurementHistoriesByDeviceService(
      req.params.device
    );
    res
      .status(200)
      .json({ message: "Measurement history by device", data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  createMeasurementHistory, // Create measurement history
  getMeasurementHistories, // Get measurement histories
  getMeasurementHistoryByPatientId, // Get measurement history by patient id
  getMeasurementHistoryByDevice, // Get measurement history by device
  getMeasurementHistoryByUser, // Get measurement history by user
};
