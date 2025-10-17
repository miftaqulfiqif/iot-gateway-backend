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

    const { years, months, total_months } = generateAge(date_of_birth);
    const isBaby = total_months < 58;
    let motherId = null;

    // Generated id
    const patientId = await generatePatientId(isBaby);

    // validation for parent or baby
    if (isBaby) {
      const mother = await prismaClient.patient.findFirst({
        where: { nik: nik },
        select: { id: true },
      });

      motherId = mother.id;
    } else {
      // validation for adult
      if (!nik)
        throw new ResponseError(400, "NIK is required for adult patient");

      const nikFound = await prismaClient.patient.findUnique({
        where: { nik },
      });
      if (nikFound) {
        throw new ResponseError(400, "NIK already exists");
      }
    }

    // ihs number for SATUSEHAT
    if (ihs_number) {
      const patientIhsNumberFound = await prismaClient.patient.findFirst({
        where: { ihs_number: ihs_number },
      });
      if (patientIhsNumberFound) {
        throw new ResponseError(400, "IHS Number already exist");
      }
    }

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
      "base64",
    )}`;

    //Save to database
    const newPatient = await prismaClient.patient.create({
      data: {
        id: patientId,
        barcode_img: barcodeBase64,
        nik: isBaby ? null : nik,
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
        mother: motherId
          ? {
              connect: { id: motherId },
            }
          : undefined,
      },
      include: {
        address: true,
        mother: true,
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
    const countCriticalPatient = await prismaClient.patient.count({
      where: {
        condition: "critical",
      },
    });

    const patients = await prismaClient.patient.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        nik: true,
        no_kk: true,
        ihs_number: true,
        name: true,
        gender: true,
        phone: true,
        place_of_birth: true,
        date_of_birth: true,
        condition: true,
        created_at: true,
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
        patient_room: {
          select: {
            id: true,
            bed: {
              select: {
                id: true,
                bed_number: true,
                type: true,
              },
            },
            room: {
              select: {
                name: true,
                number: true,
                type: true,
              },
            },
          },
        },
        patient_handler: {
          select: {
            measurement_activity: {
              select: {
                recorded_at: true,
              },
              orderBy: {
                recorded_at: "desc",
              },
              take: 1,
            },
          },
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
    });

    // Patients data mapping
    const patientData = patients.map((p) => {
      // Count age
      let age = null;
      if (p.date_of_birth) {
        const dob = new Date(p.date_of_birth);
        const today = new Date();
        age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
      }

      // Get last measurement
      let last_measurement = null;
      if (p.patient_handler.length > 0) {
        const handler = p.patient_handler[0];
        if (handler.measurement_activity.length > 0) {
          last_measurement = handler.measurement_activity[0].recorded_at;
        }
      }

      return {
        ...p,
        age,
        last_measurement,
      };
    });

    return {
      total,
      page,
      limit,
      critical_patient: countCriticalPatient,
      data: patientData,
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
  query,
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

    let patients;

    if (limit === 99) {
      patients = await prismaClient.patient.findMany({
        where: whereConditions,
        skip: skip,
        orderBy: {
          id: "desc",
        },
      });
    } else {
      patients = await prismaClient.patient.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      });
    }

    return {
      total,
      page,
      limit,
      data: patients,
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
      include: {
        address: true,
        patient_handler: true,
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
      include: {
        patient_room: {
          select: {
            room: {
              select: {
                name: true,
                number: true,
                type: true,
              },
            },
          },
        },
      },
    });

    const age = generateAge(patient.date_of_birth);

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
                id: true,
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
        id: true,
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
          id: user.id,
          name: user.name,
          speciality: user.speciality,
          profile_picture: user.profile_picture,
          recorded_at: userEntry.recorded_at,
        });
      }
    }

    const lastMeasurement = await prismaClient.lastMeasurementPatient.findFirst(
      {
        where: {
          patient_id: patientId,
        },
      },
    );

    // Last Body Composition Analysis
    const lastBodyCompositionAnalysis =
      await prismaClient.measurementHistoriesDigitProBMI.findFirst({
        where: {
          patient_handler: {
            patient_id: patientId,
          },
        },
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          bmi: true,
          body_fat: true,
          muscle_mass: true,
          water: true,
          visceral_fat: true,
          bone_mass: true,
          metabolism: true,
          protein: true,
          obesity: true,
          body_age: true,
          lbm: true,
          recorded_at: true,
        },
      });

    // Body Composition Trends
    const bodyCompositionTrends =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: {
          patient_handler: {
            patient_id: patientId,
          },
        },
        orderBy: {
          recorded_at: "asc",
        },
        take: 8,
        select: {
          recorded_at: true,
          body_fat: true,
          muscle_mass: true,
        },
      });

    const bodyFatTrend = bodyCompositionTrends.map((item) => ({
      recorded_at: item.recorded_at,
      value: item.body_fat,
    }));

    const muscleMassTrend = bodyCompositionTrends.map((item) => ({
      recorded_at: item.recorded_at,
      value: item.muscle_mass,
    }));

    return {
      detail: {
        ...patient,
        age,
      },
      last_measurement: lastMeasurement,
      last_body_composition_analysis: {
        ...lastBodyCompositionAnalysis,
        body_fat_trend: bodyFatTrend,
        muscle_mass_trend: muscleMassTrend,
      },
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
      "",
    );
    const imageBuffer = Buffer.from(base64Data, "base64");

    return imageBuffer;
  } catch (error) {
    throw error;
  }
};
//Patent ID Generator

const generatePatientId = async (isBaby) => {
  const count = await prismaClient.patient.count();

  // Get 2 last digit
  const nowYear = new Date().getFullYear().toString().slice(-2);

  // increment patient id padding 5 digit (jadi max 99999 pasien per tahun)
  const numericId = String(count + 1).padStart(5, "0");

  let patientId = isBaby
    ? `B${nowYear}${numericId}`
    : `P${nowYear}${numericId}`;

  const existing = await prismaClient.patient.findUnique({
    where: { id: patientId },
  });

  if (existing) {
    while (true) {
      // Generate random 5 digit
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      patientId = `P${nowYear}${randomNum}`;

      const existingRandom = await prismaClient.patient.findUnique({
        where: { id: patientId },
      });

      if (!existingRandom) break;
    }
  }

  return patientId;
};
