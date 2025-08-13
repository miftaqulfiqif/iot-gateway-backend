import {prismaClient} from "../../applications/database.js";

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