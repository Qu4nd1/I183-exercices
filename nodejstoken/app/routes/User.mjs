import express from "express";
import { register } from "../auth.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    await register(username, password);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (err.message === "Invalid input") {
      return res.status(400).json({ error: "Invalid input" });
    }
    if (err.message === "Username already taken") {
      return res.status(409).json({ error: "Username already taken" });
    }
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
