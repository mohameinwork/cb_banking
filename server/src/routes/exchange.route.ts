import { Router } from "express";
import { exchange, setRates } from "../controllers/exchange.controller";
import { validate } from "../middleware/validate";
// import { auth } from "../middlewares/auth";
// import { requireRole } from "../middlewares/roles";
import { setRateSchema, exchangeSchema } from "../validation/exchange.v";

const router = Router();

router.post("/rate", validate(setRateSchema), setRates);

router.post("/convert", exchange);

export default router;
