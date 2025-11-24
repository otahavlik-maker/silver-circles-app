import React, { useState, useRef } from 'react';

const SecureButton = ({ onClick, children, className, holdDuration = 600 }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startHold = (e) => {
    // Prevents default touch behaviors like scrolling while holding
    if(e.type === 'touchstart') e.preventDefault();
    
    setIsHolding(true);
    startTimeRef.current = Date.now();
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const percentage = Math.min((elapsed / holdDuration) * 100, 100);
      
      setProgress(percentage);

      if (percentage >= 100) {
        completeHold();
      }
    }, 16); // 60fps update
  };

  const endHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const completeHold = () => {
    endHold();
    // Haptic feedback if available (Vibration)
    if (navigator.vibrate) navigator.vibrate(50);
    onClick();
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className={`relative overflow-hidden select-none active:scale-95 transition-transform ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Progress Fill Layer (Background) */}
      <div 
        className="absolute inset-0 bg-black/20 transition-all ease-linear"
        style={{ width: `${progress}%`, display: isHolding ? 'block' : 'none' }}
      />
      
      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        {children}
      </div>
    </button>
  );
};

export default SecureButton;