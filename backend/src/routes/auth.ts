// ported from gbthang - auth validation - 2026-04-17
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD = 8;
const MIN_USERNAME = 4;

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;

    const errors: Record<string, string> = {};

    if (!username || !String(username).trim()) {
      errors.username = "Username is required";
    } else if (String(username).trim().length < MIN_USERNAME) {
      errors.username = `Username must be at least ${MIN_USERNAME} characters`;
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!EMAIL_RE.test(String(email))) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (String(password).length < MIN_PASSWORD) {
      errors.password = `Password must be at least ${MIN_PASSWORD} characters`;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(409).json({
        message: "Email already in use",
        errors: { email: "Email already in use" },
      });
      return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(409).json({
        message: "Username already taken",
        errors: { username: "Username already taken" },
      });
      return;
    }

    const user = await User.create({ name, username, email, password });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!EMAIL_RE.test(String(email))) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (String(password).length < MIN_PASSWORD) {
      errors.password = `Password must be at least ${MIN_PASSWORD} characters`;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
