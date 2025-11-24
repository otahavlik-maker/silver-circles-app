import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useCompanionAI } from '../../hooks/useCompanionAI';
import { usePassiveMonitor } from '../../hooks/usePassiveMonitor';
import { Coffee, Pill, Sun, CloudRain, Users, Music, Heart, Mic, CheckCircle2, Moon, Sunrise, Activity, Thermometer, Clock } from 'lucide-react';

import TimeBankMarketplace from '../features/TimeBankMarketplace';
import ColdHomeAlert from '../features/ColdHomeAlert';
import SecureButton from '../atoms/SecureButton';

// ATOM: Action Card
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
  const { isMonitoring, toggleMonitoring, sensorData } = usePassiveMonitor(triggerSOS);
  
  const [timeOfDay, setTimeOfDay] = useState('MORNING');
  const [bessieState, setBessieState] = useState('IDLE');
  const [bessieText, setBessieText] = useState("How are you feeling today?");
  const [showTimeBank, setShowTimeBank] = useState(false);

  // Simulace dat z termostatu (18°C)
  const weather = { temp: 18, condition: 'Cloudy', suggestion: 'Put on a cardigan' };

  // Aktivace senzorů a cirkadiánního rytmu
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) setTimeOfDay('NIGHT'); else if (hour >= 12) setTimeOfDay('AFTERNOON'); else setTimeOfDay('MORNING');
    const timer = setTimeout(() => { if (!isMonitoring) toggleMonitoring(); }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamická hudební terapie
  const getMusicSuggestion = () => {
    if (timeOfDay === 'NIGHT') return { title: 'Sleep Hygiene', sub: 'Delta Waves & Rain', color: 'bg-indigo-900', icon: Moon };
    if (timeOfDay === 'MORNING') return { title: 'Wake Up Gently', sub: 'The Beatles (1965)', color: 'bg-amber-500', icon: Sunrise };
    return { title: 'Afternoon Tea', sub: 'Classical Piano', color: 'bg-rose-400', icon: Music };
  };

  const music = getMusicSuggestion();
  // Vizuální odezva na hlasitost
  const visualizerScale = 1 + (sensorData.audioLevel / 200);

  const handleBessieInteraction = () => {
    if (bessieState === 'IDLE') {
      setBessieState('LISTENING');
      setBessieText("I'm listening...");
      setTimeout(() => {
        setBessieState('SPEAKING');
        setBessieText(timeOfDay === 'NIGHT' ? "It's getting late, Elsie. Shall we prepare for bed?" : "That sounds lovely! I've logged it in your diary.");
        setTimeout(() => setBessieState('IDLE'), 4000);
      }, 3000);
    }
  };

  if (sosActive) return (
    <div className="fixed inset-0 bg-rose-600 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-pulse">
      <Heart size={120} className="mb-8 animate-bounce" />
      <h1 className="text-5xl font-bold mb-4">HELP IS COMING</h1>
      <SecureButton onClick={() => window.location.reload()} className="mt-8 border-4 border-white px-10 py-6 rounded-full text-2xl font-bold bg-rose-800">HOLD TO CANCEL</SecureButton>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-32 relative ${timeOfDay === 'NIGHT' ? 'bg-slate-900' : 'bg-[#FDFBF7]'}`}> 
      
      {showTimeBank && <TimeBankMarketplace onClose={() => setShowTimeBank(false)} />}
      <ColdHomeAlert />

      {/* 1. HEADER (FINÁLNÍ PROPORCIONÁLNÍ VERZE) */}
      <header className={`pt-6 px-8 pb-8 text-white rounded-b-[3rem] shadow-xl relative overflow-hidden mb-6 transition-colors duration-1000 ${timeOfDay === 'NIGHT' ? 'bg-slate-800' : 'bg-indigo-900'}`}>
        <div className="relative z-10">
          
          {/* HLAVNÍ POZDRAV (Zmenšen z 4xl na 3xl) */}
          <h1 className="text-3xl font-bold mb-2">Good {timeOfDay === 'MORNING' ? 'Morning' : 'Evening'}, Elsie.</h1>
          
          {/* STAV MONITORU A POČASÍ */}
          <div className="flex items-center gap-6 text-xl opacity-90">
            
            {/* Monitor Status */}
            <div className={`flex items-center gap-2 ${isMonitoring ? 'text-emerald-400' : 'text-slate-500'}`}>
                <Activity size={24} className={isMonitoring ? "animate-pulse" : ""} />
                <span className="text-lg">Safety Monitor Active</span>
            </div>
            
            {/* Počasí */}
            <div className="flex items-center gap-2">
                <Thermometer size={24} />
                <span className="text-lg">{weather.temp}°C</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BESSIE (Audio Reactive) */}
      <div className="px-6 mb-8 relative z-20 -mt-4">
        <button onClick={handleBessieInteraction} className={`w-full bg-white p-6 rounded-3xl shadow-xl border-4 flex items-center gap-6 transition-all ${bessieState === 'LISTENING' ? 'border-rose-400 ring-4 ring-rose-100' : 'border-indigo-100'}`}>
          <div 
            className={`p-5 rounded-full transition-all duration-75 ${bessieState === 'IDLE' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-500 text-white'}`}
            style={{ transform: bessieState === 'LISTENING' ? `scale(${visualizerScale})` : 'scale(1)' }}
          >
            {bessieState === 'LISTENING' ? <Mic size={40} /> : <Heart size={40} fill="currentColor" />}
          </div>
          <div className="text-left">
            <span className="block font-bold text-slate-800 text-xl leading-tight mb-1">"{bessieText}"</span>
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">{bessieState === 'IDLE' ? 'Tap to answer' : 'Recording...'}</span>
          </div>
        </button>
      </div>

      {/* 3. HOLISTIC FEED */}
      <main className="flex-1 px-6 space-y-5">
        
        {/* Clinical */}
        {clinicalData.meds.map(med => (
          <ActionCard key={med.id} icon={Pill} title={`Time for ${med.name}`} subtitle={med.taken ? "Taken" : "Take with food"} color="bg-emerald-500" urgent={!med.taken} completed={med.taken} onClick={() => takeMed(med.id)} />
        ))}

        {/* Circadian Music */}
        <ActionCard icon={music.icon} title={music.title} subtitle={music.sub} color={music.color} onClick={() => alert(`Playing: ${music.sub}`)} />
        
        {/* Time Bank */}
        <ActionCard icon={Clock} title="Community Help" subtitle="4 Time Credits" color="bg-indigo-600" onClick={() => setShowTimeBank(true)} />
        
        {/* Social */}
        <ActionCard icon={Users} title="Grandson Visiting" subtitle="Today at 4:00 PM" color="bg-blue-600" onClick={() => alert("Calendar: Tom is bringing cake.")} />
        
        {/* Hydration */}
        <ActionCard icon={Coffee} title="Have a Drink" subtitle={`Goal: ${hydrationLevel}% reached`} color="bg-sky-500" onClick={drinkWater} />

      </main>

      {/* 4. SECURE SOS */}
      <div className="fixed bottom-6 left-6 right-6 z-30">
        <SecureButton onClick={triggerSOS} holdDuration={1000} className="w-full bg-rose-700 text-white py-6 rounded-2xl font-bold text-3xl shadow-2xl border-b-8 border-rose-900 flex items-center justify-center gap-4">
          <div className="bg-white/20 p-2 rounded-full"><Heart fill="currentColor" size={32}/></div> HOLD FOR HELP
        </SecureButton>
        <p className="text-center text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Hold button for 1 second</p>
      </div>
    </div>
  );
};

export default PatientMode;