import { prismaClient } from "../../applications/database.js";
import { generateAge } from "../../applications/generator/patient-age.js";

export const createPatient = async (patient) => {
  try {
    // Generate age
    const age = generateAge(patient.date_of_birth);

    // Generated id
    const patientId = await generatePatientId(
      patient.gender === "male" ? "L" : "P",
      generateAge(patient.date_of_birth)
    );

    const patientCreating = await prismaClient.patient.create({
      data: {
        id: patientId,
        ...patient,
        age: age,
      },
    });

    return patientCreating;
  } catch (error) {
    throw error;
  }
};

export const getPatients = async () => {
  try {
    return await prismaClient.patient.findMany();
  } catch (error) {
    throw error;
  }
};

export const getPatient = async (id) => {
  try {
    return await prismaClient.patient.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
};

//Patent ID Generator
const generatePatientId = async (genderCode, age) => {
  const count = await prismaClient.patient.count();
  const numericId = String(count + 1).padStart(13, "0");

  let patientId = `PAT${genderCode}${age}${numericId}`;

  const existing = await prismaClient.patient.findUnique({
    where: { id: patientId },
  });

  // Check if patientId is already exist
  if (existing) {
    while (true) {
      // Generate random number 10 digits
      const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
      patientCode = `PAT${genderCode}${age}${randomNum}`;

      const existingRandom = await prismaClient.patient.findUnique({
        where: { id: patientId },
      });

      if (!existingRandom) break;
    }
  }

  return patientId;
};
