import { Command } from 'commander';
import logger from '@/logger';
import { handleError } from '@/utils/handle-error';
import { z } from 'zod';
import { generateSession } from '@/lib/telegram';
import prompts from 'prompts';
import { ensurePathExists } from '@/utils/ensure-path-exists';
import { checkoutSession, saveSession } from '@/lib/session';
import { resolve } from 'node:path';
import chalk from 'chalk';

export const makeSession = new Command()
  .command('make-session <session-name>')
  .description('Create a new session.')
  .option(
    '-S, --store-dir <directory>',
    'A path to a file where the session will be stored.',
    '~/.tgcloud',
  )
  .option('--proxy <proxy>', 'Use a socks5 proxy to connect to Telegram.')
  .option('--cwd <cwd>', 'A path to a directory where the session will be stored.', process.cwd())
  .action(async (sessionName, opts) => {
    logger.log('');

    console.log(sessionName, opts);

    try {
      const options = z
        .object({
          sessionName: z.string(),
          storeDir: z.string().default('~/.tgcloud'),
          proxy: z.string().optional(),
          cwd: z.string().default(process.cwd()),
        })
        .parse({
          sessionName,
          ...opts,
        });

      const sessionDir = resolve(options.cwd, options.storeDir);
      await ensurePathExists(sessionDir, {
        mode: 0o700,
      });

      // check season file exists
      if (!!(await checkoutSession(sessionDir, options.sessionName))) {
        // send confirmation to overwrite
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: 'A session with this name already exists. Overwrite?',
          initial: false,
        });

        if (!overwrite) {
          logger.info('Aborted.');
          process.exitCode = 0;
          return;
        }
      }

      const session = await generateSession({
        phoneNumber: handlePhoneNumber,
        password: handlePassword,
        phoneCode: handlePhoneCode,
        proxy: options.proxy,
        onError: (err) => {
          throw err;
        },
      });

      await saveSession(sessionDir, options.sessionName, session);

      logger.info(chalk.green('Success!'), `Session ${chalk.bold(options.sessionName)} created.`);
      logger.log('');
    } catch (e) {
      handleError(e);
    }
  });

async function handlePhoneNumber(): Promise<string> {
  const { phoneNumber } = await prompts({
    type: 'text',
    name: 'phoneNumber',
    message: 'Enter your phone number:',
  });

  return phoneNumber;
}

async function handlePassword(): Promise<string> {
  const { password } = await prompts({
    type: 'text',
    name: 'password',
    message: 'Enter your password:',
  });

  return password;
}

async function handlePhoneCode(): Promise<string> {
  const { code } = await prompts({
    type: 'text',
    name: 'code',
    message: 'Enter the code you just received:',
  });

  return code;
}
