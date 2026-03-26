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

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getWeekKey = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getAnalytics = async (userId, query) => {
  const days = Math.min(Math.max(Number(query.days) || 30, 7), 180);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - (days - 1));
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [entries, meals] = await Promise.all([
    prisma.entry.findMany({
      where: { userId, date: { gte: start, lt: end } },
      select: { date: true, calories: true, water: true },
      orderBy: { date: "asc" },
    }),
    prisma.meal.findMany({
      where: { userId, date: { gte: start, lt: end } },
      select: { date: true, calories: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const dayMap = new Map();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dayMap.set(toDateKey(d), { calories: 0, water: 0 });
  }

  for (const e of entries) {
    const key = toDateKey(new Date(e.date));
    if (!dayMap.has(key)) continue;
    const row = dayMap.get(key);
    row.calories += e.calories || 0;
    row.water += e.water || 0;
  }

  for (const meal of meals) {
    const key = toDateKey(new Date(meal.date));
    if (!dayMap.has(key)) continue;
    const row = dayMap.get(key);
    row.calories += meal.calories || 0;
  }

  const daily = Array.from(dayMap.entries()).map(([date, values]) => ({
    date,
    calories: values.calories,
    water: values.water,
  }));

  const weeklyMap = new Map();
  for (const item of daily) {
    const wk = getWeekKey(new Date(item.date));
    const row = weeklyMap.get(wk) || { calories: 0, water: 0 };
    row.calories += item.calories;
    row.water += item.water;
    weeklyMap.set(wk, row);
  }

  const monthlyMap = new Map();
  for (const item of daily) {
    const mk = getMonthKey(new Date(item.date));
    const row = monthlyMap.get(mk) || { calories: 0, water: 0 };
    row.calories += item.calories;
    row.water += item.water;
    monthlyMap.set(mk, row);
  }

  const weekly = Array.from(weeklyMap.entries()).map(([label, values]) => ({ label, ...values }));
  const monthly = Array.from(monthlyMap.entries()).map(([label, values]) => ({ label, ...values }));

  const totalCalories = daily.reduce((s, d) => s + d.calories, 0);
  const totalWater = daily.reduce((s, d) => s + d.water, 0);
  const avgCalories = Math.round(totalCalories / daily.length);
  const avgWater = Math.round(totalWater / daily.length);
  const half = Math.floor(daily.length / 2);
  const firstHalfCalories = daily.slice(0, half).reduce((s, d) => s + d.calories, 0) || 1;
  const secondHalfCalories = daily.slice(half).reduce((s, d) => s + d.calories, 0);
  const firstHalfWater = daily.slice(0, half).reduce((s, d) => s + d.water, 0) || 1;
  const secondHalfWater = daily.slice(half).reduce((s, d) => s + d.water, 0);

  return {
    rangeDays: days,
    daily,
    weekly,
    monthly,
    summary: {
      totalCalories,
      totalWater,
      avgCalories,
      avgWater,
      caloriesTrendPct: Number((((secondHalfCalories - firstHalfCalories) / firstHalfCalories) * 100).toFixed(1)),
      waterTrendPct: Number((((secondHalfWater - firstHalfWater) / firstHalfWater) * 100).toFixed(1)),
    },
  };
};
