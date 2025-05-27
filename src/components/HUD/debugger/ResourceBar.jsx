import React from 'react';

/**
 * Composant de barre de progression pour l'affichage des ressources
 */
const ResourceBar = React.memo(({ value, max, color = "#4CAF50" }) => {
  const percentage = React.useMemo(() => Math.min(100, (value / max) * 100), [value, max]);
  
  return (
    <div className="debugger-resource-bar-container">
      <div 
        className="debugger-resource-bar-fill" 
        style={{ 
          width: `${percentage}%`,
          backgroundColor: color
        }} 
      />
    </div>
  );
});

export default ResourceBar;
