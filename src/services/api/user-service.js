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
        username: username,
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
    const roleName = user.role?.name ?? "";
    // Get name by role
    let name = "";
    if (roleName === "admin") {
      name = user.admin?.name ?? "";
    } else if (roleName === "doctor") {
      name = user.doctor?.name ?? "";
    } else if (roleName === "nurse") {
      name = user.nurse?.name ?? "";
    }

    return {
      name: name,
      username: user.username,
      profile_picture: user.profile_picture?.path ?? "",
      role: user.role?.name ?? "",
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
