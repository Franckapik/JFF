#!/usr/bin/env node
/**
 * 🎯 Menu Interactif - Scripts FSM JFF
 * 
 * Menu centralisé pour tous les scripts de test et validation du projet.
 * Lance avec: npm run test
 * 
 * @version 1.0.0
 * @date 23 décembre 2025
 */

import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 🎨 Colors pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// 📋 Définition des scripts disponibles
const SCRIPT_CATEGORIES = {
  fsm: {
    title: '🧪 Tests FSM (Terminal)',
    description: 'Tests du FSM XState v5 en mode terminal Node.js',
    scripts: [
      {
        name: '🎯 TOUS LES TESTS FSM',
        description: '⚡ Exécute tous les scénarios FSM + Guards + Vitest (~15s)',
        command: 'bash',
        args: ['scripts/run-all-tests.sh'],
      },
      {
        name: 'Cycle Complet (full)',
        description: 'Test complet: exploration + collection + maintenance (~10s)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--scenario=full'],
      },
      {
        name: 'Test Rapide (quick)',
        description: 'Validation rapide du FSM (<1s)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--scenario=quick'],
      },
      {
        name: 'Exploration',
        description: 'Test du domaine exploration uniquement (~2s)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--scenario=explore'],
      },
      {
        name: 'Collection',
        description: 'Test du domaine collection uniquement (~3s)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--scenario=collect'],
      },
      {
        name: 'Maintenance',
        description: 'Test du domaine maintenance uniquement (~3s)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--scenario=maintain'],
      },
      {
        name: 'Mode Verbose',
        description: 'Tous les tests avec logs détaillés (debug)',
        command: 'node',
        args: ['scripts/test-fsm-cycle.js', '--verbose'],
      },
    ],
  },
  guards: {
    title: '🔍 Tests Guards',
    description: 'Validation des guards FSM (règles métier)',
    scripts: [
      {
        name: 'Guards Interactif',
        description: 'Menu interactif pour tester les guards',
        command: 'node',
        args: ['scripts/test-guards-interactive.js'],
      },
      {
        name: 'Guards Rapide',
        description: 'Test rapide avec contextes prédéfinis (<1s)',
        command: 'node',
        args: ['scripts/quick-test-guards.js'],
      },
    ],
  },
  validation: {
    title: '✅ Validation & Quality',
    description: 'Vérifications de qualité du code',
    scripts: [
      {
        name: 'Pre-commit',
        description: 'Validation complète: ESLint + TypeScript + build',
        command: 'bash',
        args: ['scripts/pre-commit.sh'],
      },
      {
        name: 'TypeScript Check',
        description: 'Vérification TypeScript (tsc --noEmit)',
        command: 'npm',
        args: ['run', 'type-check'],
      },
    ],
  },
  dev: {
    title: '🚀 Développement',
    description: 'Commandes de développement',
    scripts: [
      {
        name: 'Dev Server',
        description: 'Lance le serveur Vite en mode développement',
        command: 'npm',
        args: ['run', 'dev'],
      },
      {
        name: 'Build',
        description: 'Build de production',
        command: 'npm',
        args: ['run', 'build'],
      },
      {
        name: 'TypeScript Watch',
        description: 'Surveillance TypeScript en continu',
        command: 'npm',
        args: ['run', 'type-watch'],
      },
    ],
  },
};

// 🚀 Exécute un script
async function runScript(script) {
  console.log('\n' + c('cyan', '═'.repeat(60)));
  console.log(c('bright', `🚀 Exécution: ${script.name}`));
  console.log(c('yellow', `📝 ${script.description}`));
  console.log(c('cyan', '═'.repeat(60)) + '\n');

  return new Promise((resolve) => {
    const child = spawn(script.command, script.args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      console.log('\n' + c('cyan', '═'.repeat(60)));
      if (code === 0) {
        console.log(c('green', `✅ ${script.name} terminé avec succès`));
      } else {
        console.log(c('red', `❌ ${script.name} terminé avec erreur (code ${code})`));
      }
      console.log(c('cyan', '═'.repeat(60)) + '\n');
      resolve(code);
    });

    child.on('error', (err) => {
      console.error(c('red', `❌ Erreur d'exécution: ${err.message}`));
      resolve(1);
    });
  });
}

