import { prismaClient } from "../../applications/database.js";
import axios from "axios";

export const updateSatuSehatService = async (hospitalId, data) => {
  try {
    const { organization_id, client_id, client_secret } = data;

    // 1. Login ke Satu Sehat untuk dapatkan access token
    const tokenResponse = await axios.post(
      "https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials",
      {
        client_id: client_id,
        client_secret: client_secret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error("Failed to get access token from Satu Sehat");
    }

    // 2. Simpan ke database (upsert)
    const satuSehat = await prismaClient.satuSehatEnv.upsert({
      where: {
        hospital_id: hospitalId,
      },
      update: {
        organization_id,
        client_id,
        client_secret,
        token: accessToken,
      },
      create: {
        hospital_id: hospitalId,
        organization_id,
        client_id,
        client_secret,
        token: accessToken,
      },
    });

    return satuSehat;
  } catch (error) {
    throw error;
  }
};
