import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { prisma } from "../config/db.js";

export const signup = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password required" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw { status: 400, message: "User already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  const token = generateToken(user.id);

  return { user, token };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw { status: 400, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const token = generateToken(user.id);

  return { user, token };
};

export const getMe = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      age: true,
      heightCm: true,
      weightKg: true,
      goals: true,
    },
  });
};