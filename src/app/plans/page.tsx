// src/app/plans/page.tsx
'use client';

import Link from 'next/link';
import { CheckCircle2, Zap } from 'lucide-react';

export default function PlansPage() {
  const plans = [
    {
      name: 'Promotional Plan',
      range: '$200 – $20,000',
      dailyProfit: '1.4% Daily for 6 days',
      referral: '5% referral bonus',
      duration: 'Withdrawal is after 6 days.',
      desc: 'You can start with us as low as $200 in the promotional plan, depending on the market. You can clarify from company customer care.',
      popular: false,
    },
    {
      name: 'Business Plan',
      range: '$20,000 – $50,000',
      dailyProfit: '1.4% Daily Profit for 2 Weeks',
      referral: '10% referral bonus',
      duration: 'WITHDRAWAL IS AFTER THE CONTRACT EXPIRES',
      desc: 'The company automatically assigns an account manager to the investor.',
      popular: true,
    },
    {
      name: 'Shareholders Plan',
      range: '$50,000 – No Limit',
      dailyProfit: '1.4% Daily Profit for 1 Month',
      referral: '10% referral bonus',
      duration: 'WITHDRAWAL IS AFTER THE CONTRACT EXPIRES',
      desc: 'The company assigns an account manager to you. The shareholders plan comes with huge benefits like a certain amount of loan and other bonuses.',
      popular: false,
    },
  ];

  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section with proper breathing room from Navbar */}
        <div className="text-center space-y-3">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Investment Portfolios
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase pt-2">
            PLANS
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
            Select from our carefully structured financial portfolios engineered for secure daily returns and professional growth.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-[#111622] rounded-xl border transition-all duration-300 flex flex-col shadow-2xl overflow-hidden hover:-translate-y-1 ${
                plan.popular
                  ? 'border-blue-500 shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'border-gray-800/80 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="bg-[#182030] p-6 text-center border-b border-gray-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                  {plan.name}
                </h3>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {plan.range}
                </div>
              </div>

              {/* Features List */}
              <div className="p-6 space-y-4 text-xs text-gray-300 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/60 text-gray-200 font-semibold">
                    <Zap size={16} className="text-cyan-400 shrink-0" />
                    <span>{plan.dailyProfit}</span>
                  </div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/60 text-gray-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{plan.referral}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed bg-black/20 p-3 rounded-lg border border-gray-800/50">
                    {plan.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800/60 text-[11px] font-bold text-amber-400 tracking-wide uppercase text-center">
                  {plan.duration}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 bg-[#111622]">
                <Link
                  href="/register"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-600/25 tracking-wide uppercase"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}