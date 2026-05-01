import mongoose from "mongoose";

// ported from gbthang - added attendees array - 2026-04-17
export type EventType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  organizer_id: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model<EventType>("Event", eventSchema);

export default Event;
