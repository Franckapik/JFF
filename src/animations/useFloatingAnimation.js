import { useEffect } from 'react';

/**
 * Hook pour ajouter une animation de flottement à un objet Three.js
 * @param {Object} ref - Référence à l'objet Three.js
 * @param {Object} options - Options de configuration de l'animation
 * @param {number} options.baseHeight - Hauteur de base de l'objet (défaut: 1.5)
 * @param {number} options.amplitude - Amplitude du mouvement (défaut: 0.1)
 * @param {number} options.frequency - Fréquence de l'oscillation (défaut: 0.002)
 */
export const useFloatingAnimation = (ref, options = {}) => {
  const {
    baseHeight = 1.5,
    amplitude = 0.1,
    frequency = 0.002
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const animate = () => {
      if (ref.current) {
        ref.current.position.y = baseHeight + Math.sin(Date.now() * frequency) * amplitude;
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [ref, baseHeight, amplitude, frequency]);
};
