import React, { useState } from 'react';
import { Syringe, Pill, AlertTriangle, Clock, CheckCircle2, ShieldAlert, X } from 'lucide-react';

const ClinicalMedicationManager = () => {
  // Mock Data with Clinical Attributes
  const [meds, setMeds] = useState([
    { 
      id: 1, 
      name: 'Insulin Glargine', 
      dose: '12 Units', 
      time: '08:00', 
      type: 'HIGH_RISK', // Requires Double Check
      category: 'P1', // Critical
      status: 'pending' 
    },
    { 
      id: 2, 
      name: 'Warfarin', 
      dose: '2.5mg', 
      time: '08:00', 
      type: 'HIGH_RISK', 
      category: 'P1', 
      status: 'pending' 
    },
    { 
      id: 3, 
      name: 'Vitamin D', 
      dose: '1000 IU', 
      time: '09:00', 
      type: 'STANDARD', 
      category: 'P2', // Routine
      status: 'pending' 
    },
  ]);

  const [confirmingMed, setConfirmingMed] = useState(null); // The med currently being double-checked
  const [safetyCheck, setSafetyCheck] = useState(false); // Checkbox in the modal

  const handleAttemptTake = (med) => {
    if (med.type === 'HIGH_RISK') {
      // Trigger Safety Protocol
      setConfirmingMed(med);
      setSafetyCheck(false);
    } else {
      // Standard meds just get marked done
      markAsTaken(med.id);
    }
  };

  const markAsTaken = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, status: 'taken', takenAt: new Date().toLocaleTimeString() } : m));
    setConfirmingMed(null);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Syringe size={20} className="text-rose-600" />
          Clinical Meds
        </h3>
        <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full border border-rose-200">
          Safety Protocol Active
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {meds.map((med) => (
          <div 
            key={med.id}
            className={`
              relative p-3 rounded-xl border-2 transition-all group
              ${med.status === 'taken' ? 'bg-slate-50 border-slate-100 opacity-60' : ''}
              ${med.status === 'pending' && med.category === 'P1' ? 'bg-white border-rose-100 shadow-sm hover:border-rose-300' : ''}
              ${med.status === 'pending' && med.category === 'P2' ? 'bg-white border-slate-100 hover:border-indigo-200' : ''}
            `}
          >
            {/* P1 Badge (Traffic Light) */}
            {med.status === 'pending' && med.category === 'P1' && (
              <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                P1: CRITICAL
              </div>
            )}

            <div className="flex justify-between items-center">
              {/* Left Side: Info */}
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${med.type === 'HIGH_RISK' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}
                `}>
                  {med.type === 'HIGH_RISK' ? <Syringe size={20} /> : <Pill size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{med.dose} • {med.time}</p>
                </div>
              </div>

              {/* Right Side: Action */}
              {med.status === 'taken' ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 size={16} /> Taken
                </div>
              ) : (
                <button 
                  onClick={() => handleAttemptTake(med)}
                  className={`
                    px-4 py-2 rounded-lg text-xs font-bold transition-colors
                    ${med.type === 'HIGH_RISK' 
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}
                  `}
                >
                  Administer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: HIGH RISK INTERLOCK */}
      {confirmingMed && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm border-b-4 border-rose-500">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={32} className="text-rose-600" />
            </div>
            
            <h4 className="text-xl font-bold text-slate-800 mb-1">Safety Stop</h4>
            <p className="text-sm text-slate-500 mb-4">
              You are administering a <span className="text-rose-600 font-bold">High-Risk Medication</span>.
            </p>

            <div className="bg-rose-50 p-4 rounded-xl mb-4 border border-rose-100">
              <p className="font-bold text-lg text-slate-800">{confirmingMed.name}</p>
              <p className="font-mono text-rose-700 text-xl font-bold">{confirmingMed.dose}</p>
            </div>

            <label className="flex items-start gap-3 text-left text-sm text-slate-600 mb-6 cursor-pointer p-2 hover:bg-slate-50 rounded">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                checked={safetyCheck}
                onChange={(e) => setSafetyCheck(e.target.checked)}
              />
              <span>
                I have visually confirmed the dosage on the device/packaging matches <strong>{confirmingMed.dose}</strong>.
              </span>
            </label>

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmingMed(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => markAsTaken(confirmingMed.id)}
                disabled={!safetyCheck}
                className={`
                  flex-1 py-3 font-bold rounded-xl text-white shadow-lg transition-all
                  ${safetyCheck 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' 
                    : 'bg-slate-300 cursor-not-allowed'}
                `}
              >
                Confirm Dose
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClinicalMedicationManager;