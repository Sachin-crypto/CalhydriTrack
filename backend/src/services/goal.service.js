import { prisma } from "../config/db.js";

export const getGoal = async (userId) => {
  const [goal, user] = await Promise.all([
    prisma.goal.findUnique({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, age: true, heightCm: true, weightKg: true },
    }),
  ]);

  return {
    profile: user,
    goals: goal || { calories: 0, water: 0 },
  };
};

export const setGoal = async (userId, body) => {
  const calories = Number(body.calories);
  const water = Number(body.water);
  const age = body.age !== undefined ? Number(body.age) : undefined;
  const heightCm = body.heightCm !== undefined ? Number(body.heightCm) : undefined;
  const weightKg = body.weightKg !== undefined ? Number(body.weightKg) : undefined;

  if (!Number.isFinite(calories) || calories < 0) throw { status: 400, message: "Invalid calorie goal" };
  if (!Number.isFinite(water) || water < 0) throw { status: 400, message: "Invalid water goal" };

  const [goals, profile] = await prisma.$transaction([
    prisma.goal.upsert({
      where: { userId },
      update: { calories, water },
      create: { calories, water, userId },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        age: Number.isFinite(age) ? age : undefined,
        heightCm: Number.isFinite(heightCm) ? heightCm : undefined,
        weightKg: Number.isFinite(weightKg) ? weightKg : undefined,
      },
      select: { id: true, email: true, age: true, heightCm: true, weightKg: true },
    }),
  ]);

  return { profile, goals };
};