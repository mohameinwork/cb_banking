import { Request, Response } from "express";
import * as Reports from "../services/report.service.js";
import { dailyRange, monthlyRange, yearlyRange } from "../utils/date.js";

export async function daily(req: Request, res: Response) {
  const { start, end } = dailyRange();
  res.json(await Reports.financialSummary(start, end));
}

export async function monthly(req: Request, res: Response) {
  const { year, month } = req.params;
  const { start, end } = monthlyRange(Number(year), Number(month));
  res.json(await Reports.financialSummary(start, end));
}

export async function yearly(req: Request, res: Response) {
  const { year } = req.params;
  const { start, end } = yearlyRange(Number(year));
  res.json(await Reports.financialSummary(start, end));
}

export async function trial(req: Request, res: Response) {
  const { year, month } = req.params;
  const { start, end } = monthlyRange(Number(year), Number(month));
  res.json(await Reports.trialBalance(start, end));
}
