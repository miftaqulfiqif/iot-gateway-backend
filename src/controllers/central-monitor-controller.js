import {
    createPatientMonitoring
} from "../services/api/patient-monitoring-service.js";

const create = async (req, res, next) => {
    try {
        const result = await createPatientMonitoring(req.body);
        res.status(200).json({ message: "Patient monitoring created", data: result });
    } catch (error) {
        next(error);
    }
}

export default {create};