import { useState, useEffect } from 'react';

// "Bessie" - The Empathetic AI Logic
export const useCompanionAI = () => {
  const [moodLog, setMoodLog] = useState([]);
  const [suggestion, setSuggestion] = useState(null);

  // Slovník "Gentle Prompts" (Jemné podněty)
  const prompts = [
    "What was the best part of your morning, Elsie?",
    "The birds are singing loudly today, aren't they?",
    "Do you remember that trip to Blackpool?",
    "Would you like to send a message to Sarah?"
  ];

  // Analýza sentimentu (Simulace)
  // V reálu by toto volalo Google Gemini API
  const analyzeResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('sad') || lower.includes('pain') || lower.includes('lonely')) {
      return { status: 'ALERT', action: 'Notify Nurse (Non-Emergency)' };
    }
    if (lower.includes('happy') || lower.includes('good')) {
      return { status: 'POSITIVE', action: 'Log in Social Feed' };
    }
    return { status: 'NEUTRAL', action: 'None' };
  };

  const triggerPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return randomPrompt;
  };

  return {
    triggerPrompt,
    analyzeResponse,
    moodLog
  };
};