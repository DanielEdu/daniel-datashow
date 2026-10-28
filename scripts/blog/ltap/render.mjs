// Rebuild the English infographic. Requires sharp and Python 3 with Pillow.
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const temp = join(root, '.astro/ltap-render');
await mkdir(temp, { recursive: true });
const icons = join(root, 'public/images/blog/databricks-ltap/icons');
for (const file of await readdir(icons)) {
  if (!file.endsWith('.svg')) continue;
  await sharp(join(icons, file))
    .resize(192, 192, { fit: 'contain', background: '#00000000' })
    .png().toFile(join(temp, file.replace('.svg', '.png')));
}
const result = spawnSync(process.env.PYTHON || 'python3', [join(here, 'frames.py'), root, temp], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status || 1);
