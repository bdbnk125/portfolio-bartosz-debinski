import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
const htmlFiles = (await readdir(output)).filter((file) => file.endsWith('.html'));
const missing = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(path.join(output, htmlFile), 'utf8');
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;
    const cleanReference = reference.split('#')[0];
    if (!cleanReference) continue;
    try {
      await access(path.join(output, cleanReference));
    } catch {
      missing.push(`${htmlFile}: ${reference}`);
    }
  }
}

const imageFiles = [];
async function collectImages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectImages(fullPath);
    else if (/\.(?:webp|png|jpe?g)$/i.test(entry.name)) imageFiles.push(fullPath);
  }
}
await collectImages(path.join(output, 'assets'));

if (missing.length) {
  console.error(`Brakujące odwołania:\n${missing.join('\n')}`);
  process.exit(1);
}

const imageBytes = (await Promise.all(imageFiles.map(async (file) => (await stat(file)).size))).reduce((sum, size) => sum + size, 0);
console.log(`Sprawdzono ${htmlFiles.length} strony i ${imageFiles.length} grafik (${(imageBytes / 1024 / 1024).toFixed(2)} MB).`);
