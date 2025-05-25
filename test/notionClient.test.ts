import getNotionClient, { getEnvOrThrow } from '../src/notionClient';

jest.mock('@notionhq/client', () => ({
  Client: jest.fn(),
}));

const { Client } = require('@notionhq/client');

describe('getEnvOrThrow', () => {
  it('returns the value if set', () => {
    process.env.TEST_ENV = 'value';
    expect(getEnvOrThrow('TEST_ENV')).toBe('value');
  });
  it('throws if not set', () => {
    delete process.env.TEST_ENV;
    expect(() => getEnvOrThrow('TEST_ENV')).toThrow('Environment variable TEST_ENV is required.');
  });
});

describe('getNotionClient', () => {
  it('calls Client with the correct token', () => {
    process.env.NOTION_TOKEN = 'secret';
    getNotionClient();
    expect(Client).toHaveBeenCalledWith({ auth: 'secret' });
  });
});
