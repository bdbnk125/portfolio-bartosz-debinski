import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
const files = [
  'index.html',
  'kivo.html',
  'vena.html',
  'style.css',
  'case-study.css',
  'navigation.js',
  'animations.js',
  'contact.js',
];
const directories = ['assets', 'fonts'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(output, file));
}

for (const directory of directories) {
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}

const builtFiles = await readdir(output);
console.log(`Zbudowano dist: ${builtFiles.length} elementów głównych.`);
