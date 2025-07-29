import { prismaClient } from "../../applications/database.js";
import {
  loginValidation,
  registerValidation,
} from "../../validation/user-validation.js";
import { validate } from "../../validation/validation.js";
import { v4 as uuid } from "uuid";
import bcrypt, { compare } from "bcrypt";
import { ResponseError } from "../../errors/response-error.js";

export const registerService = async (request) => {
  try {
    const user = validate(registerValidation, request);
    let { hospital_name, name, username, password } = user;

    const adminId = "ADM" + uuid();

    //Create hospital
    const hospital = await prismaClient.hospital.create({
      data: {
        id: uuid(),
        name: hospital_name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const countUser = await prismaClient.user.count({
      where: { username: username },
    });

    if (countUser > 0) {
      throw new ResponseError(400, "Username already exists");
    }

    password = await bcrypt.hash(password, 10);

    //Create User
    const createUser = await prismaClient.user.create({
      data: {
        id: adminId,
        username: username,
        password: password,
        is_active: true,
        hospital_id: hospital.id,
        role_id: 1,
      },
      select: {
        id: true,
        hospital_id: true,
        username: true,
      },
    });

    await prismaClient.admin.create({
      data: {
        user_id: createUser.id,
        name: name,
      },
      select: {
        user_id: true,
      },
    });

    return {
      id: createUser.id,
      hospital: hospital.name,
      name: name,
      username: username,
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
        hospital: true,
        admin: true,
        doctor: true,
        nurse: true,
        profile_picture: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }
    // Get role
    const roleCode = user.role?.kode ?? "";
    const roleName = user.role?.name ?? "";

    // Get name by role
    const name =
      roleCode === "ADM"
        ? user.admin?.name
        : roleCode === "DOC"
        ? user.doctor?.name
        : roleCode === "NUR"
        ? user.nurse?.name
        : "";

    return {
      name: name ?? "",
      username: user.username,
      role: roleName,
      profile_picture: user.profile_picture?.path ?? "",
      hospital: user.hospital
        ? {
            id: user.hospital.id,
            name: user.hospital.name,
            logo_path: user.hospital.logo_path ?? "",
          }
        : null,
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

    const userFound = await prismaClient.user.findFirst({
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
        admin: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
        nurse: {
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
        admin: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
        nurse: {
          select: {
            name: true,
          },
        },
      },
    });

    let displayName = "Unknown";

    switch (userFound.role_id) {
      case 1:
        displayName = userFound.admin?.name ?? "No admin data";
        break;
      case 2:
        displayName = userFound.doctor?.name ?? "No doctor data";
        break;
      case 3:
        displayName = userFound.nurse?.name ?? "No nurse data";
        break;
    }

    return {
      token: updatedUser.token,
      name: displayName,
      username: updatedUser.username,
      profile_picture: userFound.profile_picture,
      role: userFound.role.name,
      hospital: userFound.hospital,
    };
  } catch (e) {
    throw e;
  }
};

export const getUsersService = async () => {
  try {
    const users = await prismaClient.user.findMany({
      include: {
        role: true,
        hospital: true,
        admin: true,
        doctor: true,
        nurse: true,
        profile_picture: true,
      },
    });

    const result = users.map((user) => {
      const roleCode = user.role?.kode ?? "";
      const roleName = user.role?.name ?? "";

      const name =
        roleCode === "ADM"
          ? user.admin?.name
          : roleCode === "DOC"
          ? user.doctor?.name
          : roleCode === "NUR"
          ? user.nurse?.name
          : "";

      return {
        name: name ?? "",
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: roleName,
        created_at: user.created_at,
      };
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getUserByUsernameService = async (username) => {
  try {
    const user = await prismaClient.user.findFirst({
      where: { username },
      include: {
        role: true,
        hospital: true,
        admin: true,
        doctor: true,
        nurse: true,
        profile_picture: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const roleCode = user.role?.id ?? "";
    const roleName = user.role?.name ?? "";

    const roleDataMap = {
      1: user.admin,
      2: user.doctor,
      3: user.nurse,
    };

    const roleData = roleDataMap[roleCode] ?? {};

    const allRecentHandlers = await prismaClient.patientHandler.findMany({
      where: {
        user_id: user.id,
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
      name: roleData.name ?? "",
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: roleName,
      place_of_birth: roleData.place_of_birth ?? "",
      date_of_birth: roleData.date_of_birth ?? "",
      address: roleData.address ?? "",
      profile_picture: user.profile_picture?.path ?? "",
      recent_patients: recentPatient.map((item) => ({
        id: item.id,
        patient_name: item.patient?.name ?? "",
        timestamp: item.timestamp,
      })),
    };
  } catch (error) {
    throw error;
  }
};
