/**
 * ============================================================================
 * SHIP VISUAL ANIMATIONS - Animations visuelles pour le vaisseau
 * ============================================================================
 * 
 * Fonctions d'animation spécialisées pour le vaisseau :
 * - Rotations et oscillations selon l'état
 * - Orientation selon la direction de déplacement
 * - Effets visuels distinctifs par état
 * 
 * Adapté des animations de drone pour les spécificités du vaisseau.
 */

import * as THREE from 'three';

import type { WorldPosition } from '../../types/coordinates.d.ts';
import type { VehicleVisualState } from '../../types/vehicle.d.ts';

/**
 * Applique les animations visuelles selon l'état du vaisseau
 * @param mesh - Mesh THREE.js du vaisseau
 * @param shipState - État visuel actuel du vaisseau
 * @param baseY - Position Y de base pour les oscillations
 * @param elapsedTime - Temps écoulé depuis le début
 * @param deltaTime - Delta temps pour les animations fluides
 * @param direction - Direction de déplacement optionnelle pour l'orientation
 */
export const applyShipVisualAnimations = (
  mesh: THREE.Mesh,
  shipState: VehicleVisualState,
  baseY: number,
  elapsedTime: number,
  deltaTime: number,
  direction?: WorldPosition
): void => {
  switch (shipState) {
    case 'docked':
      // Rotation lente et oscillation subtile au repos
      mesh.rotation.y += deltaTime * 0.3;
      mesh.position.y = baseY + Math.sin(elapsedTime * 1.5) * 0.05;
      // Oscillation latérale très légère pour simuler le "repos" actif
      mesh.rotation.z = Math.sin(elapsedTime * 2) * 0.02;
      break;
      
  // case 'moving': // supprimé car doublon inutile
    case 'moving_to_tile':
      // Animation de déplacement : oscillation verticale modérée
      mesh.position.y = baseY + Math.sin(elapsedTime * 4) * 0.1;
      // Léger tangage pour simuler le mouvement
      mesh.rotation.x = Math.sin(elapsedTime * 3) * 0.05;
      mesh.rotation.z = Math.sin(elapsedTime * 2.5) * 0.03;
      
      // Orientation selon la direction si fournie
      if (direction) {
        const targetRotation = calculateShipRotation(direction);
        // Interpolation douce vers la rotation cible
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotation, deltaTime * 2);
      }
      break;
      
    case 'collecting': {
      // Animation de collecte : oscillation rapide + rotation
      mesh.position.y = baseY + Math.sin(elapsedTime * 6) * 0.15;
      mesh.rotation.y += deltaTime * 1.0;
      // Vibration pour simuler l'activité de collecte
      mesh.rotation.x = Math.sin(elapsedTime * 8) * 0.08;
      mesh.rotation.z = Math.cos(elapsedTime * 7) * 0.06;
      
      // Effet de "pulsation" pour indiquer l'activité
      const collectScale = 1 + Math.sin(elapsedTime * 5) * 0.05;
      mesh.scale.setScalar(collectScale);
      break;
    }
      
    case 'returning':
      // Animation de retour : mouvement rapide et oscillation énergique
      mesh.position.y = baseY + Math.sin(elapsedTime * 5) * 0.12;
      mesh.rotation.y += deltaTime * 1.5;
      // Tangage plus prononcé pour indiquer la vitesse
      mesh.rotation.x = Math.sin(elapsedTime * 4) * 0.07;
      mesh.rotation.z = Math.sin(elapsedTime * 3.5) * 0.04;
      
      // Orientation vers la base si direction fournie
      if (direction) {
        const targetRotation = calculateShipRotation(direction);
        mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotation, deltaTime * 3);
      }
      break;
      
    default:
      // Animation par défaut : rotation très lente
      mesh.rotation.y += deltaTime * 0.1;
      mesh.position.y = baseY;
      // Réinitialiser l'échelle si elle a été modifiée
      mesh.scale.setScalar(1);
      break;
  }
};

/**
 * Calcule la rotation Y du vaisseau selon la direction de déplacement
 * @param direction - Vecteur de direction (peut être normalisé ou non)
 * @returns Angle de rotation en radians pour l'axe Y
 */
export const calculateShipRotation = (direction: WorldPosition): number => {
  // Calculer l'angle basé sur les composantes X et Z (plan horizontal)
  const angle = Math.atan2(direction.x, direction.z);
  return angle;
};

/**
 * Calcule le vecteur de direction entre deux positions
 * @param from - Position de départ
 * @param to - Position d'arrivée
 * @returns Vecteur de direction normalisé
 */
