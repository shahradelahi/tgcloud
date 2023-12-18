import type { TelegramClientParams as BaseParams } from 'telegram/client/telegramBaseClient';
import { StringSession } from 'telegram/sessions';
import { getTelegramClient } from '@/lib/telegram';
import { TelegramClient } from 'telegram';

export interface TelegramCloudParams extends Omit<BaseParams, 'baseLogger'> {
  session: string | StringSession;
}

// TODO: Create these apis: init, upload, download, delete, list
// TODO: create module for creating cache data and storing sync data at ~/.cache/tgcloud

type UploadParams = {
  sourcePath: string;
  chat?: string;
};

type UploadResult = UploadedFile[];

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  mime: string;
  date: Date;
};

export class TelegramCloud {
  private client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  static async init(params: TelegramCloudParams) {
    const client = await getTelegramClient(params);
    await client.connect();
    return new TelegramCloud(client);
  }

  async upload({}: UploadParams): Promise<UploadResult> {
    return [];
  }
}

export { StringSession } from '@/lib/telegram';
export * as SocksProxy from '@/lib/socks-proxy';
