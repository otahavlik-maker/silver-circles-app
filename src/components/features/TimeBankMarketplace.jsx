import React, { useState } from 'react';
import { Clock, Heart, Users, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';

const TimeBankMarketplace = ({ onClose }) => {
  const [credits, setCredits] = useState(4); // 4 Hodiny v "peněžence"
  const [activeTab, setActiveTab] = useState('OFFERS'); // OFFERS (Nabídky) | REQUESTS (Poptávky)

  // Mock Data: Komunitní výměnný obchod
  const [listings, setListings] = useState([
    { id: 1, type: 'OFFER', author: 'Elsie (82)', title: 'Knitting Lessons', cost: 1, desc: 'Learn to knit a scarf. Tea included.', tags: ['Skill', 'Social'] },
    { id: 2, type: 'OFFER', author: 'Arthur (79)', title: 'WW2 Stories', cost: 1, desc: 'First-hand accounts of London in the 40s.', tags: ['Education'] },
    { id: 3, type: 'REQUEST', author: 'Tom (Volunteer)', title: 'Garden Weeding', cost: 2, desc: 'Need help clearing the back patch.', tags: ['Labor'] },
    { id: 4, type: 'REQUEST', author: 'Sarah (Nurse)', title: 'Cat Sitting', cost: 1, desc: 'Feed Mr. Whiskers on Sunday.', tags: ['Animals'] },
  ]);

  const handleTrade = (item) => {
    if (item.type === 'OFFER') {
      // Kupuji službu (Utrácím kredity)
      if (credits >= item.cost) {
        setCredits(c => c - item.cost);
        alert(`You booked "${item.title}"! -${item.cost} Hour(s)`);
      } else {
        alert("Not enough Time Credits! Try helping someone first.");
      }
    } else {
      // Plním něčí prosbu (Vydělávám kredity)
      setCredits(c => c + item.cost);
      alert(`Thank you for helping ${item.author}! +${item.cost} Hour(s) earned.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col font-sans">
      
      {/* 1. Header: Time Wallet */}
      <div className="bg-emerald-700 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Users className="text-emerald-300" />
              Dignity Economy
            </h2>
            <p className="opacity-80">Community Time Bank</p>
          </div>
          <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            Close
          </button>
        </div>

        {/* Wallet Card */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white text-slate-800 p-4 rounded-2xl shadow-lg border border-emerald-100 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Balance</p>
            <p className="text-4xl font-bold text-emerald-600 flex items-baseline gap-1">
              {credits} <span className="text-lg text-slate-500 font-medium">Hours</span>
            </p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-full">
            <Clock size={32} className="text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="mt-16 px-6 flex gap-4">
        <button 
          onClick={() => setActiveTab('OFFERS')}
          className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${activeTab === 'OFFERS' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
        >
          Community Offers
        </button>
        <button 
          onClick={() => setActiveTab('REQUESTS')}
          className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${activeTab === 'REQUESTS' ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
        >
          People's Needs
        </button>
      </div>

      {/* 3. Listings Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {listings
          .filter(item => (activeTab === 'OFFERS' ? item.type === 'OFFER' : item.type === 'REQUEST'))
          .map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">
                  {item.tags[0]}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{item.title}</h3>
                <p className="text-sm text-slate-500">by {item.author}</p>
              </div>
              <div className="bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                <Clock size={14} /> {item.cost} Hr
              </div>
            </div>
            
            <p className="text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
            
            <button 
              onClick={() => handleTrade(item)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors
                ${item.type === 'OFFER' 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'}
              `}
            >
              {item.type === 'OFFER' ? (
                <>Book This <ArrowRight size={18} /></>
              ) : (
                <>I Can Help <Heart size={18} /></>
              )}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TimeBankMarketplace;