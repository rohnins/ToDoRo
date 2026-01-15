import React, { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(() => {
    const saved = localStorage.getItem('workDuration');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem('breakDuration');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('timerTemplate') || 'minimal';
  });

  const updateWorkDuration = (minutes) => {
    setWorkDuration(minutes);
    localStorage.setItem('workDuration', minutes.toString());
  };

  const updateBreakDuration = (minutes) => {
    setBreakDuration(minutes);
    localStorage.setItem('breakDuration', minutes.toString());
  };

  const updateTemplate = (templateName) => {
    setTemplate(templateName);
    localStorage.setItem('timerTemplate', templateName);
  };

  const value = {
    isActive,
    setIsActive,
    isBreak,
    setIsBreak,
    workDuration,
    breakDuration,
    template,
    updateWorkDuration,
    updateBreakDuration,
    updateTemplate,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
