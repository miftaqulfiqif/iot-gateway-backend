import {createNewMeasurementActivityService} from "../services/api/measurement-activity-service.js";

const createNewMeasurementActivity = async (req,res,next) => {
    try {
        const result = await createNewMeasurementActivityService(req.user.id, req.body);
        res.status(200).json({ message: "Measurement activity created", data: result });
    } catch (error) {
     next(error);
    }
}

export default  {
    createNewMeasurementActivity,
}