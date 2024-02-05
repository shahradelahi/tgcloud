#!/usr/bin/env node

import { Command } from 'commander';
import { makeSession, upload } from './commands';
import { getPackageVersion } from '@/utils/get-package-info';
import dotenv from 'dotenv';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

function main() {
  const program = new Command()
    .name('tgcloud')
    .description('A CLI tool for managing Telegram Cloud files.')
    .version(getPackageVersion(), '-v, --version', 'display the version number');

  program.addCommand(makeSession).addCommand(upload);

  dotenv.config();

  program.parse();
}

main();
