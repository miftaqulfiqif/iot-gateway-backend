import {
  currentUserService,
  loginService,
  logOutService,
  registerService,
} from "../services/api/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(200).json({ message: "User created", data: result });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const result = await currentUserService(req.user.username);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await logOutService(req.user.username);
    res.status(200).json({ message: "User logged out", data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    const { token, ...userWithoutToken } = result;
    res.status(200).json(userWithoutToken);
  } catch (e) {
    next(e);
  }
};

export default { register, currentUser, logout, login };
