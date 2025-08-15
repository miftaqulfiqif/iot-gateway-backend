import {
  createService,
  getAllService,
  getByPatientIdService,
  getByDeviceIdService,
  getByUserIdService,
} from "../../services/api/devices-model/digit-pro-baby-service.js";
const create = async (req, res, next) => {
  try {
    const result = await createService(req.user, req.body);
    res.status(200).json({ message: "Digit pro baby created", data: result });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";
  const patient_id = req.query.patient_id || null;

  try {
    const result = await getAllService(query, page, limit, skip, patient_id);
    res.status(200).json({
      message: "Success getting digit pro babies ",
      patient_id: patient_id,
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByPatientId = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";
  const patientId = req.params.patient_id;

  try {
    if (!patientId) {
      return res.status(400).json({ message: "Patient id is required" });
    }

    const result = await getByPatientIdService(
      query,
      page,
      limit,
      skip,
      patientId
    );
    res.status(200).json({
      message: "Success getting digit pro babies by patient id",
      patient_id: patientId,
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};
const getByDevice = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";
  const macAddress = req.params.mac_address || null;

  try {
    if (macAddress === null) {
      return res.status(400).json({ message: "Mac address is required" });
    }

    const result = await getByDeviceIdService(
      query,
      page,
      limit,
      skip,
      macAddress
    );
    res.status(200).json({
      message: "Success getting digit pro babies by Device",
      device_id: macAddress,
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";
  const userId = req.params.user_id || null;

  try {
    if (userId === null) {
      return res.status(400).json({ message: "User id is required" });
    }

    const result = await getByUserIdService(query, page, limit, skip, userId);
    res.status(200).json({
      message: `Success getting digit pro babies by user id : ${userId}`,
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, getByPatientId, getByDevice, getByUserId };
