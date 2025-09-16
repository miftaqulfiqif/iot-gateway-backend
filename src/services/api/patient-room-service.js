import {prismaClient} from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";
import * as trace_events from "node:trace_events";
import {removeUnnecessaryItems} from "@babel/preset-env/lib/filter-items.js";

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

export const getRoomsService = async () => {
    try {
        const rooms = await prismaClient.room.findMany({
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                name: true,
                number: true,
                type: true,
                capacity: true,
                patient_room: {
                    select: {
                        patient: {
                            select: {
                                name: true,
                            },
                        },
                        assigned_at: true,
                    },
                },
            },
        });
        // const availableRoomsCount = await prismaClient.room.count({
        //     where: {
        //         status: "active",
        //     }
        // })

        // mapping each room
        const formattedRooms = rooms.map((room) => {
            const roomStatus = room.patient_room.length === room.capacity ? "full" : "available";
            const patientCount = room.patient_room.length;

            return {
                total_patients: room.patient_room.length,
                id: room.id,
                name: room.name,
                number: room.number,
                type: room.type,
                capacity: {
                    total: room.capacity,
                    used: patientCount,
                },
                status: roomStatus,
                patients: room.patient_room.map((pr) => ({
                    name: pr.patient?.name || "",
                    assigned_at: pr.assigned_at || "",
                    status: "active"
                })),
            };
        });

        return {
            total_rooms: rooms.length,
            // available_room_count: availableRoomsCount,
            rooms: formattedRooms,
        };
    } catch (error) {
        throw error;
    }
};

export const createBedService = async (body) => {
    try {
        const {room_id, bed_number, type} = body;

        // Check if capacity full
        const room = await prismaClient.room.findUnique({
            where: {
                id: room_id,
            },
            select: {
                capacity: true,
                bed: true
            }
        })
        if (room.bed.length >= room.capacity){
            throw new ResponseError(402, "Room is full");
        }

        // Check if bed is exist
        const bedFound = await prismaClient.bed.findFirst({
            where: {
                bed_number: bed_number,
                room_id: room_id,
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

export const getBedsService = async () => {
    try {
        const beds = await prismaClient.bed.findMany({
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                room_id: true,
                bed_number: true,
                type: true,
                status: true,
            },
        })

        return beds;
    } catch (error) {
        throw error;
    }
}

export const addPatientRoomService = async (body) => {
    try {
        const { patient_id, room_id, bed_id } = body;

        // Check if patient available
        const patient = await prismaClient.patient.findUnique({
            where: {
                id: patient_id,
            },
            select: {
                name: true
            }
        })
        if (!patient) {
            throw new ResponseError(401, "No patient found")
        }

        // Check if bed and room is match
        const bed = await prismaClient.bed.findFirst({
            where: {
                id: body.bed_id,
                room_id: body.room_id,
            }
        })
        if (!bed) {
            throw new ResponseError(401, "Bed not found")
        }

        // Check if room available
        const room = await prismaClient.room.findUnique({
            where: {
                id: room_id,
            },
            select: {
                capacity: true,
            },
        });
        if (!room) {
            throw new ResponseError(404, "Room not found");
        }

        // Count patients
        const patientCount = await prismaClient.patientRoom.count({
            where: {
                room_id: room_id,
            },
        });

        // Check capacity
        if (patientCount >= room.capacity) {
            throw new ResponseError(403, "Room is full");
        }

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

            await tx.bed.update({
                where: {
                    id: createdRoom.bed_id,
                },
                data: {
                    status: "used"
                }
            })

            await tx.activityRoomLog.create({
                data: {
                    room_id: room_id,
                    activity: `Patient ${patient.name} check-in`,
                },
            });

            return createdRoom;
        });

        return { patientRoom };
    } catch (error) {
        throw error;
    }
};

export const getDetailRoomService = async (roomId) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
            select: {
                id: true,
                name: true,
                number: true,
                type: true,
                capacity: true,
            },
        });

        const patientCount = await prismaClient.patientRoom.count({
            where: { room_id: roomId },
        });

        const admissionToday = await prismaClient.patientRoom.count({
            where: {
                room_id: roomId,
                assigned_at: { gte: startOfDay, lte: endOfDay },
            },
        });

        const patients = await prismaClient.bed.findMany({
            where: { room_id: roomId },
            select: {
                id: true,
                bed_number: true,
                patient_room: {
                    select: {
                        assigned_at: true,
                        patient: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { bed_number: "asc" },
        });

        const recentActivities = await prismaClient.activityRoomLog.findMany({
            where: { room_id: roomId },
            select: {
                id: true,
                timestamp: true,
                activity: true,
            },
            orderBy: { timestamp: "desc" },
            take: 10,
        });

        const listBed = patients.map((bed) => {
            const occupant = bed.patient_room;
            return {
                id: bed.id,
                bed_number: bed.bed_number,
                patient: occupant
                    ? {
                        id: occupant.patient?.id || null,
                        name: occupant.patient?.name || null,
                        assigned_at: occupant.assigned_at,
                    }
                    : null,
                status: occupant ? "active" : "available",
            };
        });

        return {
            detail: {
                id: room.id,
                name: room.name,
                number: room.number,
                type: room.type,
                status: patientCount >= room.capacity ? "full" : "available",
            },
            utils: {
                capacity: {
                    total_patient: patientCount,
                    room_capacity: room.capacity,
                },
                admissions_today: admissionToday,
                observations_today: admissionToday,
            },
            patients: listBed,
            recent_activities: recentActivities,
        };
    } catch (error) {
        throw error;
    }
};

export const getPatientRoomService = async (patientId) => {
    try {
        const rooms = await prismaClient.patientRoom.findMany()
        return rooms;
    } catch (error) {
        throw error;
    }
}

export const getRoomByPatientIdService = async (patientId) => {
    try {
        const room = await prismaClient.patientRoom.findFirst({
            where: {
                patient_id: patientId,
            },
            select: {
                id: true,
                room: {
                    select: {
                        name: true,
                        number: true,
                        type: true,
                    }
                },
                bed: {
                    select: {
                        bed_number: true,
                        type: true,
                    }
                }
            }
        })
        if (!room) {
            throw new ResponseError(404, "Room not found");
        }

        return {
            id: room.id,
            room: {
                name: room.room.name,
                number: room.room.number,
                type: room.room.type
            },
            bed: {
                name: room.bed.bed_number,
                type: room.bed.type
            }
        };
    } catch (error) {
        throw error;
    }
}

export const getBedByRoomIdService = async (roomId, isAvailable) => {
    try {
        const beds = await prismaClient.bed.findMany({
            where: {
                room_id: roomId,
                ...(isAvailable === "true" ? { status: "available" } : {}),
            },
            orderBy: {
                bed_number: "asc",
            }
        })

        return beds;
    } catch (error) {
        throw error;
    }
}

