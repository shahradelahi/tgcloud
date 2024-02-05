import { MakeDirectoryOptions, promises } from 'node:fs';
import { fsAccess } from '@/utils/fs-extra';
import { resolve } from 'path';

export async function ensurePathExists(
  path: string,
  options: MakeDirectoryOptions & {
    recursive?: true;
    cwd?: string;
  } = {
    recursive: true,
  },
): Promise<void> {
  if (await fsAccess(path)) {
    const stat = await promises.stat(path);

    // fix permissions
    if (options.mode && stat.mode !== options.mode) {
      await promises.chmod(path, options.mode);
    }

    return;
  }

  if (options.cwd) {
    path = resolve(options.cwd, path);
  }

  await promises.mkdir(path, options);
}
