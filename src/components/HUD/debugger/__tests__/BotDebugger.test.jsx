import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BotDebugger from '../BotDebugger';

// Mock des stores Zustand
vi.mock('../../../stores/playerStore', () => ({
  default: {
    getState: () => ({
      players: {
        'bot_0': {
          vehicles: {
            'main_ship_bot_0': { isActive: true, resources: { food: 10, debris: 5 } }
          }
        }
      }
    })
  }
}));

vi.mock('../../../stores/useBotStore', () => ({
  default: () => ({
    bots: {
      'bot_0': {
        state: 'idle',
        isRunning: true,
        actionQueue: [],
        memory: {
          knownResources: [],
          collectedResources: [],
          knownDangers: []
        }
      }
    }
  })
}));

vi.mock('../../../stores/useTileStore', () => ({
  useTileStore: () => ({
    tiles: {},
    selectedTile: null
  })
}));

describe('BotDebugger Refactored Components', () => {
  it('should render the debugger header correctly', () => {
    render(<BotDebugger />);
    
    // Vérifier que le titre est présent
    expect(screen.getByText('Bot Debugger')).toBeInTheDocument();
  });

  it('should render bot selector buttons', () => {
    render(<BotDebugger />);
    
    // Vérifier qu'il y a des boutons de sélection de bot
    expect(screen.getByText('Bot 1')).toBeInTheDocument();
    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Tile')).toBeInTheDocument();
  });

  it('should render tabs correctly', () => {
    render(<BotDebugger />);
    
    // Vérifier que les onglets sont présents
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('État')).toBeInTheDocument();
    expect(screen.getByText('Ressources')).toBeInTheDocument();
  });

  it('should render content based on active tab', () => {
    render(<BotDebugger />);
    
    // Par défaut, l'onglet Actions devrait être actif
    expect(screen.getByText("File d'actions (0)")).toBeInTheDocument();
    expect(screen.getByText('Aucune action en attente')).toBeInTheDocument();
  });
});
