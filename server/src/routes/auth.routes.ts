import { Router } from "express";
import {
  register,
  login,
  refresh,
  logoutAll,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout-all", authenticate, logoutAll);

router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

export default router;
