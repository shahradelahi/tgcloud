import { getTelegramClient, StringSession } from '@/lib/telegram';
import { expect } from 'chai';
import { checkoutSession } from '@/lib/local-session';
import { resolve } from 'node:path';

describe('Telegram', () => {
  it('should check session is still alive', async () => {
    const session = await checkoutSession(resolve(process.cwd(), '.tgcloud'), 'default');
    expect(session).to.be.an.instanceOf(StringSession);

    const client = await getTelegramClient({
      session,
      proxy: {
        socksType: 5,
        ip: 'localhost',
        port: 8080,
      },
    });

    expect(client).to.be.an('object');

    await client.connect();

    console.log(await client.getMe());

    await client.disconnect();
  });
});
