import express from "express";
import {
  createLoan,
  deleteLoan,
  getLoans,
  makeLoanPayment,
  updateLoan,
} from "../controllers/loan.controller";

const router = express.Router();

// Get all loans
// Private Route
router.get("/all", getLoans);

// Create a loan
// Private Route
router.post("/", createLoan);

// Update a loan
// Private Route
router.put("/:id", updateLoan);

// Delete a loan
// Private Route
router.delete("/:id", deleteLoan);

// Make a payment
// Private Route
router.post("/make-payment", makeLoanPayment);

export default router;
