#!/usr/bin/env node

import { Command } from 'commander';
import { makeSession } from './commands';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command()
    .name('tgcloud')
    .description('A CLI tool for managing Telegram Cloud files.')
    .version('1.0.0', '-v, --version', 'display the version number');

  program.addCommand(makeSession);

  program.parse();
}

main();
