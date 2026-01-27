import { Router } from "express";
import {
  depositFn as deposit,
  withdrawFn as withdraw,
  transferFn as transfer,
  createAccount,
  getAccounts,
} from "../controllers/accounts.controller";
import { auth } from "../middleware/auth";
// import { idempotent } from "../middlewares/idempotency.ts";
import { validate } from "../middleware/validate";
import {
  depositSchema,
  withdrawSchema,
  transferSchema,
} from "../validation/transaction.v";

const router = Router();

// Create Account
router.post("/", createAccount);
// Account Transactions
router.post("/deposit", validate(depositSchema), deposit);

// Withdrawals
router.post("/withdraw", validate(withdrawSchema), withdraw);

// Transfers
router.post("/transfer", validate(transferSchema), transfer);

// Get accounts
router.get("/all", getAccounts);

export default router;
