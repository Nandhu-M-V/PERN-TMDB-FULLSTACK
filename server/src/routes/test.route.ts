import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ user: req.user });
});

export default router;
