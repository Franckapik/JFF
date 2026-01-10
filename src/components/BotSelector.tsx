import React from 'react';

import { useUI, type BotViewMode } from '../contexts/UIContext';

/**
 * Composant de sélection de vue bot
 * Permet de basculer entre bot-0, bot-1 ou les deux
 */
export default function BotSelector() {
  const { selectedView, setSelectedView } = useUI();

  const options: { value: BotViewMode; label: string; color: string }[] = [
    { value: 'bot-0', label: 'Bot-0', color: '#22c55e' },
    { value: 'bot-1', label: 'Bot-1', color: '#3b82f6' },
    { value: 'both', label: 'Both', color: '#8b5cf6' },
  ];

  return (
    <div style={styles.container}>
      <span style={styles.label}>Vue:</span>
      <div style={styles.buttonGroup}>
        {options.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => setSelectedView(value)}
            style={{
              ...styles.button,
              backgroundColor: selectedView === value ? color : 'transparent',
              color: selectedView === value ? '#fff' : '#666',
              borderColor: color,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    position: 'fixed',
    top: '10px',
    right: '20px',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '4px',
  } as React.CSSProperties,
  button: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 600,
    border: '1.5px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
};
