'use client';

import { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'admin' | 'user';
};

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! Welcome to Crystal Investments. How can we help you today?',
      sender: 'admin',
    },
  ]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = inputMessage.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: 'user' },
    ]);

    setInputMessage('');
  };

  return (
    <div className="fixed bottom-6 right-4 z-[100]">
      {isOpen ? (
        <div className="flex h-[420px] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-2xl sm:w-80">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#1559e8] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle size={18} />
              </div>

              <div>
                <h4 className="text-sm font-bold">How can we help?</h4>
                <p className="flex items-center gap-1 text-[10px] text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  We’re here to help
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 hover:bg-white/15"
            >
              <X size={19} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-white p-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'ml-auto rounded-br-none bg-[#2563eb] text-white'
                    : 'mr-auto rounded-bl-none border border-gray-200 bg-gray-50 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-gray-200 bg-white p-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-3 py-2 text-xs text-gray-900 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              aria-label="Send message"
              className="rounded-full bg-[#2563eb] p-2 text-white hover:bg-blue-700"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
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
      )}
    </div>
  );
}
