import { Request, Response } from "express";
import {
  setRate,
  getRate,
  exchange as exchangeService,
} from "../services/exchange.service.js";

export async function setRates(req: Request, res: Response) {
  const { baseCurrency, quoteCurrency, rate } = req.body;
  const updated = await setRate(baseCurrency, quoteCurrency, rate);
  res.json({ message: "Rate updated", rate: updated });
}

export async function exchange(req: Request, res: Response) {
  try {
    const { userId, sourceAccountId, targetAccountId, sourceAmount, rate } =
      req.body;

    if (!userId || !sourceAccountId || !targetAccountId)
      return res.status(400).json({ message: "Missing required fields" });

    if (!sourceAmount || Number(sourceAmount) <= 0)
      return res
        .status(400)
        .json({ message: "Source amount must be greater than zero" });

    if (!rate || Number(rate) <= 0)
      return res.status(400).json({ message: "Invalid exchange rate" });

    const result = await exchangeService({
      userId: String(userId),
      sourceAccountId: String(sourceAccountId),
      targetAccountId: String(targetAccountId),
      sourceAmount: Number(sourceAmount),
      rate: Number(rate),
    });

    return res.status(201).json({
      message: "Successfully exchanged",
      data: result,
    });
  } catch (error: any) {
    console.error("Error processing exchange:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}
