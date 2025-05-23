# Journal des modifications (Changelog)

Ce document recense toutes les modifications significatives apportées au système, en particulier concernant la FSM et le système de drones.

## Mai 2025

### Documentation

- **Ajout**: Création de la documentation complète du système de drones
  - Référence technique: `Drone-System-Reference.md`
  - Guide d'implémentation: `Drone-Implementation-Guide.md`
  - Guide d'intégration FSM: `Drone-FSM-Integration-Guide.md`
  - Système de communication: `Drone-Communication-System.md`

- **Mise à jour**: Documentation existante mise à jour pour refléter les récentes modifications
  - `FSM-Elements-Reference.md`: ajout de sections sur les types de drones
  - `ID-References-Analysis.md`: mise à jour de la section sur les mouvements des drones
  - `README.md` et `README-GAME.md`: ajout d'informations sur le système de drones

### Implémentation

#### Amélioration du composant `UnifiedDroneMovement`

- **Ajout**: Support spécifique pour trois types de drones distincts
  - Explorer Drone: vitesse +20%, rotation -20%, cooldown court (2s)
  - Combat Drone: vitesse -10%, rotation +20%, cooldown long (4s)
  - Special Drone: vitesse standard, rotation -50%, cooldown moyen (3s)

- **Amélioration**: Comportements spécialisés par type de drone
  - Explorer Drone: détection détaillée des ressources et dangers
  - Combat Drone: combat, pose de mines, collecte limitée avec transfert
  - Special Drone: scan avancé avec rayon étendu, détection d'objets rares

- **Mise à jour**: Positionnement des drones en formation triangulaire
  - Explorer Drone: devant le vaisseau
  - Combat Drone: 120° (2π/3), légèrement plus haut
  - Special Drone: 240° (4π/3), légèrement plus bas

- **Optimisation**: Différenciation entre joueur humain et bots
  - Joueur humain: formation à droite, états locaux
  - Bots: formation à gauche, états dans le store

#### Système de messages

- **Amélioration**: Types de messages spécifiques par type de drone
  - Explorer Drone: 'resource', 'danger'
  - Combat Drone: 'combat_engage', 'mine_laid', 'resource'
  - Special Drone: 'special_scan', 'special_discovered', 'scan_complete'

- **Ajout**: Gestion du retour au vaisseau et réinitialisation
  - Transfert automatique des ressources du Combat Drone au vaisseau
  - Rechargement de la capacité de pose de mines
  - Réinitialisation des compteurs d'exploration

## Avril 2025

*[À compléter avec l'historique antérieur si nécessaire]*
