import {
  createPatientMonitoring,
  getCentralMonitorService,
} from "../services/api/central-monitor-service.js";
import { prismaClient } from "../applications/database.js";

const create = async (req, res, next) => {
  try {
    const result = await createPatientMonitoring(req.user.id, req.body);
    res
      .status(200)
      .json({ message: "Patient monitoring created", data: result });
  } catch (error) {
    next(error);
  }
};

const getCentralMonitors = async (req, res, next) => {
  try {
    const result = await getCentralMonitorService();
    res.status(200).json({
      message: "Getting patient monitoring successfuly",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getCentralMonitors };
