import React, { useState, useEffect } from 'react';
import { ThermometerSnowflake, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ColdHomeAlert = () => {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState('CHECKING'); // CHECKING | ALERT | RESOLVED

  // Mock: Weather API & Logic
  useEffect(() => {
    // Simulace: Venku je 4 stupně (Zima!)
    const outdoorTemp = 4; 
    
    if (outdoorTemp < 5) {
      setTimeout(() => setStatus('ALERT'), 2000);
    } else {
      setVisible(false);
    }
  }, []);

  const handleResponse = (isHeatingOn) => {
    if (isHeatingOn) {
      setStatus('RESOLVED');
      setTimeout(() => setVisible(false), 3000);
    } else {
      // Trigger Social Prescribing Logic
      alert("PRIORITY ALERT SENT: Social Prescriber notified for 'Winter Fuel Payment' assessment.");
      setStatus('RESOLVED');
      setTimeout(() => setVisible(false), 3000);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-6 right-6 z-40 animate-slide-up">
      <div className={`p-6 rounded-2xl shadow-2xl border-l-8 flex items-start gap-4 ${status === 'ALERT' ? 'bg-white border-blue-500' : 'bg-emerald-50 border-emerald-500'}`}>
        
        <div className={`p-3 rounded-full ${status === 'ALERT' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {status === 'ALERT' ? <ThermometerSnowflake size={32} /> : <CheckCircle2 size={32} />}
        </div>

        <div className="flex-1">
          {status === 'CHECKING' && <p className="font-bold text-slate-500 mt-2">Checking environmental data...</p>}
          
          {status === 'RESOLVED' && (
            <div>
              <h3 className="text-xl font-bold text-slate-800">Safety Check Complete</h3>
              <p className="text-slate-600">Stay warm, Elsie.</p>
            </div>
          )}

          {status === 'ALERT' && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Cold Weather Alert</h3>
              <p className="text-slate-600 mb-4">It is 4°C outside. Is your heating working correctly?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleResponse(true)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                >
                  <Flame size={18} /> Yes, I'm warm
                </button>
                <button 
                  onClick={() => handleResponse(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-300"
                >
                  <AlertTriangle size={18} /> No / Help
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColdHomeAlert;