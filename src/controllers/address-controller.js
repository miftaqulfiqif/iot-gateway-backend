import {
    getDistrictsService,
    getProvincesService,
    getRegenciesService,
    getVillagesService
} from "../services/api/address-service.js";

const getProvinces = async (req,res,next) => {
    try {
        const codes = req.query.codes;
        const name = req.query.name;

        const result = await getProvincesService(codes, name);
        res.status(200).json({message: "Success getting provinces", data: result});
    } catch (error) {
        next(error);
    }
}

const getRegencies = async (req,res,next) => {
    try {
        const codes = req.query.codes;
        const name = req.query.name;

        const result = await getRegenciesService(codes, name);
        res.status(200).json({message: "Success getting regencies", data: result});
    } catch (error) {
        next(error);
    }
}

const getDistricts = async (req,res,next) => {
    try {
        const codes = req.query.codes;
        const name = req.query.name;

        const result = await getDistrictsService(codes, name);
        res.status(200).json({message: "Success getting districts", data: result});
    } catch (error) {
        next(error);
    }
}

const getVillages = async (req,res,next) => {
    try {
        const codes = req.query.codes;
        const name = req.query.name;

        const result = await getVillagesService(codes, name);
        res.status(200).json({message: "Success getting villages", data: result});
    } catch (error) {
        next(error);
    }
}

export default {getProvinces, getRegencies, getDistricts, getVillages};