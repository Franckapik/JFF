import React from 'react';
import useGameStore from '../../../stores/useGameStore/';
import { useTileStore } from '../../../stores/useTileStore';

/**
 * Fonction utilitaire pour copier du texte dans le presse-papiers
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pour les navigateurs qui ne supportent pas navigator.clipboard
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * Fonction pour convertir les données en JSON lisible
 */
const formatDataAsJSON = (data, title) => {
  return `// ${title}\n${JSON.stringify(data, null, 2)}`;
};

/**
 * Composant pour afficher les détails d'un store spécifique
 */
const StoreSection = React.memo(({ title, data, color = "#2196F3" }) => {
  const [copied, setCopied] = React.useState(false);
  const [expandedView, setExpandedView] = React.useState(false);

  const handleCopy = async () => {
    const jsonData = formatDataAsJSON(data, title);
    const success = await copyToClipboard(jsonData);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const renderValue = (value, key, depth = 0) => {
    const maxDepth = expandedView ? 10 : 6; // Plus de profondeur en mode étendu
    if (depth > maxDepth) return <span className="debugger-value">...</span>;
    
    if (value === null) return <span className="debugger-value-null">null</span>;
    if (value === undefined) return <span className="debugger-value-undefined">undefined</span>;
    if (typeof value === 'boolean') return <span className="debugger-value-boolean">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="debugger-value-number">{value}</span>;
    if (typeof value === 'string') return <span className="debugger-value-string">"{value}"</span>;
    if (typeof value === 'function') return <span className="debugger-value-function">[Function]</span>;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="debugger-value">[]</span>;
      const maxArrayItems = expandedView ? 20 : 10; // Plus d'éléments en mode étendu
      if (value.length > maxArrayItems) {
        const showItems = expandedView ? 10 : 5;
        return (
          <span className="debugger-value">
            [{value.slice(0, showItems).map((item, i) => renderValue(item, i, depth + 1)).reduce((prev, curr, i) => [prev, ', ', curr])}, ... +{value.length - showItems} more]
          </span>
        );
      }
      return (
        <div className="debugger-array">
          [
          {value.map((item, index) => (
            <div key={index} style={{ marginLeft: `${(depth + 1) * 15}px` }}>
              {index}: {renderValue(item, index, depth + 1)}
            </div>
          ))}
          ]
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return <span className="debugger-value">{"{}"}</span>;
      
      // Plus d'entrées en mode étendu
      const maxEntries = expandedView ? 50 : 20;
      const displayEntries = entries.slice(0, maxEntries);
      
      return (
        <div className="debugger-object" style={{ marginLeft: `${depth * 15}px` }}>
          {"{"}
          {displayEntries.map(([objKey, objValue]) => (
            <div key={objKey} className="debugger-object-entry" style={{ marginLeft: `${(depth + 1) * 15}px` }}>
              <span className="debugger-key">{objKey}:</span> {renderValue(objValue, objKey, depth + 1)}
            </div>
          ))}
          {entries.length > maxEntries && (
            <div style={{ marginLeft: `${(depth + 1) * 15}px`, color: '#aaa' }}>
              ... +{entries.length - maxEntries} more properties
            </div>
          )}
          {"}"}
        </div>
      );
    }
    
    return <span className="debugger-value">{String(value)}</span>;
  };

  return (
    <div className="debugger-section">
      <div className="debugger-section-header">
        <h3 className="debugger-section-title" style={{ color }}>
          {title}
        </h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            className={`debugger-copy-button ${expandedView ? '' : 'debugger-copy-all'}`}
            onClick={() => setExpandedView(!expandedView)}
            title={expandedView ? 'Vue simplifiée' : 'Vue détaillée'}
            style={{ fontSize: '9px', padding: '2px 6px' }}
          >
            {expandedView ? '🔽 Moins' : '🔼 Plus'}
          </button>
          <button 
            className="debugger-copy-button"
            onClick={handleCopy}
            title={`Copier ${title} en JSON`}
          >
            {copied ? '✓ Copié' : '📋 Copier'}
          </button>
        </div>
      </div>
      <div className="debugger-store-content">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="debugger-store-item">
            <div className="debugger-store-key">{key}:</div>
            <div className="debugger-store-value">
              {renderValue(value, key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Composant pour l'onglet Stores du debugger
 * Affiche la structure et les variables des stores
 */
const StoresTab = React.memo(() => {
  const [allCopied, setAllCopied] = React.useState(false);
  
  // Récupération des stores (bot-only approach)
  const tileStore = useTileStore();
  const gameStore = useGameStore();

  // Filtrer les fonctions pour ne garder que les données
  const getStoreData = (store) => {
    const data = {};
    Object.entries(store).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        data[key] = value;
      }
    });
    return data;
  };

  const tileData = getStoreData(tileStore);
  const gameData = getStoreData(gameStore);

  // Fonction pour copier tous les stores
  const handleCopyAll = async () => {
    const allStores = {
      GameStore: gameData,
      TileStore: {
        ...tileData,
        tiles: `${Object.keys(tileData.tiles || {}).length} tiles (voir TileStore individuel pour détails)`
      }
    };
    
    const jsonData = `// Stores Bot-Only - Export complet\n${JSON.stringify(allStores, null, 2)}`;
    const success = await copyToClipboard(jsonData);
    if (success) {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    }
  };

  return (
    <div className="debugger-tab-content">
      <div className="debugger-stores-overview">
        <div className="debugger-section">
          <div className="debugger-section-header">
            <h3 className="debugger-section-title">Vue d'ensemble des Stores</h3>
            <button 
              className="debugger-copy-button debugger-copy-all"
              onClick={handleCopyAll}
              title="Copier tous les stores en JSON"
            >
              {allCopied ? '✓ Tout copié' : '📋 Copier tout'}
            </button>
          </div>
          <div className="debugger-stores-summary">
            <div className="debugger-summary-item">
              <span className="debugger-label">TileStore:</span>
              <span className="debugger-value">{Object.keys(tileData).length} propriétés</span>
            </div>
            <div className="debugger-summary-item">
              <span className="debugger-label">GameStore:</span>
              <span className="debugger-value">{Object.keys(gameData).length} propriétés</span>
            </div>
            <div style={{
              padding: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              Mode Bot-Only : PlayerStore et BotStore remplacés par le système FSM
            </div>
          </div>
        </div>
      </div>

      <StoreSection 
        title="GameStore" 
        data={gameData} 
        color="#4CAF50" 
      />
      
      <StoreSection 
        title="TileStore" 
        data={{
          ...tileData,
          tiles: `${Object.keys(tileData.tiles || {}).length} tiles` // Simplifier l'affichage des tiles
        }} 
        color="#9C27B0" 
      />
    </div>
  );
});

export default StoresTab;
