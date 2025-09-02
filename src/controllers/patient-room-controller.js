import {
    createRoomService,
    createBedService,
    addPatientRoomService,
    getPatientRoomService,
    getRoomsService,
    getBedsService,
    getDetailRoomService,
    getRoomByPatientIdService
} from "../services/api/patient-room-service.js";


const createRoom = async (req, res, next) => {
    try {
        const result = await createRoomService(req.body);
         res.status(200).json({ message: "Room created", data: result });
     } catch (error) {
        next(error);
     }
}

const getRoom = async (req, res, next) => {
    try {
        const result = await getRoomsService();
        res.status(200).json({ message: "Getting rooms successfuly", data: result });
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

const getBed = async (req, res, next) => {
    try {
        const result = await getBedsService();
        res.status(200).json({ message: "Getting beds successfuly", data: result });
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

const getPatientRoom = async (req, res, next) => {
    try {
        const result = await getPatientRoomService()
        res.status(200).json({ message: "Getting patient room successfuly", data: result });
    } catch (error) {
        next(error);
    }
}

const getDetailRoom = async (req, res, next) => {
    const roomId = req.params.room_id;
    try {
        const result = await getDetailRoomService(roomId);
        res.status(200).json({
            message: "Detail room",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getRoomByPatientId = async (req, res, next) => {
    const patientId = req.params.patient_id;
    try {
        const result = await getRoomByPatientIdService(patientId);
        res.status(200).json({
            message: "Patient room",
            data: result
        })
    } catch (error) {
        next(error);
    }
}

export default {createRoom, getRoom, createBed, getBed, addPatientRoom, getPatientRoom, getDetailRoom, getRoomByPatientId};