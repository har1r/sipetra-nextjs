"use client";

import { useState, useEffect, useRef } from "react";
// Import hook session dari library Better Auth Anda
// Sesuaikan path import ini dengan setup project Anda
import { authClient } from "@/lib/auth/auth-client";

export default function ChatUI() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mengambil session aktif dari Better Auth
  const { data: session } = authClient.useSession();

  // Ambil data user dari session, berikan fallback agar tidak error saat loading
  const MY_NAME = session?.user?.name || "User";
  const MY_ID = session?.user?.id;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error("Gagal load chat:", err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    // Validasi: Jangan kirim jika input kosong atau user belum login
    if (!inputValue.trim() || !MY_ID) return;

    const currentText = inputValue;
    setInputValue("");

    // Optimistic Update
    const tempMsg = {
      _id: Date.now().toString(),
      senderName: MY_NAME,
      message: currentText,
      createdAt: new Date(),
      senderId: { name: MY_NAME },
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: MY_ID, // Sekarang menggunakan ID asli dari Better Auth
          senderName: MY_NAME,
          message: currentText,
          role: "operator",
        }),
      });

      if (!res.ok) throw new Error("Gagal simpan ke database");

      const savedMsg = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMsg._id ? savedMsg : m)),
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-[450px] bg-card/50 border border-border rounded-[2rem] p-4 shadow-sm backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-2 shrink-0">
        <div className="h-2 w-2 rounded-full bg-mongo-green animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Operator Channel
        </h3>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 pr-2 mb-2 flex flex-col"
      >
        <div className="flex-1" />
        <div className="space-y-4 pb-2">
          {messages.map((msg) => {
            const displayName =
              msg.senderId?.name || msg.senderName || "Unknown User";

            // Cek apakah pengirim adalah user yang sedang login
            const isMe =
              msg.senderId?._id === MY_ID || msg.senderName === MY_NAME;

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-1`}
              >
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <span className="text-[10px] font-bold text-foreground">
                    {displayName}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${isMe ? "rounded-tr-none bg-mongo-green text-white shadow-md shadow-mongo-green/10" : "rounded-tl-none bg-muted/80 text-foreground border border-border/50"}`}
                >
                  <p className="text-[11px] leading-relaxed">{msg.message}</p>
                </div>
                <span className="text-[9px] text-muted-foreground px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 pt-2 border-t border-border/50 mt-auto">
        <div className="flex items-end gap-2 p-1.5 bg-background border-2 border-muted rounded-2xl focus-within:border-mongo-green/50 transition-all duration-300">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            // Disable input jika session belum siap
            disabled={!session}
            placeholder={session ? "Ketik pesan..." : "Silahkan login..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] px-2 py-2 resize-none max-h-[120px] no-scrollbar disabled:opacity-50"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!session}
            className="h-9 w-9 rounded-xl bg-mongo-green text-white flex items-center justify-center shrink-0 mb-0.5 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4 rotate-45"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
