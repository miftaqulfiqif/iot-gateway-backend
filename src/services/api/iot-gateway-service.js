import {prismaClient} from "../../applications/database.js";
import {ResponseError} from "../../errors/response-error.js";

export const createNewIotGatewayDevice = async (hospitalId, body) => {
    try {
        const {id, name, description} = body;


        const gatewayFound = await prismaClient.iotGateway.findUnique({
            where: {
                id: id,
            }
        })

        if (gatewayFound) {
            throw new ResponseError(401,"Gateway is exists")
        }

        const newGateway = await prismaClient.iotGateway.create({
            data: {
                id: id,
                name: name,
                description: description,
                hospital_id: hospitalId,
            }
        })

        return {
            id: newGateway.id,
            name: newGateway.name,
            description: newGateway.description
        }
    } catch (error) {
        throw error;
    }
}

export const getIotGatewaysService = async (page, limit, skip, query) => {
    try {

        const searchCondition = query ? {
            OR: [
                {
                    name: {
                        contains: query,
                    }
                },
                {
                    description: {
                        contains: query,
                    }
                }
            ]
        } : {};

        const whereCondition = {
...searchCondition
        };

        const total = await prismaClient.iotGateway.count({where: whereCondition})
        const total_page = Math.ceil(total / limit);
        const iotGateways = await prismaClient.iotGateway.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: {
                name: "asc"
            },
        });


        return {
            current_page: page,
            total_items: total,
            total_page: total_page,
            data: iotGateways,
        }

    } catch (error) {
        throw error;
    }
}