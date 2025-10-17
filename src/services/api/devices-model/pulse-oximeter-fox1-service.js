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
    if (!device && device.device_function !== "pulse_oximeter") {
      throw new ResponseError(401, "Device not found");
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
      const measurement = await tx.measurementHistoriesPulseOximeterFox1.create(
        {
          data: {
            spo2: dataMeasurement.spo2,
            pulse_rate: dataMeasurement.pulse_rate,
            patient_handler: {
              connect: { id: patientHandler.id },
            },
          },
        },
      );

      await tx.lastMeasurementPatient.upsert({
        where: {
          patient_id: patientHandler.patient_id,
        },
        update: {
          spo2: String(dataMeasurement.spo2),
          timestamp_spo2: new Date(),
        },
        create: {
          spo2: String(dataMeasurement.spo2),
          timestamp_spo2: new Date(),
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
          title: "Pengukuran Saturasi Oksigen",
          description: dataMeasurement.description
            ? dataMeasurement.description
            : `Hasil pengukuran : ${dataMeasurement.spo2} %`,
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
          parameter: "Oxigen Saturation",
          value: `${dataMeasurement.spo2} %`,
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
      spo2: result.spo2,
      count_used: deviceUpdate.count_used,
    };
  } catch (error) {
    throw error;
  }
};
