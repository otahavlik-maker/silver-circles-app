// src/components/modes/NurseMode.jsx - FINAL REPAIRED VERSION with Modules

import React, { useState } from 'react';
import { Activity, MapPin, Mic, FileText, ChevronRight, AlertTriangle, Layers, X } from 'lucide-react';
import GhostCamera from '../features/GhostCamera'; 
import SbarTriageModule from '../SbarTriageModule'; 

// KLINICKÉ MODULY - OPRAVENÁ CESTA k App.jsx!
import { VitalsModule } from '../../App'; // <--- OPRAVENO: ../../App
import ClinicalMedicationManager from '../ClinicalMedicationManager';
import TreatmentsLogModule from '../TreatmentsLogModule';

const NurseMode = () => {
  const [showGhostCam, setShowGhostCam] = useState(false); 
  const [showSbarModule, setShowSbarModule] = useState(false);
  
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: 'Elsie (82)', 
      condition: 'Type 2 Diabetes', 
      acuity: 'P1', 
      status: 'DETERIORATING', 
      location: '2 miles away',
      lastVitals: 'BP 160/95 (High)',
      alerts: ['Insulin Missed', 'SOS Triggered']
    },
    { 
      id: 2, 
      name: 'Arthur (79)', 
      condition: 'Leg Ulcer', 
      acuity: 'P2', 
      status: 'STABLE', 
      location: '0.5 miles away',
      lastVitals: 'BP 120/80 (Normal)',
      alerts: ['Routine Dressing Change']
    }
  ]);

  const [activePatient, setActivePatient] = useState(null);

  const openSbarForPatient = (patient) => {
    setActivePatient(patient);
    setShowSbarModule(true);
  };
  
  const closeSbarModule = () => {
    setActivePatient(null);
    setShowSbarModule(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      
      {/* OVERLAY: GHOST CAMERA */}
      {showGhostCam && <GhostCamera onClose={() => setShowGhostCam(false)} />}

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
        <div className="flex gap-4 text-sm font-mono">
          <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded text-red-200">P1 CRITICAL: 1</div>
          <div className="bg-amber-500/20 border border-amber-500/50 px-3 py-1 rounded text-amber-200">P2 URGENT: 1</div>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        
        {/* Patient Cards (P1/P2) */}
        {patients.map((p) => (
          <div key={p.id} className={`rounded-xl border-l-8 shadow-sm bg-white overflow-hidden transition-all ${p.acuity === 'P1' ? 'border-red-600 ring-1 ring-red-100' : 'border-amber-500'}`}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {p.name}
                    {p.status === 'DETERIORATING' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">DETERIORATING</span>}
                  </h3>
                  <p className="text-slate-500 text-sm">{p.condition}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-xl ${p.acuity === 'P1' ? 'text-red-600' : 'text-slate-600'}`}>{p.acuity}</span>
                  <div className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-1"><MapPin size={12} /> {p.location}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                 <p className="text-sm font-mono text-slate-700"><strong>Latest:</strong> {p.lastVitals}</p>
                 {p.alerts.map((alert, i) => (
                   <div key={i} className="flex items-center gap-2 text-red-600 text-sm font-bold mt-1"><AlertTriangle size={14} /> {alert}</div>
                 ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => openSbarForPatient(p)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                  <Mic size={18} /> Note
                </button>
                
                {p.id === 2 && (
                  <button onClick={() => setShowGhostCam(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <Layers size={18} /> Wound Tracker
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* KLINICKÉ MODULY - NYNÍ ZDE, PŘÍMO POD PATIENT CARDS! */}
        <VitalsModule />
        <ClinicalMedicationManager />
        <TreatmentsLogModule />

      </div>

      {/* NEW MODAL: SbarTriageModule */}
      {showSbarModule && activePatient && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-end sm:justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><FileText size={20} /> SBAR Report: {activePatient.name}</h3>
              <button onClick={closeSbarModule} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
                <SbarTriageModule patient={activePatient} onClose={closeSbarModule} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseMode;