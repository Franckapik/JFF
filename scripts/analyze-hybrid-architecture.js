#!/usr/bin/env node

/**
 * 🕵️ Script d'Analyse de l'Architecture Hybride
 * 
 * Analyse l'état actuel des fichiers pour identifier :
 * - Quels fichiers utilisent Robot3 vs XState
 * - Les imports et dépendances
 * - Les fichiers à migrer en priorité
 */

const fs = require('fs');
const path = require('path');

// Configuration des chemins et patterns
const CONFIG = {
  srcPath: path.join(__dirname, '..', 'src'),
  patterns: {
    xstate: [
      'useFSMStore.*\\.js$',
      'useFSM\\.js$',
      'XState',
      'createActor',
      'fsmBotMachine',
      'getSnapshot'
    ],
    robot3: [
      'useFSMStore/',
      'robot3',
      'createMachine.*robot',
      'useOLDFSMROBOTStore',
      'robot.*machine'
    ],
    imports: [
      'import.*useFSMStore',
      'import.*useFSM',
      'from.*useFSMStore',
      'from.*robot'
    ]
  }
};

/**
 * Analyse un fichier pour détecter ses dépendances
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    
    const analysis = {
      path: relativePath,
      type: 'unknown',
      dependencies: [],
      imports: [],
      issues: []
    };

    // Analyser les imports
    const importMatches = content.match(/import.*from.*['"`]([^'"`]+)['"`]/g) || [];
    analysis.imports = importMatches.map(imp => {
      const match = imp.match(/from.*['"`]([^'"`]+)['"`]/);
      return match ? match[1] : imp;
    });

    // Détecter le type (XState vs Robot3)
    let xstateScore = 0;
    let robot3Score = 0;

    CONFIG.patterns.xstate.forEach(pattern => {
      if (content.match(new RegExp(pattern, 'gi'))) {
        xstateScore++;
        analysis.dependencies.push(`XState: ${pattern}`);
      }
    });

    CONFIG.patterns.robot3.forEach(pattern => {
      if (content.match(new RegExp(pattern, 'gi'))) {
        robot3Score++;
        analysis.dependencies.push(`Robot3: ${pattern}`);
      }
    });

    // Déterminer le type
    if (xstateScore > robot3Score) {
      analysis.type = 'xstate';
    } else if (robot3Score > xstateScore) {
      analysis.type = 'robot3';
    } else if (xstateScore > 0 && robot3Score > 0) {
      analysis.type = 'hybrid';
      analysis.issues.push('Fichier hybride détecté - migration nécessaire');
    }

    // Détecter les problèmes potentiels
    if (content.includes('useFSMStore') && content.includes('useFSMStoreXState')) {
      analysis.issues.push('Multiple stores importés - conflit potentiel');
    }

    if (content.includes('boucle infinie') || content.includes('DÉSACTIVÉ')) {
      analysis.issues.push('Composant désactivé pour problèmes de boucles');
    }

    return analysis;
  } catch (error) {
    return {
      path: path.relative(CONFIG.srcPath, filePath),
      type: 'error',
      error: error.message
    };
  }
}

/**
 * Parcours récursif des fichiers
 */
function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDirectory(fullPath, fileList);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      fileList.push(fullPath);
    }
  });
  
  return fileList;
}

/**
 * Génère le rapport d'analyse
 */
function generateReport() {
  console.log('🔍 Analyse de l\'Architecture Hybride Robot3 ↔ XState\n');
  console.log('=' .repeat(80));
  
  const files = walkDirectory(CONFIG.srcPath);
  const analyses = files.map(analyzeFile);
  
  // Grouper par type
  const groups = {
    xstate: analyses.filter(a => a.type === 'xstate'),
    robot3: analyses.filter(a => a.type === 'robot3'),
    hybrid: analyses.filter(a => a.type === 'hybrid'),
    unknown: analyses.filter(a => a.type === 'unknown'),
    error: analyses.filter(a => a.type === 'error')
  };
  
  // Statistiques générales
  console.log('\n📊 STATISTIQUES GÉNÉRALES');
  console.log('-'.repeat(40));
  console.log(`Total fichiers analysés: ${analyses.length}`);
  console.log(`🟢 Fichiers XState: ${groups.xstate.length}`);
  console.log(`🟡 Fichiers Robot3: ${groups.robot3.length}`);
  console.log(`🔶 Fichiers Hybrides: ${groups.hybrid.length}`);
  console.log(`⚪ Fichiers Neutres: ${groups.unknown.length}`);
  console.log(`❌ Erreurs: ${groups.error.length}`);
  
  // Détail XState
  if (groups.xstate.length > 0) {
    console.log('\n🟢 FICHIERS XSTATE (À CONSERVER)');
    console.log('-'.repeat(40));
    groups.xstate.forEach(file => {
      console.log(`✅ ${file.path}`);
      if (file.issues.length > 0) {
        file.issues.forEach(issue => console.log(`   ⚠️  ${issue}`));
      }
    });
  }
  
  // Détail Robot3
  if (groups.robot3.length > 0) {
    console.log('\n🟡 FICHIERS ROBOT3 (À MIGRER)');
    console.log('-'.repeat(40));
    groups.robot3.forEach(file => {
      console.log(`🔶 ${file.path}`);
      if (file.dependencies.length > 0) {
        console.log(`   Dependencies: ${file.dependencies.join(', ')}`);
      }
    });
  }
  
  // Détail Hybrides (PRIORITÉ HAUTE)
  if (groups.hybrid.length > 0) {
    console.log('\n🔶 FICHIERS HYBRIDES (PRIORITÉ MIGRATION)');
    console.log('-'.repeat(40));
    groups.hybrid.forEach(file => {
      console.log(`⚠️  ${file.path}`);
      console.log(`   Dependencies: ${file.dependencies.join(', ')}`);
      file.issues.forEach(issue => console.log(`   🚨 ${issue}`));
    });
  }
  
  // Erreurs
  if (groups.error.length > 0) {
    console.log('\n❌ ERREURS D\'ANALYSE');
    console.log('-'.repeat(40));
    groups.error.forEach(file => {
      console.log(`❌ ${file.path}: ${file.error}`);
    });
  }
  
  // Recommandations
  console.log('\n🎯 RECOMMANDATIONS DE MIGRATION');
  console.log('-'.repeat(40));
  
  if (groups.hybrid.length > 0) {
    console.log('📋 PRIORITÉ 1 - Résoudre les fichiers hybrides:');
    groups.hybrid.forEach(file => {
      console.log(`   • ${file.path}`);
    });
  }
  
  if (groups.robot3.length > 0) {
    console.log('\n📋 PRIORITÉ 2 - Migrer les fichiers Robot3:');
    
    // Identifier les fichiers critiques
    const criticalFiles = groups.robot3.filter(file => 
      file.path.includes('Scene.jsx') || 
      file.path.includes('tileFilterSlice') ||
      file.path.includes('App.jsx')
    );
    
    if (criticalFiles.length > 0) {
      console.log('   🔥 Fichiers critiques (migrer en premier):');
      criticalFiles.forEach(file => console.log(`     • ${file.path}`));
    }
    
    const otherFiles = groups.robot3.filter(file => !criticalFiles.includes(file));
    if (otherFiles.length > 0) {
      console.log('   📁 Autres fichiers:');
      otherFiles.forEach(file => console.log(`     • ${file.path}`));
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📖 Voir MIGRATION_ROADMAP.md pour le plan détaillé de migration');
}

// Exécuter l'analyse
if (require.main === module) {
  generateReport();
}

module.exports = { analyzeFile, generateReport };
