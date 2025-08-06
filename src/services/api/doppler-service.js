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
    }

    // Save Measurement Activity
    const measurementActivity = await prismaClient.measurementActivity.create({
      data: {
        patient_handler_id: patientHandler.id,
        title: `Pengukuran Doppler`,
        description: dataMeasurement.description ? dataMeasurement.description : `Hasil pengukuran heart rate : ${dataMeasurement.heart_rate} bpm` ,
      },
      select: {
        id: true,
        title: true,
        description: true,
      }
    })

    // Create history
    const historyMeasurement = await prismaClient.measurementHistoriesDoppler.create({
      data: {
        patient_handler_id: patientHandler.id,
        heart_rate: dataMeasurement.heart_rate,
      },
    });

    return {
      id: historyMeasurement.id,
      heart_rate: historyMeasurement.heart_rate,
      description: measurementActivity.description,
    }
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
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        }
      ];
    }

    if (patient_id) {
      whereCondition.patient_handler = {
        ...(whereCondition.patient_handler || {}),
        patient: {
          ...(whereCondition.patient_handler?.patient || {}),
          id: patient_id,
        }
      };
    }

    const total = await prismaClient.measurementHistoriesDoppler.count({
      where: whereCondition
    })

    const histories =
        await prismaClient.measurementHistoriesDoppler.findMany({
          where: whereCondition,
          skip: skip,
          take: limit,
          orderBy: {
            recorded_at: "desc"
          },
          select:{
            id: true,
            heart_rate: true,
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
                  }
                },
                user: {
                  select: {
                    id: true,
                    username: true,
                  }
                },
                device_connected: {
                  select: {
                    id: true,
                    name: true,
                    mac_address: true,
                  }
                }
              }
            }
          }
        })

    return {
      total,
      page,
      limit,
      data: histories
    }
  } catch (error) {
    throw error;
  }
};

export const getByPatientIdService = async (query, page, limit, skip, patientId) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      patient: {
        ...(whereCondition.patient_handler?.patient || {}),
        id: patientId,
      }
    }

    const total = await prismaClient.measurementHistoriesDoppler.count({
      where: whereCondition
    })

    const histroies = await prismaClient.measurementHistoriesDoppler.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        recorded_at: "desc"
      },
      select:{
        id: true,
        heart_rate: true,
        recorded_at: true,
        patient_handler: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
              }
            },
            device_connected: {
              select: {
                id: true,
                name: true,
                mac_address: true,
              }
            }
          }
        }
      }
    })

    return {
      total,
      page,
      limit,
      data: histroies
    }
  } catch (error) {
    throw error;
  }
};

export const getByDeviceIdService = async (query, page, limit, skip, deviceId) => {
  try {
    const whereCondition = {}

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        }
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      device_id: deviceId
    }

    const total = await prismaClient.measurementHistoriesDoppler.count({
      where: whereCondition
    })

    const histories = await prismaClient.measurementHistoriesDoppler.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        recorded_at: "desc"
      },
      select:{
        id: true,
        heart_rate: true,
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
              }
            },
            user: {
              select: {
                id: true,
                username: true,
              }
            },
          }
        }
      }
    })

    return {
      total,
      page,
      limit,
      data: histories
    }
  } catch (error) {
    throw error;
  }
}

export const getByUserIdService = async (query, page, limit, skip, userId) => {
  try {
    const whereCondition = {}

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query
              }
            }
          }
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query
              }
            }
          }
        }
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      user_id: userId,
    };

    const total = await prismaClient.measurementHistoriesDoppler.count({
      where: whereCondition,
    });

    const histories = await prismaClient.measurementHistoriesDoppler.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: {
        recorded_at: "desc"
      },
      select:{
        id: true,
        heart_rate: true,
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
              }
            },
            device_connected: {
              select: {
                id: true,
                name: true,
                mac_address: true,
              }
            }
          }
        }
      }
    })

    return {
      total,
      page,
      limit,
      data: histories
    }
  } catch (error) {
    throw error;
  }
}