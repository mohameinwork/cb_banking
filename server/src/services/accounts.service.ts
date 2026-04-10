import { accounts, ledgerAccounts } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
export async function createAccount({
  type,
  name,
  phone,
  currency,
}: {
  type: "PERSON" | "COMPANY";
  name: string;
  phone: string;
  currency: "USD" | "SLSH";
}) {
  try {
    //
    // 1️⃣ VALIDATION
    //
    if (!type) throw new Error("Account type is required");
    if (!name) throw new Error("Name is required");
    if (!phone) throw new Error("Phone is required");
    if (!currency) throw new Error("Currency is required");

    let companyAccountId: string | null = null;
    // Check the type of the account being created and ensure companyAccountId is provided for COMPANY type
    if (type === "COMPANY") {
      companyAccountId = uuidv4(); // Generate a new UUID for the company account
    } else {
      companyAccountId = null; // Ensure it's null for PERSON type
    }
    //
    // 2️⃣ GENERATE ACCOUNT NUMBER
    //
    const accountNumber = Math.floor(
      1000000 + Math.random() * 9000000,
    ).toString();

    //
    // 3️⃣ CREATE LEDGER ACCOUNT
    //
    const [ledgerAccount] = await db
      .insert(ledgerAccounts)
      .values({
        code: `ACC-${accountNumber}`,
        name: `${name} (${currency})`,
        type: "LIABILITY", // user balances are liabilities
      } as any)
      .returning();

    //
    // 4️⃣ CREATE ACCOUNT
    //
    const [newAccount] = await db
      .insert(accounts)
      .values({
        type,
        name,
        phone,
        currency,
        accountNumber,
        companyAccountId,
        balance: "0.00",
        ledgerAccountId: ledgerAccount.id,
      } as any)
      .returning();

    //
    // 5️⃣ RETURN CLEAN RESPONSE
    //
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

export async function updateAccountStatus(
  accountId: string,
  status: "ACTIVE" | "INACTIVE",
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
