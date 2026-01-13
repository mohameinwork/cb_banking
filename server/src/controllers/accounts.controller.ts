import { Request, Response } from "express";
import { deposit, transfer, withdraw } from "../services/transaction.service";
import {
  createAccount as createAccountService,
  getAllAccounts,
} from "../services/accounts.service";
export async function createAccount(req: Request, res: Response) {
  try {
    const { userId, currency, account_number, balance } = req.body;

    const account = await createAccountService(
      userId,
      currency,
      account_number,
      balance
    );
    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function depositFn(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount, currency } = req.body;

    const txn = await deposit(id, amount, currency);
    res.json({ message: "Deposit successful", transaction: txn });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function withdrawFn(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount, currency } = req.body;

    const txn = await withdraw(id, Number(amount), currency);
    res.json({ message: "Withdrawal successful", transaction: txn });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function transferFn(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { toAccountId, amount, currency } = req.body;

    const txn = await transfer(id, toAccountId, amount, currency);
    res.json({ message: "Transfer successful", transaction: txn });
  } catch (error) {
    console.error("Error processing transfer:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
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
