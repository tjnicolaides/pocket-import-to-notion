import importRowsToDatabase from '../src/importer';

describe('importRowsToDatabase', () => {
  it('calls pages.create for each row with correct properties', async () => {
    const mockCreate = jest.fn();
    const mockNotion = { pages: { create: mockCreate } } as any;
    const databaseId = 'dbid';
    const rows = [
      { title: 'A', url: 'https://a.com', status: 'archive' },
      { title: 'B', url: 'https://b.com', status: 'unread' },
    ];
    await importRowsToDatabase(mockNotion, databaseId, rows);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      parent: { database_id: databaseId },
      properties: expect.objectContaining({
        Name: expect.anything(),
        URL: expect.anything(),
        Read: expect.anything(),
      }),
    }));
  });
});
