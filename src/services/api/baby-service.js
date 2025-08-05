import { prismaClient } from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";

// Get all babies
export const getBabiesService = async () => {
  try {
    return await prismaClient.baby.findMany();
  } catch (error) {
    throw error;
  }
};

// Get baby by patient id
export const getBabyByNikService = async (nik) => {
  try {
    return await prismaClient.baby.findMany({
      where: {
        patient: {
          nik: nik
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getBabyByPatientId = async (patientId) => {
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

// Create baby
export const createBabyService = async (baby) => {
  try {
    const {patient_id, ihs_number, multi_birth_integer, name, gender, date_of_birth, place_of_birth} = baby

    // found patient / parrent
    const parent = await prismaClient.patient.findUnique({
      where: {
        id: patient_id,
      },
    })
    if (!parent) {
      throw new ResponseError(401, "Patient not found")
    }

    if (ihs_number) {
      const babyIhsNumberFound = await prismaClient.baby.findUnique({
        where: {
          ihs_number: ihs_number,
        },
      })
      if (babyIhsNumberFound) {
        throw new ResponseError(401, "IHS number already exist")
      }
    }

    const newBaby = await prismaClient.baby.create({
      data: {
        ihs_number: ihs_number,
        patient_id: patient_id,
        multi_birth_integer: multi_birth_integer,
        name: name,
        gender: gender,
        date_of_birth: new Date(date_of_birth),
        place_of_birth: place_of_birth,
      }
    });

    return {
      ...newBaby
    }
  } catch (error) {
    throw error;
  }
};
