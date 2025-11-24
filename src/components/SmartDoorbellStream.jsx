import React, { useState, useEffect } from 'react';
import { Bell, Mic, MicOff, ShieldAlert, Phone, User, Eye, X, PhoneOff } from 'lucide-react';

const SmartDoorbellStream = ({ onClose }) => {
  // States: RINGING, PATIENT_ACTIVE, CARER_INTERCEPTING, ENDED
  const [status, setStatus] = useState('RINGING');
  const [scamReported, setScamReported] = useState(false);
  const [timer, setTimer] = useState(0);

  // Simulation of call timer
  useEffect(() => {
    let interval;
    if (status === 'PATIENT_ACTIVE' || status === 'CARER_INTERCEPTING') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-2">
          <Eye className="text-red-500 animate-pulse" />
          <span className="font-mono font-bold tracking-widest">FRONT DOOR • LIVE</span>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      {/* VIDEO FEED (Mock) */}
      <div className="relative w-full max-w-lg aspect-[4/3] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Simulated Camera View */}
        <div className="absolute inset-0 flex items-center justify-center">
           {/* Placeholder for Rogue Trader Image */}
           <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-10">
             <User size={64} className="text-slate-500" />
           </div>
           <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
        
        {/* Overlay Status */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
           {status === 'RINGING' && (
             <div className="animate-bounce bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
               <Bell className="text-yellow-400 fill-yellow-400" />
               <span className="font-bold">Doorbell Ringing...</span>
             </div>
           )}
           
           {(status === 'PATIENT_ACTIVE' || status === 'CARER_INTERCEPTING') && (
             <div className="text-white font-mono text-xl">{formatTime(timer)}</div>
           )}

           {status === 'CARER_INTERCEPTING' && (
             <div className="mt-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest animate-pulse">
               Carer Override Active
             </div>
           )}
        </div>
      </div>

      {/* CONTROLS AREA */}
      <div className="w-full max-w-lg mt-6 grid grid-cols-2 gap-4">
        
        {/* LEFT: PATIENT CONTROLS */}
        <div className={`p-4 rounded-xl border-2 transition-all ${status === 'PATIENT_ACTIVE' ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
          <div className="flex items-center gap-2 mb-3 text-slate-300">
             <User size={16} />
             <span className="text-xs font-bold uppercase">Arthur (Patient)</span>
          </div>
          
          {status === 'RINGING' && (
            <button 
              onClick={() => setStatus('PATIENT_ACTIVE')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Phone size={18} /> Answer
            </button>
          )}

          {status === 'PATIENT_ACTIVE' && (
            <div className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
              <Mic size={16} /> TALKING
            </div>
          )}

          {status === 'CARER_INTERCEPTING' && (
            <div className="text-slate-500 text-xs font-bold flex items-center justify-center gap-2 bg-black/50 py-2 rounded">
              <MicOff size={14} /> MUTED FOR SAFETY
            </div>
          )}
        </div>

        {/* RIGHT: CARER CONTROLS (THE GATEKEEPER) */}
        <div className={`p-4 rounded-xl border-2 transition-all ${status === 'CARER_INTERCEPTING' ? 'bg-indigo-900/50 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-800 border-slate-700'}`}>
          <div className="flex items-center gap-2 mb-3 text-indigo-300">
             <ShieldAlert size={16} />
             <span className="text-xs font-bold uppercase">Sarah (Carer)</span>
          </div>

          {(status === 'RINGING' || status === 'PATIENT_ACTIVE') && (
            <button 
              onClick={() => setStatus('CARER_INTERCEPTING')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <ShieldAlert size={18} /> INTERCEPT
            </button>
          )}

          {status === 'CARER_INTERCEPTING' && (
            <button 
              onClick={() => setStatus('ENDED')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <PhoneOff size={18} /> END CALL
            </button>
          )}
        </div>

      </div>

      {/* BOTTOM: ROGUE TRADER ALERT */}
      <div className="w-full max-w-lg mt-4">
        <button 
          onClick={() => setScamReported(!scamReported)}
          className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${scamReported ? 'bg-amber-600 text-white border-amber-600' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}
        >
          {scamReported ? (
            <>
              <ShieldAlert /> ROGUE TRADER REPORTED TO NEIGHBORHOOD WATCH
            </>
          ) : (
            <>
              <ShieldAlert /> Flag Visitor as Suspicious
            </>
          )}
        </button>
        {scamReported && (
          <p className="text-amber-500 text-xs text-center mt-2">
            Alert sent to 14 nearby CareSync users.
          </p>
        )}
      </div>

    </div>
  );
};

export default SmartDoorbellStream;