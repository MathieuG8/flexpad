/**
 * @astrojs/vercel 7.x : si le build tourne avec une version de Node « inconnue » (ex. 24),
 * l’adaptateur écrit nodejs18.x dans .vc-config.json — runtime refusé par Vercel depuis fin 2025.
 * On force un runtime supporté après `astro build`.
 */
import fs from 'node:fs';
import path from 'node:path';

const TARGET = 'nodejs22.x';
const root = path.join(process.cwd(), '.vercel', 'output', 'functions');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name === '.vc-config.json') patchFile(p);
  }
}

function patchFile(file) {
  let raw = fs.readFileSync(file, 'utf8');
  const j = JSON.parse(raw);
  if (j.runtime !== 'nodejs18.x' && j.runtime !== 'nodejs16.x') return;
  j.runtime = TARGET;
  fs.writeFileSync(file, JSON.stringify(j, null, '\t') + '\n');
  console.log('[patch-vercel-runtime]', path.relative(process.cwd(), file), '→', TARGET);
}

walk(root);
