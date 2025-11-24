import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, X, Trophy } from 'lucide-react';

const SilverGym = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState('Stand inside the frame');
  const [skeletonY, setSkeletonY] = useState(50); // Animation state for arms

  // Simulation of PoseNet AI tracking (Auto-exercise for demo)
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        // Animate skeleton going up and down (Simulating movement)
        setSkeletonY(prev => {
          const next = prev === 50 ? 20 : 50;
          
          // Logic: When movement completes cycle, add rep
          if (next === 50) {
             setReps(r => r + 1);
             setFeedback('Excellent form!');
          } else {
             setFeedback('Reach higher... hold it...');
          }
          return next;
        });
      }, 1500); // 1.5 second per movement
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center">
      
      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center text-white bg-slate-900/50 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-500" />
          <h2 className="text-xl font-bold">The Silver Gym <span className="text-slate-400 text-sm">(Otago Rehab)</span></h2>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Main Viewport (AI Camera Simulation) */}
      <div className="relative w-full max-w-md aspect-[3/4] bg-slate-800 rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl">
        
        {/* Simulated Camera Feed Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center">
           {/* Grid lines to look like tech */}
           <div className="absolute inset-0 border-2 border-emerald-500/20 m-4 rounded-xl border-dashed"></div>
           <p className="text-white/10 font-bold text-4xl rotate-90 sm:rotate-0">CAMERA ACTIVE</p>
        </div>

        {/* AI Skeleton Overlay (SVG Animation) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transition: 'all 1s ease-in-out' }}>
           {/* Head */}
           <circle cx="50%" cy="20%" r="20" className="stroke-emerald-400 fill-transparent" strokeWidth="4" />
           {/* Spine */}
           <line x1="50%" y1="20%" x2="50%" y2="50%" className="stroke-emerald-400" strokeWidth="4" />
           {/* Arms (Animated based on skeletonY state) */}
           <line x1="50%" y1="30%" x2="20%" y2={skeletonY + "%"} className="stroke-emerald-400" strokeWidth="4" />
           <line x1="50%" y1="30%" x2="80%" y2={skeletonY + "%"} className="stroke-emerald-400" strokeWidth="4" />
           {/* Legs */}
           <line x1="50%" y1="50%" x2="30%" y2="80%" className="stroke-emerald-400" strokeWidth="4" />
           <line x1="50%" y1="50%" x2="70%" y2="80%" className="stroke-emerald-400" strokeWidth="4" />
           {/* Joints */}
           <circle cx="50%" cy="30%" r="4" className="fill-white" />
           <circle cx="50%" cy="50%" r="4" className="fill-white" />
        </svg>

        {/* Feedback Overlay */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-2xl font-bold text-white drop-shadow-md mb-2 transition-all">{feedback}</p>
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur px-6 py-2 rounded-full text-emerald-400 font-mono text-xl border border-emerald-500/30">
             <Trophy size={20} />
             <span>{reps} Reps</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xl transition-all active:scale-95 shadow-xl ${isPlaying ? 'bg-amber-500 text-amber-900 hover:bg-amber-400' : 'bg-emerald-500 text-white hover:bg-emerald-400'}`}
        >
          {isPlaying ? <><Pause fill="currentColor" /> Pause</> : <><Play fill="currentColor" /> Start Session</>}
        </button>
      </div>

    </div>
  );
};

export default SilverGym;