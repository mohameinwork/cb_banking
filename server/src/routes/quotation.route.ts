import express from "express";
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  deleteQuotation,
  payQuotation,
  getQuotationPayments,
  updateQuotation,
} from "../controllers/quotation.controller.js";

const router = express.Router();

// Routes
router.post("/", createQuotation);
router.get("/", getQuotations);
router.post("/:id/pay", payQuotation);
router.get("/:id/payments", getQuotationPayments);
router.get("/:id", getQuotationById);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

export default router;
