import { describe, it, expect } from 'vitest';
import { ACTION_STATUS } from '../ai/constants/botConstants';

/**
 * Fonctions utilitaires extraites de BotDebugger.jsx pour les tests
 */
// Formater le nom d'un état pour l'affichage
const formatStateName = (state) => {
  if (!state) return '';
  return state.charAt(0).toUpperCase() + state.slice(1);
};

// Obtenir la couleur pour un statut d'action
const getActionStatusColor = (status) => {
  switch(status) {
    case ACTION_STATUS.PENDING: return "#f9a825"; // Orange
    case ACTION_STATUS.IN_PROGRESS: return "#2196F3"; // Bleu
    case ACTION_STATUS.COMPLETED: return "#4CAF50"; // Vert
    case ACTION_STATUS.FAILED: return "#f44336"; // Rouge
    default: return "#aaaaaa"; // Gris
  }
};

// Fonction helper pour la barre de ressources des tuiles
const getTileResourceBarStyle = (quantity) => {
  let color = "#4CAF50"; // Green by default
  if (quantity === 0) color = "#777777"; // Gray if empty
  else if (quantity < 3) color = "#f44336"; // Red if very low
  else if (quantity < 5) color = "#ff9800"; // Orange if somewhat low
  
  return {
    width: `${Math.min(quantity * 10, 100)}%`,
    backgroundColor: color,
  };
};

describe('UI Utilities', () => {
  describe('formatStateName', () => {
    it('devrait mettre en majuscule la première lettre d\'un état', () => {
      expect(formatStateName('idle')).toBe('Idle');
      expect(formatStateName('exploring')).toBe('Exploring');
      expect(formatStateName('collecting')).toBe('Collecting');
    });

    it('devrait conserver la casse des autres lettres', () => {
      expect(formatStateName('idleState')).toBe('IdleState');
      expect(formatStateName('EXPLORE')).toBe('EXPLORE');
      expect(formatStateName('CamelCase')).toBe('CamelCase');
    });

    it('devrait gérer les états avec un seul caractère', () => {
      expect(formatStateName('a')).toBe('A');
      expect(formatStateName('Z')).toBe('Z');
    });

    it('devrait gérer les états vides ou non définis', () => {
      expect(formatStateName('')).toBe('');
      expect(formatStateName(null)).toBe('');
      expect(formatStateName(undefined)).toBe('');
    });
  });

  describe('getActionStatusColor', () => {
    it('devrait retourner la bonne couleur pour chaque statut d\'action', () => {
      expect(getActionStatusColor(ACTION_STATUS.PENDING)).toBe('#f9a825'); // Orange
      expect(getActionStatusColor(ACTION_STATUS.IN_PROGRESS)).toBe('#2196F3'); // Bleu
      expect(getActionStatusColor(ACTION_STATUS.COMPLETED)).toBe('#4CAF50'); // Vert
      expect(getActionStatusColor(ACTION_STATUS.FAILED)).toBe('#f44336'); // Rouge
    });

    it('devrait retourner la couleur grise par défaut pour un statut inconnu', () => {
      expect(getActionStatusColor('UNKNOWN')).toBe('#aaaaaa');
      expect(getActionStatusColor(null)).toBe('#aaaaaa');
      expect(getActionStatusColor(undefined)).toBe('#aaaaaa');
    });
  });

  describe('getTileResourceBarStyle', () => {
    it('devrait retourner la largeur proportionnelle à la quantité', () => {
      expect(getTileResourceBarStyle(5).width).toBe('50%');
      expect(getTileResourceBarStyle(3).width).toBe('30%');
      expect(getTileResourceBarStyle(10).width).toBe('100%'); // Limité à 100%
      expect(getTileResourceBarStyle(15).width).toBe('100%'); // Limité à 100%
    });

    it('devrait retourner la bonne couleur selon la quantité', () => {
      expect(getTileResourceBarStyle(0).backgroundColor).toBe('#777777'); // Gris pour vide
      expect(getTileResourceBarStyle(1).backgroundColor).toBe('#f44336'); // Rouge pour très peu
      expect(getTileResourceBarStyle(2).backgroundColor).toBe('#f44336'); // Rouge pour très peu
      expect(getTileResourceBarStyle(3).backgroundColor).toBe('#ff9800'); // Orange pour peu
      expect(getTileResourceBarStyle(4).backgroundColor).toBe('#ff9800'); // Orange pour peu
      expect(getTileResourceBarStyle(5).backgroundColor).toBe('#4CAF50'); // Vert par défaut
      expect(getTileResourceBarStyle(10).backgroundColor).toBe('#4CAF50'); // Vert par défaut
    });

    it('devrait gérer les valeurs négatives correctement', () => {
      const style = getTileResourceBarStyle(-5);
      expect(style.width).toBe('-50%');
      // La couleur sera celle par défaut pour les quantités suffisantes
      expect(style.backgroundColor).toBe('#4CAF50');
    });
  });
});
