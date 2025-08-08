import {prismaClient} from "../../applications/database.js";

export const getProvincesService = async (code, name) => {
    try {
        const whereClause = {};

        if (code) {
            whereClause.id = {
                contains: code,
            };
        }

        if (name) {
            whereClause.name = {
                contains: name,
            };
        }

        const provinces = await prismaClient.province.findMany({
            where: Object.keys(whereClause).length ? whereClause : undefined,
        });

        return provinces;
    } catch (error) {
        console.error("Error in getProvincesService:", error);
        throw error;
    }
};

export const getRegenciesService = async (code, name) => {
    try {
        const whereClause = {};

        if (code) {
            whereClause.province_id = {
                contains: code,
            };
        }

        if (name) {
            whereClause.name = {
                contains: name,
            };
        }

        const regencies = await prismaClient.regency.findMany({
            where: Object.keys(whereClause).length ? whereClause : undefined,
        });

        return regencies;
    } catch (error) {
        console.error("Error in getRegenciesService:", error);
        throw error;
    }
};

export const getDistrictsService = async (code, name) => {
    try {
        const whereClause = {};

        if (code) {
            whereClause.regency_id = {
                contains: code,
            };
        }

        if (name) {
            whereClause.name = {
                contains: name,
            };
        }

        const districts = await prismaClient.district.findMany({
            where: Object.keys(whereClause).length ? whereClause : undefined,
        });

        return districts;
    } catch (error) {
        console.error("Error in getDistrictsService:", error);
        throw error;
    }
};

export const getVillagesService = async (code, name) => {
    try {
        const whereClause = {};

        if (code) {
            whereClause.district_id = {
                contains: code,
            };
        }

        if (name) {
            whereClause.name = {
                contains: name,
            };
        }

        const villages = await prismaClient.village.findMany({
            where: Object.keys(whereClause).length ? whereClause : undefined,
        });

        return villages;
    } catch (error) {
        console.error("Error in getVillagesService:", error);
        throw error;
    }
};
