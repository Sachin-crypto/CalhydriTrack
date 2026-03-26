import * as goalService from "../services/goal.service.js";

export const getGoal = async (req, res, next) => {
  try {
    const data = await goalService.getGoal(req.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const setGoal = async (req, res, next) => {
  try {
    const data = await goalService.setGoal(req.userId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};