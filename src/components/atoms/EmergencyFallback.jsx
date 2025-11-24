import React from 'react';
import { Phone, RefreshCw } from 'lucide-react';

const EmergencyFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-rose-900 text-white flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="bg-white text-rose-900 p-4 rounded-full mb-6">
        <Phone size={48} />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">System Pause</h1>
      <p className="text-xl mb-8 opacity-90 max-w-md">
        The application has encountered a technical problem. 
        Your health data is safe.
      </p>
      
      {/* Emergency Contact Card */}
      <div className="bg-white text-black p-8 rounded-3xl w-full max-w-sm mb-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Emergency Contact</h2>
        <p className="text-lg text-slate-600 mb-4">Dr. Ada Turing (GP)</p>
        
        <a 
          href="tel:111" 
          className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-xl mt-2 text-2xl transition-colors"
        >
          <Phone /> Call 111 (NHS)
        </a>
      </div>

      {/* Reset Button */}
      <button 
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 text-white/70 hover:text-white underline decoration-2 underline-offset-4"
      >
        <RefreshCw size={16} />
        Try reloading the application
      </button>
      
      {/* Dev Info */}
      {error && <pre className="mt-8 text-xs text-rose-200 text-left bg-black/20 p-4 rounded max-w-lg overflow-auto">{error.message}</pre>}
    </div>
  );
};

export default EmergencyFallback;