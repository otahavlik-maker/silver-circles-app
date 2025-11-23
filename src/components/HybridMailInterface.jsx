import React, { useState } from 'react';
import { Mail, Printer, Send, FileText, CheckCircle, Loader } from 'lucide-react';

// Mock simulation of an API call to a postal service (e.g., Lob.com)
const sendPhysicalMail = async (content) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        trackingId: 'GB-ROYAL-MAIL-' + Math.floor(Math.random() * 10000), 
        status: 'Sent to Printer' 
      });
    }, 2500); // 2.5 second delay to feel "real"
  });
};

const HybridMailInterface = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    if (!message) return;
    setIsSending(true);
    // Integrate with Postal API here
    const response = await sendPhysicalMail(message);
    setResult(response);
    setIsSending(false);
    setMessage('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="text-indigo-600" />
            Digital Postman
          </h2>
          <p className="text-sm text-slate-500">Send a physical letter to Grandma's house.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Printer size={12} />
          Ready to Print
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-40 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            placeholder="Write your letter here... (e.g., 'Hi Grandma, look at little Timmy!')"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button
            onClick={handleSend}
            disabled={!message || isSending}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
              ${!message ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
            `}
          >
            {isSending ? (
              <>
                <Loader className="animate-spin" /> Processing PDF...
              </>
            ) : (
              <>
                <Send size={20} /> Send via Royal Mail (£0.85)
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-pulse">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-green-800">Letter Dispatched!</h3>
          <p className="text-green-600 mb-4">Tracking ID: {result.trackingId}</p>
          <button 
            onClick={() => setResult(null)}
            className="text-sm text-green-700 font-bold hover:underline"
          >
            Send Another Letter
          </button>
        </div>
      )}
    </div>
  );
};

export default HybridMailInterface;