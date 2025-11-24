import React, { useState } from 'react';
import { Users, Mic, Heart, Clock, Sprout, Coffee, X, HandHeart, Hammer } from 'lucide-react';

const VillageSocial = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('BENCH'); // BENCH or BANK
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [credits, setCredits] = useState(4); // Time Credits Balance

  // Mock Data: Chat Rooms (Benches)
  const benches = [
    { id: 1, topic: 'Gardening Club', icon: <Sprout className="text-emerald-500" />, people: ['Marie', 'Tom', 'You'] },
    { id: 2, topic: 'Cricket Chat', icon: <Hammer className="text-blue-500" />, people: ['Bill', 'Sarah'] },
    { id: 3, topic: 'Afternoon Tea', icon: <Coffee className="text-amber-600" />, people: ['Elsie'] },
  ];

  // Mock Data: Time Bank Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Teach Knitting', type: 'OFFER', cost: 1, author: 'You' },
    { id: 2, title: 'Fix Toaster', type: 'REQUEST', cost: 1, author: 'Tom' },
    { id: 3, title: 'Ride to Clinic', type: 'REQUEST', cost: 2, author: 'Elsie' },
  ]);

  const handleJoin = (id) => {
    if (joinedRoom === id) {
      setJoinedRoom(null); // Leave
    } else {
      setJoinedRoom(id); // Join
    }
  };

  const handleTransaction = (task) => {
    if (task.type === 'OFFER') return; // Can't buy own offer
    if (credits >= task.cost) {
      setCredits(c => c - task.cost);
      setTasks(tasks.filter(t => t.id !== task.id)); // Remove task
      alert(`You helped ${task.author}! -${task.cost} Credits`);
    } else {
      alert("Not enough Time Credits!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      
      {/* Header */}
      <div className="p-4 bg-slate-800 text-white flex justify-between items-center shadow-md">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <Users className="text-indigo-400" />
          The Village Green
        </h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 border-t border-slate-700">
        <button 
          onClick={() => setActiveTab('BENCH')}
          className={`flex-1 p-4 font-bold flex justify-center gap-2 ${activeTab === 'BENCH' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          <Users /> The Bench
        </button>
        <button 
          onClick={() => setActiveTab('BANK')}
          className={`flex-1 p-4 font-bold flex justify-center gap-2 ${activeTab === 'BANK' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
        >
          <Clock /> Time Bank
        </button>
      </div>

      {/* VIEW: THE BENCH (Voice Chat) */}
      {activeTab === 'BENCH' && (
        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          <p className="text-center text-slate-500 mb-6">Sit on a bench to start chatting.</p>
          
          <div className="grid gap-4">
            {benches.map((bench) => (
              <button
                key={bench.id}
                onClick={() => handleJoin(bench.id)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${joinedRoom === bench.id ? 'bg-white border-indigo-500 shadow-xl ring-4 ring-indigo-500/20' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">{bench.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{bench.topic}</h3>
                      <p className="text-sm text-slate-500">{joinedRoom === bench.id ? 'Connected' : `${bench.people.length} people sitting here`}</p>
                    </div>
                  </div>
                  {joinedRoom === bench.id && (
                    <div className="flex items-center gap-2 text-rose-500 font-bold animate-pulse">
                      <Mic size={20} /> LIVE
                    </div>
                  )}
                </div>

                {/* Avatars */}
                <div className="flex gap-2">
                  {bench.people.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${joinedRoom === bench.id ? 'bg-indigo-500 border-2 border-indigo-200' : 'bg-slate-300'}`}>
                        {p[0]}
                      </div>
                      <span className="text-xs text-slate-400">{p}</span>
                    </div>
                  ))}
                  {joinedRoom !== bench.id && (
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                      +
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: TIME BANK (Dignity Economy) */}
      {activeTab === 'BANK' && (
        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          
          {/* Balance Card */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white mb-6 shadow-lg flex justify-between items-center">
            <div>
              <p className="opacity-80 font-mono uppercase text-xs tracking-widest mb-1">Your Balance</p>
              <h3 className="text-4xl font-bold">{credits} Hours</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock size={32} />
            </div>
          </div>

          <h3 className="font-bold text-slate-800 mb-4">Community Noticeboard</h3>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${task.type === 'OFFER' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {task.type === 'OFFER' ? <HandHeart size={20} /> : <Users size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500">Posted by {task.author}</p>
                  </div>
                </div>

                {task.type === 'OFFER' ? (
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    YOUR OFFER
                  </span>
                ) : (
                  <button 
                    onClick={() => handleTransaction(task)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm"
                  >
                    Help (-{task.cost})
                  </button>
                )}
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl font-bold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
              + Post a Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageSocial;