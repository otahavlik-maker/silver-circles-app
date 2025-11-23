import React, { useState, useEffect } from 'react';
import { Zap, Thermometer, Activity, Check, AlertTriangle } from 'lucide-react';

const StatusRow = ({ icon: Icon, label, status, subtext }) => {
  const getColor = (s) => {
    if (s === 'Normal' || s === 'Low Risk') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s === 'Warning') return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border mb-2 ${getColor(status)}`}>
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <div>
          <p className="font-bold text-sm">{label}</p>
          <p className="text-xs opacity-80">{subtext}</p>
        </div>
      </div>
      <div className="font-bold text-xs px-2 py-1 rounded bg-white/50 border border-black/5">
        {status}
      </div>
    </div>
  );
};

const CivicDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Simulation of fetching data from Government APIs
  useEffect(() => {
    const fetchCivicData = async () => {
      // Fake network delay
      await new Promise(r => setTimeout(r, 1500));
      
      setData({
        powerGrid: { status: 'Normal', area: 'UK-PN-East' },
        weather: { status: 'Warning', temp: '-2°C', note: 'Cold Weather Payment Triggered' },
        fluLevel: { status: 'Low Risk', trend: 'Stable' }
      });
      setLoading(false);
    };

    fetchCivicData();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          Civic Radar
        </h3>
        {loading ? (
          <span className="text-xs text-slate-400 animate-pulse">Scanning APIs...</span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
            <Check size={12} /> Online
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          <StatusRow 
            icon={Zap} 
            label="Power Grid" 
            status={data.powerGrid.status} 
            subtext={`Area: ${data.powerGrid.area}`} 
          />
          <StatusRow 
            icon={Thermometer} 
            label="Cold Alert" 
            status={data.weather.status} 
            subtext={`${data.weather.temp} - ${data.weather.note}`} 
          />
          <StatusRow 
            icon={Activity} 
            label="Local Flu" 
            status={data.fluLevel.status} 
            subtext={`Trend: ${data.fluLevel.trend}`} 
          />
        </div>
      )}
      
      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100">
        <p>Connected to: UK Power Networks, Met Office, NHS Digital.</p>
      </div>
    </div>
  );
};

export default CivicDashboard;