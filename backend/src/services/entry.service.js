import { prisma } from "../config/db.js";

const getTodayBounds = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const upsertTodayEntry = async (userId) => {
  const { start, end } = getTodayBounds();
  const existing = await prisma.entry.findFirst({
    where: { userId, date: { gte: start, lt: end } },
  });

  if (existing) return existing;

  return prisma.entry.create({
    data: { userId, date: start, calories: 0, water: 0 },
  });
};

export const createEntry = async (userId, body) => {
  const calories = Number(body.calories || 0);
  const water = Number(body.water || 0);

  if (calories < 0 || water < 0) {
    throw { status: 400, message: "Calories and water must be non-negative" };
  }

  const entry = await upsertTodayEntry(userId);
  return prisma.entry.update({
    where: { id: entry.id },
    data: {
      calories,
      water,
    },
  });
};

export const addMeal = async (userId, body) => {
  const mealType = String(body.mealType || "").toUpperCase();
  const name = String(body.name || "").trim();
  const calories = Number(body.calories);

  if (!["BREAKFAST", "LUNCH", "DINNER", "SNACKS"].includes(mealType)) {
    throw { status: 400, message: "Invalid meal type" };
  }
  if (!name) throw { status: 400, message: "Food item name is required" };
  if (!Number.isFinite(calories) || calories <= 0) {
    throw { status: 400, message: "Calories must be greater than 0" };
  }

  const { start } = getTodayBounds();
  return prisma.meal.create({
    data: {
      userId,
      mealType,
      name,
      calories,
      date: start,
    },
  });
};

export const addWater = async (userId, body) => {
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw { status: 400, message: "Amount must be greater than 0" };
  }

  const entry = await upsertTodayEntry(userId);
  return prisma.entry.update({
    where: { id: entry.id },
    data: { water: entry.water + amount },
  });
};

export const setWater = async (userId, body) => {
  const water = Number(body.water);
  if (!Number.isFinite(water) || water < 0) {
    throw { status: 400, message: "Water must be non-negative" };
  }

  const entry = await upsertTodayEntry(userId);
  return prisma.entry.update({
    where: { id: entry.id },
    data: { water },
  });
};

export const getTodayEntry = async (userId) => {
  const { start, end } = getTodayBounds();
  const [entry, meals] = await Promise.all([
    prisma.entry.findFirst({ where: { userId, date: { gte: start, lt: end } } }),
    prisma.meal.findMany({
      where: { userId, date: { gte: start, lt: end } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const grouped = {
    BREAKFAST: [],
    LUNCH: [],
    DINNER: [],
    SNACKS: [],
  };
  for (const meal of meals) grouped[meal.mealType].push(meal);

  const mealTotals = Object.fromEntries(
    Object.entries(grouped).map(([key, value]) => [key, value.reduce((sum, m) => sum + m.calories, 0)])
  );
  const totalMealCalories = Object.values(mealTotals).reduce((sum, n) => sum + n, 0);

  return {
    water: entry?.water ?? 0,
    manualCalories: entry?.calories ?? 0,
    meals: grouped,
    mealTotals,
    totalMealCalories,
    dailyCaloriesTotal: totalMealCalories + (entry?.calories ?? 0),
  };
};
