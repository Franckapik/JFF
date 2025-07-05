#!/usr/bin/env node

/**
 * Script d'analyse des exports/imports pour éviter les erreurs récurrentes
 * Analyse tous les fichiers .js/.jsx du projet et documente leurs exports
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Patterns pour détecter les différents types d'exports
const EXPORT_PATTERNS = {
  defaultExport: /export\s+default\s+(\w+)/g,
  namedExport: /export\s+(?:const|function|class)\s+(\w+)/g,
  namedExportBrace: /export\s*{\s*([^}]+)\s*}/g,
  destructuredExport: /export\s*{\s*([^}]+)\s*}\s*from/g
};

// Patterns pour détecter les imports
const IMPORT_PATTERNS = {
  defaultImport: /import\s+(\w+)\s+from\s+['"']([^'"']+)['"']/g,
  namedImport: /import\s*{\s*([^}]+)\s*}\s*from\s+['"']([^'"']+)['"']/g,
  mixedImport: /import\s+(\w+),\s*{\s*([^}]+)\s*}\s*from\s+['"']([^'"']+)['"']/g
};

/**
 * Récursivement trouve tous les fichiers .js/.jsx
 */
function findFiles(dir, extension = ['.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && extension.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Analyse les exports d'un fichier
 */
function analyzeExports(content, filePath) {
  const exports = {
    default: [],
    named: [],
    file: filePath
  };
  
  // Export default
  let match;
  while ((match = EXPORT_PATTERNS.defaultExport.exec(content)) !== null) {
    exports.default.push(match[1]);
  }
  
  // Export nommés
  while ((match = EXPORT_PATTERNS.namedExport.exec(content)) !== null) {
    exports.named.push(match[1]);
  }
  
  // Export en accolades
  while ((match = EXPORT_PATTERNS.namedExportBrace.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(' as ')[0]);
    exports.named.push(...names);
  }
  
  return exports;
}

/**
 * Analyse les imports d'un fichier
 */
function analyzeImports(content, filePath) {
  const imports = [];
  
  // Import default
  let match;
  while ((match = IMPORT_PATTERNS.defaultImport.exec(content)) !== null) {
    imports.push({
      type: 'default',
      name: match[1],
      from: match[2],
      file: filePath
    });
  }
  
  // Import nommés
  while ((match = IMPORT_PATTERNS.namedImport.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim());
    names.forEach(name => {
      imports.push({
        type: 'named',
        name: name,
        from: match[2],
        file: filePath
      });
    });
  }
  
  return imports;
}

/**
 * Génère un rapport d'analyse
 */
function generateReport() {
  console.log('🔍 Analyse des exports/imports du projet...\n');
  
  const files = findFiles(SRC_DIR);
  const allExports = [];
  const allImports = [];
  const issues = [];
  
  // Analyse de chaque fichier
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(PROJECT_ROOT, file);
      
      const exports = analyzeExports(content, relativePath);
      const imports = analyzeImports(content, relativePath);
      
      if (exports.default.length > 0 || exports.named.length > 0) {
        allExports.push(exports);
      }
      
      if (imports.length > 0) {
        allImports.push(...imports);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse de ${file}:`, error.message);
    }
  }
  
  // Détection des incompatibilités
  for (const importItem of allImports) {
    if (importItem.from.startsWith('.')) {
      // Import relatif - on peut vérifier la compatibilité
      const targetFile = resolveImportPath(importItem.from, importItem.file);
      const targetExports = allExports.find(exp => exp.file === targetFile);
      
      if (targetExports) {
        if (importItem.type === 'default' && targetExports.default.length === 0) {
          issues.push({
            type: 'missing_default_export',
            import: importItem,
            target: targetExports
          });
        } else if (importItem.type === 'named' && !targetExports.named.includes(importItem.name)) {
          issues.push({
            type: 'missing_named_export',
            import: importItem,
            target: targetExports
          });
        }
      }
    }
  }
  
  // Affichage du rapport
  console.log('📊 RAPPORT D\'ANALYSE\n');
  
  console.log('📦 EXPORTS PAR FICHIER:');
  for (const exp of allExports) {
    console.log(`\n📁 ${exp.file}`);
    if (exp.default.length > 0) {
      console.log(`   ↳ Default: ${exp.default.join(', ')}`);
    }
    if (exp.named.length > 0) {
      console.log(`   ↳ Named: ${exp.named.join(', ')}`);
    }
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️  PROBLÈMES DÉTECTÉS:');
    for (const issue of issues) {
      console.log(`\n❌ ${issue.type}`);
      console.log(`   📍 Dans: ${issue.import.file}`);
      console.log(`   🔗 Import: ${issue.import.name} (${issue.import.type}) from "${issue.import.from}"`);
      console.log(`   📁 Cible: ${issue.target.file}`);
    }
  } else {
    console.log('\n✅ Aucun problème d\'import/export détecté !');
  }
  
  console.log(`\n📈 STATISTIQUES:`);
  console.log(`   • Fichiers analysés: ${files.length}`);
  console.log(`   • Fichiers avec exports: ${allExports.length}`);
  console.log(`   • Total d'imports: ${allImports.length}`);
  console.log(`   • Problèmes détectés: ${issues.length}`);
}

/**
 * Résoud le chemin d'import relatif
 */
function resolveImportPath(importPath, fromFile) {
  const dir = path.dirname(fromFile);
  let resolved = path.resolve(PROJECT_ROOT, dir, importPath);
  
  // Ajouter l'extension si nécessaire
  if (!path.extname(resolved)) {
    if (fs.existsSync(resolved + '.js')) {
      resolved += '.js';
    } else if (fs.existsSync(resolved + '.jsx')) {
      resolved += '.jsx';
    } else if (fs.existsSync(path.join(resolved, 'index.js'))) {
      resolved = path.join(resolved, 'index.js');
    } else if (fs.existsSync(path.join(resolved, 'index.jsx'))) {
      resolved = path.join(resolved, 'index.jsx');
    }
  }
  
  return path.relative(PROJECT_ROOT, resolved);
}

// Exécution du script
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport, findFiles, analyzeExports, analyzeImports };
