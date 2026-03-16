"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    FrontChat: (action: string, options?: Record<string, unknown>) => void;
  }
}

export default function FrontChatWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement("script");
    script.src = "https://chat-assets.frontapp.com/v1/chat.bundle.js";
    script.async = true;
    script.onload = () => {
      window.FrontChat("init", {
        chatId: "95e8e0a8faae25e35e81b21b4dcb16c0",
        useDefaultLauncher: true,
        name: "Brian Smith",
        email: "brian.smith@fairwaymc.com",
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
