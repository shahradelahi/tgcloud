import type { TelegramClientParams as BaseParams } from 'telegram/client/telegramBaseClient';
import { StringSession } from 'telegram/sessions';

export interface TelegramCloudParams extends Omit<BaseParams, 'baseLogger'> {
  session: string | StringSession;
}

export class TelegramCloud {
  constructor(params: TelegramCloudParams) {
    console.log('TelegramCloud');
  }
}

export { StringSession } from '@/lib/telegram';
export * as SocksProxy from '@/lib/socks-proxy';
