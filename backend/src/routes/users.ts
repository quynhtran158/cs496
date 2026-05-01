// ported from gbthang - users/me endpoint - 2026-04-17
import { Router, Response } from "express";
import User from "../models/User";
import Event from "../models/Event";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/users/me — current user + their created events + registered events
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const [createdEvents, registeredEvents] = await Promise.all([
      Event.find({ organizer_id: req.userId }).sort({ createdAt: -1 }),
      Event.find({ attendees: req.userId })
        .sort({ createdAt: -1 })
        .populate("organizer_id", "name username"),
    ]);

    res.json({
      user,
      createdEvents,
      registeredEvents,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
