import React, { useState } from 'react';
import { Heart, Mic, Shield, AlertTriangle, Check, X, Watch, Image as ImageIcon, Book } from 'lucide-react';

const LegacyManager = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('ITEMS'); // ITEMS or VOICE
  const [recording, setRecording] = useState(false);
  
  // Mock Data: Family Heirlooms
  // Logic: 'claims' array stores who wants the item. If length > 1, it's a conflict.
  const [items, setItems] = useState([
    { id: 1, name: "Grandfather's Watch", desc: "Gold, 1950", claims: ['Sarah', 'John'], resolved: false, icon: <Watch /> },
    { id: 2, name: "Pearl Necklace", desc: "Worn at wedding", claims: ['Sarah'], resolved: true, icon: <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-300"></div> },
    { id: 3, name: "Photo Albums (1960-1980)", desc: "The big red box", claims: [], resolved: false, icon: <ImageIcon /> },
    { id: 4, name: "First Edition Book", desc: "Dickens", claims: ['John'], resolved: true, icon: <Book /> },
  ]);

  const resolveConflict = (id) => {
    alert("Opening Camera for Arthur to record his decision...");
    // Simulate resolution
    setItems(items.map(i => i.id === id ? { ...i, resolved: true, decision: "Video Recorded" } : i));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col text-slate-100">
      
      {/* Header (Gold Theme for Legacy) */}
      <div className="p-4 bg-amber-900/40 backdrop-blur border-b border-amber-800 flex justify-between items-center">
        <h2 className="font-bold text-xl flex items-center gap-2 text-amber-100">
          <Shield className="text-amber-500" />
          Legacy & Heritage
        </h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('ITEMS')}
          className={`flex-1 p-4 font-bold text-sm tracking-widest uppercase transition-colors ${activeTab === 'ITEMS' ? 'bg-slate-800 text-amber-500 border-b-2 border-amber-500' : 'text-slate-500'}`}
        >
          Heirloom Allocator
        </button>
        <button 
          onClick={() => setActiveTab('VOICE')}
          className={`flex-1 p-4 font-bold text-sm tracking-widest uppercase transition-colors ${activeTab === 'VOICE' ? 'bg-slate-800 text-amber-500 border-b-2 border-amber-500' : 'text-slate-500'}`}
        >
          Voice Keeper
        </button>
      </div>

      {/* CONTENT: HEIRLOOM ALLOCATOR */}
      {activeTab === 'ITEMS' && (
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl mb-6 flex gap-4 items-start">
             <Heart className="text-amber-500 shrink-0 mt-1" />
             <div>
               <h3 className="font-bold text-amber-100">Family Harmony Protocol</h3>
               <p className="text-sm text-amber-200/60">
                 Items with multiple claims (conflicts) are highlighted. Arthur must record a decision to prevent future disputes.
               </p>
             </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const isConflict = item.claims.length > 1 && !item.resolved;
              
              return (
                <div key={item.id} className={`p-4 rounded-xl border ${isConflict ? 'bg-rose-900/20 border-rose-500/50' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                        
                        {/* Claims List */}
                        <div className="flex gap-2 mt-2">
                          {item.claims.length === 0 && <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">Unclaimed</span>}
                          {item.claims.map(c => (
                            <span key={c} className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded border border-indigo-700 flex items-center gap-1">
                              {c} <Heart size={10} fill="currentColor" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status / Action */}
                    <div className="text-right">
                      {isConflict ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="flex items-center gap-1 text-rose-500 text-xs font-bold uppercase animate-pulse">
                            <AlertTriangle size={12} /> Conflict
                          </span>
                          <button 
                            onClick={() => resolveConflict(item.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg font-bold"
                          >
                            Record Decision
                          </button>
                        </div>
                      ) : item.resolved && item.claims.length > 1 ? (
                         <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                           <Check size={12} /> Resolved
                         </span>
                      ) : (
                        <span className="text-slate-600 text-xs">No Action Needed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT: VOICE KEEPER */}
      {activeTab === 'VOICE' && (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900 to-black">
          <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center mb-8 transition-all ${recording ? 'border-rose-500 bg-rose-900/20 shadow-[0_0_50px_rgba(225,29,72,0.4)]' : 'border-slate-700 bg-slate-800'}`}>
            <Mic size={64} className={recording ? 'text-rose-500 animate-pulse' : 'text-slate-500'} />
          </div>

          <h3 className="text-2xl font-bold mb-2">Voice Preservation</h3>
          <p className="text-slate-400 max-w-xs mb-12">
            "Arthur, please read the sentence below to train the AI model."
          </p>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-md mb-8">
            <p className="font-serif text-xl text-amber-100 italic">
              "I remember the smell of rain on the asphalt in London, back in 1952..."
            </p>
          </div>

          <button 
            onMouseDown={() => setRecording(true)}
            onMouseUp={() => setRecording(false)}
            onMouseLeave={() => setRecording(false)}
            className="w-full max-w-sm bg-slate-100 hover:bg-white text-slate-900 font-bold py-4 rounded-full transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            {recording ? 'Recording... Release to Stop' : 'Hold to Record'}
          </button>
        </div>
      )}

    </div>
  );
};

export default LegacyManager;