import { createActor } from 'xstate';

/**
 * Middleware Zustand pour intégrer une machine XState v5.
 * @param {object} machine - La machine XState à utiliser.
 * @param {string} key - Le nom du champ dans le store pour stocker l'état.
 */
export const zustandXStateMiddleware = (machine, key = 'fsm') => (config) => (set, get, api) => {
  // Crée l'actor XState v5
  const service = createActor(machine);
  service.start();

  // Synchronise l'état XState avec Zustand
  service.subscribe((state) => {
    set({ [key]: state });
  });

  // Ajoute des actions pour envoyer des événements à la machine
  const send = (event) => service.send(event);

  // Initialise le store avec l'état initial de la machine
  set({ [key]: service.getSnapshot(), send });

  // Permet d'accéder au service XState si besoin
  api.xstateService = service;

  // Ajoute le reste du store
  return {
    ...config(set, get, api),
    [key]: service.getSnapshot(),
    send,
  };
};
