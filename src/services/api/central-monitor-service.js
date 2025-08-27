import {prismaClient} from "../../applications/database.js";

export const createPatientMonitoring = async (body) => {
    try {
        return body;
        const patientMonitoring = await prismaClient.centralMonitor.create({
            data: body,
        })
        return body;
    } catch (error) {
        throw error;
    }
}