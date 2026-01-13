import { Request, Response } from "express";
import {
  setRate,
  getRate,
  exchange as exchangeService,
} from "../services/exchange.service";

export async function setRates(req: Request, res: Response) {
  const { baseCurrency, quoteCurrency, rate } = req.body;
  const updated = await setRate(baseCurrency, quoteCurrency, rate);
  res.json({ message: "Rate updated", rate: updated });
}

export async function exchange(req: Request, res: Response) {
  try {
    const {
      userId,
      sourceAccountId,
      targetAccountId,
      sourceAmount,
      sourceCurrency,
      targetAmount,
      targetCurrency,
      rate,
    } = req.body;

    //
    // 1️⃣ VALIDATE INPUT
    //
    if (!sourceAmount || Number(sourceAmount) <= 0)
      return res
        .status(400)
        .json({ message: "Source amount must be greater than zero" });

    if (!targetAmount || Number(targetAmount) <= 0)
      return res
        .status(400)
        .json({ message: "Target amount must be greater than zero" });

    if (!sourceCurrency || !targetCurrency)
      return res.status(400).json({ message: "Both currencies are required" });

    if (sourceCurrency === targetCurrency)
      return res.status(400).json({ message: "Currencies must be different" });

    if (!rate || Number(rate) <= 0)
      return res.status(400).json({ message: "Invalid rate" });

    //
    // 2️⃣ CALL SERVICE
    //
    const result = await exchangeService({
      userId: String(userId),
      sourceAccountId: String(sourceAccountId),
      targetAccountId: String(targetAccountId),
      sourceAmount: Number(sourceAmount),
      sourceCurrency: sourceCurrency as "USD" | "SLSH",
      targetAmount: Number(targetAmount),
      targetCurrency: targetCurrency as "USD" | "SLSH",
      rate: Number(rate),
    });

    //
    // 3️⃣ SUCCESS RESPONSE
    //
    return res.status(201).json({
      message: "Successfully exchanged",
      data: result,
    });
  } catch (error) {
    console.error("Error processing exchange:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
