import { accounts, ledgerAccounts } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
export async function createAccount(
  userId: string,
  currency: string,
  account_number?: string,
) {
  try {
    // Creating a ledger account for the new account can be added here
    const [ledgerAccount] = await db
      .insert(ledgerAccounts)
      .values({
        code: account_number || `ACC-${Date.now()}`,
        name: `Account Ledger for ${account_number || "New Account"}`,
        type: "LIABILITY",
      } as any)
      .returning();

    const [newAccount] = await db
      .insert(accounts)
      .values({
        userId,
        currency,
        accountNumber: account_number!,
        ledgerAccountId: ledgerAccount.id,
      } as any)
      .returning();
    return {
      ...newAccount,
      ledgerAccount,
    };
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

export async function getAccountById(accountId: string) {
  try {
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId));
    return account;
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
}

export async function getAccountsByUserId(userId: string) {
  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
  return userAccounts;
}

export async function updateAccountStatus(
  accountId: string,
  status: "ACTIVE" | "SUSPENDED" | "CLOSED",
) {
  await db.update(accounts).set({ status }).where(eq(accounts.id, accountId));
}

export async function deleteAccount(accountId: string) {
  await db.delete(accounts).where(eq(accounts.id, accountId));
}
export async function getAllAccounts() {
  const allAccounts = await db.select().from(accounts);
  return allAccounts;
}
