import { fsAccess } from '@/utils/fs-access';
import { resolve } from 'node:path';
import { promises } from 'node:fs';

export async function checkoutSession(path: string, sessionName: string) {
  const sessionPath = resolve(path, `id_${sessionName}`);
  const exists = await fsAccess(sessionPath);

  if (!exists) {
    return false;
  }

  await fixPermission(path, sessionName);

  return true;
}

export async function saveSession(path: string, sessionName: string, session: string) {
  const sessionPath = resolve(path, `id_${sessionName}`);
  await promises.writeFile(sessionPath, session, {
    encoding: 'utf-8',
    mode: 0o600,
  });
}

export async function fixPermission(path: string, sessionName: string) {
  const stat = await promises.stat(resolve(path, `id_${sessionName}`));

  // fix permission
  if (stat.mode !== 0o600) {
    await promises.chmod(resolve(path, `id_${sessionName}`), 0o600);
  }
}
