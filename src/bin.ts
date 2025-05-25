import type { Client } from '@notionhq/client';
import readAndPrepareRows from './csv';
import importRowsToDatabase from './importer';

async function importWithProgress(
  notion: InstanceType<typeof Client>,
  databaseId: string,
  csvPath: string,
) {
  const rows = await readAndPrepareRows(csvPath);
  const total = rows.length;
  // eslint-disable-next-line no-console
  console.log(`\nImporting ${csvPath} (${total} articles):`);
  let uploaded = 0;
  await Promise.all(rows.map(async (row) => {
    await importRowsToDatabase(notion, databaseId, [row]);
    uploaded += 1;
    // eslint-disable-next-line no-console
    process.stdout.write(`\r  Progress: ${uploaded}/${total}`);
  }));
  // eslint-disable-next-line no-console
  process.stdout.write('\n');
  // eslint-disable-next-line no-console
  console.log(`Imported ${csvPath} to Notion database ${databaseId}`);
}

export default importWithProgress;
