import { accessSync, promises } from 'fs';

export function fsAccess(path: string): boolean {
  try {
    accessSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

export async function fsIsDirectory(path: string): Promise<boolean> {
  try {
    const stat = await promises.stat(path);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}
