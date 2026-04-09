import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

// --- Schema ---
const ChatSchema = new Schema(
  {
    senderId: {
      type: String,
      required: [true, "senderId wajib diisi"],
      trim: true,
    },
    senderName: {
      type: String,
      required: [true, "senderName wajib diisi"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "message wajib diisi"],
      trim: true,
      minlength: [1, "message tidak boleh kosong"],
      maxlength: [1000, "message terlalu panjang"],
    },
    role: {
      type: String,
      enum: ["admin", "operator", "system"],
      default: "operator",
    },
  },
  {
    timestamps: true,
  },
);

// --- Index (biar query cepat) ---
ChatSchema.index({ createdAt: -1 });

// --- Type Inference ---
export type ChatType = InferSchemaType<typeof ChatSchema>;

// --- Model ---
const Chat = models.Chat || model<ChatType>("Chat", ChatSchema);

export default Chat;
