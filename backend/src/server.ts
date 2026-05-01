// ported from gbthang - socket.io + error middleware - 2026-04-17
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import eventRoutes from "./routes/events";
import chatroomRoutes from "./routes/chatrooms";
import userRoutes from "./routes/users";
import ChatMessage from "./models/ChatMessage";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err.message);
  });

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "CS496 Backend is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chatrooms", chatroomRoutes);
app.use("/api/users", userRoutes);

// ─── 404 Handler (unknown API routes) ────────────────────────────────────────
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Centralized Error-Handling Middleware ───────────────────────────────────
// ported from gbthang - central error handler - 2026-04-17
interface HttpError extends Error {
  status?: number;
  errors?: Record<string, string>;
}

app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[server error]", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(err.errors ? { errors: err.errors } : {}),
  });
});

// ─── Socket.io Logic ─────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Client emits join_room with { eventId, username }
  socket.on("join_room", ({ eventId }: { eventId: string; username: string }) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined room ${eventId}`);
  });

  // Client emits send_message with { eventId, userId, username, text }
  socket.on(
    "send_message",
    async (data: { eventId: string; userId: string; username: string; text: string }) => {
      try {
        const msg = await ChatMessage.create({
          eventId: data.eventId,
          userId: data.userId,
          username: data.username,
          text: data.text,
        });
        io.to(data.eventId).emit("receive_message", msg);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    }
  );

  socket.on("leave_room", ({ eventId }: { eventId: string }) => {
    socket.leave(eventId);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
