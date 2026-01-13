import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  daily,
  monthly,
  yearly,
  trial,
} from "../controllers/report.controller";

const router = Router();

router.get("/daily", auth, daily);
router.get("/monthly/:year/:month", auth, monthly);
router.get("/yearly/:year", auth, yearly);
router.get("/trial/:year/:month", auth, trial);

export default router;
