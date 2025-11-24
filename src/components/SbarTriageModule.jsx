// src/components/SbarTriageModule.jsx - FINAL CORRECTED VERSION

import React, { useState } from 'react';
// Importujeme Card a Button ze složky atoms, kde jsou nyní definovány
import { Button, Card } from './atoms/LayoutComponents'; 
// Importujeme useDataCollection z App.jsx, kde je nyní exportován
import { useDataCollection } from '../App'; 
import { AlertTriangle, Send, HeartPulse, X } from 'lucide-react';

/**
 * SbarTriageModule - Komponenta pro záznam SBAR zpráv a klinického Triage (třídění).
 */
const SbarTriageModule = ({ patient, onClose, isQuickLog = false }) => {
  const { add } = useDataCollection('sbar_notes'); 
  
  const [sbar, setSbar] = useState({
    situation: '',
    background: '',
    assessment: '',
    recommendation: '',
    triageLevel: 'P3'
  });
  
  const handleSbarChange = (e) => {
    const { name, value } = e.target;
    setSbar(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTriageChange = (e) => {
    setSbar(prev => ({ ...prev, triageLevel: e.target.value }));
  };
  
  const submitSbar = async () => {
    // Používáme patient?.name pro bezpečné čtení
    if (!sbar.situation || !sbar.recommendation) {
      alert('Situation and Recommendation are required for SBAR logging.');
      return;
    }
    
    const patientName = patient?.name || 'Carer Log';

    const noteData = {
        patientId: patient?.id || 'unknown-carer', 
        patientName: patientName,
        notes: JSON.stringify(sbar), 
        triageLevel: sbar.triageLevel,
        value: `SBAR: ${sbar.situation.substring(0, 30)}...`,
    }

    try {
        await add(noteData); 
        alert(`SBAR logged successfully for ${patientName} with Triage: ${sbar.triageLevel}`);
        
        // Zavřít modal POUZE pokud nejsme v Quick Logu a onClose je k dispozici
        if (!isQuickLog && onClose) {
            onClose(); 
        }
        
        // Reset formuláře po odeslání
        setSbar({
            situation: '', background: '', assessment: '', 
            recommendation: '', triageLevel: 'P3'
        });

    } catch (error) {
        alert('Failed to save SBAR: ' + error.message);
    }
  };

  return (
    // Používáme Card z LayoutComponents
    <Card title={`SBAR Report: ${patient?.name || 'Quick Log'}`} action={<HeartPulse size={20} className="text-red-500" />}>
      <div className="space-y-4">
        {/* S (Situation) */}
        <textarea
          name="situation"
          placeholder="S: Situation (What is happening right now?)"
          value={sbar.situation}
          onChange={handleSbarChange}
          rows={3}
          className="w-full p-3 bg-slate-50 rounded-lg text-sm border focus:border-blue-500"
        ></textarea>
        
        {/* B (Background) */}
        <textarea
          name="background"
          placeholder="B: Background (Patient's history/context.)"
          value={sbar.background}
          onChange={handleSbarChange}
          rows={3}
          className="w-full p-3 bg-slate-50 rounded-lg text-sm border focus:border-blue-500"
        ></textarea>
        
        {/* A (Assessment) */}
        <textarea
          name="assessment"
          placeholder="A: Assessment (Clinical problem or status.)"
          value={sbar.assessment}
          onChange={handleSbarChange}
          rows={3}
          className="w-full p-3 bg-slate-50 rounded-lg text-sm border focus:border-blue-500"
        ></textarea>
        
        {/* R (Recommendation) */}
        <textarea
          name="recommendation"
          placeholder="R: Recommendation (What action is needed?)"
          value={sbar.recommendation}
          onChange={handleSbarChange}
          rows={3}
          className="w-full p-3 bg-slate-50 rounded-lg text-sm border focus:border-blue-500"
        ></textarea>
      </div>

      <div className="mt-4 flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
        <label htmlFor="triage" className="text-sm font-bold text-blue-800 flex items-center gap-2"><AlertTriangle size={16}/> Triage Level</label>
        <select 
            id="triage" 
            name="triageLevel" 
            value={sbar.triageLevel} 
            onChange={handleTriageChange}
            className="p-1 bg-white border border-blue-300 rounded-lg text-sm font-bold text-slate-800"
        >
            <option value="P1">P1 - Critical/Immediate</option>
            <option value="P2">P2 - Urgent/Semi-Urgent</option>
            <option value="P3">P3 - Routine/Standard</option>
        </select>
      </div>

      <div className='flex gap-2 mt-4'>
        <Button onClick={submitSbar} variant="primary" className="flex-1" Icon={Send}>Submit SBAR</Button>
        {/* Zobrazíme Cancel POUZE v modalu */}
        {!isQuickLog && onClose && <Button onClick={onClose} variant="secondary" Icon={X}>Cancel</Button>}
      </div>
      
    </Card>
  );
};

export default SbarTriageModule;