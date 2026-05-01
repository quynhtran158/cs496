// ported from gbthang - chat history endpoint - 2026-04-17
import { Router, Request, Response } from "express";
import ChatMessage from "../models/ChatMessage";
import { protect } from "../middleware/auth";

const router = Router();

// GET /api/chatrooms/:eventId/messages — fetch chat history for an event
router.get("/:eventId/messages", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await ChatMessage.find({ eventId: req.params.eventId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
