"use client";

let pusherClient: any = null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;

  // hanya init sekali
  if (!pusherClient) {
    const Pusher = require("pusher-js/with-encryption");

    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }

  return pusherClient;
};
