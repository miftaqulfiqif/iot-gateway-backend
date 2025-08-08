import { prismaClient } from "../../../applications/database.js";
import { ResponseError } from "../../../errors/response-error.js";

export const createService = async (user, dataMeasurement) => {
  try {
    let patientHandler = null;

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
        user_id: user.id,
        patient_id: dataMeasurement.patient_id,
        device_id: dataMeasurement.device_id,
      },
    });

    // Check if patient handler exist
    if (!patientHandler) {
      // Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          patient_id: dataMeasurement.patient_id,
          device_id: dataMeasurement.device_id,
        },
      });
    } else {
      await prismaClient.patientHandler.update({
        where: {
          id: patientHandler.id,
        },
        data: {
          user_id: patientHandler.user_id,
          patient_id: patientHandler.patient_id,
          device_id: patientHandler.device_id,
        },
      });
    }

    // Save Measurement Activity
    const measurementActivity = await prismaClient.measurementActivity.create({
      data: {
        patient_handler_id: patientHandler.id,
        title: `Pengukuran BMI`,
        description: dataMeasurement.description
          ? dataMeasurement.description
          : `Hasil pengukuran : ${dataMeasurement.bmi} kg`,
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    // Create History
    const result = await prismaClient.$transaction([
      prismaClient.measurementHistoriesDigitProBMI.create({
        data: {
          patient_handler_id: patientHandler.id,
          weight: dataMeasurement.weight,
          age: dataMeasurement.age,
          bmi: dataMeasurement.bmi,
          body_fat: dataMeasurement.body_fat,
          muscle_mass: dataMeasurement.muscle_mass,
          water: dataMeasurement.water,
          visceral_fat: dataMeasurement.visceral_fat,
          bone_mass: dataMeasurement.bone_mass,
          metabolism: dataMeasurement.metabolism,
          protein: dataMeasurement.protein,
          obesity: dataMeasurement.obesity,
          body_age: dataMeasurement.body_age,
          lbm: dataMeasurement.lbm,
        },
      }),
      prismaClient.deviceConnected.update({
        where: {
          id: device.id,
        },
        data: {
          count_used: {
            increment: 1,
          },
        },
      }),
    ]);

    const historyMeasurement = result[0];

    const deviceUpdate = await prismaClient.deviceConnected.findUnique({
      where: {
        id: device.id,
      },
      select: {
        count_used: true,
      },
    });

    return {
      id: historyMeasurement.id,
      weight: historyMeasurement.weight,
      age: historyMeasurement.age,
      bmi: historyMeasurement.bmi,
      body_fat: historyMeasurement.body_fat,
      muscle_mass: historyMeasurement.muscle_mass,
      water: historyMeasurement.water,
      visceral_fat: historyMeasurement.visceral_fat,
      bone_mass: historyMeasurement.bone_mass,
      metabolism: historyMeasurement.metabolism,
      protein: historyMeasurement.protein,
      obesity: historyMeasurement.obesity,
      body_age: historyMeasurement.body_age,
      lbm: historyMeasurement.lbm,
      description: measurementActivity.description,
      count_used: deviceUpdate.count_used,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllService = async (query, page, limit, skip, patient_id) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    if (patient_id) {
      whereCondition.patient_handler = {
        ...(whereCondition.patient_handler || {}),
        patient: {
          ...(whereCondition.patient_handler?.patient || {}),
          id: patient_id,
        },
      };
    }

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
          bmi: true,
          body_fat: true,
          muscle_mass: true,
          water: true,
          visceral_fat: true,
          bone_mass: true,
          metabolism: true,
          protein: true,
          obesity: true,
          body_age: true,
          lbm: true,
          recorded_at: true,
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};

export const getByPatientIdService = async (
  query,
  page,
  limit,
  skip,
  patientId
) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      patient: {
        ...(whereCondition.patient_handler?.patient || {}),
        id: patientId,
      },
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histroies =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
          bmi: true,
          body_fat: true,
          muscle_mass: true,
          water: true,
          visceral_fat: true,
          bone_mass: true,
          metabolism: true,
          protein: true,
          obesity: true,
          body_age: true,
          lbm: true,
          recorded_at: true,
          patient_handler: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histroies,
    };
  } catch (error) {
    throw error;
  }
};

export const getByDeviceIdService = async (
  query,
  page,
  limit,
  skip,
  deviceId
) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      device_id: deviceId,
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
          bmi: true,
          body_fat: true,
          muscle_mass: true,
          water: true,
          visceral_fat: true,
          bone_mass: true,
          metabolism: true,
          protein: true,
          obesity: true,
          body_age: true,
          lbm: true,
          recorded_at: true,
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
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

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};

export const getByUserIdService = async (query, page, limit, skip, userId) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      user_id: userId,
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
          bmi: true,
          body_fat: true,
          muscle_mass: true,
          water: true,
          visceral_fat: true,
          bone_mass: true,
          metabolism: true,
          protein: true,
          obesity: true,
          body_age: true,
          lbm: true,
          recorded_at: true,
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};
