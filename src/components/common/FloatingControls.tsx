// src/components/common/FloatingControls.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, MessageCircle, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languageGroups = [
  {
    region: 'Popular / Global',
    items: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'es', name: 'Spanish', flag: '🇪🇸' },
      { code: 'fr', name: 'French', flag: '🇫🇷' },
      { code: 'de', name: 'German', flag: '🇩🇪' },
      { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
      { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    ],
  },
  {
    region: 'Middle East & Central Asia',
    items: [
      { code: 'fa', name: 'Persian (Farsi - Iran)', flag: '🇮🇷' },
      { code: 'tr', name: 'Turkish (Turkey)', flag: '🇹🇷' },
      { code: 'ur', name: 'Urdu (Pakistan)', flag: '🇵🇰' },
      { code: 'he', name: 'Hebrew (Israel)', flag: '🇮🇱' },
      { code: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
    ],
  },
  {
    region: 'Asia & Oceania',
    items: [
      { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
      { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
      { code: 'th', name: 'Thai', flag: '🇹🇭' },
      { code: 'ms', name: 'Malay', flag: '🇲🇾' },
      { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
      { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    ],
  },
  {
    region: 'Europe',
    items: [
      { code: 'it', name: 'Italian', flag: '🇮🇹' },
      { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
      { code: 'pl', name: 'Polish', flag: '🇵🇱' },
      { code: 'hy', name: 'Armenian', flag: '🇦🇲' },
      { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
    ],
  },
  {
    region: 'Africa',
    items: [
      { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
      { code: 'am', name: 'Amharic', flag: '🇪🇹' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    ],
  },
  {
    region: 'Americas',
    items: [
      { code: 'es', name: 'Spanish (LATAM)', flag: '🇲🇽' },
      { code: 'pt', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    ],
  },
];

// Rich International Transaction Popups Data Pool (Featuring Turkish, Arabic, Persian, Asian, and Global names)
const sampleTransactions = [
  // Turkish
  { name: 'Mehmet Y.', flag: '🇹🇷', type: 'deposited', amount: '$14,000.00', timeAgo: 'Just now' },
  { name: 'Zeynep K.', flag: '🇹🇷', type: 'withdrew', amount: '$4,100.00', timeAgo: '2 mins ago' },
  { name: 'Emre A.', flag: '🇹🇷', type: 'deposited', amount: '$7,500.00', timeAgo: 'Just now' },
  { name: 'Elif S.', flag: '🇹🇷', type: 'withdrew', amount: '$12,300.00', timeAgo: '1 min ago' },
  { name: 'Burak D.', flag: '🇹🇷', type: 'deposited', amount: '$19,500.00', timeAgo: 'Just now' },

  // Persian / Iranian
  { name: 'Amir H.', flag: '🇮🇷', type: 'deposited', amount: '$5,800.00', timeAgo: 'Just now' },
  { name: 'Fatemeh Z.', flag: '🇮🇷', type: 'withdrew', amount: '$9,250.00', timeAgo: '1 min ago' },
  { name: 'Kian R.', flag: '🇮🇷', type: 'deposited', amount: '$11,000.00', timeAgo: '3 mins ago' },
  { name: 'Parisa M.', flag: '🇮🇷', type: 'withdrew', amount: '$6,400.00', timeAgo: 'Just now' },

  // Arabic / Middle Eastern
  { name: 'Tariq A.', flag: '🇸🇦', type: 'deposited', amount: '$25,000.00', timeAgo: 'Just now' },
  { name: 'Layla M.', flag: '🇦🇪', type: 'withdrew', amount: '$18,200.00', timeAgo: '2 mins ago' },
  { name: 'Omar K.', flag: '🇶🇦', type: 'deposited', amount: '$16,500.00', timeAgo: 'Just now' },
  { name: 'Yasmin B.', flag: '🇪🇬', type: 'withdrew', amount: '$8,900.00', timeAgo: '4 mins ago' },
  { name: 'Ziyad N.', flag: '🇰🇼', type: 'deposited', amount: '$30,000.00', timeAgo: 'Just now' },

  // East & South Asian
  { name: 'Kenji S.', flag: '🇯🇵', type: 'deposited', amount: '$22,100.00', timeAgo: '3 mins ago' },
  { name: 'Min-Ho C.', flag: '🇰🇷', type: 'withdrew', amount: '$7,600.00', timeAgo: 'Just now' },
  { name: 'Aarav P.', flag: '🇮🇳', type: 'deposited', amount: '$4,500.00', timeAgo: '2 mins ago' },
  { name: 'Priya S.', flag: '🇮🇳', type: 'withdrew', amount: '$13,400.00', timeAgo: 'Just now' },
  { name: 'Wei L.', flag: '🇨🇳', type: 'deposited', amount: '$19,000.00', timeAgo: 'Just now' },
  { name: 'Mei-Ling X.', flag: '🇨🇳', type: 'withdrew', amount: '$8,200.00', timeAgo: '1 min ago' },
  { name: 'Chanya S.', flag: '🇹🇭', type: 'deposited', amount: '$11,200.00', timeAgo: 'Just now' },
  { name: 'Nguyen V.', flag: '🇻🇳', type: 'withdrew', amount: '$3,900.00', timeAgo: '4 mins ago' },

  // Global / Western / African
  { name: 'David M.', flag: '🇺🇸', type: 'deposited', amount: '$3,500.00', timeAgo: 'Just now' },
  { name: 'Elena R.', flag: '🇪🇸', type: 'withdrew', amount: '$12,400.00', timeAgo: '2 mins ago' },
  { name: 'Liam K.', flag: '🇬🇧', type: 'deposited', amount: '$8,000.00', timeAgo: 'Just now' },
  { name: 'Mateo G.', flag: '🇧🇷', type: 'deposited', amount: '$15,000.00', timeAgo: 'Just now' },
  { name: 'Oluwaseun A.', flag: '🇳🇬', type: 'withdrew', amount: '$9,800.00', timeAgo: 'Just now' },
];

export default function FloatingControls() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [selectedLang, setSelectedLang] = useState(languageGroups[0].items[0]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  // Live Transaction Notification State
  const [currentNotification, setCurrentNotification] = useState<typeof sampleTransactions[0] | null>(null);

  // Initialize language from localStorage on mount and apply translation
  useEffect(() => {
    const savedLangCode = localStorage.getItem('app_selected_lang');
    if (savedLangCode) {
      for (const group of languageGroups) {
        const found = group.items.find((item) => item.code === savedLangCode);
        if (found) {
          setSelectedLang(found);
          break;
        }
      }
    }

    const applyStoredTranslation = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement && savedLangCode) {
        selectElement.value = savedLangCode;
        selectElement.dispatchEvent(new Event('change'));
      }
    };

    const timer = setTimeout(applyStoredTranslation, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Interval hook to trigger pop-ups every 9 seconds
  useEffect(() => {
    const triggerPopup = () => {
      const randomIndex = Math.floor(Math.random() * sampleTransactions.length);
      setCurrentNotification(sampleTransactions[randomIndex]);

      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);
    };

    const initialTimer = setTimeout(triggerPopup, 3000);
    const interval = setInterval(triggerPopup, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Language Change Function
  const handleLanguageChange = (lang: { code: string; name: string; flag: string }) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
    localStorage.setItem('app_selected_lang', lang.code);

    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = lang.code;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {/* 1. BOTTOM LEFT: WHATSAPP ICON & HOMEPAGE-ONLY LANGUAGE DROPDOWN */}
      <div className="fixed bottom-3 left-3 z-50 flex items-end gap-2">
        {/* WhatsApp Button */}
        <div className="flex flex-col items-center shrink-0">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            aria-label="WhatsApp Support"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
          <span className="text-[9px] text-gray-300 bg-black/60 px-1 rounded mt-0.5">
            GetButton
          </span>
        </div>

        {/* Language Selector Dropdown (Appears ONLY on the Homepage '/') */}
        {isHomePage && (
          <div className="relative">
            {isLangOpen && (
              <div className="absolute bottom-9 left-0 w-60 bg-white border border-gray-200 rounded shadow-2xl py-1 text-xs text-gray-800 max-h-72 overflow-y-auto z-50">
                {languageGroups.map((group) => (
                  <div key={group.region} className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-y border-gray-100">
                      {group.region}
                    </div>
                    {group.items.map((lang) => (
                      <button
                        key={`${lang.code}-${lang.name}`}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 hover:bg-blue-50 text-left transition-colors ${
                          selectedLang.code === lang.code ? 'bg-blue-50 font-bold text-blue-600' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-[#161f33] text-white text-xs px-3 py-2 rounded-lg border border-gray-700 shadow-md hover:bg-gray-800 transition-colors"
            >
              <span className="text-base">{selectedLang.flag}</span>
              <span className="font-medium text-[11px]">{selectedLang.name}</span>
              <ChevronDown size={13} className={`text-gray-400 transform transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* 2. BOTTOM RIGHT: CHAT BUTTON WITH INTERVAL TRANSACTION POPUP */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {currentNotification && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="bg-[#0f172a] text-white border border-blue-500/30 rounded-xl p-3 shadow-2xl flex items-center gap-3 max-w-xs backdrop-blur-md relative"
            >
              <button
                onClick={() => setCurrentNotification(null)}
                className="absolute top-1.5 right-1.5 text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                currentNotification.type === 'deposited' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {currentNotification.type === 'deposited' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>

              <div className="space-y-0.5 text-left pr-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-100">
                  <span>{currentNotification.flag}</span>
                  <span>{currentNotification.name}</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-tight">
                  {currentNotification.type === 'deposited' ? 'Deposited' : 'Withdrew'}{' '}
                  <span className="font-extrabold text-white">{currentNotification.amount}</span>
                </p>
                <span className="text-[9px] text-gray-400 block pt-0.5">{currentNotification.timeAgo}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label="Open live chat"
          onClick={() => {}}
          className="relative flex items-center gap-3 rounded-full 
            bg-gradient-to-r from-[#1677f8] to-[#1749df]
            py-2 pl-5 pr-2
            text-sm font-semibold text-white
            shadow-[0_4px_16px_rgba(0,0,0,0.25)]
            transition-all duration-200
            hover:scale-105 hover:shadow-lg"
        >
          <span className="absolute -bottom-0.5 left-0.5 z-10
            h-4 w-4 rounded-full border-2 border-white
            bg-[#35e99b]"
          />
          <span>Chat</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <MessageCircle size={25} strokeWidth={2.5} className="fill-white text-white" />
          </span>
        </button>
      </div>
    </>
  );
}