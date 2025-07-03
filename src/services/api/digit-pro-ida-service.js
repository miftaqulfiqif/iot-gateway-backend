import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

// create
export const createService = async (user, dataMeasurement) => {
  try {
    let patientHandler = null;

    // Check if device_id not found
    const device = await prismaClient.deviceConnected.findFirst({
      where: {
        id: dataMeasurement.device_id,
      },
    });
    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

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
      // Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          hospital_id: user.hospital_id,
          patient_id: dataMeasurement.patient_id,
        },
      });
    }

    // Get device name
    const deviceName = await prismaClient.deviceConnected.findFirst({
      where: {
        id: dataMeasurement.device_id,
      },
      select: {
        name: true,
      },
    });

    // Create history
    return await prismaClient.measurementHistoriesDigitProIda.create({
      data: {
        patient_handler_id: patientHandler.id,
        ...Object.keys(dataMeasurement).reduce((object, key) => {
          if (key !== "patient_id") {
            object[key] = dataMeasurement[key];
          }
          return object;
        }, {}),
        name: deviceName.name,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllService = async (query, page, limit, skip) => {
  try {
    const searchCondition = query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {};

    const whereCondition = {
      ...searchCondition,
      patient_handler: {
        is: {
          patient: {},
          
        },
      },
    };

    const total = await prismaClient.measurementHistoriesDigitProIda.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProIda.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          timestamp: "desc", // Optional: urutkan dari terbaru
        },
        select: {
          id: true,
          device_id: true,
          name: true,
          weight_mother: true,
          weight_child: true,
          timestamp: true,
          patient_handler: {
            select: {
              id: true,
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
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      });

    const patientIds = histories
      .map((h) => h.patient_handler?.patient?.id)
      .filter(Boolean);

    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: {
          in: patientIds,
        },
      },
    });

    const dataWithBaby = histories.map((history) => ({
      ...history,
      patient_handler: {
        ...history.patient_handler,
        baby: babies.find(
          (baby) => baby.patient_id === history.patient_handler?.patient?.id
        ),
      },
    }));

    return {
      total,
      page,
      limit,
      data: dataWithBaby,
    };
  } catch (error) {
    throw error;
  }
};

export const getByPatientIdService = async (patientId) => {
  try {
    return await prismaClient.measurementHistoriesDigitProIda.findMany({
      where: {
        patient_handler: {
          patient_id: patientId,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getByUserIdService = async (userId) => {
  try {
    return await prismaClient.measurementHistoriesDigitProIda.findMany({
      where: {
        patient_handler: {
          user_id: userId,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getByDeviceIdService = async (deviceId) => {
  try {
    return await prismaClient.measurementHistoriesDigitProIda.findMany({
      where: {
        device_id: deviceId,
      },
    });
  } catch (error) {
    throw error;
  }
};
