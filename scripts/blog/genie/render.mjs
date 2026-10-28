// Rebuild the original English infographic and animation. Requires Python 3 + Pillow.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const icons = join(root, 'public/images/blog/databricks-genie/icons');
const temp = join(root, '.astro/genie-render');
await mkdir(temp, { recursive: true });
for (const file of await readdir(icons)) {
  if (file.endsWith('.svg')) await sharp(join(icons, file)).resize(96, 96).png().toFile(join(temp, file.replace('.svg', '.png')));
}
const result = spawnSync(process.env.PYTHON || 'python3', [join(here, 'frames.py'), root, temp], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
