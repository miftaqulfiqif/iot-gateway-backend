import { prismaClient } from "../../applications/database.js";

// create
export const createService = async (user, dataMeasurement) => {
  try {
    console.log(dataMeasurement);
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
