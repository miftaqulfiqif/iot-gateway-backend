import {prismaClient} from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";
import {addPatientRoomService} from "./patient-room-service.js";

export const createPatientMonitoring = async (userId, body) => {
    try {
        const {device_id, patient_id, room_id, bed_id} = body;

        let patientRoom = null;
        let patientHandler = null;
        const dataPatientRoom = { patient_id, room_id, bed_id };

        // Check if patient not found
        const patient = await prismaClient.patient.findUnique({
            where: {
                id: patient_id
            },
        })
        if (!patient) {
            throw new ResponseError(401, "Patient not found")
        }

        // Check if device not found
        const device = await prismaClient.deviceConnected.findUnique({
            where: {
                id: device_id
            }
        })
        if (!device) {
            throw new ResponseError(401, "Device not found")
        }

        // Check patient room
        patientRoom = await prismaClient.patientRoom.findFirst({
            where: {
                ...dataPatientRoom
            }
        })
        if (!patientRoom) {
            try {
                patientRoom = await addPatientRoomService(dataPatientRoom)
            } catch (error) {
                throw error;
            }
        }

        // Check patient handler
        patientHandler = await prismaClient.patientHandler.findFirst({
            where: {
                user_id: userId,
                patient_id: patient.id,
                device_id: device.id
            }
        })

        // Check if patient handler exist
        if (!patientHandler) {
            // Create patient handler
            patientHandler = await prismaClient.patientHandler.create({
                data: {
                    user_id: userId,
                    patient_id: patient.id,
                    device_id: device.id
                }
            })
        } else {
            // Update patient handler
            patientHandler = await prismaClient.patientHandler.update({
                where: {
                    id: patientHandler.id
                },
                data: {
                    user_id: userId,
                    patient_id: patient.id,
                    device_id: device.id
                }
            })
        }

        // Save Measurement Activity
        const measurementActivity = await prismaClient.measurementActivity.create({
            data: {
                patient_handler_id: patientHandler.id,
                title: `Menggunakan ${device.name}`,
                description: body.description
                    ? body.description
                    : `Pasient menggunakan ${device.name} pada tanggal ${new Date().toLocaleDateString()}`,
            }
        })

        // Create history
        const result = await prismaClient.$transaction([
            prismaClient.centralMonitor.create({
                data: {
                    patient_handler_id: patientHandler.id
                }
            }),
            prismaClient.deviceConnected.update({
                where: {
                    id: device.id,
                },
                data: {
                    count_used: {
                        increment: 1,
                    },
                },
            })
        ])

        const historyMeasurement = result[0];

        const deviceUpdate = await prismaClient.deviceConnected.findUnique({
            where: {
                id: device.id,
            },
            select: {
                count_used: true,
            }
        })

        return {
            id: historyMeasurement.id,
            description: measurementActivity.description,
            count_used: deviceUpdate.count_used,
            patient_room : patientRoom,
        };
    } catch (error) {
        throw error;
    }
}

export const getCentralMonitorService = async () => {
    try {
        const centralMonitor = await prismaClient.centralMonitor.findMany()
        return centralMonitor
    } catch (error) {
        throw error;
    }
}