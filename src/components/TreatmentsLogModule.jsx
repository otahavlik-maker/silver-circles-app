// src/components/TreatmentsLogModule.jsx

import React, { useState } from 'react';
import { Button, Card } from './atoms/LayoutComponents'; 
import { useDataCollection } from '../App'; 
import { Syringe, Stethoscope, ClipboardList, Plus, X } from 'lucide-react';

/**
 * TreatmentsLogModule - Modul pro zaznamenávání provedených léčebných akcí a intervencí.
 * (Např. Injekce, převazy, fyzioterapie, péče o sondu.)
 */
const TreatmentsLogModule = () => {
  const { data: treatments, add, remove } = useDataCollection('treatments_log', [orderBy('createdAt', 'desc'), limit(5)]);
  
  const [treatment, setTreatment] = useState('');
  const [intervention, setIntervention] = useState('Injection'); // Defaultní typ

  const logTreatment = async () => {
    if (!treatment) {
      alert('Please describe the treatment or intervention.');
      return;
    }
    
    const logData = {
        name: intervention,
        notes: treatment,
        value: `${intervention}: ${treatment.substring(0, 30)}...`,
    };

    try {
        await add(logData);
        setTreatment('');
        alert(`Treatment logged: ${intervention}`);
    } catch (error) {
        alert('Failed to log treatment: ' + error.message);
    }
  };

  return (
    <Card title="Treatments & Interventions" action={<ClipboardList size={20} className="text-purple-500" />}>
      <div className="flex gap-2 mb-4">
        {/* Type Selector */}
        <select 
          value={intervention} 
          onChange={(e) => setIntervention(e.target.value)} 
          className="p-2 bg-slate-50 rounded-lg text-sm border-none w-1/3"
        >
          <option value="Injection">Injection</option>
          <option value="Wound Care">Wound Care</option>
          <option value="Physiotherapy">Physio/Mobility</option>
          <option value="Nutrition">Nutrition/Feed</option>
          <option value="Other">Other Clinical Action</option>
        </select>
        
        {/* Description Input */}
        <input 
          type="text" 
          value={treatment} 
          onChange={(e) => setTreatment(e.target.value)} 
          placeholder="e.g. 10U Insulin, Large clean dressing applied" 
          className="flex-1 p-2 bg-slate-50 rounded-lg text-sm border-none" 
        />
      </div>
      
      <Button onClick={logTreatment} className="w-full" Icon={Plus} variant="secondary">Log Intervention</Button>
      
      {/* Historical Data Display */}
      <div className="mt-6 border-t pt-4 space-y-2">
        <h4 className="text-sm font-bold text-slate-700 mb-2">Recent Actions</h4>
        {treatments.map((t) => (
          <div key={t.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded-lg group">
            <span className="font-medium text-purple-700 flex items-center gap-2">
                <Syringe size={16} className='text-purple-400'/>
                {t.name}: 
            </span>
            <div className="flex flex-col text-right ml-4 flex-1">
                <span className='text-xs text-slate-700 truncate'>{t.notes}</span>
                <span className="text-xs text-slate-400">{t.createdAt?.toDate().toLocaleString()}</span>
            </div>
            <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100 text-rose-400"><X size={14} /></button>
          </div>
        ))}
        {treatments.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No treatments logged recently.</div>}
      </div>
    </Card>
  );
};

export default TreatmentsLogModule;