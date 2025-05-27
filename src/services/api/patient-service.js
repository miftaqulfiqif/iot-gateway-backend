import { prismaClient } from "../../applications/database.js";
import { generateAge } from "../../applications/generator/patient-age.js";
import bwipjs from "bwip-js";
import { ResponseError } from "../../errors/response-error.js";

// Create new patient
export const createPatient = async (user, patient) => {
  try {
    // Generate age
    const age = generateAge(patient.date_of_birth);

    // Generated id
    const patientId = await generatePatientId(
      patient.gender === "male" ? "L" : "P",
      age
    );

    // Generate barcode
    const patientBarcode = await bwipjs.toBuffer({
      bcid: "code128",
      text: patientId,
      scale: 3,
      height: 10,
      includetext: false,
    });

    // Convert to base64
    const barcodeBase64 = `data:image/png;base64,${patientBarcode.toString(
      "base64"
    )}`;

    //Save to database
    let newPatient = null;
    await prismaClient.$transaction(async (tx) => {
      // Create patient
      newPatient = await tx.patient.create({
        data: {
          id: patientId,
          age: age,
          barcode_img: barcodeBase64,
          ...patient,
        },
      });

      // Create patient handler
      await tx.patientHandler.create({
        data: {
          user_id: user.id,
          patient_id: newPatient.id,
          hospital_id: user.hospital_id,
        },
      });
    });
    return newPatient;
  } catch (error) {
    throw error;
  }
};

// Pagination patient by hospital
export const getPatientByHospitalService = async (
  hospital,
  page,
  limit,
  skip,
  query
) => {
  try {
    const searchCondition = query
      ? {
          OR: [{ name: { contains: query } }],
        }
      : {};

    const whereConditions = {
      ...searchCondition,
      patient_handle: {
        some: {
          hospital_id: hospital.id,
        },
      },
    };

    const total = await prismaClient.patient.count({ where: whereConditions });

    const patient = await prismaClient.patient.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });

    return {
      total,
      page,
      limit,
      data: patient,
    };
  } catch (error) {
    throw error;
  }
};

// Get all patients
export const getPatients = async () => {
  try {
    return await prismaClient.patient.findMany();
  } catch (error) {
    throw error;
  }
};

// Get single patient
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

// Show barcode to Postman
export const showBarcodeTestService = async (id) => {
  try {
    const patient = await prismaClient.patient.findUnique({
      where: { id },
    });

    if (!patient || !patient.barcode_img) {
      throw new ResponseError(404, "Patient not found");
    }

    // Hapus prefix data URI
    const base64Data = patient.barcode_img.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64Data, "base64");

    return imageBuffer;
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
      patientId = `PAT${genderCode}${age}${randomNum}`;

      // Check if patientId is already exist
      const existingRandom = await prismaClient.patient.findUnique({
        where: { id: patientId },
      });

      if (!existingRandom) break;
    }
  }

  return patientId;
};
