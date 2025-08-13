import { prismaClient } from "../../applications/database.js";
import {
  loginValidation,
  registerValidation,
} from "../../validation/user-validation.js";
import { validate } from "../../validation/validation.js";
import { v4 as uuid } from "uuid";
import bcrypt, { compare } from "bcrypt";
import { ResponseError } from "../../errors/response-error.js";
import { idGenerator } from "../../applications/generator/id-generator.js";

export const createUserService = async (hospitalId, request) => {
  try {
    const {
      name,
      gender,
      address,
      username,
      password,
      email,
      phone,
      role_id,
      nik,
      ihs_number,
      last_education,
      experience,
      speciality,
    } = request;
    const {
      use,
      line,
      city,
      postal_code,
      country,
      rt,
      rw,
      province_id,
      regency_id,
      district_id,
      village_id,
    } = address;

    const findUser = await prismaClient.user.findUnique({
      where: { username: username },
    });
    if (findUser) {
      throw new ResponseError(401, "Username already exists");
    }

    if (nik) {
      const findNikUser = await prismaClient.user.findFirst({
        where: { nik },
      });
      if (findNikUser) {
        throw new ResponseError(401, "NIK already exists");
      }
    }
    if (ihs_number) {
      const findIhsNumber = await prismaClient.user.findFirst({
        where: { ihs_number },
      });
      if (findIhsNumber) {
        throw new ResponseError(401, "IHS Number already exists");
      }
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const userAddress = await prismaClient.address.create({
      data: {
        use: use,
        line: line,
        city: city,
        postal_code: postal_code,
        country: country,
        rt: rt,
        rw: rw,
        province_id: province_id,
        regency_id: regency_id,
        district_id: district_id,
        village_id: village_id,
      },
    });

    //Create User
    const createUser = await prismaClient.user.create({
      data: {
        name: name,
        gender: gender,
        address: { connect: { id: userAddress.id } },
        username: username,
        password: passwordHashed,
        email: email,
        phone: phone,

        nik: nik,
        ihs_number: ihs_number,
        last_education: last_education,
        experience: experience,
        speciality: speciality,

        hospital: { connect: { id: hospitalId } },
        role: { connect: { id: role_id } },
      },
      include: {
        hospital: true,
        address: true,
        role: true,
      },
    });

    return {
      id: createUser.id,
      name: createUser.name,
      gender: createUser.gender,
      address: createUser.address,
      username: createUser.username,
      password: createUser.passwordHashed,
      email: createUser.email,
      phone: createUser.phone,

      nik: nik ?? " -- ",
      ihs_number: ihs_number ?? " -- ",
      last_education: last_education ?? " -- ",
      experience: experience ?? " -- ",
      speciality: speciality ?? " -- ",

      hospital_id: createUser.hospital,
      role: createUser.role.name,
    };
  } catch (error) {
    throw error;
  }
};

// Get current user
export const currentUserService = async (username) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
        hospital: {
          select: {
            id: true,
            name: true,
            logo_path: true,
            satu_sehat_env: {
              select: {
                token: true,
              },
            },
          },
        },
        profile_picture: true,
        gateway: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }
    // Get role
    const roleName = user.role?.name ?? "";

    // Check Gateway
    if (user.gateway === null) {
      const gateway = await prismaClient.iotGateway.findFirst({});

      await prismaClient.user.update({
        where: {
          username,
        },
        data: {
          gateway: {
            connect: {
              id: gateway.id,
            },
          },
        },
      });

      return {
        name: user.name,
        username: user.username,
        role: roleName,
        profile_picture: user.profile_picture?.path ?? "",
        hospital: user.hospital
          ? {
              id: user.hospital.id,
              name: user.hospital.name,
              logo_path: user.hospital.logo_path ?? "",
              access_token_satusehat:
                user.hospital.access_token_satusehat ?? "",
            }
          : null,
        gateway: gateway,
      };
    }

    return {
      name: user.name,
      username: user.username,
      role: roleName,
      profile_picture: user.profile_picture?.path ?? "",
      hospital: user.hospital
        ? {
            id: user.hospital.id,
            name: user.hospital.name,
            logo_path: user.hospital.logo_path ?? "",
            access_token_satusehat: user.hospital.satu_sehat_env.token ?? "",
          }
        : null,
      gateway: user.gateway,
    };
  } catch (error) {
    throw error;
  }
};

