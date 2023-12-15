import { Logger, sessions, TelegramClient } from 'telegram';
import type { TelegramClientParams as BaseParams } from 'telegram/client/telegramBaseClient';
import { LogLevel } from 'telegram/extensions/Logger';
import { isSocks, parseProxy } from '@/lib/socks-proxy';
import { getPackageVersion } from '@/utils/get-package-info';
import type { UserAuthParams } from 'telegram/client/auth';

export const TG_API_ID = Number(process.env.TG_API_ID || 164290);
export const TG_API_HASH = process.env.TG_API_HASH || 'c65fac5f4bdf492be82d4f5648fa69bc';

export const StringSession = sessions.StringSession;

export interface TelegramClientParams extends BaseParams {
  session?: string | sessions.StringSession;
}

export async function getTelegramClient(params: TelegramClientParams) {
  const { session, ...rest } = params;

  const client = new TelegramClient(session || new StringSession(''), TG_API_ID, TG_API_HASH, {
    ...rest,
    baseLogger: new Logger(LogLevel.ERROR),
    appVersion: await getPackageVersion(),
  });

  return client;
}

type TelegramProxy = BaseParams['proxy'];

function getProxyFromString(proxy: string): TelegramProxy {
  if (!isSocks(proxy)) {
    throw new Error('Malformed socks proxy string');
  }

  const { type, username, password, server, port } = parseProxy(proxy);

  return {
    socksType: type === 'socks4' ? 4 : 5,
    ip: server,
    port,
    username,
    password,
  };
}

export interface GenerateSessionOptions extends UserAuthParams {
  timeout?: number;
  proxy?: string | undefined;
}

export async function generateSession({
  timeout,
  proxy,
  ...authParams
}: GenerateSessionOptions): Promise<string> {
  const session = new StringSession('');

  let params: TelegramClientParams = {
    session,
    timeout,
  };

  if (proxy) {
    params.proxy = getProxyFromString(proxy);
  }

  const client = await getTelegramClient(params);

  await client.start(authParams);

  client.destroy().catch(() => {});

  return session.save();
}
