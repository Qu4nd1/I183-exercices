import express from "express";
import { login } from "../auth.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await login(username, password);
    res.status(200).json({ message: "Authentication successful", token });
  } catch (err) {
    if (err.message === "Invalid input") {
      return res.status(400).json({ error: "Invalid input" });
    }
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.error("Error authenticating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