export const logOutService = async (username) => {
  try {
    return await prismaClient.user.update({
      where: {
        username,
      },
      data: {
        token: null,
      },
    });
  } catch (e) {
    throw new Error(`Failed to log out user ${username}: ${e.message}`);
  }
};

export const loginService = async (request) => {
  try {
    const user = validate(loginValidation, request);

    const userFound = await prismaClient.user.findUnique({
      where: {
        username: user.username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        token: true,
        role_id: true,
        is_active: true,
        profile_picture: {
          select: {
            path: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            logo_path: true,
          },
        },
      },
    });

    if (!userFound) {
      throw new ResponseError(401, "Username or password wrong");
    }
    if (!userFound.is_active) {
      throw new ResponseError(401, "Account is inactive");
    }

    const isValidPassword = await bcrypt.compare(
      user.password,
      userFound.password
    );

    if (!isValidPassword) {
      throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();

    const updatedUser = await prismaClient.user.update({
      where: { id: userFound.id },
      data: { token },
      select: {
        token: true,
        username: true,
        name: true,
        profile_picture: true,
        role: true,
        hospital: true,
      },
    });

    return {
      token: updatedUser.token,
      name: updatedUser.name,
      username: updatedUser.username,
      profile_picture: updatedUser.profile_picture,
      role: updatedUser.role.name,
      hospital: updatedUser.hospital,
    };
  } catch (e) {
    throw e;
  }
};

export const getAllUserService = async (page, limit, skip, query) => {
  try {
    const searchCondition = query
      ? {
          OR: [{ name: { contains: query } }],
        }
      : {};

    const whereConditions = {
      ...searchCondition,
    };

    const total = await prismaClient.user.count({ where: whereConditions });
    const total_page = limit > 0 ? Math.ceil(total / limit) : 0;

    const users = await prismaClient.user.findMany({
      where: whereConditions,
      skip: skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        username: true,
        role: {
          select: {
            name: true,
          },
        },
        created_at: true,
      },
    });

    return {
      current_page: page,
      total_items: total,
      total_page: total_page,
      data: users,
    };
  } catch (error) {
    throw error;
  }
};

export const getDetailUserService = async (userId) => {
  try {
    // Get detail user
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: {
        role: true,
        hospital: true,
        profile_picture: true,
        address: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    // Get Recent Patient
    const allRecentHandlers = await prismaClient.patientHandler.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        id: true,
        patient_id: true,
        patient: {
          select: {
            name: true,
          },
        },
        timestamp: true,
      },
    });

    // Get Measurement Activity
    const measurementActivity = await prismaClient.measurementActivity.findMany(
      {
        where: {
          patient_handler: {
            user_id: userId,
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          recorded_at: true,
          patient_handler: {
            select: {
              patient: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          recorded_at: "desc",
        },
        take: 10,
      }
    );

    const uniquePatients = new Map();

    // Filter only patient_id unique
    for (const handler of allRecentHandlers) {
      if (!uniquePatients.has(handler.patient_id)) {
        uniquePatients.set(handler.patient_id, handler);
      }
    }

    const recentPatient = Array.from(uniquePatients.values()).slice(0, 10);

    return {
      id: user.id,
      name: user.name,
      ihs_number: user.ihs_number ? user.ihs_number : " -- ",
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      place_of_birth: user.place_of_birth,
      date_of_birth: user.date_of_birth,
      address: user.address,
      profile_picture: user.profile_picture?.path ?? "",
      recent_patients: recentPatient.map((item) => ({
        id: item.id,
        patient_name: item.patient?.name ?? " -- ",
        timestamp: item.timestamp,
      })),
      measurement_activity: measurementActivity.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        patient_name: item.patient_handler?.patient?.name ?? " -- ",
        recorded_at: item.recorded_at,
      })),
    };
  } catch (error) {
    throw error;
  }
};

export const changeGatewayService = async (userId, gatewayId) => {
  try {
    const gateway = await prismaClient.iotGateway.findUnique({
      where: {
        id: gatewayId,
      },
    });

    if (!gateway) {
      throw new ResponseError(404, "Gateway not found");
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        gateway: {
          connect: {
            id: gatewayId,
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
