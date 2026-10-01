import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import chromium from '@sparticuz/chromium';
import { chromium as playwright } from 'playwright';

// Use the npm-packaged headless browser so CI does not need an external
// Playwright browser download. Its NSS libraries are supplied in the package.
export async function launchBrowser() {
  const folder = join(tmpdir(), 'flipmar-browser-libs');
  const libFolder = join(folder, 'lib');
  if (!existsSync(join(libFolder, 'libnspr4.so'))) {
    await mkdir(folder, { recursive: true });
    const packed = join(
      dirname(fileURLToPath(import.meta.url)),
      '..',
      'node_modules',
      '@sparticuz',
      'chromium',
      'bin',
      'al2023.tar.br',
    );
    const tar = join(folder, 'libraries.tar');
    await writeFile(tar, brotliDecompressSync(await readFile(packed)));
    execFileSync('tar', ['-xf', tar, '-C', folder]);
  }
  const env = {
    ...process.env,
    LD_LIBRARY_PATH: [libFolder, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
  };
  return playwright.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
    env,
  });
}
