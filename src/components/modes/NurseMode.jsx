import React, { useState } from 'react';
import { Activity, MapPin, Mic, FileText, ChevronRight, AlertTriangle, CheckCircle, Clock, Save } from 'lucide-react';

const NurseMode = () => {
  // MOCK: Seznam pacientů (Data, která by normálně přišla z Firebase)
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: 'Elsie (82)', 
      condition: 'Type 2 Diabetes', 
      acuity: 'P1', // CRITICAL
      status: 'DETERIORATING', // Radar detekoval zhoršení
      location: '2 miles away',
      lastVitals: 'BP 160/95 (High)',
      alerts: ['Insulin Missed', 'SOS Triggered']
    },
    { 
      id: 2, 
      name: 'Arthur (79)', 
      condition: 'Leg Ulcer', 
      acuity: 'P2', // URGENT
      status: 'STABLE', 
      location: '0.5 miles away',
      lastVitals: 'BP 120/80 (Normal)',
      alerts: ['Routine Dressing Change']
    },
    { 
      id: 3, 
      name: 'Mary (85)', 
      condition: 'Dementia', 
      acuity: 'P3', // ROUTINE
      status: 'STABLE', 
      location: '4 miles away',
      lastVitals: 'Hydration 90% (Good)',
      alerts: []
    }
  ]);

  // State pro diktování
  const [activePatient, setActivePatient] = useState(null); // Kterého pacienta řeším
  const [isRecording, setIsRecording] = useState(false);
  const [note, setNote] = useState(''); // Výsledný text

  // Simulace AI Diktování (Voice-to-SOAP)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setNote('Listening...');
      // Simulace: Po 2 sekundách AI "pochopí" a vygeneruje SOAP note
      setTimeout(() => {
        setIsRecording(false);
        setNote(`
        [AI GENERATED SBAR NOTE]
        S (Situation): Patient found confused and dizzy. Blood Glucose 14.2 mmol/L. BP 160/95.
        B (Background): 82y female, Type 2 Diabetes. Missed morning insulin dose due to "forgetting".
        A (Assessment): Hyperglycemia symptomatic. Patient is deteriorating (P1). Risk of falls.
        R (Recommendation): Administered 10U Novorapid stat. Will monitor for 1hr. Request GP review medication compliance aid.
        `.trim());
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* 1. HLAVIČKA (Cockpit Header) */}
      <header className="bg-blue-900 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="text-blue-400" />
            Clinical Cockpit
          </h1>
          <div className="text-right">
            <p className="font-bold">Nurse Sarah</p>
            <p className="text-xs text-blue-300">Shift ends: 18:00</p>
          </div>
        </div>
        
        {/* Route Optimization Stats */}
        <div className="flex gap-4 text-sm font-mono">
          <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded text-red-200">
            P1 CRITICAL: 1
          </div>
          <div className="bg-amber-500/20 border border-amber-500/50 px-3 py-1 rounded text-amber-200">
            P2 URGENT: 1
          </div>
        </div>
      </header>

      {/* 2. SEZNAM PACIENTŮ (AI Route Optimization) */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {patients.map((p) => (
          <div 
            key={p.id} 
            className={`rounded-xl border-l-8 shadow-sm bg-white overflow-hidden transition-all ${
              p.acuity === 'P1' ? 'border-red-600 ring-1 ring-red-100' : 
              p.acuity === 'P2' ? 'border-amber-500' : 'border-emerald-500'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {p.name}
                    {p.status === 'DETERIORATING' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                        DETERIORATING
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-500 text-sm">{p.condition}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-xl ${p.acuity === 'P1' ? 'text-red-600' : 'text-slate-600'}`}>
                    {p.acuity}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-1">
                    <MapPin size={12} /> {p.location}
                  </div>
                </div>
              </div>

              {/* Vitals & Alerts */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                 <p className="text-sm font-mono text-slate-700"><strong>Latest:</strong> {p.lastVitals}</p>
                 {p.alerts.map((alert, i) => (
                   <div key={i} className="flex items-center gap-2 text-red-600 text-sm font-bold mt-1">
                     <AlertTriangle size={14} /> {alert}
                   </div>
                 ))}
              </div>

              {/* Akce */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setActivePatient(p)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Mic size={18} /> Clinical Note
                </button>
                <button className="px-4 py-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MODÁLNÍ OKNO: Voice-to-Clinical-Note */}
      {activePatient && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-end sm:justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <FileText size={20} /> New Note: {activePatient.name}
              </h3>
              <button onClick={() => { setActivePatient(null); setNote(''); }} className="text-white/80 hover:text-white">Close</button>
            </div>

            <div className="p-8 text-center">
              {!note && !isRecording && (
                <div className="text-slate-500 mb-8">
                  <p>Tap microphone to dictate.</p>
                  <p className="text-xs mt-2">AI will format to SOAP structure.</p>
                </div>
              )}

              {/* Tlačítko nahrávání */}
              <button 
                onClick={toggleRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${isRecording ? 'bg-red-500 animate-pulse shadow-red-300' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              >
                <Mic size={40} className={isRecording ? 'text-white' : ''} />
              </button>

              {/* Výsledek AI */}
              {note && (
                <div className="bg-slate-100 p-4 rounded-xl text-left font-mono text-sm text-slate-800 border-l-4 border-emerald-500 h-48 overflow-y-auto mb-6">
                  <pre className="whitespace-pre-wrap font-sans">{note}</pre>
                </div>
              )}

              {note && !isRecording && (
                <button 
                  onClick={() => { alert('Note synced to NHS Spine (Mock)'); setActivePatient(null); setNote(''); }}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Confirm & Upload Note
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NurseMode;