// 📊 Affiche le menu principal
async function showMainMenu() {
  console.clear();
  console.log(c('bright', c('cyan', '\n╔═══════════════════════════════════════════════════════════╗')));
  console.log(c('bright', c('cyan', '║') + '  🎯 ' + c('bright', 'Menu Interactif - Scripts FSM JFF') + '            ' + c('cyan', '║')));
  console.log(c('bright', c('cyan', '╚═══════════════════════════════════════════════════════════╝')));
  console.log(c('yellow', '\n📅 Version 1.0.0 - 23 décembre 2025\n'));

  const choices = [
    new inquirer.Separator(c('green', '━━━ Catégories ━━━')),
  ];

  Object.entries(SCRIPT_CATEGORIES).forEach(([key, category]) => {
    choices.push({
      name: `${category.title} - ${c('yellow', category.description)}`,
      value: key,
    });
  });

  choices.push(new inquirer.Separator());
  choices.push({
    name: c('red', '❌ Quitter'),
    value: 'quit',
  });

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: c('bright', 'Sélectionnez une catégorie:'),
      choices,
      pageSize: 15,
    },
  ]);

  if (category === 'quit') {
    console.log(c('green', '\n👋 À bientôt!\n'));
    process.exit(0);
  }

  return category;
}

// 📋 Affiche le menu d'une catégorie
async function showCategoryMenu(categoryKey) {
  const category = SCRIPT_CATEGORIES[categoryKey];

  console.clear();
  console.log(c('cyan', '\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(c('cyan', '║') + '  ' + category.title + '                                   ' + c('cyan', '║'));
  console.log(c('cyan', '╚═══════════════════════════════════════════════════════════╝'));
  console.log(c('yellow', `\n${category.description}\n`));

  const choices = category.scripts.map((script) => ({
    name: `${c('bright', script.name)} - ${c('yellow', script.description)}`,
    value: script,
  }));

  choices.push(new inquirer.Separator());
  choices.push({
    name: c('blue', '⬅️  Retour au menu principal'),
    value: 'back',
  });

  const { script } = await inquirer.prompt([
    {
      type: 'list',
      name: 'script',
      message: c('bright', 'Sélectionnez un script:'),
      choices,
      pageSize: 15,
    },
  ]);

  if (script === 'back') {
    return null;
  }

  return script;
}

// 🔄 Demande si l'utilisateur veut continuer
async function askContinue() {
  const { continueChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'continueChoice',
      message: c('bright', 'Que voulez-vous faire?'),
      choices: [
        {
          name: c('green', '🔄 Lancer un autre test'),
          value: 'continue',
        },
        {
          name: c('blue', '⬅️  Retour au menu principal'),
          value: 'main',
        },
        {
          name: c('red', '❌ Quitter'),
          value: 'quit',
        },
      ],
    },
  ]);

  return continueChoice;
}

// 🎬 Main loop
async function main() {
  let currentCategory = null;

  while (true) {
    try {
      // Menu principal si pas de catégorie sélectionnée
      if (!currentCategory) {
        currentCategory = await showMainMenu();
      }

      // Menu de catégorie
      const script = await showCategoryMenu(currentCategory);

      if (!script) {
        // Retour au menu principal
        currentCategory = null;
        continue;
      }

      // Exécution du script
      await runScript(script);

      // Demander si on continue
      const choice = await askContinue();

      if (choice === 'quit') {
        console.log(c('green', '\n👋 À bientôt!\n'));
        process.exit(0);
      } else if (choice === 'main') {
        currentCategory = null;
      }
      // Si 'continue', on reste dans la même catégorie
    } catch (error) {
      if (error.isTtyError) {
        console.error(c('red', '❌ Impossible de render le prompt dans cet environnement'));
      } else {
        console.error(c('red', `❌ Erreur: ${error.message}`));
      }
      process.exit(1);
    }
  }
}

// 🚀 Lancement
main().catch((error) => {
  console.error(c('red', `❌ Erreur fatale: ${error.message}`));
  process.exit(1);
});
