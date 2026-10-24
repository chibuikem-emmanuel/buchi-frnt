// src/app/about/page.tsx
'use client';

import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FloatingControls from '../../components/common/FloatingControls';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#181e28] text-white min-h-screen flex flex-col justify-between">
      {/* 1. SHARED NAVBAR CONTAINER */}
      <div className="w-full h-24 relative bg-[#181e28] border-b border-gray-800/60 shrink-0">
        <Navbar />
      </div>

      {/* 2. MAIN CENTERED CONTENT CONTAINER */}
      <main className="py-12 px-4 max-w-4xl mx-auto w-full flex-grow">
        <div className="bg-white text-gray-900 rounded-md shadow-2xl overflow-hidden p-6 sm:p-12 space-y-8">
          {/* Hero Banner Image */}
          <div className="w-full h-64 sm:h-80 rounded overflow-hidden relative shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
              alt="Crystals Investments Team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Section 1: Title & Welcome */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              ABOUT US
            </h1>
            
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Welcome to Grove Assets Ltd
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              As a leading global market maker, Grove Assets Ltd has become one of the World's largest independent online traders and funds managers with clients from all over the world.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              One of the best asset management platforms. With over $145 million traded daily in the binary systems and forex markets, we are dedicated to giving our clients their own share of the money daily. As a leading global market maker, Grove Assets Ltd has become one of the World's Largest independent online traders, cryptocurrency trading and funds managers with clients from all over the world. The company has many sources in which returns are generated, they buy multinational cooperation stocks with investor funds, they buy profitable government bonds, trade in the stock market and forex, they trade on the Forex market top and share their profits with investors as percentage based on the amount of investment invested by an investor.
            </p>
          </div>

          {/* Section 2: Reliability & Commitment */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              How Reliable and Committed are We ?
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Trading, whether it be securities, company assets or cryptocurrency, always involves some level of financial risk. To minimize this factor, competent risk analysis is carried out, and the correct allocation of funds is made. Thanks to a wide range of currency pairs, we can maximize the diversification of investment funds, significantly reducing any risk. Our analysts are monitoring the market twenty-four hours a day in order to stay clear of the continuous changes. Thus, having all the necessary knowledge and experience, we are able to constantly benefit from cryptocurrency trading, creating high profit for the company and for its investors.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Due to the successful work and high qualification of employees, Grove Assets Ltd is constantly growing. Constant implementation of modern technologies and use of new trading methods allow the increase of the company's productivity. All is done with the purpose of always being among the best of the best in our business, not only in the field of trading, but also in the provision of financial services. Cooperating with us is based on the provision of high quality services, transparent transaction structure, and high financial growth of investments. Our investors will receive high income throughout the whole investment period, regardless of the investment plan they've chosen.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Grove Assets Ltd, though starting as an autonomous company, has been very successful in the past few years on the market and experienced no particular downtime or major downturn.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Minimal risk will allow us to avoid financial drawdown, and the unique business model and detailed cryptocurrency market analysis along with modern technologies ensure high financial growth of our company.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our trading methods and the principles that we shall adhere to will bring the company exclusively positive results. We always follow the development of new technologies, and apply new strategies to maintain a high standard. Grove Assets Ltd is not just a group of specialists from various fields; all of them are combined to act together as a single unit forming a precise mechanism, that is capable of solving the most complex tasks in the shortest time, finding new methods, and forecasting the most unpredictable situations.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Risk analysis experts continuously monitor the crypto currency markets and are in a continuous process of searching for new solutions to improve the efficiency of the asset structure of the company.
            </p>
          </div>

          {/* Section 3: Company Sources of Income */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Company Sources of Income
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The company is affiliated with numerous business partners and ventures from which returns are generated, utilizing traditional trading in mid term strategies, and applies rigorous market analysis to select stocks for long terms. They purchase well-researched multinational cooperation stocks with investor funds, buy state and purchase profitable government bonds, trade in the stock and forex markets — as the moment for investment, Louis jeans, Netflix, Amazon, Tesla, and blind long-term assets like those mentioned above, and of course foreign funds aren't left out. The field investors team consists of highly qualified analysts and risk managers, analytical structural experts who combine many of the top software tools and experience to achieve mind-blowing prediction accuracy on the movements and shifts of currency exchanges and cryptocurrency markets. The company also engages in diversified real estate and agricultural investments in different global regions. They then share their estimated profits from their numerous expert trades with investors in percentages based on an investor's portfolio.
            </p>
          </div>
        </div>
      </main>

    

      {/* FLOATING CONTROLS */}
      <FloatingControls />
    </div>
  );
}