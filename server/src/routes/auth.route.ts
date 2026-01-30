import { Router } from "express";
import * as AuthController from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/auth.v.js";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/profile", AuthController.getProfile);
router.delete("/delete/:id", AuthController.deleteAccount);
router.put("/update-password/:id", AuthController.updatePassword);
router.get("/users", AuthController.getUsers);
router.put("/users/:id/role", AuthController.changeUserRole);

export default router;
