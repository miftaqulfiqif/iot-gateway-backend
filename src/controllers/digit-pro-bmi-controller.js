import {createService, getAllService} from "../services/api/digit-pro-bmi-service.js";

const create = async (req, res, next) => {
    try {
        const result = await createService(req.user, req.body);
        res.status(200).json({ message: "Digit pro bmi created", data: result });
    } catch (error) {
     next(error);
    }
};

const getAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = req.query.query || "";
    const patient_id = req.query.patient_id || null

    try {
       const result = await getAllService(query, page, limit, skip, patient_id);
       res.status(200).json({
           message: "Success getting digit pro bmis",
           patient_id: patient_id,
           current_page: page,
           total_items: result.total,
           total_pages: Math.ceil(result.total / limit),
           data: result.data,
       });
    } catch (error) {
        next(error);
    }
}

export default {create, getAll};