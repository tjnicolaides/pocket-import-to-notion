import createDatabase from '../src/database';

describe('createDatabase', () => {
  it('creates a database and returns its id', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: 'db123' });
    const mockNotion = { databases: { create: mockCreate } } as any;
    const parentPageId = 'parent123';
    const id = await createDatabase(mockNotion, parentPageId);
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      parent: { type: 'page_id', page_id: parentPageId },
      properties: expect.objectContaining({
        Name: expect.anything(),
        URL: expect.anything(),
        Read: expect.anything(),
      }),
    }));
    expect(id).toBe('db123');
  });
});
