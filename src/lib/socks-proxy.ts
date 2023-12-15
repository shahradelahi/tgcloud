export const SOCKS_PROXY_REGEX =
  /^(socks[45]):\/\/(?:([a-zA-Z0-9.\-]+):([a-zA-Z0-9.\-]+)@)?(.+):(\d+)$/;

export function isSocks(proxy: string) {
  return SOCKS_PROXY_REGEX.test(proxy);
}

export interface Proxy {
  type: 'socks4' | 'socks5';
  username: string | undefined;
  password: string | undefined;
  server: string;
  port: number;
}

export function parseProxy(proxy: string) {
  const match = SOCKS_PROXY_REGEX.exec(proxy);

  if (!match) {
    throw new Error('Malformed socks proxy string.');
  }

  const [, type, username, password, server, port] = match;

  return {
    type,
    username,
    password,
    server,
    port: parseInt(port, 10),
  };
}
