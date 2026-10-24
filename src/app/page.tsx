// src/app/page.tsx
'use client';

import CryptoTicker from '../components/home/CryptoTicker';
import LiveTransactions from '../components/home/LiveTransactions';
import FloatingControls from '../components/common/FloatingControls';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { 
    q: "How do I invest with Crystals Investments?", 
    a: "To make an investment, you must become a member of Crystals Investments. Once you sign right up, you can make your deposits down the assets through the members home. You can start trading via standard economic professional you meet upon signup." 
  },
  { 
    q: "I wish to invest but don't have an e-currency account. What should I do?", 
    a: "You can open a free Blockchain account from www.blockchain.com." 
  },
  { 
    q: "How do I open my Crystals Investments account?", 
    a: "It is super easy and convenient. Follow the link, fill in the registration form, and click register." 
  },
  { 
    q: "Which e-currencies do you accept?", 
    a: "We accept Bitcoin, Tether (USDT), Ethereum, PerfectMoney, Ripple, Bitcoin Cash, Dash, BNB, XRP, USDC, Tron, and Dogecoin." 
  },
  { 
    q: "How can I withdraw funds?", 
    a: "Login to your account using your username and password, then click the Withdraw section." 
  },
  { 
    q: "How can I change my email address or password?", 
    a: "Log into your Crystals Investments account and click on the 'Account Information'. You can change your email address and password there." 
  },
  { 
    q: "What if I can't log into my account because I forgot my password?", 
    a: "Click forgot password link, type your username or e-mail and you'll receive your account information." 
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full bg-[#181e28] text-white relative">
      {/* 1. HERO SECTION */}
      <section 
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 bg-cover bg-center overflow-hidden pt-20"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.65)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop')`
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Crystals Investments, for a world powered by technology
          </motion.h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium">
            Crystals investments involves most-basic financial approaches that will endure in ever-changing investment environment. As the biggest digital currency wealth manager, Crystal Investments enables investors to take advantage of the rapidly developing digital economy and secure their future now.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <span className="inline-block bg-[#2563eb] hover:bg-blue-600 text-white font-medium text-xs px-8 py-3 rounded-md transition-all shadow-lg">
                Get Started
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-300">
          <ArrowDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* 2. CRYPTO MARKET TICKER */}
      <CryptoTicker />

      {/* 3. WHO WE ARE */}
      <section className="py-20 bg-white text-gray-900 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
            ABOUT US
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Who We Are ?
          </h2>
          
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Trading on stock exchanges, FX, and crypto markets is our main business, assistance of Crystals investments allows investors to start producing in asset pools as well as trading on commercial activities in any trading direction that has potential to be highly profitable. We frequently secure other financial sources like launching to venture capital funds, as well as funding business angel funds.
          </p>

          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Profiting gains can become on Crystals investments from the capacity to produce resilience dollars every day. Our systems in balancing our diversified investment and trading portfolio, and then supporting the community base item within most of the governments have valid securities only general.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <span className="bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold px-8 py-3 rounded-full inline-block shadow-md transition-colors">
                Start Trading
              </span>
            </Link>
          </div>

<div className="mt-10 p-5 border border-gray-200 rounded-xl bg-white max-w-xl mx-auto shadow-sm text-left space-y-3">
  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
    <div className="text-xl">🏢</div>
    <div>
      <h4 className="text-xs font-extrabold uppercase tracking-wide text-gray-900">
        Official Company Registration
      </h4>
      <p className="text-[11px] text-gray-500">Verified Corporate Details & Compliance</p>
    </div>
  </div>

  <div className="text-xs space-y-1.5 text-gray-700">
    <p><span className="font-semibold text-gray-900">Company Name:</span> GROVE ASSETS LTD</p>
    <p><span className="font-semibold text-gray-900">Company Number:</span> NI697714</p>
    <p><span className="font-semibold text-gray-900">Registered Office:</span> 51 Whitesides Road, Randalstown, Antrim, Northern Ireland, BT41 3EX</p>
  </div>

  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
      Active UK Register
    </span>
    <a
      href="https://find-and-update.company-information.service.gov.uk/company/NI697714"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
    >
      View on Companies House &rarr;
    </a>
  </div>
</div>
        </div>
      </section>

      {/* 4. OUR FEATURES */}
      <section 
        className="relative py-24 bg-cover bg-center bg-fixed px-4 text-white" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(10, 15, 26, 0.65), rgba(10, 15, 26, 0.70)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop')` 
        }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-left space-y-2">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-widest block">
              OUR FEATURES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Experience the next level of performance with our standout features
            </h2>
            <hr className="border-gray-500/50 my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-600/40">
              <div className="w-14 h-14 flex items-center justify-center text-4xl mb-1">
                🤖
              </div>
              <h3 className="text-base font-extrabold text-white">
                24/7 Support
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
                Our customer care service is available at all time to attend to you and also offer profitable advice on the best investment programs.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-600/40">
              <div className="w-14 h-14 flex items-center justify-center text-4xl mb-1">
                💻
              </div>
              <h3 className="text-base font-extrabold text-white">
                Secured Transactions
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
                Your financial future is secured through our multiple investment packages that are suitable for every class.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-600/40">
              <div className="w-14 h-14 flex items-center justify-center text-4xl mb-1">
                🚀
              </div>
              <h3 className="text-base font-extrabold text-white">
                Quick Returns
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
                We offer you an unbeatable interest on your investment within the shortest possible time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-600/40">
              <div className="w-14 h-14 flex items-center justify-center text-4xl mb-1">
                🌐
              </div>
              <h3 className="text-base font-extrabold text-white">
                Strong Security
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
                The system runs on highly encrypted algorithms to protect and secure our user accounts. We have experienced security experts who are constantly fixing threats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQS & INDUSTRIES WE SERVE */}
      <section id="faqs" className="py-20 bg-white text-gray-900 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">FAQS</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Industries We Serve</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-md bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">▶</span> {faq.q}
                  </span>
                  <ChevronDown size={16} className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-600 border-t border-gray-100 leading-relaxed bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CRYSTALS INVESTMENTS WELCOME */}
      <section 
        className="relative py-24 bg-cover bg-center bg-fixed px-4 text-white border-t border-gray-900"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 11, 18, 0.85), rgba(8, 11, 18, 0.90)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide drop-shadow-md">
              Crystals Investments
            </h2>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8 p-2">
            <div className="flex sm:flex-col justify-center items-center gap-6 text-cyan-400 shrink-0 text-4xl sm:text-5xl font-extrabold filter drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              <span>⚛️</span>
              <span>⚖️</span>
              <span>☄️</span>
            </div>

            <div className="space-y-4 text-center sm:text-left flex-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome
              </h3>
              
              <div className="w-full h-[3px] bg-cyan-400 rounded-full my-2 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              
              <p className="text-xs sm:text-sm text-gray-100 font-bold leading-relaxed pt-1">
                We have developed a platform for you to manage your investments and increase your income. Crystals investments is supported by a team of professionals, experts, and leading market specialists who offer users 24/7 assistance and support, ensuring a dependable system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PARTNERS */}
      <section className="py-20 bg-white text-gray-900 text-center px-4 border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-12">Our Partners</h3>
        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 opacity-90">
          <span className="text-3xl sm:text-4xl font-black tracking-widest text-purple-700">myob</span>
          <span className="text-3xl sm:text-4xl font-black tracking-widest text-red-600 flex items-center gap-1">
            <span className="text-orange-500 text-2xl">●</span> citrus
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-wider text-orange-600">BELIMO</span>
          <span className="text-xl sm:text-2xl font-bold tracking-wider text-green-600">LifeGroups</span>
          <span className="text-3xl sm:text-4xl font-black italic text-red-600">Lilly</span>
        </div>
      </section>

      {/* 8. INSIGHTS SECTION */}
      <section id="insights" className="py-20 bg-white text-gray-900 border-t border-gray-100 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">Insights</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            The company has a wide range of business relationships and income generating sources. It uses conventional trading for short and medium term strategies, and applies rigorous market analysis to select stocks for long term holdings. With money from investors, they invest in the stock and currency markets, well researched multinational cooperation companies, successful government bonds, and as the case, blind long term assets like Louis jeans, Netflix, Amazon, and Tesla, among others. In addition to these financial assets, foreign funds are also included.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            The highly skilled analysts and risk managers on the Crystals Investments investments team combine their years of experience with exciting edge-software to produce astounding prediction accuracy on the movements and shifts of currency exchanges and cryptocurrency markets. Additionally, the corporation invests in a variety of global agricultural and real estate projects. Thus, in proportion to each investor's portfolio, they distribute to investors their enormous earnings from their securities skilled deals.
          </p>
        </div>
      </section>

      {/* 9. LIVE TRANSACTIONS AUTO-SCROLL SECTION */}
      <LiveTransactions />

      {/* 10. FLOATING ACTION CONTROLS */}
      <FloatingControls />
    </div>
  );
}