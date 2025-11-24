import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useCompanionAI } from '../../hooks/useCompanionAI'; // Náš AI mozek
import { Coffee, Pill, Sun, CloudRain, Users, Music, Heart, Mic, CheckCircle2 } from 'lucide-react';

// ATOM: Action Card (Holistická karta úkolu)
const ActionCard = ({ icon: Icon, title, subtitle, color, onClick, urgent, completed }) => (
  <button 
    onClick={onClick}
    disabled={completed}
    className={`w-full p-6 rounded-3xl flex items-center gap-6 shadow-lg active:scale-95 transition-transform text-left border-l-8 relative overflow-hidden
    ${completed ? 'bg-slate-100 border-slate-300 opacity-60' : 'bg-white'}
    ${urgent && !completed ? 'border-amber-500 animate-pulse-slow' : 'border-slate-200'}
    `}
  >
    <div className={`p-4 rounded-2xl ${completed ? 'bg-slate-400' : color} text-white shadow-md`}>
      {completed ? <CheckCircle2 size={40} /> : <Icon size={40} strokeWidth={2.5} />}
    </div>
    <div>
      <h3 className={`text-2xl font-bold leading-tight ${completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{title}</h3>
      {subtitle && <p className="text-xl text-slate-600 mt-1 font-medium">{subtitle}</p>}
    </div>
  </button>
);

const PatientMode = () => {
  const { sosActive, triggerSOS, clinicalData, takeMed, hydrationLevel, drinkWater } = useAppStore();
  
  // AI Logic (Bessie)
  const { triggerPrompt, analyzeResponse } = useCompanionAI();
  const [bessieState, setBessieState] = useState('IDLE'); // IDLE, LISTENING, SPEAKING
  const [bessieText, setBessieText] = useState("How are you feeling today?");
  
  // Environmental Context (Mock)
  const weather = { temp: 18, condition: 'Cloudy', suggestion: 'Put on a cardigan' };

  // Bessie Interaction Handler
  const handleBessieInteraction = () => {
    if (bessieState === 'IDLE') {
      setBessieState('LISTENING');
      setBessieText("I'm listening...");
      
      setTimeout(() => {
        setBessieState('SPEAKING');
        setBessieText("That sounds lovely, Elsie. I'll tell Sarah you are in good spirits.");
        // Reset po chvíli
        setTimeout(() => setBessieState('IDLE'), 4000);
      }, 2000);
    }
  };

  // SOS Screen
  if (sosActive) {
    return (
      <div className="fixed inset-0 bg-rose-600 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-pulse">
        <Heart size={120} className="mb-8 animate-bounce" />
        <h1 className="text-5xl font-bold mb-4">HELP IS COMING</h1>
        <button onClick={() => window.location.reload()} className="mt-12 bg-white text-rose-600 px-10 py-6 rounded-full text-2xl font-bold shadow-xl">
          CANCEL ALARM
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans pb-32"> 
      {/* WCAG: #FDFBF7 is "Warm Cream" - better for aging eyes than pure white */}

      {/* 1. HEADER (Context Aware) */}
      <header className="p-8 bg-indigo-900 text-amber-50 rounded-b-[3rem] shadow-xl relative overflow-hidden mb-6">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Good Afternoon, Elsie.</h1>
          <div className="flex items-center gap-3 text-xl opacity-90">
            <CloudRain size={24} />
            <span>{weather.temp}°C - {weather.suggestion}</span>
          </div>
        </div>
        {/* Ambient Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </header>

      {/* 2. BESSIE (AI Companion) */}
      <div className="px-6 mb-8 relative z-20 -mt-12">
        <button 
          onClick={handleBessieInteraction}
          className={`w-full bg-white p-6 rounded-3xl shadow-xl border-4 flex items-center gap-6 transition-all
            ${bessieState === 'LISTENING' ? 'border-rose-400 ring-4 ring-rose-100' : 'border-indigo-100'}
          `}
        >
          <div className={`p-5 rounded-full transition-colors duration-500 ${bessieState === 'IDLE' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-500 text-white animate-pulse'}`}>
            {bessieState === 'LISTENING' ? <Mic size={40} /> : <Heart size={40} fill="currentColor" />}
          </div>
          <div className="text-left">
            <span className="block font-bold text-slate-800 text-xl leading-tight mb-1">
              "{bessieText}"
            </span>
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              {bessieState === 'IDLE' ? 'Tap to answer' : 'Recording...'}
            </span>
          </div>
        </button>
      </div>

      {/* 3. HOLISTIC FEED (The Stream of Life) */}
      <main className="flex-1 px-6 space-y-5">
        
        {/* A. CLINICAL (Meds from Store) */}
        {clinicalData.meds.map(med => (
          <ActionCard 
            key={med.id}
            icon={Pill}
            title={`Time for ${med.name}`}
            subtitle={med.taken ? "Taken at 9:00 AM" : "Take with food"}
            color="bg-emerald-500"
            urgent={!med.taken}
            completed={med.taken}
            onClick={() => takeMed(med.id)}
          />
        ))}

        {/* B. HYDRATION (Interactive) */}
        <ActionCard 
          icon={Coffee}
          title="Have a Drink"
          subtitle={`Goal: ${hydrationLevel}% reached`}
          color="bg-sky-500"
          onClick={drinkWater}
        />

        {/* C. SOCIAL (Simulated) */}
        <ActionCard 
          icon={Users}
          title="Grandson Visiting"
          subtitle="Today at 4:00 PM"
          color="bg-blue-600"
          onClick={() => alert("Calendar: Tom is bringing cake.")}
        />

        {/* D. MENTAL (Reminiscence) */}
        <ActionCard 
          icon={Music}
          title="Memory Lane"
          subtitle="Play hits from 1965?"
          color="bg-amber-500"
          onClick={() => alert("Playing 'The Beatles - Help!'")}
        />

      </main>

      {/* 4. SOS FOOTER */}
      <div className="fixed bottom-6 left-6 right-6 z-30">
        <button 
          onClick={triggerSOS}
          className="w-full bg-rose-700 hover:bg-rose-800 text-white py-6 rounded-2xl font-bold text-3xl shadow-2xl border-b-8 border-rose-900 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-4"
        >
          <div className="bg-white/20 p-2 rounded-full"><Heart fill="currentColor" size={32}/></div>
          SOS / HELP
        </button>
      </div>
    </div>
  );
};

export default PatientMode;