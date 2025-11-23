import React, { useState } from 'react';
import { Wallet, TrendingUp, Plus, DollarSign, User } from 'lucide-react';

const ExpenseLedger = () => {
  // Mock data - simulation of previous expenses
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Weekly Groceries', amount: 45.50, by: 'Sarah' },
    { id: 2, title: 'Taxi to Clinic', amount: 15.00, by: 'Arthur' },
    { id: 3, title: 'Prescription Charge', amount: 9.65, by: 'Sarah' },
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // Calculate total
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const sarahTotal = expenses.filter(e => e.by === 'Sarah').reduce((acc, curr) => acc + curr.amount, 0);
  
  // Simple calculation for the progress bar (avoid division by zero)
  const sarahPercentage = total > 0 ? (sarahTotal / total) * 100 : 0;

  const handleAdd = () => {
    if (!title || !amount) return;
    const newExp = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      by: 'Sarah', // Currently hardcoded to the logged-in user
    };
    setExpenses([newExp, ...expenses]);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Wallet className="text-emerald-600" size={20} />
          Family Treasury
        </h3>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-lg">
          Total: £{total.toFixed(2)}
        </span>
      </div>

      {/* Visual Balance Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Sarah ({Math.round(sarahPercentage)}%)</span>
          <span>Others ({Math.round(100 - sarahPercentage)}%)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${sarahPercentage}%` }} 
            className="h-full bg-emerald-500 transition-all duration-500"
          />
          <div 
            style={{ width: `${100 - sarahPercentage}%` }} 
            className="h-full bg-slate-300 transition-all duration-500"
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-100">
        <input
          type="text"
          placeholder="Item (e.g. Milk)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-[2] bg-transparent text-sm outline-none"
        />
        <input
          type="number"
          placeholder="£0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-20 bg-transparent text-sm outline-none text-right"
        />
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 text-white rounded-lg p-1 hover:bg-emerald-700"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {expenses.map((ex) => (
          <div key={ex.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${ex.by === 'Sarah' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                {ex.by[0]}
              </div>
              <div>
                <p className="font-medium text-slate-700">{ex.title}</p>
                <p className="text-xs text-slate-400">Paid by {ex.by}</p>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-600">
              £{ex.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseLedger;