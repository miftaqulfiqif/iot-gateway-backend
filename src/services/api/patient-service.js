import { prismaClient } from "../../applications/database.js";
import { generateAge } from "../../generated/patient-age.js";

export const createPatient = async (patient) => {
  const age = generateAge(patient.date_of_birth);

  const patientCreating = await prismaClient.patient.create({
    data: {
      ...patient,
      age: age,
    },
  });

  return patientCreating;
};

export const getPatients = async () => {
  return await prismaClient.patient.findMany();
};

export const getPatient = async (id) => {
  return await prismaClient.patient.findUnique({
    where: {
      id: id,
    },
  });
};
