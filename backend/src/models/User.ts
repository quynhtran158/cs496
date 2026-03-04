import mongoose from "mongoose";
import bcrypt from "bcrypt";

export type UserType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  imageUrl?: string;
  bio?: string;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
