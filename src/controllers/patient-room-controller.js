import {createRoomService, createBedService, addPatientRoomService } from "../services/api/patient-room-service.js";

const createRoom = async (req, res, next) => {
    try {
        const result = await createRoomService(req.body);
         res.status(200).json({ message: "Room created", data: result });
     } catch (error) {
        next(error);
     }
}

const createBed = async (req, res, next) => {
    try {
        const result = await createBedService(req.body);
        res.status(200).json({ message: "Bed created", data: result });
    } catch (error) {
        next(error);
    }
}

const addPatientRoom = async (req, res, next) => {
    try {
        const result = await addPatientRoomService(req.body);
        res.status(200).json({ message: "Patient room added", data: result });
    } catch (error) {
        next(error);
    }
}
export default {createRoom, createBed, addPatientRoom};