import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/lib/models/chat";
import mongoose from "mongoose";
import { getPusherServer } from "@/lib/pusher-server";

const pusherServer = getPusherServer();

// --- User Schema (lightweight, hanya untuk lookup) ---
const userSchema = new mongoose.Schema({
  name: String,
  image: String,
});

// helper biar tidak redefine model terus
const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

// =======================
// ✅ GET MESSAGES
// =======================
export async function GET() {
  try {
    await connectDB();

    const messages = await Chat.find().sort({ createdAt: -1 }).limit(50).lean();

    const populated = await Promise.all(
      messages.map(async (msg: any) => {
        let userData = null;

        try {
          // ✅ hanya query kalau valid ObjectId
          if (mongoose.Types.ObjectId.isValid(msg.senderId)) {
            userData = await User.findById(msg.senderId)
              .select("name image")
              .lean();
          }
        } catch (e) {
          console.error("User lookup error:", msg.senderId);
        }

        return {
          ...msg,
          sender: userData || {
            name: msg.senderName || "Unknown",
            image: null,
          },
        };
      }),
    );

    return NextResponse.json(populated.reverse(), { status: 200 });
  } catch (error: any) {
    console.error("CRITICAL BACKEND ERROR (GET):", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// =======================
// ✅ SEND MESSAGE
// =======================
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { senderId, senderName, message, role } = body;

    // ✅ VALIDASI WAJIB (biar gak crash)
    if (!senderId || !senderName || !message) {
      return NextResponse.json(
        { error: "senderId, senderName, dan message wajib diisi" },
        { status: 400 },
      );
    }

    const newMessage = await Chat.create({
      senderId,
      senderName,
      message,
      role: role || "operator",
    });

    let userDetail = null;

    try {
      // ✅ hanya query kalau valid ObjectId
      if (mongoose.Types.ObjectId.isValid(senderId)) {
        userDetail = await User.findById(senderId).select("name image").lean();
      }
    } catch (e) {
      console.error("User lookup error (POST):", senderId);
    }

    const finalData = {
      ...newMessage.toObject(),
      sender: userDetail || {
        name: senderName,
        image: null,
      },
    };

    // ✅ Pusher (safe)
    try {
      console.log("ENV CHECK:", {
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
      });
      await pusherServer.trigger("chat-channel", "incoming-message", finalData);
    } catch (err) {
      console.error("Pusher error:", err);
    }

    return NextResponse.json(finalData, { status: 201 });
  } catch (error: any) {
    console.error("CRITICAL BACKEND ERROR (POST):", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