export const calculateMovementDirection = (
  from: WorldPosition,
  to: WorldPosition
): WorldPosition => {
  const direction = {
    x: to.x - from.x,
    y: to.y - from.y,
    z: to.z - from.z
  };
  
  // Normaliser le vecteur
  const length = Math.sqrt(
    direction.x * direction.x + 
    direction.y * direction.y + 
    direction.z * direction.z
  );
  
  if (length === 0) {
    return { x: 0, y: 0, z: 1 }; // Direction par défaut (vers le "nord")
  }
  
  return {
    x: direction.x / length,
    y: direction.y / length,
    z: direction.z / length
  };
};

/**
 * Applique des effets de particules ou de trails selon l'état
 * @param _mesh - Mesh du vaisseau
 * @param shipState - État visuel du vaisseau
 * @param _elapsedTime - Temps écoulé
 * @param _deltaTime - Delta temps
 */
export const applyShipEffects = (
  _mesh: THREE.Mesh,
  shipState: VehicleVisualState,
  _elapsedTime: number,
  _deltaTime: number
): void => {
  // Placeholder pour les effets de particules
  // Peut être étendu avec des systèmes de particules THREE.js
  
  switch (shipState) {
    case 'moving_to_tile':
    case 'returning':
      // Effet de "propulsion" : pourrait ajouter des particules derrière le vaisseau
      // Effet de traînée énergétique
      break;
      
    case 'collecting':
      // Effet de "collecte" : particules autour du vaisseau
      // Aura de collecte
      break;
      
    case 'docked':
      // Effet de "repos" : lueur douce
      break;
      
    default:
      break;
  }
};

/**
 * Gère les transitions fluides entre les états d'animation
 * @param mesh - Mesh du vaisseau
 * @param previousState - État précédent
 * @param currentState - État actuel
 * @param transitionProgress - Progression de la transition (0-1)
 */
export const applyShipStateTransition = (
  mesh: THREE.Mesh,
  previousState: VehicleVisualState,
  currentState: VehicleVisualState,
  transitionProgress: number
): void => {
  // Interpolation douce entre les états
  // Utile pour éviter les changements brusques d'animation
  
  if (previousState === 'collecting' && currentState !== 'collecting') {
    // Transition sortant de l'état de collecte : rétablir l'échelle
    const scale = THREE.MathUtils.lerp(1.05, 1.0, transitionProgress);
    mesh.scale.setScalar(scale);
  }
  
  if (previousState !== 'docked' && currentState === 'docked') {
    // Transition vers l'état de repos : ralentir les rotations
    // Cette logique pourrait être intégrée dans applyShipVisualAnimations
    // Exemple : interpoler vers une vitesse de rotation plus lente
  }
};

/**
 * Obtient les paramètres d'animation selon l'état
 * @param shipState - État visuel du vaisseau
 * @returns Paramètres d'animation (vitesses, amplitudes, etc.)
 */
export const getShipAnimationParams = (shipState: VehicleVisualState) => {
  switch (shipState) {
    case 'docked':
      return {
        rotationSpeed: 0.3,
        oscillationAmplitude: 0.05,
        oscillationFrequency: 1.5
      };
      
    case 'moving_to_tile':
      return {
        rotationSpeed: 0.5,
        oscillationAmplitude: 0.1,
        oscillationFrequency: 4.0
      };
      
    case 'collecting':
      return {
        rotationSpeed: 1.0,
        oscillationAmplitude: 0.15,
        oscillationFrequency: 6.0,
        scaleAmplitude: 0.05
      };
      
    case 'returning':
      return {
        rotationSpeed: 1.5,
        oscillationAmplitude: 0.12,
        oscillationFrequency: 5.0
      };
      
    default:
      return {
        rotationSpeed: 0.1,
        oscillationAmplitude: 0.0,
        oscillationFrequency: 1.0
      };
  }
};

/**
 * Fonction utilitaire pour créer des effets de lueur ou d'aura
 * @param color - Couleur de l'effet
 * @param intensity - Intensité (0-1)
 * @returns Matériau pour l'effet de lueur
 */
export const createShipGlowEffect = (
  color: THREE.Color,
  intensity: number = 0.5
): THREE.ShaderMaterial => {
  // Shader basique pour un effet de lueur
  // Peut être étendu avec des shaders plus complexes
  
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      intensity: { value: intensity },
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float intensity;
      uniform float time;
      varying vec3 vNormal;
      
      void main() {
        float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(color, glow * intensity);
      }
    `,
    transparent: true,
    side: THREE.BackSide
  });
};
