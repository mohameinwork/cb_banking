import { db } from "../db/index.js";
import { accounts, transactions } from "../db/schema.js";
import { journalEntries, journalLines, ledgerAccounts } from "../db/schema.js";
import { desc, eq, or } from "drizzle-orm";

// System cash ledger account ID - this should be initialized in the database
const SYSTEM_CASH_LEDGER_ID = "00000000-0000-0000-0000-000000000001"; // Fixed UUID for system cash

async function getSystemCashLedgerId(tx: any) {
  // Check if system cash ledger account exists
  const [existing] = await tx
    .select()
    .from(ledgerAccounts)
    .where(eq(ledgerAccounts.id, SYSTEM_CASH_LEDGER_ID));

  if (existing) {
    return existing.id;
  }

  // Create system cash ledger account if it doesn't exist
  const [created] = await tx
    .insert(ledgerAccounts)
    .values({
      id: SYSTEM_CASH_LEDGER_ID,
      code: "CASH-001",
      name: "System Cash Account",
      type: "ASSET",
    })
    .returning();

  return created.id;
}

// Deposit, Withdraw, Transfer, Get Transactions
export async function deposit(id: string, amount: number, currency: string) {
  return await db.transaction(async (tx) => {
    const systemCashLedgerId = await getSystemCashLedgerId(tx);

    // 🔒 Lock account
    const [acc] = await tx.select().from(accounts).where(eq(accounts.id, id));

    if (!acc) throw new Error("Account not found");
    if (acc.currency !== currency) throw new Error("Currency mismatch");
    if (!acc.ledgerAccountId) throw new Error("Ledger account missing");

    const newBalance = Number(acc.balance) + amount;

    await tx
      .update(accounts)
      .set({ balance: newBalance.toFixed(2) })
      .where(eq(accounts.id, id));

    // ✅ Transaction
    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "DEPOSIT",
        amount,
        currency,
        toAccountId: id,
        status: "COMPLETED",
      } as any)
      .returning();

    // ✅ Journal
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        transactionId: txn.id,
        description: `Deposit ${amount} ${currency}`,
      })
      .returning();

    // ✅ Double Entry (CORRECT)
    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: acc.ledgerAccountId, // USER ACCOUNT
        side: "DEBIT",
        amount: amount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId: systemCashLedgerId, // SYSTEM CASH
        side: "CREDIT",
        amount: amount.toFixed(2),
      },
    ]);

    return txn;
  });
}

export async function withdraw(
  accountId: string,
  amount: number,
  currency: string,
) {
  return await db.transaction(async (tx) => {
    const systemCashLedgerId = await getSystemCashLedgerId(tx);

    const [acc] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId));

    if (!acc) throw new Error("Account not found");
    if (acc.currency !== currency) throw new Error("Currency mismatch");
    if (!acc.ledgerAccountId) throw new Error("Ledger account missing");

    if (Number(acc.balance) < amount) throw new Error("Insufficient funds");

    const newBalance = Number(acc.balance) - amount;

    await tx
      .update(accounts)
      .set({ balance: newBalance.toFixed(2) })
      .where(eq(accounts.id, accountId));

    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "WITHDRAWAL",
        amount,
        currency,
        fromAccountId: accountId,
        status: "COMPLETED",
      } as any)
      .returning();

    const [journal] = await tx
      .insert(journalEntries)
      .values({
        transactionId: txn.id,
        description: `Withdraw ${amount} ${currency}`,
      })
      .returning();

    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: systemCashLedgerId,
        side: "DEBIT",
        amount: amount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId: acc.ledgerAccountId,
        side: "CREDIT",
        amount: amount.toFixed(2),
      },
    ]);

    return txn;
  });
}

export async function transfer(
  fromId: string,
  toId: string,
  amount: number,
  currency: string,
) {
  return await db.transaction(async (tx) => {
    const [fromRes] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, fromId));

    const [toRes] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, toId));

    const from = fromRes;
    const to = toRes;

    if (!from || !to) throw new Error("Account not found");
    if (from.currency !== currency || to.currency !== currency)
      throw new Error("Currency mismatch");

    if (!from.ledgerAccountId || !to.ledgerAccountId)
      throw new Error("Ledger account missing");

    if (Number(from.balance) < amount) throw new Error("Insufficient funds");

    const newFromBal = Number(from.balance) - amount;
    const newToBal = Number(to.balance) + amount;

    await tx
      .update(accounts)
      .set({ balance: newFromBal.toFixed(2) })
      .where(eq(accounts.id, fromId));

    await tx
      .update(accounts)
      .set({ balance: newToBal.toFixed(2) })
      .where(eq(accounts.id, toId));

    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "TRANSFER",
        amount,
        currency,
        fromAccountId: fromId,
        toAccountId: toId,
        status: "COMPLETED",
      } as any)
      .returning();

    const [journal] = await tx
      .insert(journalEntries)
      .values({
        transactionId: txn.id,
        description: `Transfer ${amount} ${currency}`,
      })
      .returning();

    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: to.ledgerAccountId,
        side: "DEBIT",
        amount: amount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId: from.ledgerAccountId,
        side: "CREDIT",
        amount: amount.toFixed(2),
      },
    ]);

    return txn;
  });
}

export async function getAccountTransactions(accountId: string) {
  try {
    if (!accountId) throw new Error("Account ID is required");

    const data = await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromAccountId, accountId),
          eq(transactions.toAccountId, accountId),
        ),
      )
      .orderBy(desc(transactions.createdAt));

    const formatted = data.map((tx) => {
      let direction: "IN" | "OUT" = "IN";

      if (tx.fromAccountId === accountId) {
        direction = "OUT";
      }

      return {
        ...tx,
        direction,
        signedAmount: direction === "OUT" ? `-${tx.amount}` : `+${tx.amount}`,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error getting account transactions:", error);
    throw new Error("Failed to fetch account transactions");
  }
}

export async function getAllTransactions() {
  try {
    const data = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));

    return data;
  } catch (error) {
    console.error("Error getting all transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}
