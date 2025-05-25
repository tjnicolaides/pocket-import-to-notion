import fs from 'fs';
import { parse } from 'csv-parse';

export async function readAndPrepareRows(csvPath: string): Promise<any[]> {
    const rows: any[] = [];
    const parser = fs.createReadStream(csvPath).pipe(parse({ columns: true }));
    for await (const row of parser) {
        if ((row.status || '').toLowerCase() !== 'done') {
            rows.push(row);
        }
    }
    rows.sort((a, b) => Number(a.time_added) - Number(b.time_added));
    return rows;
} 