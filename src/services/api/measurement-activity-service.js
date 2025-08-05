import {prismaClient} from "../../applications/database.js";

export const createNewMeasurementActivityService = async (userId, body) => {
    try {
        const {device_id, patient_id, title, description} = body;
        let patientHandler = null;

        // Check patient handler
        patientHandler = await prismaClient.patientHandler.findFirst({
            where: {
                user_id: userId,
                patient_id: patient_id,
                device_id: device_id,
            }
        })

        if (!patientHandler) {
            patientHandler = await prismaClient.patientHandler.create({
                data: {
                    user_id: userId,
                    patient_id: patient_id,
                    device_id: device_id,
                }
            })
        }

        return patientHandler;

        return {
            patient_id: patient_id,
            title: title,
            description: description,
            recorded_at: new Date(),
        }

    } catch (error) {
        throw error;
    }
}