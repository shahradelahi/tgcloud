import { SocksProxy } from 'tgcloud';
import { expect } from 'chai';

describe('Socks Proxy', () => {
  const proxyList: {
    url: string;
    type: 'socks4' | 'socks5';
  }[] = [
    {
      url: 'socks5://localhost:8080',
      type: 'socks5',
    },
    {
      url: 'socks5://myuser:password@localhost:8080',
      type: 'socks5',
    },
    {
      url: 'socks4://localhost:8080',
      type: 'socks4',
    },
    {
      url: 'socks4://myuser:password@localhost:8080',
      type: 'socks4',
    },
  ];

  it('should detect socks proxy', () => {
    for (const proxy of proxyList) {
      expect(SocksProxy.isSocks(proxy.url)).to.be.true;
    }
  });

  it('should parse socks proxy', () => {
    expect(SocksProxy.parseProxy(proxyList[0].url)).to.be.deep.equal({
      type: 'socks5',
      username: undefined,
      password: undefined,
      server: 'localhost',
      port: 8080,
    });

    expect(SocksProxy.parseProxy(proxyList[1].url)).to.be.deep.equal({
      type: 'socks5',
      username: 'myuser',
      password: 'password',
      server: 'localhost',
      port: 8080,
    });
  });
});
