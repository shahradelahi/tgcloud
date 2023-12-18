import {
  getEntryChatHistory,
  getTelegramClient,
  StringSession,
  TelegramClientParams,
} from '@/lib/telegram';
import { expect } from 'chai';
import { checkoutSession } from '@/lib/local-session';
import { resolve } from 'node:path';
import { Api, TelegramClient } from 'telegram';
import * as console from 'console';
import { promises } from 'node:fs';
import { Buffer } from 'buffer';
import { italic } from 'chalk';

const connectionParams: TelegramClientParams = {
  proxy: {
    socksType: 5,
    ip: 'localhost',
    port: 8080,
  },
};

describe('Telegram Instance', () => {
  it('should check session is still alive', async () => {
    const session = await checkoutSession(resolve(process.cwd(), '.tgcloud'), 'default');
    expect(session).to.be.an.instanceOf(StringSession);

    const client = await getTelegramClient({
      session,
      ...connectionParams,
    });

    expect(client).to.be.an('object');

    await client.connect();

    console.log(await client.getMe());

    await client.disconnect();
  });
});

describe('Telegram Actions', () => {
  let client: TelegramClient;

  before(async () => {
    const session = await checkoutSession(resolve(process.cwd(), '.tgcloud'), 'default');
    expect(session).to.be.an.instanceOf(StringSession);

    client = await getTelegramClient({
      session,
      ...connectionParams,
    });

    expect(client).to.be.an('object');

    await client.connect();
  });

  after(async () => {
    await client.disconnect();
  });

  it('should read first 100 messages from personal cloud', async () => {
    const result = await client.invoke(
      new Api.messages.GetHistory({
        peer: 'me',
        limit: 100,
      }),
    );

    if (result.className === 'messages.MessagesNotModified') {
      expect.fail('No messages found');
    }

    const { messages } = result;

    console.log(messages.length);
    console.log(result);
  });

  it('should get media from last 100 messages', async () => {
    const result = await client.invoke(
      new Api.messages.GetHistory({
        peer: 'me',
        limit: 100,
      }),
    );

    if (result.className === 'messages.MessagesNotModified') {
      expect.fail('No messages found');
    }

    const { messages } = result;

    console.log(messages.length);

    const mediaMessages = messages.filter((message) => {
      return (
        message.className === 'Message' &&
        message.media &&
        ['MessageMediaPhoto', 'MessageMediaDocument'].includes(message.media.className)
      );
    });

    console.log('Media:', mediaMessages.length);
    console.log('MessageId:', mediaMessages[0].id);
    console.log('ChatId:', mediaMessages[0].peerId);
    console.log(mediaMessages[0]);
  });

  it('should download a file by the message id', async () => {
    const messageId = new Api.InputMessageID({ id: 473876 });

    const messages = await client.invoke(
      new Api.messages.GetMessages({
        id: [messageId],
      }),
    );

    if (messages.className === 'messages.MessagesNotModified' || messages.messages.length === 0) {
      expect.fail('No messages found');
    }

    if (messages.messages.length > 1) {
      expect.fail('More than one message found');
    }

    const message = messages.messages[0];

    if (message.className !== 'Message' || !message.media) {
      expect.fail('Message is not a media message');
    }

    const data = await client.downloadMedia(message, {
      progressCallback: console.log,
    });

    console.log(data);

    expect(data).to.be.an.instanceOf(Buffer);

    await promises.writeFile(resolve(process.cwd(), 'test.jpg'), data as any);
  });

  it('should read entry history of the given chat', async () => {
    try {
      const messages = await getEntryChatHistory(client, {
        peer: 'me',
        max: 1000,
      });

      console.log(messages.length);
      console.log(messages[0]);
    } catch (error) {
      console.log(error);
    }
  }).timeout(6e4); // 1 minute
});
