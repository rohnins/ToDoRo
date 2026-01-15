import React, { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import './TimerSettings.css';

function TimerSettings({ isOpen, onClose }) {
  const { workDuration, breakDuration, updateWorkDuration, updateBreakDuration } = useTimer();
  const [workMinutes, setWorkMinutes] = useState(workDuration);
  const [breakMinutes, setBreakMinutes] = useState(breakDuration);

  if (!isOpen) return null;

  const handleSave = () => {
    if (workMinutes > 0 && workMinutes <= 120) {
      updateWorkDuration(workMinutes);
    }
    if (breakMinutes > 0 && breakMinutes <= 60) {
      updateBreakDuration(breakMinutes);
    }
    onClose();
  };

  const handleCancel = () => {
    setWorkMinutes(workDuration);
    setBreakMinutes(breakDuration);
    onClose();
  };

  return (
    <div className="timer-settings-overlay" onClick={onClose}>
      <div className="timer-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Timer Settings</h2>
        <div className="timer-settings-content">
          <div className="timer-setting-group">
            <label htmlFor="work-duration">Work Duration (minutes)</label>
            <input
              id="work-duration"
              type="number"
              min="1"
              max="120"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 25)}
            />
          </div>
          <div className="timer-setting-group">
            <label htmlFor="break-duration">Break Duration (minutes)</label>
            <input
              id="break-duration"
              type="number"
              min="1"
              max="60"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 5)}
            />
          </div>
        </div>
        <div className="timer-settings-actions">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default TimerSettings;
