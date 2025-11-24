import React, { useState } from 'react';
import { Sun, Moon, Sunset, Coffee, GlassWater, AlertCircle, Lightbulb, LogOut, Dumbbell, QrCode, Users } from 'lucide-react';
import SilverGym from './SilverGym';
import SmartHomeHub from './SmartHomeHub';
import VillageSocial from './VillageSocial'; // <--- NOVÝ IMPORT

// Sub-component: The Virtual Dog
const PupPal = ({ hydrationLevel }) => {
  const getMood = () => {
    if (hydrationLevel > 80) return { emoji: '🐶', text: 'Happy!', color: 'text-emerald-600' };
    if (hydrationLevel > 40) return { emoji: '🐕', text: 'Thirsty...', color: 'text-amber-600' };
    return { emoji: '🐕‍🦺', text: 'Needs Water!', color: 'text-rose-600 animate-bounce' };
  };
  
  const mood = getMood();

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-4 shadow-xl border-4 border-white flex flex-col items-center gap-2">
      <div className="text-6xl">{mood.emoji}</div>
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden border border-slate-300">
        <div 
          className={`h-full transition-all duration-1000 ${hydrationLevel > 50 ? 'bg-blue-500' : 'bg-rose-500'}`} 
          style={{ width: `${hydrationLevel}%` }}
        />
      </div>
      <p className={`font-bold ${mood.color}`}>{mood.text}</p>
    </div>
  );
};

// Main Component
const BioRhythmicDashboard = ({ onExit }) => {
  const [simulatedHour, setSimulatedHour] = useState(10); 
  const [hydration, setHydration] = useState(60);
  
  // Modals State
  const [showGym, setShowGym] = useState(false);
  const [showSmartHome, setShowSmartHome] = useState(false);
  const [showVillage, setShowVillage] = useState(false); // <--- NOVÝ STAV

  const getPhase = (hour) => {
    if (hour >= 20 || hour < 6) return 'NIGHT';
    if (hour >= 16) return 'DUSK';
    return 'DAY';
  };

  const phase = getPhase(simulatedHour);

  const themes = {
    DAY: {
      bg: 'bg-indigo-50',
      text: 'text-slate-900',
      accent: 'bg-indigo-600',
      icon: <Sun className="text-amber-500" size={40} />,
      label: 'Active Day',
    },
    DUSK: {
      bg: 'bg-orange-50',
      text: 'text-amber-900',
      accent: 'bg-orange-600',
      icon: <Sunset className="text-orange-500" size={40} />,
      label: 'Sundown soothing',
    },
    NIGHT: {
      bg: 'bg-slate-950',
      text: 'text-indigo-100',
      accent: 'bg-indigo-900',
      icon: <Moon className="text-indigo-300" size={40} />,
      label: 'Sleep Mode',
    },
  };

  const currentTheme = themes[phase];

  const drinkWater = () => {
    setHydration(prev => Math.min(prev + 20, 100));
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${currentTheme.bg} ${currentTheme.text} flex flex-col p-6 relative`}>
      
      {/* OVERLAYS */}
      {showGym && <SilverGym onClose={() => setShowGym(false)} />}
      {showSmartHome && <SmartHomeHub onClose={() => setShowSmartHome(false)} />}
      {showVillage && <VillageSocial onClose={() => setShowVillage(false)} />} {/* <--- NOVÝ MODÁL */}

      {/* Dev Controls */}
      <div className="mb-6 p-2 bg-white/20 backdrop-blur border border-white/30 rounded-xl flex gap-2 text-xs justify-center items-center shadow-lg">
        <span className="hidden sm:inline opacity-70">Dev Time:</span>
        <button onClick={() => setSimulatedHour(10)} className="bg-white/80 text-black px-2 py-1 rounded hover:bg-white font-bold">Day</button>
        <button onClick={() => setSimulatedHour(17)} className="bg-orange-100 text-orange-900 px-2 py-1 rounded hover:bg-orange-200 font-bold">Dusk</button>
        <button onClick={() => setSimulatedHour(22)} className="bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-700 font-bold">Night</button>
        <div className="w-px h-6 bg-black/20 mx-2"></div>
        <button onClick={onExit} className="bg-rose-600 text-white px-3 py-1 rounded font-bold hover:bg-rose-700 flex items-center gap-1 shadow-md">
          <LogOut size={12} /> EXIT
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{currentTheme.label}</h1>
          <p className="opacity-80 text-lg">Time: {simulatedHour}:00</p>
        </div>
        <div className="animate-pulse">{currentTheme.icon}</div>
      </div>

      {/* NIGHT MODE */}
      {phase === 'NIGHT' ? (
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <button className="flex-1 bg-rose-900 rounded-3xl flex items-center justify-center gap-4 border-2 border-rose-700 shadow-2xl shadow-rose-900/50 active:scale-95 transition-transform">
            <AlertCircle size={64} className="text-white" />
            <span className="text-3xl font-bold text-white uppercase tracking-widest">Help</span>
          </button>
          <button className="h-32 bg-slate-800 rounded-3xl flex items-center justify-center gap-4 border border-slate-700 active:scale-95 transition-transform">
            <Lightbulb size={40} className="text-yellow-200" />
            <span className="text-2xl font-bold text-yellow-100">Toilet Light</span>
          </button>
        </div>
      ) : (
        /* DAY/DUSK MODE */
        <div className="grid grid-cols-2 gap-4 flex-1 content-start">
          <div className="col-span-2 mb-4">
             <PupPal hydrationLevel={hydration} />
          </div>

          <button 
            onClick={drinkWater}
            className={`${currentTheme.accent} text-white p-6 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2 col-span-1`}
          >
            <GlassWater size={48} />
            <span className="font-bold text-xl">Drink</span>
          </button>

          <button 
            onClick={() => setShowGym(true)}
            className="bg-white text-emerald-800 p-6 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2 col-span-1 border-2 border-emerald-100"
          >
            <Dumbbell size={48} className="text-emerald-600" />
            <span className="font-bold text-xl">Exercise</span>
          </button>

          <button 
            onClick={() => setShowSmartHome(true)}
            className="bg-white text-slate-800 p-6 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2 col-span-1 border-2 border-slate-100"
          >
            <QrCode size={48} className="text-blue-600" />
            <span className="font-bold text-xl">My Home</span>
          </button>

          {/* NOVÉ TLAČÍTKO: VILLAGE SOCIAL */}
          <button 
            onClick={() => setShowVillage(true)}
            className="bg-white text-indigo-900 p-6 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2 col-span-1 border-2 border-indigo-100"
          >
            <Users size={48} className="text-indigo-600" />
            <span className="font-bold text-xl">Friends</span>
          </button>

          <div className="col-span-2 bg-white/50 p-6 rounded-3xl text-center border-2 border-white/50">
             <h3 className="font-bold text-lg mb-2">Dr. Ada says:</h3>
             <p className="text-lg leading-relaxed">
               {hydration < 50 
                 ? "Arthur, please have a glass of water." 
                 : "Why not visit 'Friends' to see if anyone is chatting?"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioRhythmicDashboard;