import { prismaClient } from "../../applications/database.js";
import { ResponseError } from "../../errors/response-error.js";

export const createService = async (user, data) => {
  try {
    const { patient_id, device_id } = data;

    let patientHandler = null;

    // Check if device_id not found
    const device = await prismaClient.deviceConnected.findFirst({
      where: {
        id: device_id,
      },
    });
    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

    // Check patient handler
    patientHandler = await prismaClient.patientHandler.findFirst({
      where: {
        user_id: user.id,
        patient_id: patient_id,
        device_id: device.id,
      },
    });

    // Check if patient handler exist
    if (!patientHandler) {
      //Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          patient_id: patient_id,
          device_id: device.id,
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

    const historiesMeasurement = await prismaClient.historiesMeasurement.create(
      {
        data: {
          patient_handler_id: patientHandler.id,
          parameter: "Baby Weight",
          value: `${data.weight} kg`,
          room: data.room ? data.room : "-",
        },
      },
    );

    return historiesMeasurement;
  } catch (error) {
    throw error;
  }
};

export const getMeasurementsService = async (page, limit, skip, query) => {
  try {
    const searchCondition = query
      ? {
          OR: [
            {
              patient_handler: {
                patient: {
                  name: {
                    contains: query,
                  },
                },
              },
            },
            {
              patient_handler: {
                device_connected: {
                  model: {
                    contains: query,
                  },
                },
              },
            },
          ],
        }
      : {};

    const whereCondition = { ...searchCondition };

    const total = await prismaClient.historiesMeasurement.count({
      where: whereCondition,
    });

    const historiesMeasurement =
      await prismaClient.historiesMeasurement.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          parameter: true,
          room: true,
          value: true,
          recorded_at: true,
          patient_handler: {
            select: {
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
              device_connected: {
                select: {
                  model: true,
                },
              },
            },
          },
        },
      });

    const historiesMeasurementData = historiesMeasurement.map((p) => {
      const patient = p.patient_handler?.patient || {
        id: null,
        name: "Unknown",
      };
      const device = p.patient_handler?.device_connected || {
        model: "Unknown",
      };

      return {
        id: p.id,
        patient_id: patient.id,
        name: patient.name,
        parameter: p.parameter,
        value: p.value,
        room: p.room,
        device: device.model,
        recorded_at: p.recorded_at,
      };
    });
    return {
      total,
      page,
      limit,
      data: historiesMeasurementData,
    };
  } catch (error) {
    throw error;
  }
};

export const getMeasurementsByPatientIDService = async (
  page,
  limit,
  skip,
  query,
  patientId,
) => {
  try {
    const searchCondition = query
      ? {
          OR: [
            {
              patient_handler: {
                patient: {
                  name: {
                    contains: query,
                  },
                },
              },
            },
            {
              patient_handler: {
                device_connected: {
                  model: {
                    contains: query,
                  },
                },
              },
            },
          ],
        }
      : {};

    const whereCondition = {
      ...searchCondition,
      patient_handler: {
        patient_id: patientId,
      },
    };

    const total = await prismaClient.historiesMeasurement.count({
      where: whereCondition,
    });

    const historiesMeasurement =
      await prismaClient.historiesMeasurement.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          parameter: true,
          room: true,
          value: true,
          recorded_at: true,
          patient_handler: {
            select: {
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
              device_connected: {
                select: {
                  model: true,
                },
              },
            },
          },
        },
      });

    const historiesMeasurementData = historiesMeasurement.map((p) => {
      const patient = p.patient_handler?.patient || {
        id: null,
        name: "Unknown",
      };
      const device = p.patient_handler?.device_connected || {
        model: "Unknown",
      };

      return {
        id: p.id,
        patient_id: patient.id,
        name: patient.name,
        parameter: p.parameter,
        value: p.value,
        room: p.room,
        device: device.model,
        recorded_at: p.recorded_at,
      };
    });
    return {
      total,
      page,
      limit,
      data: historiesMeasurementData,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllMeasurementService = async () => {
  try {
    const historiesMeasurement =
      await prismaClient.historiesMeasurement.findMany();
    return historiesMeasurement;
  } catch (error) {
    throw error;
  }
};
