import {
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountNumber: text("account_number").notNull().unique(),
  currency: text("currency").notNull(), // USD|SLSH
  balance: numeric("balance", { precision: 18, scale: 2 }).default("0.00"),
  status: text("status").default("ACTIVE"),
  ledgerAccountId: uuid("ledger_account_id"), // FK to ledger_accounts.id
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  fromAccountId: uuid("from_account_id"),
  toAccountId: uuid("to_account_id"),
  status: text("status").default("COMPLETED"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: uuid("id").defaultRandom().primaryKey(),

  baseCurrency: text("base_currency").notNull(), // e.g USD
  quoteCurrency: text("quote_currency").notNull(), // e.g SLSH
  rate: numeric("rate", { precision: 18, scale: 6 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loans = pgTable("loans", {
  id: uuid("id").defaultRandom().primaryKey(),

  accountId: uuid("account_id").notNull(),

  principal: numeric("principal", { precision: 18, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(), // % per month
  termMonths: integer("term_months").notNull(),

  status: text("status")
    .$type<"ACTIVE" | "PAID" | "DEFAULTED">()
    .default("ACTIVE"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const loanPayments = pgTable("loan_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  loanId: uuid("loan_id").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ledgerAccounts = pgTable("ledger_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: text("code").notNull().unique(), // e.g. 1000
  name: text("name").notNull(), // e.g. Cash on Hand

  type: text("type")
    .$type<"ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE">()
    .notNull(),
});

// =============================
// Journal Entry Header
// =============================
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================
// Ledger Entries (Double-Entry Lines)
// =============================
export const journalLines = pgTable("journal_lines", {
  id: uuid("id").defaultRandom().primaryKey(),

  journalId: uuid("journal_id")
    .notNull()
    .references(() => journalEntries.id),

  ledgerAccountId: uuid("ledger_account_id")
    .notNull()
    .references(() => ledgerAccounts.id),

  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),

  side: text("side").$type<"DEBIT" | "CREDIT">().notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const quotation = pgTable("quotation", {
  id: uuid("id").defaultRandom().primaryKey(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  company_name: text("company_name").notNull(),
  container_no: text("container_no").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
