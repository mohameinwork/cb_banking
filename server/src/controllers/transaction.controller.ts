import { Request, Response } from "express";
import {
  getAccountTransactions,
  getAllTransactions,
} from "../services/transaction.service.js";

export const getAllTran = async (req: Request, res: Response) => {
  try {
    const accountId = (req.query.accountId as string) ?? "";
    const transactions = accountId
      ? await getAccountTransactions(accountId)
      : await getAllTransactions();

    res.status(200).json({
      message: "Fetched Successfully",
      data: transactions,
    });
  } catch (error) {
    console.log("Error at getting transactions", error);
    res.status(500).json({ message: "Error at transactions" });
  }
};
