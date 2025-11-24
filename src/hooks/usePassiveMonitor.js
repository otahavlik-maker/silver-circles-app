import { useState, useEffect, useRef } from 'react';

export const usePassiveMonitor = (onFallDetected) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensorData, setSensorData] = useState({
    acceleration: { x: 0, y: 0, z: 0 },
    audioLevel: 0, 
    status: 'CALM'
  });

  // Audio Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // 1. FALL DETECTION (Bezpečná verze pro PC)
  useEffect(() => {
    const handleMotion = (event) => {
      // KROK 1: Pokud senzor nic nepošle, okamžitě skonči
      if (!event || !event.accelerationIncludingGravity) return;
      
      const rawX = event.accelerationIncludingGravity.x;
      const rawY = event.accelerationIncludingGravity.y;
      const rawZ = event.accelerationIncludingGravity.z;

      // KROK 2: Pokud jsou hodnoty null (na PC), použij 0. Nikdy nepoužívej toFixed na null.
      const x = (typeof rawX === 'number') ? rawX : 0;
      const y = (typeof rawY === 'number') ? rawY : 0;
      const z = (typeof rawZ === 'number') ? rawZ : 0;
      
      // Výpočet pádu
      const totalForce = Math.sqrt(x*x + y*y + z*z);
      
      if (totalForce > 25) {
        setSensorData(prev => ({ ...prev, status: 'FALL_RISK' }));
        if (onFallDetected) onFallDetected();
      }

      // Bezpečný update
      setSensorData(prev => ({ 
        ...prev, 
        acceleration: { 
          x: x.toFixed(1), 
          y: y.toFixed(1), 
          z: z.toFixed(1) 
        } 
      }));
    };

    // Aktivace jen pokud to prohlížeč podporuje
    if (isMonitoring && typeof window !== 'undefined' && window.DeviceMotionEvent) {
      try {
        window.addEventListener('devicemotion', handleMotion);
      } catch (e) {
        console.warn("Senzory pohybu nedostupné");
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [isMonitoring, onFallDetected]);

  // 2. AUDIO MONITOR (Zjednodušený)
  const startAudioAnalysis = async () => {
    // Ochrana pro prohlížeče bez mikrofonu
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("Audio API není podporováno");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Fix pro Safari/Starší prohlížeče
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      analyzeLoop();
    } catch (err) {
      console.log("Mikrofon zamítnut nebo nedostupný:", err);
    }
  };

  const analyzeLoop = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    setSensorData(prev => ({ ...prev, audioLevel: Math.round(average) }));
    
    requestAnimationFrame(analyzeLoop);
  };

  const toggleMonitoring = () => {
    if (!isMonitoring) {
      setIsMonitoring(true);
      startAudioAnalysis(); 
    } else {
      setIsMonitoring(false);
      if (audioContextRef.current) audioContextRef.current.close();
    }
  };

  return { isMonitoring, toggleMonitoring, sensorData };
};