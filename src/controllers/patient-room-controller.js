import {createRoomService} from "../services/api/room-service.js";

const createRoom = async (req, res, next) => {
    try {
        const result = await createRoomService(req.body);
         res.status(200).json({ message: "Room created", data: result });
     } catch (error) {
        next(error);
     }
}



export default {createRoom};