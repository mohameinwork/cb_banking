import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { db } from "../db/index.js";
import { accounts, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    const name = username; // Adjusting to use username as name
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashed })
      .returning();

    return user;
  } catch (error) {
    console.log("Error in registerUser:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  // 1️⃣ Fetch user
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("Invalid credentials");

  // 2️⃣ Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  // 4️⃣ Generate JWT
  const secret = process.env.JWT_SECRET!;
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1d") as SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    secret,
    { expiresIn },
  );

  // 5️⃣ Return SAFE user object
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function updateUserPassword(id: string, newPassword: string) {
  const hashed = await bcrypt.hash(newPassword, 10);
  const [user] = await db
    .update(users)
    .set({ password: hashed })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

export async function getUsers() {
  try {
    const user = await db.select().from(users);

    if (!user) return [];

    return user;
  } catch (err) {
    console.log("Error fetching users with accounts:", err);
  }
}
export async function updateUserRole(
  id: string,
  role: "admin" | "staff" | "customer",
) {
  try {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  } catch (error) {
    console.log("Error at update user role:", error);
    throw error;
  }
}
