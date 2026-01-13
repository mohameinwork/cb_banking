import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { db } from "../db";
import { accounts, users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "staff" | "customer" = "customer"
) {
  const hashed = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ name, email, password: hashed, role })
    .returning();

  return user;
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const secret: Secret = process.env.JWT_SECRET ?? "default_secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1d") as SignOptions["expiresIn"];
  const options: SignOptions = {
    expiresIn,
  };

  const token = jwt.sign({ id: user.id, role: user.role }, secret, options);

  return { user, token };
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

export async function getUsersWithAccounts() {
  return await db
    .select()
    .from(users)
    .leftJoin(accounts, eq(users.id, accounts.userId));
}

export async function updateUserRole(
  id: string,
  role: "admin" | "staff" | "customer"
) {
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, id))
    .returning();
  return user;
}
