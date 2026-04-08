import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/lib/models/chat";
import mongoose from "mongoose";

// Better Auth biasanya membuat koleksi bernama "user" atau "users"
// Kita buat skema minimal agar populate tahu arahnya ke mana
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      name: String,
      image: String,
    }),
    "user",
  ); // Parameter ketiga "user" adalah nama koleksi asli di MongoDB

export async function GET() {
  try {
    await connectDB();

    const messages = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({
        path: "senderId",
        select: "name image", // Ambil name dan foto profil dari Better Auth
        model: User, // Gunakan shadow model tadi
      });

    return NextResponse.json(messages.reverse(), { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pesan" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { senderId, senderName, message, role } = body;

    if (!senderId || !message) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const newMessage = await Chat.create({
      senderId,
      senderName, // Kita tetap simpan ini sebagai backup/denormalisasi
      message,
      role: role || "operator",
    });

    // Kembalikan data yang sudah ter-populate agar UI langsung update dengan benar
    const populatedMessage = await Chat.findById(newMessage._id).populate({
      path: "senderId",
      select: "name image",
      model: User,
    });

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
