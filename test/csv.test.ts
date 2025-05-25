import fs from 'fs';
import path from 'path';
import readAndPrepareRows from '../src/csv';

describe('readAndPrepareRows', () => {
  const testCsvPath = path.join(__dirname, 'test.csv');
  const csvData = [
    'title,url,time_added,tags,status',
    'A,https://a.com,2,tag1,archive',
    'B,https://b.com,1,tag2,Done',
    'C,https://c.com,3,tag3,unread',
  ].join('\n');

  beforeAll(() => {
    fs.writeFileSync(testCsvPath, csvData);
  });
  afterAll(() => {
    fs.unlinkSync(testCsvPath);
  });

  it('filters out Done and sorts by time_added', async () => {
    const rows = await readAndPrepareRows(testCsvPath);
    expect(rows.length).toBe(2);
    expect(rows[0].title).toBe('A');
    expect(rows[1].title).toBe('C');
  });
});
