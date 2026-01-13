import { Request, Response } from "express";
import { getTransactions } from "../services/transaction.service";

export const getAllTran = async (req: Request, res: Response) => {
  try {
    const transactions = await getTransactions();

    res.status(200).json({
      message: "Fetched Successfully",
      data: transactions,
    });
  } catch (error) {
    console.log("Error at getting transactions", error);
    res.status(500).json({ message: "Error at transactions" });
  }
};
