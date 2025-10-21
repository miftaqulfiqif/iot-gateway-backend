import { prismaClient } from "../../../applications/database.js";
import { ResponseError } from "../../../errors/response-error.js";
import axios from "axios";

export const createService = async (user, dataMeasurement) => {
  try {
    const accessTokenSatuSehat = user.hospital.satu_sehat_env.access_token;
    const satuSehatEnv = dataMeasurement.satusehat_env;
    let patientHandler = null;

    const device = await prismaClient.deviceConnected.findFirst({
      where: {
        mac_address: dataMeasurement.device_mac,
      },
    });
    if (!device) {
      throw new ResponseError(401, "Device not found");
    }

    if (device.device_function !== "digitpro_bmi") {
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
      // Create patient handler
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

    // Format FHIR
    const dataFhir = formatObservation(
      satuSehatEnv.encounter_id,
      user.ihs_number,
      satuSehatEnv.patient_ihs_number,
      dataMeasurement.weight,
    );

    // Create History
    const result = await prismaClient.$transaction(async (tx) => {
      // Create measurement history
      const measurement = await tx.measurementHistoriesDigitProBMI.create({
        data: {
          patient_handler_id: patientHandler.id,
          weight: dataMeasurement.weight,
          age: dataMeasurement.age,
          bmi: dataMeasurement.bmi,
          body_fat: dataMeasurement.body_fat,
          muscle_mass: dataMeasurement.muscle_mass,
          water: dataMeasurement.water,
          visceral_fat: dataMeasurement.visceral_fat,
          bone_mass: dataMeasurement.bone_mass,
          metabolism: dataMeasurement.metabolism,
          protein: dataMeasurement.protein,
          obesity: dataMeasurement.obesity,
          body_age: dataMeasurement.body_age,
          lbm: dataMeasurement.lbm,
        },
      });

      await tx.lastMeasurementPatient.upsert({
        where: {
          patient_id: patientHandler.patient_id,
        },
        update: {
          body_weight: String(dataMeasurement.weight),
          body_height: String(dataMeasurement.height),
          timestamp_body_weight: new Date(),
          timestamp_body_height: new Date(),
        },
        create: {
          patient_id: patientHandler.patient_id,
          body_weight: String(dataMeasurement.weight),
          body_height: String(dataMeasurement.height),
          timestamp_body_weight: new Date(),
          timestamp_body_height: new Date(),
        },
      });

      await tx.measurementActivity.create({
        data: {
          patient_handler_id: patientHandler.id,
          title: `Pengukuran BMI`,
          description: dataMeasurement.note
            ? dataMeasurement.note
            : `Hasil pengukuran : ${dataMeasurement.bmi} kg`,
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
          parameter: "BMI",
          value: `${dataMeasurement.bmi}`,
          room: dataMeasurement.room ? dataMeasurement.room : "-",
        },
      });

      // Update device connected
      await tx.deviceConnected.update({
        where: {
          id: device.id,
        },
        data: {
          count_used: { increment: 1 },
        },
      });

      // Send to SATUSEHAT
      if (satuSehatEnv.encounter_id) {
        try {
          await axios.post(
            `https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1/Observation`,
            dataFhir,
            {
              headers: {
                "Content-Type": "application/fhir+json",
                Authorization: `Bearer ${accessTokenSatuSehat}`,
              },
            },
            {
              timeout: 10000,
            },
          );
        } catch (error) {
          // Throw transaction rollback
          console.error(
            "Sent to SatuSehat error:",
            error.response?.data || error.message,
          );
          throw new Error(
            `Sent to SatuSehat error: ${error.response?.data.issue[0].code}`,
          );
        }
      }

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
      weight: result.weight,
      age: result.age,
      bmi: result.bmi,
      body_fat: result.body_fat,
      muscle_mass: result.muscle_mass,
      water: result.water,
      visceral_fat: result.visceral_fat,
      bone_mass: result.bone_mass,
      metabolism: result.metabolism,
      protein: result.protein,
      obesity: result.obesity,
      body_age: result.body_age,
      lbm: result.lbm,
      count_used: deviceUpdate.count_used,
      encounter_id: satuSehatEnv.encounter_id ? satuSehatEnv.encounter_id : "",
      is_satusehat: satuSehatEnv.encounter_id ? true : false,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllService = async (query, page, limit, skip, patient_id) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    if (patient_id) {
      whereCondition.patient_handler = {
        ...(whereCondition.patient_handler || {}),
        patient: {
          ...(whereCondition.patient_handler?.patient || {}),
          id: patient_id,
        },
      };
    }

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
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
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};

export const getByPatientIdService = async (
  query,
  page,
  limit,
  skip,
  patientId,
) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      patient: {
        ...(whereCondition.patient_handler?.patient || {}),
        id: patientId,
      },
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histroies =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
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
          patient_handler: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histroies,
    };
  } catch (error) {
    throw error;
  }
};

export const getByDeviceIdService = async (
  query,
  page,
  limit,
  skip,
  deviceId,
) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            user: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      device_id: deviceId,
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
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
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};

export const getByUserIdService = async (query, page, limit, skip, userId) => {
  try {
    const whereCondition = {};

    if (query) {
      whereCondition.OR = [
        {
          patient_handler: {
            device_connected: {
              name: {
                contains: query,
              },
            },
          },
        },
        {
          patient_handler: {
            patient: {
              name: {
                contains: query,
              },
            },
          },
        },
      ];
    }

    whereCondition.patient_handler = {
      ...(whereCondition.patient_handler || {}),
      user_id: userId,
    };

    const total = await prismaClient.measurementHistoriesDigitProBMI.count({
      where: whereCondition,
    });

    const histories =
      await prismaClient.measurementHistoriesDigitProBMI.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
          recorded_at: "desc",
        },
        select: {
          id: true,
          weight: true,
          age: true,
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
          patient_handler: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                  gender: true,
                  phone: true,
                  place_of_birth: true,
                  date_of_birth: true,
                },
              },
              device_connected: {
                select: {
                  id: true,
                  name: true,
                  mac_address: true,
                },
              },
            },
          },
        },
      });

    return {
      total,
      page,
      limit,
      data: histories,
    };
  } catch (error) {
    throw error;
  }
};

const formatObservation = (encounterId, practitionerId, patientId, weight) => {
  return {
    resourceType: "Observation",
    status: "final",
    category: [
      {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs",
            display: "Vital Signs",
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "29463-7",
          display: "Body weight",
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    encounter: {
      reference: `Encounter/${encounterId}`,
    },
    effectiveDateTime: "2023-06-04T05:55:00+00:00",
    issued: "2023-06-04T05:55:00+00:00",
    performer: [
      {
        reference: `Practitioner/${practitionerId}`,
      },
    ],
    valueQuantity: {
      value: weight,
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg",
    },
  };
};
