import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import './TemplateSelector.css';

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple timer display' },
  { id: 'fullscreen', name: 'Fullscreen Focus', description: 'Red background, large timer, hide distractions' },
  { id: 'dark', name: 'Dark Mode', description: 'Dark theme with neon accents' },
  { id: 'animated', name: 'Animated', description: 'Pulsing effects, smooth transitions' },
];

function TemplateSelector() {
  const { template, updateTemplate } = useTimer();

  return (
    <div className="template-selector">
      <label htmlFor="template-select">Timer Theme:</label>
      <select
        id="template-select"
        value={template}
        onChange={(e) => updateTemplate(e.target.value)}
        className="template-select"
      >
        {TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <div className="template-description">
        {TEMPLATES.find((t) => t.id === template)?.description}
      </div>
    </div>
  );
}

export default TemplateSelector;
