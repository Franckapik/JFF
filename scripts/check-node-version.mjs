import { readFileSync } from 'node:fs';

const { engines } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const match = /^>=(\d+)\.(\d+)\.(\d+)$/.exec(engines.node);

if (!match) {
  throw new Error(`Format engines.node non pris en charge : ${engines.node}`);
}

const minimum = match.slice(1).map(Number);
const current = process.versions.node.split('.').map(Number);
const firstDifference = current.findIndex((part, index) => part !== minimum[index]);

if (firstDifference !== -1 && current[firstDifference] < minimum[firstDifference]) {
  console.error(`Node ${engines.node} requis ; version active : ${process.version} (${process.execPath}).`);
  console.error('Installez et activez la version du projet avec : nvm install && nvm use');
  process.exit(1);
}
