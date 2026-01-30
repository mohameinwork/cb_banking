import express from "express";
import { getAllTran } from "../controllers/transaction.controller.js";

const router = express.Router();

// Get all transaction
router.get("/all", getAllTran);

export default router;
