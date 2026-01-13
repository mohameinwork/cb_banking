import { db } from "../db";
import { accounts, transactions } from "../db/schema";
import { ledgerAccounts, journalEntries, journalLines } from "../db/schema";
import { eq } from "drizzle-orm";

export async function deposit(
  accountId: string,
  amount: number,
  currency: string
) {
  return await db.transaction(async (tx) => {
    // 1️⃣ Fetch account
    const [acc] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId));

    if (!acc) throw new Error("Account not found");
    if (acc.currency !== currency) throw new Error("Currency mismatch");

    if (!acc.ledgerAccountId) throw new Error("Account ledger not configured");

    // update balance
    const newBalance = Number(acc.balance) + amount;
    await tx
      .update(accounts)
      .set({ balance: `${newBalance}` })
      .where(eq(accounts.id, accountId))
      .returning();

    // 2️⃣ Record business transaction
    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "DEPOSIT",
        amount,
        currency,
        toAccountId: accountId,
      } as any)
      .returning();

    // 3️⃣ Journal Entry
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        description: `Deposit to account ${accountId}`,
        transactionId: txn.id,
      } as any)
      .returning();

    // 4️⃣ Double Entry
    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: acc.ledgerAccountId, // ASSET +
        amount: `${amount}`,
        side: "DEBIT" as const,
      },
      {
        journalId: journal.id,
        ledgerAccountId: acc.ledgerAccountId, // LIABILITY +
        amount: `${amount}`,
        side: "CREDIT" as const,
      },
    ]);

    return txn;
  });
}

export async function withdraw(
  accountId: string,
  amount: number,
  currency: string
) {
  return await db.transaction(async (tx) => {
    const [acc] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId));

    if (!acc) throw new Error("Account not found");
    if (acc.currency !== currency) throw new Error("Currency mismatch");
    if (Number(acc.balance) < amount) throw new Error("Insufficient funds");

    const newBalance = Number(acc.balance) - amount;

    await tx
      .update(accounts)
      .set({ balance: `${newBalance}` })
      .where(eq(accounts.id, accountId));

    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "WITHDRAWAL",
        amount,
        currency,
        fromAccountId: accountId,
      } as any)
      .returning();

    await tx.insert(journalEntries).values({
      transactionId: txn.id,
      accountId,
      delta: `-${amount}`,
      resultingBalance: newBalance,
    } as any);

    return txn;
  });
}

export async function transfer(
  fromId: string,
  toId: string,
  amount: number,
  currency: string
) {
  return await db.transaction(async (tx) => {
    const [from] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, fromId));
    const [to] = await tx.select().from(accounts).where(eq(accounts.id, toId));

    if (!from || !to) throw new Error("Account not found");
    if (from.currency !== currency || to.currency !== currency)
      throw new Error("Currency mismatch");

    if (Number(from.balance) < amount) throw new Error("Insufficient funds");

    const newFromBal = Number(from.balance) - amount;
    const newToBal = Number(to.balance) + amount;

    await tx
      .update(accounts)
      .set({ balance: `${newFromBal}` })
      .where(eq(accounts.id, fromId));
    await tx
      .update(accounts)
      .set({ balance: `${newToBal}` })
      .where(eq(accounts.id, toId));

    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "TRANSFER" as const,
        amount: `${amount}`,
        currency,
        fromAccountId: fromId,
        toAccountId: toId,
      } as any)
      .returning();
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        description: `Transfer from ${fromId} to ${toId}`,
      })
      .returning();

    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: String(to.ledgerAccountId), // Liability +
        amount: `${amount}`,
        side: "DEBIT" as const,
      },
      {
        journalId: journal.id,
        ledgerAccountId: String(from.ledgerAccountId), // Liability −
        amount: `${amount}`,
        side: "CREDIT" as const,
      },
    ]);

    return txn;
  });
}

export async function getTransactions() {
  try {
    const tran = await db.select().from(transactions);

    return tran;
  } catch (error) {
    console.log("Error at getting transactions", error);
  }
}
