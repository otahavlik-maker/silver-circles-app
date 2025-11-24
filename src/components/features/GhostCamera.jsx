import React, { useState } from 'react';
import { Camera, X, Layers, Eye, Check } from 'lucide-react';

const GhostCamera = ({ onClose }) => {
  const [opacity, setOpacity] = useState(50); // Průhlednost "ducha"
  const [captured, setCaptured] = useState(false);

  // Mock: Minulá fotka rány (The "Ghost")
  const ghostImage = "https://images.unsplash.com/photo-1579165466741-7f35a4755657?q=80&w=1000&auto=format&fit=crop"; 

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => {
      alert("Image Synced to Digital Twin History");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex items-center gap-2">
          <Layers className="text-blue-400" />
          <span className="font-bold">Wound Tracker: Left Heel</span>
        </div>
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full backdrop-blur">
          <X size={20} />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-slate-800">
        
        {/* 1. LIVE CAMERA FEED (Simulated) */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
           {/* Grid pro zarovnání */}
           <div className="w-full h-full border-2 border-white/20 grid grid-cols-3 grid-rows-3">
             {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10"></div>)}
           </div>
           <p className="absolute text-white/50 font-mono">LIVE CAMERA FEED</p>
        </div>

        {/* 2. THE GHOST OVERLAY (Minulá fotka) */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-200 grayscale contrast-125"
          style={{ 
            backgroundImage: `url(${ghostImage})`, 
            opacity: opacity / 100 
          }}
        ></div>

        {/* 3. Feedback po vyfocení */}
        {captured && (
          <div className="absolute inset-0 bg-white flex items-center justify-center animate-flash">
            <div className="text-emerald-600 flex flex-col items-center scale-150">
              <Check size={64} />
              <span className="font-bold text-xl">MATCHED</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/80 p-6 pb-12">
        
        {/* Opacity Slider */}
        <div className="flex items-center gap-4 mb-6">
          <Eye size={20} className="text-white/50" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={opacity} 
            onChange={(e) => setOpacity(e.target.value)}
            className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white font-mono w-12 text-right">{opacity}%</span>
        </div>

        {/* Trigger */}
        <div className="flex justify-center">
          <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-full h-full bg-white rounded-full hover:bg-blue-500 transition-colors"></div>
          </button>
        </div>
        
        <p className="text-center text-white/50 text-sm mt-4">
          Align the ghost image with the live wound
        </p>
      </div>
    </div>
  );
};

export default GhostCamera;