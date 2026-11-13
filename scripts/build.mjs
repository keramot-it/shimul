import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') {
  throw new Error('Build output must be the project dist directory.');
}

// Only these public files are deployed. Original uploads are never copied.
const files = ['index.html', 'styles.css', 'experience.css', 'script.js', 'favicon.svg', 'assets'];
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of files) {
  await cp(path.join(root, name), path.join(output, name), {
    recursive: true,
    filter: (source) => !/\.(pdf|env)$/i.test(source) && !path.basename(source).startsWith('.'),
  });
}

async function listFiles(dir) {
  const paths = [];
  for (const name of await readdir(dir)) {
    const absolute = path.join(dir, name);
    if ((await stat(absolute)).isDirectory()) paths.push(...await listFiles(absolute));
    else paths.push(absolute);
  }
  return paths;
}

const publicFiles = await listFiles(output);
const html = await readFile(path.join(output, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="(\.[^"]+)"/g)) {
  await stat(path.resolve(output, match[1]));
}
if (publicFiles.some((file) => /\.pdf$/i.test(file))) throw new Error('Private PDF in build output.');
console.log(`Built ${publicFiles.length} public files in dist/. Ready for Vercel.`);
