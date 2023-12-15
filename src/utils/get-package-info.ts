import { fsAccess } from '@/utils/fs-access';
import { isJson } from '@/utils/is-json';
import { promises } from 'node:fs';
import path from 'node:path';
import type { PackageJson } from 'type-fest';

export async function getPackageInfo(cwd: boolean = false) {
  const packageJsonPath = getPackageFilePath(
    cwd ? path.join(process.cwd(), 'package.json') : '../package.json',
  );

  if (!(await fsAccess(packageJsonPath))) {
    return;
  }

  const content = await promises.readFile(packageJsonPath, 'utf-8');
  if (!content || !isJson(content)) {
    throw new Error('Invalid package.json file');
  }

  return JSON.parse(content) as PackageJson;
}

function getPackageFilePath(filePath: string) {
  if (typeof __dirname === 'undefined') {
    return path.resolve(import.meta.url, filePath);
  }
  return path.resolve(__dirname, filePath);
}

export async function getModuleType() {
  const packageJson = await getPackageInfo(true);
  return packageJson?.type === 'module' ? 'esm' : 'cjs';
}

export async function getPackageVersion() {
  const packageInfo = await getPackageInfo();
  return packageInfo?.version || '0.0.0-dev';
}
