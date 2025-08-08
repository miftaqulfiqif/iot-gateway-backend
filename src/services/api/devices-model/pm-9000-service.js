import {prismaClient} from "../../../applications/database.js";
import {ResponseError} from "../../../errors/response-error.js";

export const createService = async (userId, dataMeasurement) => {
    try {
        return "BELOM FIX"


        let patientHandler = null;

        const device = await prismaClient.deviceConnected.findUnique({
            where: {
                id: dataMeasurement.device_id,
             }
        })
        if (!device) {
            throw new ResponseError(401, "Device not found")
        }

        // Check patient handler
        patientHandler = await prismaClient.patientHandler.findFirst({
            where: {
                user_id: userId,
                patient_id: dataMeasurement.patient_id,
                device_id: dataMeasurement.device_id,
            }
        });

        // Check if patient handler exist
        if (!patientHandler) {
            // Create new patient handler
            patientHandler = await prismaClient.patientHandler.create({
                    data: {
                        user_id: userId,
                        patient_id: dataMeasurement.patient_id,
                        device_id: dataMeasurement.device_id,
                    }
                }
            )
        } else {
            patientHandler = await prismaClient.patientHandler.update({
                where: {
                    id: patientHandler.id
                },
                data: {
                    user_id: userId,
                    patient_id: patientHandler.patient_id,
                    device_id: patientHandler.device_id
                }
            })
        }
    } catch (error) {
        throw error;
    }
}