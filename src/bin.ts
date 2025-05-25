#!/usr/bin/env node

import getNotionClient, { getEnvOrThrow } from './notionClient.js';
import createDatabase from './database.js';
import readAndPrepareRows from './csv.js';
import importRowsToDatabase from './importer.js';

const args = process.argv.slice(2);
const doInit = args.includes('--init');
const csvPaths = args.filter((arg) => arg.endsWith('.csv'));

if (csvPaths.length === 0 && !doInit) {
  // eslint-disable-next-line no-console
  console.error('Usage: npx . [--init] <csv1> [csv2 ...]');
  process.exit(1);
}

const notion = getNotionClient();

async function main() {
  let databaseId = process.env.NOTION_DATABASE_ID;
  if (doInit) {
    const parentPageId = getEnvOrThrow('NOTION_PARENT_PAGE_ID');
    databaseId = await createDatabase(notion, parentPageId);
    if (csvPaths.length === 0) {
      // eslint-disable-next-line no-console
      console.log('Database initialized. No CSVs provided for import.');
      return;
    }
  } else if (!databaseId) {
    // eslint-disable-next-line no-console
    console.error('Error: NOTION_DATABASE_ID environment variable is required unless --init is passed.');
    process.exit(1);
  }

  await Promise.all(csvPaths.map(async (csvPath) => {
    const rows = await readAndPrepareRows(csvPath);
    await importRowsToDatabase(notion, databaseId, rows);
    // eslint-disable-next-line no-console
    console.log(`Imported ${csvPath} to Notion database ${databaseId}`);
  }));
  // eslint-disable-next-line no-console
  console.log('Import complete!');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
