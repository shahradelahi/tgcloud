import { Command } from 'commander';
import logger from '@/logger';
import { handleError } from '@/utils/handle-error';
import { z } from 'zod';

export const upload = new Command()
  .command('upload')
  .description('Upload things to Telegram.')
  .argument('<path>', 'A path to a file or directory to upload.')
  .option('-S, --session <session>', 'Use a session to connect to Telegram.')
  .option('--proxy <proxy>', 'Use a socks5 proxy to connect to Telegram.')
  .option('--cwd <cwd>', 'A path to a directory where the session will be stored.', process.cwd())
  .action(async (path, opts) => {
    logger.log('');

    try {
      const options = z
        .object({
          session: z.string(),
          path: z.string(),
          proxy: z.string().optional(),
          cwd: z.string().default(process.cwd()),
        })
        .parse({
          path,
          ...opts,
        });

      // TODO: Use the TelegramCloud module to upload the file to Telegram

      logger.log('');
    } catch (e) {
      handleError(e);
    }
  });
