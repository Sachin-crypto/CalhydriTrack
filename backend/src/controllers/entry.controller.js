import * as entryService from "../services/entry.service.js";

export const createEntry = async (req, res, next) => {
  try {
    const data = await entryService.createEntry(req.userId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createMeal = async (req, res, next) => {
  try {
    const data = await entryService.addMeal(req.userId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const addWater = async (req, res, next) => {
  try {
    const data = await entryService.addWater(req.userId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const setWater = async (req, res, next) => {
  try {
    const data = await entryService.setWater(req.userId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getTodayEntry = async (req, res, next) => {
  try {
    const data = await entryService.getTodayEntry(req.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await entryService.getAnalytics(req.userId, req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};