import { prismaClient } from "../../applications/database.js";

// Get all babies
export const getBabiesService = async () => {
  try {
    return await prismaClient.baby.findMany();
  } catch (error) {
    throw error;
  }
};

// Get baby by patient id
export const getBabyByPatientIdService = async (patientId) => {
  try {
    return await prismaClient.baby.findMany({
      where: {
        patient_id: patientId,
      },
    });
  } catch (error) {
    throw error;
  }
};
