import React, { useState, useEffect } from 'react';

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Timer logic with useEffect
    useEffect(() => {
    let interval = null;

    if (isActive) {
        interval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    // Timer is finished
                    setIsActive(false);
                    alert(isBreak ? 'Break over! Time to work.' : 'Work session over! Time for a break.');
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds(seconds - 1);
            }
        }, 1000);
    }

  return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  // Start/Pause
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  // Switch mode
  const toggleMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    setMinutes(isBreak ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h2>{isBreak ? '☕ Break Time' : '💼 Works Time!!!!'}</h2>
      
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div>
        <button onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
        <button onClick={toggleMode}>
          Switch to {isBreak ? 'Work' : 'Break'}
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;