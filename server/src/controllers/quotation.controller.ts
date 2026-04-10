import { Request, Response } from "express";
import {
  createQuotationService,
  getQuotationsService,
  getQuotationByIdService,
  payQuotationPartialService,
  deleteQuotationService,
  getQuotationPaymentsService,
  updateQuotationService,
} from "../services/quotation.service.js";

//
// CREATE
//
export async function createQuotation(req: Request, res: Response) {
  try {
    const { companyAccountId, title, description, total } = req.body;

    if (!companyAccountId || !title || !total)
      return res.status(400).json({ message: "Missing required fields" });

    const result = await createQuotationService({
      companyAccountId,
      title,
      description,
      total: Number(total),
      items: req.body.items || [],
    });

    return res.status(201).json({
      message: "Quotation created",
      data: result,
    });
  } catch (error: any) {
    console.error("Create quotation error:", error);
    return res.status(500).json({ message: error.message });
  }
}

//
// GET ALL
//
export async function getQuotations(req: Request, res: Response) {
  try {
    const data = await getQuotationsService();

    return res.json({
      message: "Quotations fetched",
      data,
    });
  } catch (error) {
    console.error("Fetch quotations error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//
// GET ONE
//
export async function getQuotationById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const data = await getQuotationByIdService(id as string);

    return res.json({
      message: "Quotation fetched",
      data,
    });
  } catch (error: any) {
    console.error("Fetch quotation error:", error);
    return res.status(404).json({ message: error.message });
  }
}

//
// PAY
//
export async function payQuotation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0)
      return res
        .status(400)
        .json({ message: "Payment amount must be greater than zero" });

    const result = await payQuotationPartialService({
      quotationId: id as string,
      amount: Number(amount),
    });

    return res.json({
      message: "Quotation paid successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Pay quotation error:", error);
    return res.status(400).json({ message: error.message });
  }
}

// Update quotation (for testing purposes, not part of requirements)
export async function updateQuotation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, total } = req.body;

    if (!title || !total)
      return res.status(400).json({ message: "Missing required fields" });

    const result = await updateQuotationService(id as string, {
      title,
      description,
      items: req.body.items || [],
    });

    return res.json({
      message: "Quotation updated",
      data: result,
    });
  } catch (error: any) {
    console.error("Update quotation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//
// DELETE
//
export async function deleteQuotation(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await deleteQuotationService(id as string);

    return res.json(result);
  } catch (error: any) {
    console.error("Delete quotation error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export async function getQuotationPayments(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const data = await getQuotationPaymentsService(id as string);

    return res.json({
      message: "Quotation payments fetched",
      data,
    });
  } catch (error) {
    console.error("Fetch quotation payments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
