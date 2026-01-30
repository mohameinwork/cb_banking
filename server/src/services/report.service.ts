import { db } from "../db/index.js";
import { journalEntries, journalLines, ledgerAccounts } from "../db/schema.js";
import { and, gte, lte, eq } from "drizzle-orm";

export async function financialSummary(start: Date, end: Date) {
  const rows = await db
    .select({
      accountType: ledgerAccounts.type,
      side: journalLines.side,
      amount: journalLines.amount,
    })
    .from(journalLines)
    .innerJoin(journalEntries, eq(journalEntries.id, journalLines.journalId))
    .innerJoin(
      ledgerAccounts,
      eq(ledgerAccounts.id, journalLines.ledgerAccountId),
    )
    .where(
      and(
        gte(journalEntries.createdAt, start),
        lte(journalEntries.createdAt, end),
      ),
    );

  let assets = 0;
  let liabilities = 0;
  let revenue = 0;
  let expenses = 0;

  for (const row of rows) {
    const amt = Number(row.amount);

    switch (row.accountType) {
      case "ASSET":
        assets += row.side === "DEBIT" ? amt : -amt;
        break;

      case "LIABILITY":
        liabilities += row.side === "CREDIT" ? amt : -amt;
        break;

      case "REVENUE":
        revenue += row.side === "CREDIT" ? amt : 0;
        break;

      case "EXPENSE":
        expenses += row.side === "DEBIT" ? amt : 0;
        break;
    }
  }

  return {
    assets,
    liabilities,
    revenue,
    expenses,
    profit: revenue - expenses,
  };
}

export async function trialBalance(start: Date, end: Date) {
  const rows = await db
    .select({
      code: ledgerAccounts.code,
      name: ledgerAccounts.name,
      type: ledgerAccounts.type,
      side: journalLines.side,
      amount: journalLines.amount,
    })
    .from(journalLines)
    .innerJoin(journalEntries, eq(journalEntries.id, journalLines.journalId))
    .innerJoin(
      ledgerAccounts,
      eq(ledgerAccounts.id, journalLines.ledgerAccountId),
    )
    .where(
      and(
        gte(journalEntries.createdAt, start),
        lte(journalEntries.createdAt, end),
      ),
    );

  const map = new Map<
    string,
    { debit: number; credit: number; name: string }
  >();

  for (const row of rows) {
    const amt = Number(row.amount);

    if (!map.has(row.code)) {
      map.set(row.code, { debit: 0, credit: 0, name: row.name });
    }

    const entry = map.get(row.code)!;

    if (row.side === "DEBIT") entry.debit += amt;
    else entry.credit += amt;
  }

  return Array.from(map.entries()).map(([code, v]) => ({
    code,
    name: v.name,
    debit: v.debit,
    credit: v.credit,
  }));
}
