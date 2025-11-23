import React, { useState } from 'react';
import { BookOpen, CheckSquare, Heart, Star, Calendar, Music } from 'lucide-react';

const MemorialMode = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('memories');
  
  // Mock Data: Admin Tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Obtain Medical Certificate of Cause of Death', done: true },
    { id: 2, text: 'Register the death (Registrar Office)', done: true },
    { id: 3, text: 'Use "Tell Us Once" service (Gov.uk)', done: false },
    { id: 4, text: 'Contact Funeral Director', done: false },
    { id: 5, text: 'Cancel State Pension', done: false },
  ]);

  // Mock Data: Timeline
  const memories = [
    { id: 1, date: '1945', title: 'End of the War', type: 'Life Event' },
    { id: 2, date: '1968', title: 'Wedding Day', type: 'Family' },
    { id: 3, date: '2023', title: '80th Birthday Party', type: 'Recent' },
  ];

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur">
        <div>
          <h1 className="text-2xl font-serif text-amber-100">In Memoriam</h1>
          <p className="text-amber-400/60 text-sm">Arthur P. (1943 - 2024)</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-slate-700 text-slate-400 text-sm hover:bg-slate-800"
        >
          Exit Archive
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-4 justify-center">
        <button 
          onClick={() => setActiveTab('memories')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'memories' ? 'bg-amber-900/50 text-amber-200 ring-1 ring-amber-500/50' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Life Story
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'admin' ? 'bg-amber-900/50 text-amber-200 ring-1 ring-amber-500/50' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Admin & Legal
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* VIEW: MEMORIES */}
        {activeTab === 'memories' && (
          <div className="space-y-8 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-800">
            {memories.map((m) => (
              <div key={m.id} className="relative pl-12">
                <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500"></div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                  <span className="text-amber-500 font-bold font-mono text-sm">{m.date}</span>
                  <h3 className="text-xl font-serif text-slate-200 mt-1">{m.title}</h3>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">{m.type}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-slate-800/30 p-8 rounded-xl text-center border border-dashed border-slate-700 mt-8">
              <Heart className="mx-auto text-slate-600 mb-2" />
              <p className="text-slate-500 italic">"What is grief, if not love persevering?"</p>
            </div>
          </div>
        )}

        {/* VIEW: ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-900/30 p-4 rounded-xl mb-6 flex gap-3">
              <BookOpen className="text-amber-500 shrink-0" />
              <p className="text-sm text-amber-200/80">
                This checklist guides you through the UK Government's "Tell Us Once" process to minimize paperwork during this difficult time.
              </p>
            </div>

            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group
                  ${task.done 
                    ? 'bg-slate-900 border-slate-800 opacity-50' 
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
              >
                <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors
                  ${task.done ? 'bg-amber-600 border-amber-600' : 'border-slate-500 group-hover:border-amber-400'}`}
                >
                  {task.done && <CheckSquare size={14} className="text-white" />}
                </div>
                <span className={`${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemorialMode;