import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Plus, X, Image as ImageIcon } from 'lucide-react';

const ARMemoryWall = ({ onClose }) => {
  const [permission, setPermission] = useState('prompt'); // prompt, granted, denied
  const [memories, setMemories] = useState([
    { id: 1, x: 20, y: 30, title: 'Wedding 1968', color: 'bg-amber-500' },
    { id: 2, x: 70, y: 50, title: 'Timmy first steps', color: 'bg-blue-500' },
  ]);

  // Mock Camera Request
  useEffect(() => {
    // In a real app, we would use navigator.mediaDevices.getUserMedia
    // Here we just simulate the delay of asking permission
    const timer = setTimeout(() => setPermission('granted'), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addMarker = (e) => {
    // Get click coordinates relative to the screen
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMem = {
      id: Date.now(),
      x,
      y,
      title: 'New Memory',
      color: 'bg-indigo-500'
    };
    setMemories([...memories, newMem]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-mono text-xs uppercase tracking-widest">Live AR Feed</span>
        </div>
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full backdrop-blur">
          <X size={20} />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div 
        className="flex-1 relative overflow-hidden bg-slate-800 cursor-crosshair"
        onClick={addMarker}
      >
        {/* Simulated Camera Feed Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
           <Camera size={100} className="text-white opacity-20" />
           <p className="mt-4 text-white font-mono opacity-50">Camera Active</p>
        </div>

        {/* Permission Loader */}
        {permission === 'prompt' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white space-y-4">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-white/20 rounded-full animate-spin mx-auto"></div>
              <p>Calibrating Sensors...</p>
            </div>
          </div>
        )}

        {/* AR Markers (Floating Memories) */}
        {permission === 'granted' && memories.map((m) => (
          <div
            key={m.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onClick={(e) => { e.stopPropagation(); alert(`Opening memory: ${m.title}`); }}
          >
            {/* The Pin Point */}
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${m.color} animate-ping absolute top-0 left-0 opacity-50`}></div>
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${m.color} relative z-10`}></div>
            
            {/* The Floating Card */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 bg-white/90 backdrop-blur p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-95 group-hover:scale-100 origin-top">
              <div className="h-20 bg-slate-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                 <ImageIcon size={16} className="text-slate-400" />
              </div>
              <p className="text-[10px] font-bold text-slate-800 text-center">{m.title}</p>
            </div>
            
            {/* Connecting Line to 'reality' */}
            <div className="absolute h-8 w-px bg-white/50 left-1/2 -top-8 origin-bottom"></div>
          </div>
        ))}
        
        {/* Instructions */}
        {permission === 'granted' && (
           <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
             <p className="text-white/80 text-sm bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur border border-white/20">
               Tap anywhere to pin a memory to this location
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ARMemoryWall;