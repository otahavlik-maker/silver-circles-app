import React, { useState, useEffect } from 'react';
import { QrCode, Shield, ShieldAlert, Mic, Video, X, Zap, Wifi, Tv } from 'lucide-react';

const SmartHomeHub = ({ onClose }) => {
  const [mode, setMode] = useState('SCAN'); // SCAN or SENTINEL
  const [scannedItem, setScannedItem] = useState(null);
  
  // Sentinel State
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [threatLevel, setThreatLevel] = useState('SAFE');

  // Database of "Smart Labels" (Instructions)
  const smartLabels = {
    microwave: { title: 'Microwave', instruction: 'Press the BIG RED button to heat soup for 2 mins.', icon: <Zap /> },
    router: { title: 'WiFi Router', instruction: 'If internet is down, pull the black cord and count to 10.', icon: <Wifi /> },
    tv: { title: 'TV Remote', instruction: 'Use the blue button for BBC1. Do not touch the "Source" button.', icon: <Tv /> }
  };

  // Simulation: Safety Sentinel Listening Logic
  useEffect(() => {
    let interval;
    if (mode === 'SENTINEL' && listening) {
      const phrases = [
        "Hello, how are you?", 
        "Nice weather today.", 
        "I am calling from your BANK.", // Trigger
        "We need your PASSWORD.", // Trigger
        "Just a routine check."
      ];
      
      let i = 0;
      interval = setInterval(() => {
        const text = phrases[i % phrases.length];
        setTranscript(prev => [...prev.slice(-4), text]); // Keep last 5 lines
        
        // SCAM DETECTION LOGIC
        if (text.toUpperCase().includes('BANK') || text.toUpperCase().includes('PASSWORD')) {
          setThreatLevel('CRITICAL');
        }
        
        i++;
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [mode, listening]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      
      {/* Header */}
      <div className="p-4 bg-slate-800 text-white flex justify-between items-center shadow-md">
        <h2 className="font-bold text-xl flex items-center gap-2">
          {mode === 'SCAN' ? <QrCode className="text-emerald-400" /> : <Shield className="text-blue-400" />}
          Smart Home Hub
        </h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 border-t border-slate-700">
        <button 
          onClick={() => setMode('SCAN')}
          className={`flex-1 p-4 font-bold flex justify-center gap-2 ${mode === 'SCAN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
        >
          <QrCode /> Object Scanner
        </button>
        <button 
          onClick={() => setMode('SENTINEL')}
          className={`flex-1 p-4 font-bold flex justify-center gap-2 ${mode === 'SENTINEL' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
        >
          <Shield /> Safety Sentinel
        </button>
      </div>

      {/* CONTENT: SCANNER MODE */}
      {mode === 'SCAN' && (
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
          
          {/* Simulated Camera Viewfinder */}
          {!scannedItem ? (
            <div className="w-full max-w-md aspect-square bg-slate-800 rounded-3xl border-4 border-slate-600 relative flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute inset-0 border-2 border-emerald-500/50 m-8 rounded-xl border-dashed animate-pulse pointer-events-none"></div>
              <p className="text-slate-400 mb-8">Point camera at a Smart Label...</p>
              
              {/* Simulation Controls */}
              <div className="grid grid-cols-1 gap-3 w-full max-w-xs z-10">
                <button onClick={() => setScannedItem(smartLabels.microwave)} className="bg-slate-700 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-3">
                  <QrCode size={16} /> Scan "Microwave"
                </button>
                <button onClick={() => setScannedItem(smartLabels.router)} className="bg-slate-700 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-3">
                  <QrCode size={16} /> Scan "WiFi Router"
                </button>
                <button onClick={() => setScannedItem(smartLabels.tv)} className="bg-slate-700 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-3">
                  <QrCode size={16} /> Scan "TV Remote"
                </button>
              </div>
            </div>
          ) : (
            // AR OVERLAY RESULT
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {scannedItem.icon} {scannedItem.title}
                </h3>
                <button onClick={() => setScannedItem(null)} className="text-white/80 hover:text-white"><X /></button>
              </div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video size={32} />
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-4">"Hi Dad!"</p>
                <p className="text-lg text-slate-600 leading-relaxed">{scannedItem.instruction}</p>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button onClick={() => setScannedItem(null)} className="text-emerald-600 font-bold hover:underline">Scan Another Item</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENT: SENTINEL MODE */}
      {mode === 'SENTINEL' && (
        <div className={`flex-1 p-6 flex flex-col items-center justify-center transition-colors duration-500 ${threatLevel === 'CRITICAL' ? 'bg-rose-900' : 'bg-slate-900'}`}>
          
          <div className="text-center mb-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border-4 shadow-2xl transition-all ${listening ? 'scale-110' : 'scale-100'} ${threatLevel === 'CRITICAL' ? 'bg-rose-600 border-rose-400 animate-ping' : 'bg-blue-600 border-blue-400'}`}>
              {threatLevel === 'CRITICAL' ? <ShieldAlert size={64} className="text-white" /> : <Mic size={64} className="text-white" />}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {threatLevel === 'CRITICAL' ? 'SCAM ALERT TRIGGERED' : 'Sentinel Active'}
            </h3>
            <p className="text-white/60">
              {threatLevel === 'CRITICAL' ? 'Suspicious keywords detected!' : 'Monitoring environment for threats...'}
            </p>
          </div>

          {/* Live Transcript Log */}
          <div className="w-full max-w-md bg-black/30 rounded-xl p-4 h-48 overflow-hidden border border-white/10 mb-6 font-mono text-sm">
            {transcript.map((line, i) => (
              <p key={i} className={`mb-2 ${line.toUpperCase().includes('BANK') ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                &gt; {line}
              </p>
            ))}
            {!listening && <p className="text-slate-500 italic">Sentinel paused.</p>}
          </div>

          <button 
            onClick={() => {
              setListening(!listening);
              if (!listening) { setThreatLevel('SAFE'); setTranscript([]); }
            }}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg ${listening ? 'bg-slate-700 text-white' : 'bg-emerald-600 text-white'}`}
          >
            {listening ? 'Stop Monitoring' : 'Activate Sentinel'}
          </button>
          
          {threatLevel === 'CRITICAL' && (
            <div className="mt-6 bg-white text-rose-600 px-6 py-3 rounded-full font-bold animate-bounce">
              ⚠️ HANG UP THE PHONE IMMEDIATELY ⚠️
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SmartHomeHub;