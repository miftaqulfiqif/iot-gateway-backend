import {prismaClient} from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";

export const createRoomService = async (body) => {
    try {
        const {name, number, type, capacity} = body;

        const room = await prismaClient.room.create({
            data: {
                name: name,
                number: number,
                type: type,
                capacity: capacity,
            }
        })

        return room;
    } catch (error) {
        throw error;
    }
}

export const createBedService = async (body) => {
    try {
        const {room_id, bed_number, type} = body;

        const bedFound = await prismaClient.bed.findFirst({
            where: {
                bed_number: bed_number,
            },
        })
        if (bedFound) {
            throw new ResponseError(401, "Bed number already exist")
        }

        const bed = await prismaClient.bed.create({
            data: {
                room_id: room_id,
                bed_number: bed_number,
                type: type,
                status: "available",
            }
        })

        return bed
    } catch (error) {
        throw error;
    }
}

export const addPatientRoomService = async (body) => {
    try {
        const { patient_id, room_id, bed_id } = body;

        // Check if patient is already assigned to a room
        const patientHasRoom = await prismaClient.patientRoom.findUnique({
            where: { patient_id }
        });

        if (patientHasRoom) {
            throw new ResponseError(401, "Patient is already assigned to a room");
        }

        // Check if bed is already assigned to a room
        const bedIsTaken = await prismaClient.patientRoom.findUnique({
            where: { bed_id }
        });

        if (bedIsTaken) {
            throw new ResponseError(401, "Bed is already assigned");
        }

        // Save patient room + log activity
        const patientRoom = await prismaClient.$transaction(async (tx) => {
            const createdRoom = await tx.patientRoom.create({
                data: {
                    patient_id,
                    room_id,
                    bed_id,
                    assigned_at: new Date(),
                },
            });

            await tx.activityRoomLog.create({
                data: {
                    patient_room_id: createdRoom.id,
                    activity: "check-in",
                },
            });

            return createdRoom;
        });

        return { patientRoom };
    } catch (error) {
        throw error;
    }
};
