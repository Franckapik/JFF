import { describe, it, expect, beforeEach, vi } from 'vitest';
import fsmLogger from '../utils/fsmLogger';

describe('fsmLogger', () => {
  // Spy sur console.log pour vérifier les appels
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    fsmLogger.configure({
      enableConsole: true,
      enableBuffering: true
    });
    fsmLogger.clearBuffer();
  });

  describe('Fonctions de base de log', () => {
    it('devrait logger un message info', () => {
      const message = 'Test info message';
      fsmLogger.info(message);
      expect(console.log).toHaveBeenCalled();
    });

    it('devrait logger un message state', () => {
      const message = 'Test state message';
      fsmLogger.state(message);
      expect(console.log).toHaveBeenCalled();
    });

    it('devrait logger un message action', () => {
      const message = 'Test action message';
      fsmLogger.action(message);
      expect(console.log).toHaveBeenCalled();
    });

    it('devrait logger un message condition', () => {
      const message = 'Test condition message';
      fsmLogger.condition(message);
      expect(console.log).toHaveBeenCalled();
    });

    it('devrait logger un message mouvement', () => {
      const message = 'Test mouvement message';
      fsmLogger.mouvement(message);
      expect(console.log).toHaveBeenCalled();
    });

    it('devrait logger un message erreur', () => {
      const message = 'Test error message';
      fsmLogger.error(message);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Fonctions spéciales', () => {
    it('devrait logger une transition d\'état', () => {
      const result = fsmLogger.stateTransition('IDLE', 'EXPLORING', { reason: 'test' }, 'player-1');
      expect(console.log).toHaveBeenCalled();
      expect(result.type).toBe('STATE');
      expect(result.message).toContain('IDLE → EXPLORING');
      expect(result.playerId).toBe('player-1');
    });

    it('devrait logger une exécution d\'action', () => {
      const result = fsmLogger.actionExecution('moveToResource', 10, { status: 'success' }, 'player-1');
      expect(console.log).toHaveBeenCalled();
      expect(result.type).toBe('ACTION');
      expect(result.message).toContain('moveToResource');
      expect(result.playerId).toBe('player-1');
    });

    it('devrait logger une évaluation de condition', () => {
      const result = fsmLogger.conditionEvaluation('hasResource', true, { resource: 'gold' }, 'player-1');
      expect(console.log).toHaveBeenCalled();
      expect(result.type).toBe('CONDITION');
      expect(result.message).toContain('hasResource = TRUE');
      expect(result.playerId).toBe('player-1');
    });
  });

  describe('Configuration et buffer', () => {
    it('devrait respecter la configuration enableConsole: false', () => {
      fsmLogger.configure({ enableConsole: false });
      fsmLogger.info('Test message');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('devrait ajouter des entrées au buffer quand enableBuffering = true', () => {
      fsmLogger.configure({ enableBuffering: true });
      fsmLogger.info('Test buffer');
      const buffer = fsmLogger.getLogBuffer();
      expect(buffer.length).toBeGreaterThan(0);
      expect(buffer[buffer.length - 1].message).toContain('Test buffer');
    });

    it('devrait limiter la taille du buffer', () => {
      fsmLogger.configure({ enableBuffering: true });
      
      // Remplir le buffer plus que sa capacité
      for (let i = 0; i < 105; i++) {
        fsmLogger.info(`Message ${i}`);
      }
      
      const buffer = fsmLogger.getLogBuffer();
      expect(buffer.length).toBeLessThanOrEqual(100); // La taille max du buffer
    });

    it('devrait filtrer le buffer par type', () => {
      fsmLogger.info('Test info');
      fsmLogger.error('Test error');
      fsmLogger.state('Test state');
      
      const infoLogs = fsmLogger.getLogBuffer(null, 'INFO');
      expect(infoLogs.every(log => log.type === 'INFO')).toBeTruthy();
      
      const errorLogs = fsmLogger.getLogBuffer(null, 'ERROR');
      expect(errorLogs.every(log => log.type === 'ERROR')).toBeTruthy();
    });

    it('devrait limiter le nombre de logs retournés', () => {
      for (let i = 0; i < 20; i++) {
        fsmLogger.info(`Message ${i}`);
      }
      
      const limitedLogs = fsmLogger.getLogBuffer(5);
      expect(limitedLogs.length).toBe(5);
    });

    it('devrait effacer le buffer avec clearBuffer', () => {
      fsmLogger.info('Test before clear');
      expect(fsmLogger.getLogBuffer().length).toBeGreaterThan(0);
      
      fsmLogger.clearBuffer();
      expect(fsmLogger.getLogBuffer().length).toBe(0);
    });
  });

  describe('Niveaux de log et formatage', () => {
    it('devrait appliquer le formatage correct selon le type de log', () => {
      const infoMessage = 'Info message';
      fsmLogger.info(infoMessage);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🔵 INFO'),
        infoMessage
      );
      
      const errorMessage = 'Error message';
      fsmLogger.error(errorMessage);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('🔴 ERROR'),
        errorMessage
      );
    });
    
    it('devrait traiter correctement les arguments multiples', () => {
      const arg1 = 'First argument';
      const arg2 = { detail: 'object argument' };
      const arg3 = [1, 2, 3];
      
      fsmLogger.info(arg1, arg2, arg3);
      
      // Vérifier que tous les arguments sont transmis à console.log
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        arg1,
        arg2,
        arg3
      );
    });
    
    it('devrait gérer les messages vides ou invalides', () => {
      // Message vide
      fsmLogger.info('');
      expect(console.log).toHaveBeenCalled();
      
      // Undefined
      fsmLogger.info(undefined);
      expect(console.log).toHaveBeenCalled();
      
      // Null
      fsmLogger.info(null);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Filtrage des logs par joueur', () => {
    it('devrait filtrer les logs par ID de joueur', () => {
      fsmLogger.info('Message for player 1', null, 'player1');
      fsmLogger.info('Message for player 2', null, 'player2');
      fsmLogger.info('Generic message without player');
      
      const player1Logs = fsmLogger.getLogBuffer(null, null, 'player1');
      expect(player1Logs.length).toBeGreaterThan(0);
      expect(player1Logs.every(log => log.playerId === 'player1')).toBeTruthy();
      
      const player2Logs = fsmLogger.getLogBuffer(null, null, 'player2');
      expect(player2Logs.length).toBeGreaterThan(0);
      expect(player2Logs.every(log => log.playerId === 'player2')).toBeTruthy();
    });
    
    it('devrait combiner les filtres de type et de joueur', () => {
      fsmLogger.info('Info for player 1', null, 'player1');
      fsmLogger.error('Error for player 1', null, 'player1');
      fsmLogger.info('Info for player 2', null, 'player2');
      
      const player1InfoLogs = fsmLogger.getLogBuffer(null, 'INFO', 'player1');
      expect(player1InfoLogs.length).toBeGreaterThan(0);
      expect(player1InfoLogs.every(log => 
        log.type === 'INFO' && log.playerId === 'player1'
      )).toBeTruthy();
    });
  });
  
  describe('Fonctionnalités avancées', () => {
    it('devrait ajouter un timestamp à chaque entrée de log', () => {
      fsmLogger.info('Test timestamp');
      const buffer = fsmLogger.getLogBuffer();
      const lastLog = buffer[buffer.length - 1];
      
      expect(lastLog).toHaveProperty('timestamp');
      expect(lastLog.timestamp).toBeInstanceOf(Date);
    });
    
    it('devrait permettre d\'ajouter des métadonnées aux logs', () => {
      const metadata = { resource: 'gold', amount: 100 };
      fsmLogger.info('Resource info', metadata);
      
      const buffer = fsmLogger.getLogBuffer();
      const lastLog = buffer[buffer.length - 1];
      
      expect(lastLog).toHaveProperty('metadata');
      expect(lastLog.metadata).toEqual(metadata);
    });
    
    it('devrait gérer plusieurs configurations simultanées', () => {
      // Configuration initiale
      fsmLogger.configure({
        enableConsole: true,
        enableBuffering: true
      });
      
      fsmLogger.info('First message');
      expect(console.log).toHaveBeenCalled();
      expect(fsmLogger.getLogBuffer().length).toBeGreaterThan(0);
      
      // Changer la configuration
      console.log.mockClear();
      fsmLogger.configure({
        enableConsole: false,
        enableBuffering: true
      });
      
      fsmLogger.info('Second message');
      expect(console.log).not.toHaveBeenCalled();
      expect(fsmLogger.getLogBuffer().length).toBeGreaterThan(0);
    });
  });
});
