import React, { useState, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import TimerSettings from './TimerSettings';
import TemplateSelector from './TemplateSelector';
import '../timer-templates.css';
import './PomodoroTimer.css';

function PomodoroTimer() {
  const {
    isActive,
    setIsActive,
    isBreak,
    setIsBreak,
    workDuration,
    breakDuration,
    template,
    updateWorkDuration,
    updateBreakDuration,
  } = useTimer();

  const [minutes, setMinutes] = useState(workDuration);
  const [seconds, setSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Sync minutes when mode or duration changes - ONLY if not active
  useEffect(() => {
    if (!isActive) {
      setMinutes(isBreak ? breakDuration : workDuration);
      setSeconds(0);
    }
  }, [isBreak, isActive, workDuration, breakDuration]);

  // Timer logic with useEffect
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                // Timer is finished - toggle mode and reset
                setIsActive(false);
                setIsBreak(prevIsBreak => {
                  const newIsBreak = !prevIsBreak;
                  // Use Notification API if available, or just alert? 
                  // Alert blocks execution, maybe just sound or title change? 
                  // Keeping alert for now but maybe remove it later for better UX
                  // alert(newIsBreak ? 'Break over! Time to work.' : 'Work session over! Time for a break.');
                  return newIsBreak;
                });
                return 0; // Will be updated by the sync effect
              } else {
                return prevMinutes - 1;
              }
            });
            return 59;
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, setIsActive, setIsBreak]);

  // Start/Pause
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? breakDuration : workDuration);
    setSeconds(0);
  };

  // Switch mode
  const toggleMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    // Effects will handle duration update
  };

  const adjustTime = (delta) => {
    const currentDuration = isBreak ? breakDuration : workDuration;
    const newDuration = Math.max(1, currentDuration + delta);

    // Update context
    if (isBreak) {
      updateBreakDuration(newDuration);
    } else {
      updateWorkDuration(newDuration);
    }

    // If active, also adjust current minutes to reflect the change immediately?
    // User requested "Allow direct input... Save changes immediately to TimerContext".
    // If we are active, `useEffect` above won't trigger setMinutes.
    // So we should manually adjust if needed.
    // However, if I am at 24:30 and I change goal from 25 to 26, should I jump to 25:30?
    // Probably yes, "Editable Timer".
    if (isActive) {
      setMinutes(prev => Math.max(0, prev + delta));
    }
  };

  const handleEditClick = () => {
    setEditValue(String(minutes));
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // numbers only
    setEditValue(val);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleEditBlur();
  };

  const handleEditBlur = () => {
    setIsEditing(false);
    let newMin = parseInt(editValue, 10);
    if (isNaN(newMin) || newMin <= 0) newMin = 1;

    // Update context
    if (isBreak) {
      updateBreakDuration(newMin);
    } else {
      updateWorkDuration(newMin);
    }

    // Update current state
    if (!isActive) {
      setMinutes(newMin);
      setSeconds(0);
    } else {
      // If active, we jump to the new minute? Or just update context?
      // Let's reset minutes to the new value? No that resets the seconds too maybe?
      // Let's just update minutes.
      setMinutes(newMin);
    }
  };



  const templateClass = `timer-template-${template}`;
  const activeClass = isActive ? 'timer-active' : '';

  return (
    <>
      <div className={`pomodoro-timer ${templateClass} ${activeClass}`}>
        <TemplateSelector />
        <h2>{isBreak ? '☕ Break Time' : '💼 Work Time'}</h2>

        <div className="timer-wrapper">
          <div className={`timer-display ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="timer-edit-form">
                <input
                  className="timer-input"
                  value={editValue}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  autoFocus
                />
                <span className="timer-separator">:</span>
                <span className="timer-seconds">{String(seconds).padStart(2, '0')}</span>
              </form>
            ) : (
              <div onClick={handleEditClick} className="timer-read-mode" title="Click to edit">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            )}
          </div>
          <div className="timer-quick-controls">
            <button onClick={() => adjustTime(-1)} disabled={minutes <= 1} title="-1 Minute">-</button>
            <button onClick={() => adjustTime(1)} title="+1 Minute">+</button>
          </div>
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer}>
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer}>Reset</button>
          <button onClick={toggleMode}>
            Switch to {isBreak ? 'Work' : 'Break'}
          </button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </div>
      </div>
      <TimerSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

export default PomodoroTimer;