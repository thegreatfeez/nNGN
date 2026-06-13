import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", (req, res) => {
  const { pin } = req.body ?? {};
  if (!pin || pin !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Invalid PIN" });
  }
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
  res.json({ token });
});

export default router;
