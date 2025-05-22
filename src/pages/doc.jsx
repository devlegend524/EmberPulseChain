import React from 'react';
import ExpandableCard from '../components/doc';

function Docs() {
  return (
    <div className='space-y-8'>
      <span className='flex justify-center mt-20 mb-2 text-3xl font-bold bg-gradient-to-r from-[#e879f9] via-[#f59e0b] to-[#8b5cf6] bg-[length:200%_200%] animate-gradient bg-clip-text text-transparent'>Documentation</span>
      <span className='flex justify-center mb-8 pb-4 text-lg '>Learn how to use EMBER Finance platform and maximize your yields.</span>
      
      <div className='p-6 border border-[#292524] rounded-xl shadow-xl'>
        <div className='font-bold text-2xl'>Getting Started</div>
        <div className='mt-2 mb-4 text-sm text-gray-400'>Basic information for new users</div>
        <ExpandableCard title="What is EMBER?">
          <p>EMBER is a yield farming token designed to provide sustainable returns for liquidity providers and stakers. All EMBER sales taxes are burned to reduce inflation and increase scarcity over time.</p>
        </ExpandableCard>

        <ExpandableCard title="How to connect your wallet">
          <p>Click the "Connect Wallet" button in the top right corner of the page. Select your wallet provider and follow the prompts to connect. Currently supported wallets include MetaMask, WalletConnect, and Coinbase Wallet.</p>
        </ExpandableCard>

        <ExpandableCard title="How to buy EMBER">
          <p>You can purchase EMBER by using the Swap function or Zap In directly. Connect your wallet, select the token you want to swap from (e.g., PLS, wPLS, DAI), enter the amount, and click "Swap" or "Zap In".</p>
        </ExpandableCard>
      </div>
      <div className='p-6 border border-[#292524] rounded-xl shadow-xl'>
        <div className='font-bold text-2xl'>Yield Farming Guide</div>
        <div className='mt-2 mb-4 text-sm text-gray-400'>How to stake and earn rewards</div>
        <ExpandableCard title="How do farm rewards work?">
          <p>EMBER farms distribute rewards based on each farm's multiplier. The higher the multiplier, the more EMBER rewards allocated to that farm. Rewards are calculated per block and can be harvested at any time after the lockup period.</p>
        </ExpandableCard>
        <ExpandableCard title="What are deposit fees?">
          <p>Deposit fees (3% for most pools) are charged when you stake tokens and are used to burn EMBER tokens, reducing supply. The EMBER/wPLS LP pool has no deposit fee to encourage liquidity provision.</p>
        </ExpandableCard>
        <ExpandableCard title="What is compounding?">
          <p>Compounding automatically harvests your earned EMBER and restakes it into the same farm, allowing your rewards to grow exponentially over time. It's a one-click solution for optimal yields.</p>
        </ExpandableCard>
        <ExpandableCard title="How to use Zap In feature">
          <p>Zap In allows you to enter any farm with any supported token in a single transaction. The system automatically swaps your token, creates LP tokens if needed, and stakes them in the selected farm.</p>
        </ExpandableCard>
      </div>
      <div className='p-6 border border-[#292524] rounded-xl shadow-xl'>
        <div className='font-bold text-2xl'>Tokenomics</div>
        <div className='mt-2 mb-4 text-sm text-gray-400'>EMBER token economics</div>
        <ExpandableCard title="Emission schedule">
          <p>EMBER has a maximum supply of 100 million tokens. Emissions follow a deflationary schedule, with 15 EMBER minted per block in year 1, decreasing by 25% each subsequent year.</p>
        </ExpandableCard>
        <ExpandableCard title="Burning mechanism">
          <p>EMBER implements multiple burning mechanisms: 3% sales tax on most transactions, deposit fees from farms, and regular buyback and burn events from treasury funds.</p>
        </ExpandableCard>
      </div>
      <div className="absolute -top-[35%] left-[15%]  w-full md:w-1/5 h-full opacity-15 -z-20 duration-300">
        <svg 
          viewBox="0 0 400 400" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-full"
        >
          <g opacity="0.8">
            <circle cx="200" cy="200" r="150" stroke="#b280ff" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="120" stroke="#8a3ffc" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="90" stroke="#ff6b2b" strokeWidth="1" fill="none" />
            
            <path 
              d="M200,50 L200,350 M50,200 L350,200" 
              stroke="#8a3ffc" 
              strokeWidth="0.5" 
              opacity="0.3"
            />
            
            <g className="rotate">
              <circle cx="200" cy="80" r="4" fill="#ff6b2b" />
              <circle cx="320" cy="200" r="4" fill="#8a3ffc" />
              <circle cx="200" cy="320" r="4" fill="#ff6b2b" />
              <circle cx="80" cy="200" r="4" fill="#8a3ffc" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Docs;