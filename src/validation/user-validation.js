import Joi from "joi";

export const registerValidation = Joi.object({
  hospital_name: Joi.string().max(255),
  name: Joi.string().max(255).required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
  token: Joi.string().max(100),
});

export const createUserValidation = Joi.object({
  role: Joi.string().max(20).required(),
  name: Joi.string().max(255).required(),
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
  admin: Joi.object({
    role_id: Joi.number(),
    id: Joi.string().max(100).required(),
    hospital: Joi.object({
      id: Joi.string().max(255).required(),
    }),
  }),
});

export const loginValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(20).required(),
});

export const getUserValidation = Joi.string().max(100).required();

export const deleteUserValidation = Joi.string().max(20).required();

export const updateUserValidation = Joi.object({
  password: Joi.string().max(20).required(),
  name: Joi.string().max(255),
  username: Joi.string().max(100),
  new_password: Joi.string().max(20),
});

export const updatePasswordValidation = Joi.object({
  password: Joi.string().max(20).required(),
  new_password: Joi.string().max(20).required(),
});
