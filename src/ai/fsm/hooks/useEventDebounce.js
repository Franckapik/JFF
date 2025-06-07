/**
 * ============================================================================
 * USE EVENT DEBOUNCE - Hook pour la gestion du debounce d'événements FSM
 * ============================================================================
 * 
 * Hook personnalisé pour éviter les événements dupliqués avec un système
 * de cooldown intelligent et de flags de récence.
 * 
 * ✅ Avantages:
 * - Logique de debounce réutilisable
 * - Gestion automatique des timeouts
 * - Interface simple et claire
 * - Cleanup automatique des événements expirés
 */

import { useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer le debounce d'événements avec cooldown et flags de récence
 * @param {number} cooldownMs - Durée en millisecondes du cooldown entre événements identiques
 * @returns {Object} - Interface pour gérer les événements debounced
 */
export const useEventDebounce = (cooldownMs = 1000) => {
  const lastEventTime = useRef({});
  const recentEvents = useRef(new Set());
  
  /**
   * Vérifie si un événement peut être envoyé (pas en cooldown et pas récent)
   * @param {string} eventKey - Clé unique de l'événement
   * @returns {boolean} - True si l'événement peut être envoyé
   */
  const canSendEvent = useCallback((eventKey) => {
    const now = Date.now();
    const lastEvent = lastEventTime.current[eventKey] || 0;
    return now - lastEvent > cooldownMs && !recentEvents.current.has(eventKey);
  }, [cooldownMs]);
  
  /**
   * Marque un événement comme envoyé et programme son nettoyage
   * @param {string} eventKey - Clé unique de l'événement
   * @param {number} resetAfterMs - Durée après laquelle l'événement peut être renvoyé (défaut: 5000ms)
   */
  const markEventSent = useCallback((eventKey, resetAfterMs = 5000) => {
    lastEventTime.current[eventKey] = Date.now();
    recentEvents.current.add(eventKey);
    setTimeout(() => recentEvents.current.delete(eventKey), resetAfterMs);
  }, []);
  
  /**
   * Nettoie tous les événements en attente (utile pour reset général)
   */
  const clearAllEvents = useCallback(() => {
    recentEvents.current.clear();
    lastEventTime.current = {};
  }, []);
  
  /**
   * Nettoie un événement spécifique (utile pour reset ciblé)
   * @param {string} eventKey - Clé de l'événement à nettoyer
   */
  const clearEvent = useCallback((eventKey) => {
    recentEvents.current.delete(eventKey);
    delete lastEventTime.current[eventKey];
  }, []);
  
  /**
   * Vérifie si un événement est actuellement en cooldown
   * @param {string} eventKey - Clé de l'événement
   * @returns {boolean} - True si en cooldown
   */
  const isEventInCooldown = useCallback((eventKey) => {
    const now = Date.now();
    const lastEvent = lastEventTime.current[eventKey] || 0;
    return now - lastEvent <= cooldownMs;
  }, [cooldownMs]);
  
  /**
   * Obtient le temps restant avant qu'un événement puisse être renvoyé
   * @param {string} eventKey - Clé de l'événement
   * @returns {number} - Millisecondes restantes (0 si peut être envoyé)
   */
  const getTimeUntilNextSend = useCallback((eventKey) => {
    const now = Date.now();
    const lastEvent = lastEventTime.current[eventKey] || 0;
    const timeSinceLastEvent = now - lastEvent;
    return Math.max(0, cooldownMs - timeSinceLastEvent);
  }, [cooldownMs]);
  
  return {
    canSendEvent,
    markEventSent,
    clearAllEvents,
    clearEvent,
    isEventInCooldown,
    getTimeUntilNextSend
  };
};

export default useEventDebounce;
