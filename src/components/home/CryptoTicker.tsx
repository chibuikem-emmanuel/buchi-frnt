// src/components/home/CryptoTicker.tsx
'use client';

import { useState, useEffect } from 'react';

// Fallback initial data in case the public API is fetching or rate-limited
const fallbackData = [
  { symbol: "BTC", price: "96,450.00", change: "+2.4%" },
  { symbol: "ETH", price: "3,520.10", change: "+1.8%" },
  { symbol: "USDT", price: "1.00", change: "0.0%" },
  { symbol: "BNB", price: "640.25", change: "+0.9%" },
  { symbol: "SOL", price: "215.80", change: "+4.2%" },
  { symbol: "XRP", price: "2.35", change: "+5.1%" },
  { symbol: "ADA", price: "0.85", change: "-0.4%" },
  { symbol: "DOGE", price: "0.38", change: "+3.7%" },
];

export default function CryptoTicker() {
  const [cryptoData, setCryptoData] = useState(fallbackData);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,cardano,dogecoin&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await res.json();

        if (data && Object.keys(data).length > 0) {
          const formattedData = [
            {
              symbol: "BTC",
              price: data.bitcoin?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "96,450.00",
              change: `${(data.bitcoin?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.bitcoin?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "ETH",
              price: data.ethereum?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "3,520.10",
              change: `${(data.ethereum?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.ethereum?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "USDT",
              price: data.tether?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "1.00",
              change: `${(data.tether?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.tether?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "BNB",
              price: data.binancecoin?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "640.25",
              change: `${(data.binancecoin?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.binancecoin?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "SOL",
              price: data.solana?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "215.80",
              change: `${(data.solana?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.solana?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "XRP",
              price: data.ripple?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "2.35",
              change: `${(data.ripple?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.ripple?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "ADA",
              price: data.cardano?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.85",
              change: `${(data.cardano?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.cardano?.usd_24h_change || 0).toFixed(1)}%`
            },
            {
              symbol: "DOGE",
              price: data.dogecoin?.usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0.38",
              change: `${(data.dogecoin?.usd_24h_change || 0) >= 0 ? '+' : ''}${(data.dogecoin?.usd_24h_change || 0).toFixed(1)}%`
            },
          ];
          setCryptoData(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch live crypto prices, using fallback:", err);
      }
    };

    fetchLivePrices();
    // Refresh prices automatically every 60 seconds
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden py-2 border-y border-gray-200 flex items-center text-xs">
      {/* CoinMarketCap Fixed Badge on Left */}
      <div className="shrink-0 px-3 py-1 bg-white border-r border-gray-200 flex items-center gap-1.5 font-bold text-gray-800 z-10 shadow-sm">
        <span className="text-blue-600 text-sm font-black">Ⓜ</span>
        <span className="text-[11px] tracking-tight">CoinMarketCap</span>
      </div>

      {/* Animated Tape */}
      <div className="flex-1 overflow-hidden">
        <div className="animate-ticker flex whitespace-nowrap gap-6 items-center">
          {[...cryptoData, ...cryptoData, ...cryptoData].map((item, idx) => (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 px-2 py-0.5 text-gray-800 font-medium"
            >
              <span className="font-bold text-gray-900 uppercase">{item.symbol}</span>
              <span className="text-gray-700">${item.price}</span>
              <span className={item.change.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}