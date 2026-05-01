// ported from gbthang - ChatMessage model - 2026-04-17
import mongoose from "mongoose";

export type ChatMessageType = {
  _id: string;
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  text: string;
  createdAt: Date;
};

const chatMessageSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ChatMessage = mongoose.model<ChatMessageType>("ChatMessage", chatMessageSchema);

export default ChatMessage;
