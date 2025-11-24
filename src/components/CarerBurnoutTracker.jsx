import React, { useState } from 'react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Coffee, MessageSquare, Users, Trash2, HeartPulse, X } from 'lucide-react';

const CarerBurnoutTracker = ({ onClose }) => {
  // Mock Data: Carer Stats
  const [energy, setEnergy] = useState(35); // Low energy simulation
  const [streak, setStreak] = useState(14); // 14 days without a break
  const [showVent, setShowVent] = useState(false);
  const [ventText, setVentText] = useState('');

  const getBatteryIcon = () => {
    if (energy > 60) return <BatteryFull className="text-emerald-500" size={48} />;
    if (energy > 30) return <BatteryMedium className="text-amber-500" size={48} />;
    return <BatteryLow className="text-rose-500 animate-pulse" size={48} />;
  };

  const handleVentSubmit = (e) => {
    e.preventDefault();
    if (!ventText) return;
    alert("Message cast into the void. Use this space to breathe.");
    setVentText(''); // Auto-destruct
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
          <h2 className="font-bold text-2xl text-slate-800 flex items-center justify-center gap-2">
            <HeartPulse className="text-rose-500" />
            Carer Vital Signs
          </h2>
          <p className="text-slate-500 text-sm">"Put on your own oxygen mask first."</p>
        </div>

        {/* Battery Monitor */}
        <div className="p-8 text-center bg-slate-50">
          <div className="flex justify-center mb-4 transform scale-150">
            {getBatteryIcon()}
          </div>
          <h3 className={`text-3xl font-bold mb-2 ${energy < 40 ? 'text-rose-600' : 'text-slate-700'}`}>
            {energy}% Energy
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            Shift Streak: <span className="font-bold text-slate-900">{streak} Days</span>
          </p>

          {/* WARNING LOGIC */}
          {energy < 40 && (
            <div className="mt-6 bg-rose-100 border border-rose-200 text-rose-800 p-4 rounded-xl text-left text-sm">
              <strong>⚠️ Burnout Risk Detected</strong>
              <p className="mt-1">
                You have logged {streak} consecutive days without a break. Clinical safety protocols recommend immediate respite.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <button className="col-span-1 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors">
            <Users size={20} />
            Request Backup
          </button>
          
          <button 
            onClick={() => setEnergy(e => Math.min(e + 10, 100))}
            className="col-span-1 bg-white border-2 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 p-3 rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-colors"
          >
            <Coffee size={20} />
            Log Break (+10%)
          </button>

          <button 
            onClick={() => setShowVent(true)}
            className="col-span-2 bg-slate-800 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            <MessageSquare size={18} /> Enter "The Vent Room"
          </button>
        </div>
      </div>

      {/* OVERLAY: THE VENT ROOM */}
      {showVent && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 text-slate-300">The Vent Room</h3>
          <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
            Write your frustrations here. They are anonymous and will be deleted instantly upon sending. No judgment.
          </p>

          <form onSubmit={handleVentSubmit} className="w-full max-w-md space-y-4">
            <textarea 
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              placeholder="I feel overwhelmed because..."
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-slate-500 focus:outline-none resize-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setShowVent(false)}
                className="flex-1 py-3 bg-transparent border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                <Trash2 size={16} /> Release
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CarerBurnoutTracker;