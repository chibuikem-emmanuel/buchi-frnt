'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Inject Crisp script silently on mount so admin gets mobile notifications
    if (document.getElementById('crisp-sdk')) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "0491f10d-0a11-4ea3-a33b-83051e9d1730";

    const d = document;
    const s = d.createElement("script");
    s.id = 'crisp-sdk';
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);

    // Optional: Hide Crisp's default floating launcher bubble since you are using your own custom button
    window.$crisp.push(["set", "position:reverse", [true]]);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (window.$crisp) {
      if (!isOpen) {
        window.$crisp.push(['do', 'chat:open']);
      } else {
        window.$crisp.push(['do', 'chat:hide']);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-[100]">
      {/* Your Custom Floating Trigger Button */}
      <button
        type="button"
        onClick={toggleChat}
        aria-label="Open live chat"
        className="relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1677f8] to-[#1749df] py-2 pl-5 pr-2 text-sm font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-105"
      >
        {/* Online indicator */}
        <span className="absolute -bottom-0.5 left-1 h-4 w-4 rounded-full border-2 border-white bg-[#35e99b]" />

        <span>Chat</span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <MessageCircle
            size={25}
            strokeWidth={2.5}
            className="fill-white text-white"
          />
        </span>
      </button>
    </div>
  );
}