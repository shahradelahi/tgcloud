import archiver from 'archiver';
import { resolve } from 'node:path';
import { createWriteStream, promises } from 'node:fs';

describe('Archiver - Compression', () => {
  it('should compress a file', async () => {
    // compress pnpm lock file
    const lockFilePath = resolve(process.cwd(), 'pnpm-lock.yaml');
    // print actual size
    const stats = await promises.stat(lockFilePath);
    console.log(`Actual size: ${stats.size} bytes`);
    // compress file
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const output = createWriteStream(resolve(process.cwd(), 'pnpm-lock.zip'));
    archive.pipe(output);

    archive.file(lockFilePath, { name: 'pnpm-lock.yaml' });

    await archive.finalize();

    // print compressed size
    const compressedStats = await promises.stat(resolve(process.cwd(), 'pnpm-lock.zip'));
    console.log(`Compressed size: ${compressedStats.size} bytes`);

    // remove compressed file
    await promises.unlink(resolve(process.cwd(), 'pnpm-lock.zip'));
  });
});
