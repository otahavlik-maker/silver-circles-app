import React, { useState, useEffect } from 'react';
import { Siren, Lock, Unlock, FileText, AlertTriangle, Send, ShieldAlert } from 'lucide-react';

const LegalVaultAccess = () => {
  const [status, setStatus] = useState('LOCKED'); // LOCKED, NOTIFYING, OPEN
  const [countdown, setCountdown] = useState(3);

  // Mock: Simulation of Firebase Cloud Function trigger (Send SMS via Twilio)
  const triggerEmergencyProtocol = async () => {
    setStatus('NOTIFYING');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    setStatus('OPEN');
    // In real app: await functions.httpsCallable('notifyNextOfKin')();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <h3 className="font-bold flex items-center gap-2">
          <ShieldAlert className="text-rose-500" />
          Legal Vault
        </h3>
        <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded">
          {status === 'OPEN' ? 'ACCESS_GRANTED' : 'SECURE_STORAGE'}
        </div>
      </div>

      {/* BODY: 3 States */}
      
      {/* STATE 1: LOCKED */}
      {status === 'LOCKED' && (
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-4 border-slate-200">
            <Lock size={32} className="text-slate-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Restricted Access</h4>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
              Contains sensitive documents: DNR (Do Not Resuscitate), Last Will, and Power of Attorney.
            </p>
          </div>
          
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-left flex gap-3">
             <AlertTriangle className="text-rose-600 shrink-0" />
             <div className="text-xs text-rose-800">
               <strong>Security Protocol:</strong> Unlocking this vault will immediately send an SMS alert to all registered Next of Kin (Sarah, John).
             </div>
          </div>

          <button 
            onClick={triggerEmergencyProtocol}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Siren /> BREAK GLASS TO OPEN
          </button>
        </div>
      )}

      {/* STATE 2: NOTIFYING (Simulation) */}
      {status === 'NOTIFYING' && (
        <div className="p-12 text-center bg-rose-600 text-white animate-pulse">
          <Send size={48} className="mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-2">Alerting Family...</h3>
          <p className="text-rose-100">Sending SMS to +44 7700 900...</p>
        </div>
      )}

      {/* STATE 3: OPEN (Documents) */}
      {status === 'OPEN' && (
        <div className="p-6 bg-slate-50">
           <div className="flex items-center gap-2 mb-6 text-emerald-700 bg-emerald-100 p-3 rounded-lg border border-emerald-200">
             <Unlock size={18} />
             <span className="text-sm font-bold">Vault Unlocked. Access logged at {new Date().toLocaleTimeString()}.</span>
           </div>

           <div className="space-y-3">
             {[
               { name: 'DNR_Form_Signed_2024.pdf', type: 'Critical' },
               { name: 'Power_of_Attorney_LPA.pdf', type: 'Legal' },
               { name: 'Advance_Directive.pdf', type: 'Medical' }
             ].map((doc, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3">
                   <div className="bg-red-100 p-2 rounded text-red-600">
                     <FileText size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-slate-700 group-hover:text-indigo-600">{doc.name}</p>
                     <p className="text-xs text-slate-400">{doc.type}</p>
                   </div>
                 </div>
                 <button className="text-xs bg-slate-100 px-3 py-1 rounded font-bold text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                   VIEW
                 </button>
               </div>
             ))}
           </div>

           <button 
             onClick={() => setStatus('LOCKED')}
             className="mt-6 w-full py-3 text-slate-400 text-sm hover:text-slate-600"
           >
             Lock Vault
           </button>
        </div>
      )}

    </div>
  );
};

export default LegalVaultAccess;