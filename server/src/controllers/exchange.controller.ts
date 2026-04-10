import { Request, Response } from "express";
import {
  setRate,
  getRate,
  exchange as exchangeService,
  getExchangeTransactions,
} from "../services/exchange.service.js";

export async function setRates(req: Request, res: Response) {
  const { baseCurrency, quoteCurrency, rate } = req.body;
  const updated = await setRate(baseCurrency, quoteCurrency, rate);
  res.json({ message: "Rate updated", rate: updated });
}

export async function getRates(req: Request, res: Response) {
  try {
    const { base = "USD", quote = "SLSH" } = req.query;
    const rate = await getRate(String(base), String(quote));
    res.json({
      baseCurrency: base,
      quoteCurrency: quote,
      rate,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching rate:", error);
    res.status(404).json({ message: error.message || "Rate not found" });
  }
}

export async function exchange(req: Request, res: Response) {
  try {
    const { targetAccountId, targetAmount, rate } = req.body;

    const data = await exchangeService({
      targetAccountId,
      targetAmount,
      rate,
    });

    res.json({ message: "Exchange successful", data });
  } catch (error: any) {
    console.error("Error processing exchange:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}
export async function getExchanges(req: Request, res: Response) {
  try {
    const exchanges = await getExchangeTransactions();
    res.json({ data: exchanges });
  } catch (error: any) {
    console.error("Error fetching exchanges:", error);
    res.status(500).json({ message: "Failed to fetch exchanges" });
  }
}
