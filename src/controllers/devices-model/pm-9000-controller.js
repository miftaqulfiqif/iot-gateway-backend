import {createService} from "../../services/api/devices-model/pm-9000-service.js";

const create = async (req, res, next) => {
    try {
        const result = await createService(req.user.id, req.body);
        res.status(200).json({ message: "PM 9000 created", data: result });
    } catch (error) {
        next(error);
    }
}

export default {create};