import fs from 'fs';
import { parse } from 'csv-parse';

async function readAndPrepareRows(csvPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    fs.createReadStream(csvPath)
      .pipe(parse({ columns: true }))
      .on('data', (row) => {
        if ((row.status || '').toLowerCase() !== 'done') {
          rows.push(row);
        }
      })
      .on('end', () => {
        rows.sort((a, b) => Number(a.time_added) - Number(b.time_added));
        resolve(rows);
      })
      .on('error', reject);
  });
}

export default readAndPrepareRows;
