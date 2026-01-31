import { Request, Response } from "express";
import {
  deleteUser,
  getUserById,
  loginUser,
  registerUser,
  updateUserPassword,
  getUsersWithAccounts,
  updateUserRole,
} from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    return res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProfile(req: Request, res: Response) {
  const userId = req.user.id;
  const profile = await getUserById(userId); // Assume user is attached to req in auth middleware
  res.json({ user: profile });
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.params.id || req.user.id;
  await deleteUser(userId);
  res.json({ message: "User account deleted" });
}

export async function updatePassword(req: Request, res: Response) {
  const userId = req.params.id || req.user.id;
  const { newPassword } = req.body;
  const user = await updateUserPassword(userId, newPassword);
  res.json({
    message: "Password updated",
    user: { id: user.id, email: user.email },
  });
}

export async function getUsers(req: Request, res: Response) {
  const users = await getUsersWithAccounts();
  res.json({
    message: "Users fetched successfully",
    users,
  });
}

export async function changeUserRole(req: Request, res: Response) {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { role } = req.body as { role: "admin" | "staff" | "customer" };

  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (!["admin", "staff", "customer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await updateUserRole(id, role);
  res.json({
    message: "User role updated",
    user: { id: user.id, email: user.email, role: user.role },
  });
}
