import * as authService from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const data = await authService.signup(req.body);

    res.cookie("token", data.token, {
      httpOnly: true,
    });

    res.json(data.user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.cookie("token", data.token, {
      httpOnly: true,
    });

    res.json(data.user);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};