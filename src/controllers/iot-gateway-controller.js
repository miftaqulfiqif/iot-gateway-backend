import {
    createNewIotGatewayDevice,
    getIotGatewaysService
} from "../services/api/iot-gateway-service.js";

const createNewIotGateway = async (req, res, next) => {
    try {
        const result = await createNewIotGatewayDevice(req.user.hospital_id, req.body);
        res.status(200).json({ message: "Success creating iot gateway", data: result });
    } catch (error) {
        next(error);
    }
};

const getIotGateways = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = req.query.query || "";

    try{
     const result = await getIotGatewaysService(page, limit, skip, query);
     res.status(200).json({
         message: "Success getting iot gateways",
         data: result,
     });
    } catch (error) {
        next(error);
    }
}

export default { createNewIotGateway, getIotGateways };