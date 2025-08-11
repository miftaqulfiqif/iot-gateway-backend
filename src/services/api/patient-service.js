import { prismaClient } from "../../applications/database.js";
import { generateAge } from "../../applications/generator/patient-age.js";
import bwipjs from "bwip-js";
import { ResponseError } from "../../errors/response-error.js";

// Create new patient
export const createPatient = async (user, patient) => {
  try {
    const {
      name,
      gender,
      date_of_birth,
      nik,
      no_kk,
      ihs_number,
      phone,
      place_of_birth,
      address,
    } = patient;
    const {
      use,
      line,
      city,
      postal_code,
      country,
      rt,
      rw,
      province_id,
      regency_id,
      district_id,
      village_id,
    } = address;

    const nikFound = await prismaClient.patient.findUnique({
      where: { nik: nik },
    });
    if (nikFound) {
      throw new ResponseError(400, "NIK already exist");
    }

    if (ihs_number) {
      const patientIhsNumberFound = await prismaClient.patient.findFirst({
        where: { ihs_number: ihs_number },
      });
      if (patientIhsNumberFound) {
        throw new ResponseError(400, "IHS Number already exist");
      }
    }

    // Generate age
    const age = generateAge(date_of_birth);

    // Generated id
    const patientId = await generatePatientId(
      gender === "male" ? "L" : "P",
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
    const newPatient = await prismaClient.patient.create({
      data: {
        id: patientId,
        // age: age,
        barcode_img: barcodeBase64,
        nik: nik,
        no_kk: no_kk,
        ihs_number: ihs_number,
        name: name,
        gender: gender,
        date_of_birth: new Date(date_of_birth),
        phone: phone,
        place_of_birth: place_of_birth,
        address: {
          create: {
            use: use,
            line: line,
            city: city,
            postal_code: postal_code,
            country: country,
            rt: rt,
            rw: rw,
            province_id: province_id,
            regency_id: regency_id,
            district_id: district_id,
            village_id: village_id,
          },
        },
      },
      include: {
        address: true,
      },
    });

    return {
      ...newPatient,
      address: newPatient.address,
    };
  } catch (error) {
    throw error;
  }
};

// Pagination patient by hospital
export const getPatientsService = async (page, limit, skip, query) => {
  try {
    const searchCondition = query
      ? {
          OR: [{ name: { contains: query } }],
        }
      : {};

    const whereConditions = {
      ...searchCondition,
    };

    const total = await prismaClient.patient.count({ where: whereConditions });

    const patient = await prismaClient.patient.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
      include: {
        address: {
          select: {
            use: true,
            line: true,
            city: true,
            postal_code: true,
            country: true,
            rt: true,
            rw: true,
            province: true,
            regency: true,
            district: true,
            village: true,
          },
        },
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

// Get patients by user
export const getPatientByUserService = async (
  userId,
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
          user_id: userId,
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
    next(error);
  }
};

// Update patient
export const updatePatientService = async (patientId, body) => {
  try {
    const patientFound = await prismaClient.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
      },
    });

    if (!patientFound) {
      throw new ResponseError(404, "Patient not found");
    }

    const data = {};

    if (body.name) {
      data.name = body.name;
    }
    if (body.gender) {
      data.gender = body.gender;
    }
    if (body.phone) {
      data.phone = body.phone;
    }
    if (body.place_of_birth) {
      data.place_of_birth = body.place_of_birth;
    }
    if (body.date_of_birth) {
      data.date_of_birth = body.date_of_birth;
    }
    if (body.height) {
      data.height = body.height;
    }

    return prismaClient.patient.update({
      where: {
        id: patientId,
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        place_of_birth: true,
        date_of_birth: true,
        height: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Get all patients
export const getPatients = async () => {
  try {
    return await prismaClient.patient.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
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

export const getDetailPatientService = async (patientId) => {
  try {
    // Get patient
    const patient = await prismaClient.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    // Get Babies
    const babies = await prismaClient.baby.findMany({
      where: {
        patient_id: patientId,
      },
    });

    // Get Recent Doctors
    const recentDoctor = await prismaClient.measurementActivity.findMany({
      where: {
        patient_handler: {
          patient_id: patientId,
        },
      },
      orderBy: {
        recorded_at: "desc",
      },
      select: {
        patient_handler: {
          select: {
            user: {
              select: {
                name: true,
                speciality: true,
                profile_picture: true,
              },
            },
          },
        },
        recorded_at: true,
      },
    });

    // Get Medical Activities
    const medicalActivities = await prismaClient.measurementActivity.findMany({
      where: {
        patient_handler: {
          patient_id: patientId,
        },
      },
      orderBy: {
        recorded_at: "desc",
      },
      select: {
        title: true,
        description: true,
        recorded_at: true,
      },
      take: 10,
    });

    // Filter unique users
    const uniqueUsers = new Map();
    for (const userEntry of recentDoctor) {
      const user = userEntry.patient_handler.user;
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, {
          name: user.name,
          speciality: user.speciality,
          profile_picture: user.profile_picture,
          recorded_at: userEntry.recorded_at,
        });
      }
    }

    return {
      detail: patient,
      babies: babies,
      recent_doctor: Array.from(uniqueUsers.values()).slice(0, 10),
      medical_activities: medicalActivities,
    };
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
