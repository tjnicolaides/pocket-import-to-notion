import type { Client } from '@notionhq/client';
import importRowsToDatabase from '../src/importer';
import readAndPrepareRows from '../src/csv';

jest.mock('../src/csv');

const mockReadAndPrepareRows = jest.mocked(readAndPrepareRows);

describe('importRowsToDatabase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('calls pages.create for each row with correct properties', async () => {
    jest.dontMock('../src/importer');
    // eslint-disable-next-line global-require
    const realImportRowsToDatabase = require('../src/importer').default;
    const mockCreate = jest.fn();
    const mockNotion = { pages: { create: mockCreate } } as any;
    const databaseId = 'dbid';
    const rows = [
      { title: 'A', url: 'https://a.com', status: 'archive' },
      { title: 'B', url: 'https://b.com', status: 'unread' },
    ];
    await realImportRowsToDatabase(mockNotion, databaseId, rows);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        parent: { database_id: databaseId },
        properties: expect.objectContaining({
          Name: expect.anything(),
          URL: expect.anything(),
          Read: expect.anything(),
        }),
      }),
    );
    jest.mock('../src/importer');
  });
});

describe('importWithProgress', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it('calls pages.create once per row and outputs progress', async () => {
    mockReadAndPrepareRows.mockResolvedValue([
      { title: 'A', url: 'https://a.com', status: 'archive' },
      { title: 'B', url: 'https://b.com', status: 'unread' },
    ]);
    // eslint-disable-next-line global-require
    const importWithProgressDynamic = require('../src/bin').default;
    const mockCreate = jest.fn();
    const mockNotion = { pages: { create: mockCreate } } as any;
    const databaseId = 'dbid';
    const csvPath = 'test.csv';
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    await importWithProgressDynamic(mockNotion, databaseId, csvPath);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
