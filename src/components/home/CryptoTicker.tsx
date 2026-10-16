// src/components/home/CryptoTicker.tsx
'use client';

const cryptoData = [
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