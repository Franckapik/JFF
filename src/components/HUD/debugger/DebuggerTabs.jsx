import React from 'react';

/**
 * Composant pour la navigation par onglets du debugger
 */
const DebuggerTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'actions', label: 'Actions' },
    { id: 'state', label: 'État' },
    { id: 'resources', label: 'Ressources' }
  ];

  return (
    <div className="debugger-tabs">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          className={`debugger-tab-button ${activeTab === tab.id ? 'debugger-tab-active' : ''}`} 
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DebuggerTabs;
