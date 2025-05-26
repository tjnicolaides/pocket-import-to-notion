#!/usr/bin/env node

import getNotionClient, { getEnvOrThrow } from './notionClient.js';
import createDatabase from './database.js';
import importWithProgress from './bin.js';

const args = process.argv.slice(2);
const doInit = args.includes('--init');
const csvPaths = args.filter((arg) => arg.endsWith('.csv'));

if (csvPaths.length === 0 && !doInit) {
  // eslint-disable-next-line no-console
  console.error('Usage: npx . [--init] <csv1> [csv2 ...]');
  process.exit(1);
}

const notionClient = getNotionClient();

async function main() {
  let databaseId = process.env.NOTION_DATABASE_ID;
  if (doInit) {
    const parentPageId = getEnvOrThrow('NOTION_PARENT_PAGE_ID');
    databaseId = await createDatabase(notionClient, parentPageId);
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

  for (let i = 0; i < csvPaths.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await importWithProgress(notionClient, databaseId, csvPaths[i]);
    // eslint-disable-next-line no-console
    console.log(`CSV ${i + 1} of ${csvPaths.length} complete.`);
  }
  // eslint-disable-next-line no-console
  console.log('Import complete!');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
