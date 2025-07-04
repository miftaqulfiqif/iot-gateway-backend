import {prismaClient} from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";

export const createService = async (user, dataMeasurement) => {

    try {
        let patientHandler = null

        const device = await prismaClient.deviceConnected.findFirst(({
            where: {
                id: dataMeasurement.device_id
            }
        }))
        if (!device) {
            throw new ResponseError(401, "Device not found")
        }

        // Check patient handler
        patientHandler = await prismaClient.patientHandler.findFirst({
            where: {
                hospital_id: user.hospital_id,
                user_id: user.id,
                patient_id: dataMeasurement.patient_id
            }
        })

        // Check if patient handler exist
        if (!patientHandler){
            // Create patient handler
            patientHandler = await prismaClient.patientHandler.create({
                data :{
                    user_id: user.id,
                    hospital_id: user.hospital_id,
                    patient_id: dataMeasurement.patient_id
                }
            })
        }

        const deviceName = await prismaClient.deviceConnected.findFirst({
            where: {
                id: dataMeasurement.device_id
            },
            select: {
                name: true
            }
        })

        return await prismaClient.measurementHistoriesDigitProBMI.create({
            data: {
                patient_handler_id: patientHandler.id,
                ...Object.keys(dataMeasurement).reduce((object, key) => {
                    if (key !== "patient_id") {
                        object[key] = dataMeasurement[key]
                    }
                    return object
                }, {}),
                name: deviceName.name,
            }
        });
    } catch (error) {
     throw error;
    }
}

export const getAllService = async (query, page, limit, skip, patient_id) => {
    try {

        const whereCondition = {};

        if (query) {
            whereCondition.OR = [
                {
                    name: {
                        contains: query,
                    }
                },
                {
                    patient_handler: {
                        patient: {
                            name: {
                                contains: query,
                            }
                        }
                    }
                }
            ]
        }

        if (patient_id) {
            whereCondition.patient_handler = {
                ...(whereCondition.patient_handler || {}),
                patient: {
                    ...(whereCondition.patient_handler?.patient || {}),
                    id: patient_id,
                }
            };
        }

        const total = await prismaClient.measurementHistoriesDigitProBMI.count({
            where: whereCondition
        })

        const histories =
            await prismaClient.measurementHistoriesDigitProBMI.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                orderBy: {
                    timestamp: "desc"
                },
                select:{
                    id: true,
                    device_id: true,
                    name: true,
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
                    timestamp: true,
                    patient_handler: {
                        select: {
                            id: true,
                            patient: {
                                select: {
                                    id: true,
                                    name: true,
                                    gender: true,
                                    phone: true,
                                    work: true,
                                    last_education: true,
                                    place_of_birth: true,
                                    date_of_birth: true,
                                    age: true,
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                }
                            },
                        }
                    }
                }
            })

        return {
            total,
            page,
            limit,
            data: histories
        }
    } catch (error) {
        throw error;
    }
}