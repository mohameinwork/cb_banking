import { Request, Response } from "express";
import {
  deposit,
  transfer,
  withdraw,
} from "../services/transaction.service.js";
import {
  createAccount as createAccountService,
  getAllAccounts,
} from "../services/accounts.service.js";
export async function createAccount(req: Request, res: Response) {
  try {
    const { currency, type, name, phone, companyAccountId } = req.body;

    const account = await createAccountService({
      type,
      name,
      phone,
      companyAccountId,
      currency,
    });
    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function depositFn(req: Request, res: Response) {
  try {
    const { id, amount, currency } = req.body;

    const accountId = parseId(id);
    const parsedAmount = parseAmount(amount);
    const parsedCurrency = parseCurrency(currency);

    const txn = await deposit(accountId, parsedAmount, parsedCurrency);

    return res.status(200).json({
      message: "Deposit successful",
      data: txn,
    });
  } catch (error: any) {
    console.error("Deposit error:", error);

    return res.status(400).json({
      message: error.message || "Failed to deposit",
    });
  }
}

export async function withdrawFn(req: Request, res: Response) {
  try {
    const { id, amount, currency } = req.body;

    const accountId = parseId(id);
    const parsedAmount = parseAmount(amount);
    const parsedCurrency = parseCurrency(currency);

    const txn = await withdraw(accountId, parsedAmount, parsedCurrency);

    return res.status(200).json({
      message: "Withdrawal successful",
      data: txn,
    });
  } catch (error: any) {
    console.error("Withdraw error:", error);

    return res.status(400).json({
      message: error.message || "Failed to withdraw",
    });
  }
}
export async function transferFn(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { toAccountId, amount, currency } = req.body;

    const fromAccountId = parseId(id);
    const targetAccountId = parseId(toAccountId);
    const parsedAmount = parseAmount(amount);
    const parsedCurrency = parseCurrency(currency);

    if (fromAccountId === targetAccountId) {
      return res.status(400).json({
        message: "Cannot transfer to the same account",
      });
    }

    const txn = await transfer(
      fromAccountId,
      targetAccountId,
      parsedAmount,
      parsedCurrency,
    );

    return res.status(200).json({
      message: "Transfer successful",
      data: txn,
    });
  } catch (error: any) {
    console.error("Transfer error:", error);

    return res.status(400).json({
      message: error.message || "Failed to transfer",
    });
  }
}

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await getAllAccounts();

    res.status(200).json({
      message: "Get accounts successful",
      accounts,
    });
  } catch (error) {
    console.error("Error at getting accounts:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

// Helper functions for service layer
function parseId(id: any): string {
  if (!id) throw new Error("ID is required");
  return Array.isArray(id) ? id[0] : id;
}

function parseAmount(amount: any): number {
  const parsed = Number(amount);
  if (!parsed || parsed <= 0) {
    throw new Error("Amount must be greater than zero");
  }
  return parsed;
}

function parseCurrency(currency: any): "USD" | "SLSH" {
  if (currency !== "USD" && currency !== "SLSH") {
    throw new Error("Invalid currency");
  }
  return currency;
}
