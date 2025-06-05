import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

// Create measurement history
export const createMeasurementHistoryService = async (
  user,
  dataMeasurement
) => {
  try {
    let patientHandler = null;

    // Check patient handler
    patientHandler = await prismaClient.patientHandler.findFirst({
      where: {
        hospital_id: user.hospital_id,
        user_id: user.id,
        patient_id: dataMeasurement.patient_id,
      },
    });

    // Check if patient handler exist
    if (!patientHandler) {
      //Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          hospital_id: user.hospital_id,
          patient_id: dataMeasurement.patient_id,
        },
      });
    }

    //Create history
    return await prismaClient.measurementHistories.create({
      data: {
        patient_handler_id: patientHandler.id,
        device_id: dataMeasurement.device_id,
        device: dataMeasurement.device,
        data: dataMeasurement.data,
      },
    });

    // return measurementHistory;
  } catch (error) {
    throw error;
  }
};

// Get measurement history
export const getMeasurementHistoryService = async (hospitalId) => {
  try {
    return await prismaClient.measurementHistories.findMany({
      where: {
        patient_handler: {
          hospital_id: hospitalId,
        },
      },
      select: {
        id: true,
        device: true,
        data: true,
        patient_handler: {
          select: {
            patient: {
              select: {
                id: true,
                name: true,
                gender: true,
                phone: true,
                work: true,
                last_education: true,
                place_of_birth: true,
                date_of_birth: true,
                age: true,
                weight: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

// Get measurement history by id
export const getMeasurementHistoryByIdService = async (patientId) => {
  try {
    // Check if patient id exist
    const patientCount = await prismaClient.patient.count({
      where: {
        id: patientId,
      },
    });
    if (patientCount === 0) {
      throw new ResponseError(404, "Patient not found");
    }

    // Get measurement history by patient id
    return await prismaClient.measurementHistories.findMany({
      where: {
        patient_handler: {
          patient_id: patientId,
        },
      },
      select: {
        device: true,
        timestamp: true,
        data: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
};

// Get measurement history by user
export const getMeasurementHistoryByUserService = async (userId) => {
  try {
    // Get measurement history by user
    return await prismaClient.measurementHistories.findMany({
      where: {
        patient_handler: {
          user_id: userId,
        },
      },
      select: {
        device: true,
        timestamp: true,
        data: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
};

// get measurement histories by device
export const getMeasurementHistoriesByDeviceService = async (device) => {
  try {
    return await prismaClient.measurementHistories.findMany({
      where: {
        device: device,
      },
    });
  } catch (error) {
    throw error;
  }
};
