import { prismaClient } from "../../../applications/database.js";
import { ResponseError } from "../../../errors/response-error.js";

export const createService = async (user, dataMeasurement) => {
  try {
    let patientHandler = null;

    // Check if device_id not found
    const device = await prismaClient.deviceConnected.findFirst({
      where: {
        mac_address: dataMeasurement.device_mac,
      },
    });

    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

    if (device.device_function !== "mtr_baby002") {
      throw new ResponseError(401, "Invalid device type");
    }

    // Check patient handler
    patientHandler = await prismaClient.patientHandler.findFirst({
      where: {
        user_id: user.id,
        patient_id: dataMeasurement.patient_id,
        device_id: device.id,
      },
    });

    // Check if patient handler exist
    if (!patientHandler) {
      //Create patient handler
      patientHandler = await prismaClient.patientHandler.create({
        data: {
          user_id: user.id,
          patient_id: dataMeasurement.patient_id,
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

    // Create history
    const result = await prismaClient.$transaction(async (tx) => {
      const measurement = await tx.measurementHistoriesMTRBaby002.create({
        data: {
          baby_height: dataMeasurement.baby_height,
          patient_handler: {
            connect: { id: patientHandler.id },
          },
        },
      });

      await tx.lastMeasurementPatient.upsert({
        where: {
          patient_id: patientHandler.patient_id,
        },
        update: {
          body_height: String(dataMeasurement.baby_height),
          timestamp_body_height: new Date(),
        },
        create: {
          body_height: String(dataMeasurement.baby_height),
          timestamp_body_height: new Date(),
          patient: {
            connect: {
              id: patientHandler.patient_id,
            },
          },
        },
      });

      await tx.measurementActivity.create({
        data: {
          patient_handler_id: patientHandler.id,
          title: "Pengukuran Tinggi Badan Bayi",
          description: dataMeasurement.description
            ? dataMeasurement.description
            : `Hasil pengukuran : ${dataMeasurement.baby_height} cm`,
        },
        select: {
          id: true,
          title: true,
          description: true,
        },
      });

      await tx.historiesMeasurement.create({
        data: {
          patient_handler_id: patientHandler.id,
          parameter: "Body Height",
          value: `${dataMeasurement.baby_height} cm`,
          room: dataMeasurement.room ? dataMeasurement.room : "-",
        },
      });

      await tx.deviceConnected.update({
        where: {
          id: device.id,
        },
        data: {
          count_used: {
            increment: 1,
          },
        },
      });

      return measurement;
    });

    const deviceUpdate = await prismaClient.deviceConnected.findUnique({
      where: {
        id: device.id,
      },
      select: {
        count_used: true,
      },
    });

    return {
      baby_height: result.baby_height,
      count_used: deviceUpdate.count_used,
    };
  } catch (error) {
    throw error;
  }
};
