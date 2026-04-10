import { db } from "../db/index.js";
import {
  accounts,
  exchangeRates,
  journalEntries,
  journalLines,
  ledgerAccounts,
  transactions,
} from "../db/schema.js";
import { eq, and, sql, desc } from "drizzle-orm";

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

export async function setRate(base: string, quote: string, rate: number) {
  const [existing] = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote),
      ),
    );

  if (existing) {
    const [updated] = await db
      .update(exchangeRates)
      .set({ rate: String(rate), updatedAt: new Date() })
      .where(eq(exchangeRates.id, existing.id))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(exchangeRates)
    .values({
      baseCurrency: base,
      quoteCurrency: quote,
      rate: String(rate),
    })
    .returning();

  return created;
}

export async function getRate(base: string, quote: string) {
  const [rate] = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote),
      ),
    );

  if (!rate) {
    // Return default rate if not set
    if (base === "USD" && quote === "SLSH") {
      return 10800;
    }
    throw new Error("Exchange rate not set");
  }

  return Number(rate.rate);
}


export async function exchange({
  targetAccountId,
  targetAmount,
  rate,
}: {
  targetAccountId: string;
  targetAmount: number;
  rate: number;
}) {
  try {
    if (!targetAccountId) {
      throw new Error("Target account is required");
    }
    if (!targetAmount || targetAmount <= 0) {
      throw new Error("Target amount must be greater than zero");
    }

    if (!rate || rate <= 0) {
      throw new Error("Invalid exchange rate");
    }

    return await db.transaction(async (tx) => {
      const systemCashLedgerId = await getSystemCashLedgerId(tx);

      const targetRes = await tx
        .select()
        .from(accounts)
        .where(eq(accounts.id, targetAccountId));

      const targetAcc = targetRes[0] as any;

      if (!targetAcc) {
        throw new Error("Target account not found");
      }

      // Check exchange type based on target currency
      const isBuyingSLSH = targetAcc.currency === "SLSH";
      const sourceCurrency = isBuyingSLSH ? "USD" : "SLSH";
      const sourceAmount = isBuyingSLSH
        ? targetAmount / rate
        : targetAmount * rate;

      const targetCurrency = targetAcc.currency;
      // Update target account balance
      const newTargetBalance = Number(targetAcc.balance) + targetAmount;
      await tx
        .update(accounts)
        .set({ balance: newTargetBalance.toFixed(2) })
        .where(eq(accounts.id, targetAccountId));

      // Assume we have updated the system cash account accordingly in a real implementation

      // Record transaction
      const [txn] = await tx
        .insert(transactions)
        .values({
          type: "EXCHANGE",
          amount: sourceAmount,
          currency: sourceCurrency,
          fromAccountId: null, // System cash is not a user account
          toAccountId: targetAccountId,
          status: "COMPLETED",
          meta: {
            sourceAccountId: null,
            targetAccountId,
            sourceCurrency,
            targetCurrency,
            sourceAmount,
            targetAmount,
            rate,
          },
        } as any)
        .returning();

      //
      // 5️⃣ JOURNAL ENTRY
      //
      const [journal] = await tx
        .insert(journalEntries)
        .values({
          transactionId: txn.id,
          description: `FX ${sourceCurrency} → ${targetCurrency}`,
        })
        .returning();

      //
      // 6️⃣ DOUBLE-ENTRY JOURNAL
      //
      await tx.insert(journalLines).values([
        {
          journalId: journal.id,
          ledgerAccountId: targetAcc.ledgerAccountId,
          side: "DEBIT",
          amount: targetAmount.toFixed(2),
        },
        {
          journalId: journal.id,
          ledgerAccountId: systemCashLedgerId,
          side: "CREDIT",
          amount: sourceAmount.toFixed(2),
        },
      ]);

      const newSourceBalance = 0; // Since system cash account is not tracked here, we can return 0 or null
      return {
        transactionId: txn.id,
        exchange: {
          from: sourceCurrency,
          to: targetCurrency,
          rate,
        },
        balances: {
          source: newSourceBalance,
          target: newTargetBalance,
        },
      };
    });
  } catch (error: any) {
    console.error("Error processing exchange:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to process exchange");
  }
}

export async function getExchangeTransactions() {
  try {
    const exchangeTxns = await db
      .select()
      .from(transactions)
      .where(eq(transactions.type, "EXCHANGE"))
      .orderBy(desc(transactions.createdAt));

    return exchangeTxns;
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    throw new Error("Failed to fetch exchanges");
  }
}
