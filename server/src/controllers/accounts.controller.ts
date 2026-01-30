import { Request, Response } from "express";
import {
  deposit,
  transfer,
  withdraw,
} from "../services/transaction.service.js";
import {
  createAccount as createAccountService,
  getAllAccounts,
} from "../services/accounts.service";
export async function createAccount(req: Request, res: Response) {
  try {
    const { userId, currency, account_number } = req.body;

    const account = await createAccountService(
      userId,
      currency,
      account_number,
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
    const { amount, currency, id } = req.body;

    console.log("Deposit request body:", req.body);

    const accountId = Array.isArray(id) ? id[0] : id;
    const txn = await deposit(accountId, Number(amount), String(currency));
    res.json({ message: "Deposit successful", transaction: txn });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function withdrawFn(req: Request, res: Response) {
  try {
    const { amount, currency, id } = req.body;

    const accountId = Array.isArray(id) ? id[0] : id;
    const txn = await withdraw(accountId, Number(amount), String(currency));
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

    const fromAccountId = Array.isArray(id) ? id[0] : id;
    const toId = Array.isArray(toAccountId) ? toAccountId[0] : toAccountId;
    const txn = await transfer(
      fromAccountId,
      toId,
      Number(amount),
      String(currency),
    );
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
