'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      hideWidget?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
  }
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('tawk-sdk')) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Hide Tawk's default widget bubble so your custom button handles it exclusively
    window.Tawk_API.onLoad = function () {
      if (typeof window.Tawk_API?.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      }
    };

    const s1 = document.createElement('script');
    s1.id = 'tawk-sdk';
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6af2eeffa3ee303c40518963/1k72fb5v0';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (window.Tawk_API) {
      if (!isOpen && typeof window.Tawk_API.maximize === 'function') {
        window.Tawk_API.maximize();
      } else if (typeof window.Tawk_API.minimize === 'function') {
        window.Tawk_API.minimize();
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