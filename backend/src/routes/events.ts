import { Router, Request, Response } from "express";
import Event from "../models/Event";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/events — create a new event (protected)
// ported from gbthang - back-end validation - 2026-04-17
router.post("/", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, time, location, capacity } = req.body;

    const errors: Record<string, string> = {};

    if (!title || !String(title).trim()) errors.title = "Title is required";
    if (!description || !String(description).trim()) {
      errors.description = "Description is required";
    } else if (String(description).trim().length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (!date) {
      errors.date = "Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(`${date}T00:00:00`);
      if (isNaN(selected.getTime())) {
        errors.date = "Invalid date";
      } else if (selected < today) {
        errors.date = "Date cannot be in the past";
      }
    }

    if (!time) errors.time = "Time is required";
    if (!location || !String(location).trim()) errors.location = "Location is required";

    const cap = Number(capacity);
    if (!capacity && capacity !== 0) {
      errors.capacity = "Capacity is required";
    } else if (Number.isNaN(cap) || !Number.isFinite(cap) || cap < 1 || !Number.isInteger(cap)) {
      errors.capacity = "Capacity must be a positive whole number";
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const event = await Event.create({
      title: String(title).trim(),
      description: String(description).trim(),
      date,
      time,
      location: String(location).trim(),
      capacity: cap,
      organizer_id: req.userId,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

// GET /api/events — fetch all events (public)
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate("organizer_id", "name username")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

// GET /api/events/:id — fetch a single event (public)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer_id",
      "name username"
    );

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

// POST /api/events/:id/join — register as attendee (protected)
// ported from gbthang - join endpoint - 2026-04-17
router.post("/:id/join", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const alreadyJoined = event.attendees.some(
      (a) => a.toString() === req.userId
    );
    if (alreadyJoined) {
      res.json({ message: "Already registered", event });
      return;
    }

    if (event.attendees.length >= event.capacity) {
      res.status(400).json({ message: "Event is sold out" });
      return;
    }

    event.attendees.push(req.userId as unknown as import("mongoose").Types.ObjectId);
    await event.save();

    res.json({ message: "Successfully registered", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
