import mongoose, { Schema, Document } from "mongoose";

// Interface untuk TypeScript agar type-safe
export interface IChat extends Document {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  message: string;
  role: "admin" | "operator" | "system"; // Membedakan jenis pengirim
  createdAt: Date;
}

const ChatSchema: Schema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Harus sama dengan nama model di API route
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "operator", "system"],
      default: "operator",
    },
  },
  {
    timestamps: true, // Otomatis membuat field createdAt dan updatedAt
  },
);

// Mencegah error "OverwriteModelError" saat hot-reloading di Next.js
const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
