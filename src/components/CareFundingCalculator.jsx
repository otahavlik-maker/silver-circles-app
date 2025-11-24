import React, { useState, useEffect } from 'react';
import { Calculator, PoundSterling, HelpCircle, AlertCircle, CheckCircle, TrendingDown, Info, X } from 'lucide-react';

const CareFundingCalculator = ({ onClose }) => {
  // Input States
  const [savings, setSavings] = useState(15000);
  const [houseValue, setHouseValue] = useState(250000);
  const [weeklyCost, setWeeklyCost] = useState(800);
  const [isClinical, setIsClinical] = useState(false); // CHC Trigger

  // Calculation Results
  const [result, setResult] = useState({ userPay: 0, statePay: 0, status: '' });

  // UK UPPER CAPITAL LIMIT (2024/25)
  const UPPER_LIMIT = 23250;

  useEffect(() => {
    calculateFunding();
  }, [savings, houseValue, weeklyCost, isClinical]);

  const calculateFunding = () => {
    // 1. CHC CHECK (The "Golden Ticket")
    // If needs are primarily health-based, NHS pays 100% regardless of wealth.
    if (isClinical) {
      setResult({
        userPay: 0,
        statePay: weeklyCost,
        status: 'NHS CHC Funded (Free)'
      });
      return;
    }

    // 2. MEANS TEST
    const totalAssets = savings + houseValue;

    if (totalAssets > UPPER_LIMIT) {
      setResult({
        userPay: weeklyCost,
        statePay: 0,
        status: 'Self-Funder (Assets > £23,250)'
      });
    } else {
      // Simplified sliding scale logic for demo
      setResult({
        userPay: 0,
        statePay: weeklyCost,
        status: 'Local Authority Support'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl flex items-center gap-2">
              <Calculator className="text-amber-400" />
              The Wealth Wizard
            </h2>
            <p className="text-indigo-200 text-sm">UK Care Funding Eligibility Check</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* SECURITY NOTICE */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3 mb-6 text-xs text-amber-800">
            <AlertCircle size={16} className="shrink-0" />
            <p><strong>Privacy Mode Active:</strong> Data entered here is processed in-memory only and is deleted immediately upon closing this window.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT: INPUTS */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-700 border-b pb-2">1. Financial Data</h3>
              
              <div>
                <label className="block text-sm text-slate-500 mb-1">Cash Savings (£)</label>
                <input 
                  type="number" 
                  value={savings} 
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">Property Value (£)</label>
                <input 
                  type="number" 
                  value={houseValue} 
                  onChange={(e) => setHouseValue(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">Weekly Care Cost (£)</label>
                <input 
                  type="number" 
                  value={weeklyCost} 
                  onChange={(e) => setWeeklyCost(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  2. Clinical Check <HelpCircle size={14} className="text-slate-400" />
                </h3>
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={isClinical} 
                    onChange={(e) => setIsClinical(e.target.checked)}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Is the primary need medical?</span>
                    <p className="text-xs text-slate-500 mt-1">
                      e.g., Unstable condition, requires specialist nursing (not just washing/dressing).
                      Checking this simulates <strong>NHS CHC Eligibility</strong>.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* RIGHT: RESULTS GRAPH */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center">
              <h3 className="font-bold text-center text-slate-700 mb-6">Weekly Payment Breakdown</h3>
              
              {/* THE GRAPH */}
              <div className="flex items-end h-64 gap-4 justify-center mb-4">
                {/* User Bar */}
                <div className="w-24 flex flex-col items-center gap-2 relative group">
                  <span className="font-bold text-slate-700">£{result.userPay}</span>
                  <div 
                    style={{ height: `${(result.userPay / weeklyCost) * 100}%` }} 
                    className="w-full bg-slate-800 rounded-t-lg transition-all duration-500 relative"
                  >
                    {result.userPay > 0 && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">You Pay</span>
                </div>

                {/* State Bar */}
                <div className="w-24 flex flex-col items-center gap-2">
                  <span className="font-bold text-emerald-600">£{result.statePay}</span>
                  <div 
                    style={{ height: `${(result.statePay / weeklyCost) * 100}%` }} 
                    className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500"
                  ></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">State Pays</span>
                </div>
              </div>

              {/* STATUS BADGE */}
              <div className={`p-4 rounded-xl text-center border-2 ${isClinical ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : (result.userPay > 0 ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800')}`}>
                <p className="font-bold text-lg">{result.status}</p>
                {!isClinical && result.userPay > 0 && (
                  <p className="text-xs mt-1">
                    Because your assets (£{(savings + houseValue).toLocaleString()}) exceed the Upper Limit (£{UPPER_LIMIT.toLocaleString()}).
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareFundingCalculator;