#!/usr/bin/env node

import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import fetch from 'node-fetch';

const notionToken = process.env.NOTION_TOKEN;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;
const databaseIdEnv = process.env.NOTION_DATABASE_ID;
if (!notionToken) {
    console.error('Error: NOTION_TOKEN environment variable is required.');
    process.exit(1);
}
const notion = new Client({ auth: notionToken });

const args = process.argv.slice(2);
const doInit = args.includes('--init');
const csvPaths = args.filter(arg => arg.endsWith('.csv'));

if (csvPaths.length === 0 && !doInit) {
    console.error('Usage: npx . [--init] <csv1> [csv2 ...]');
    process.exit(1);
}

if (doInit && !parentPageId) {
    console.error('Error: NOTION_PARENT_PAGE_ID environment variable is required for --init.');
    process.exit(1);
}
if (!doInit && !databaseIdEnv) {
    console.error('Error: NOTION_DATABASE_ID environment variable is required unless --init is passed.');
    process.exit(1);
}

async function createDatabase(): Promise<string> {
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentPageId! },
        title: [{ type: 'text', text: { content: 'Pocket Import' } }],
        icon: { type: 'emoji', emoji: '📚' },
        properties: {
            Name: { title: {} },
            URL: { url: {} },
            Read: { checkbox: {} }
        }
    });
    console.log('Created Notion database:', db.id);
    return db.id;
}

async function importCsvToDatabase(databaseId: string, csvPath: string) {
    // Read and parse all rows first
    const rows: any[] = [];
    const parser = fs.createReadStream(csvPath).pipe(parse({ columns: true }));
    for await (const row of parser) {
        if ((row.status || '').toLowerCase() !== 'done') {
            rows.push(row);
        }
    }
    // Sort by time_added (ascending)
    rows.sort((a, b) => Number(a.time_added) - Number(b.time_added));
    for (const row of rows) {
        const props: any = {
            Name: { title: [{ text: { content: (row.title ?? row.url ?? '') as string } }] },
            URL: { url: (row.url ?? '') as string },
            Read: { checkbox: (row.status || '') === 'archive' }
        };
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: props
        });
        // Optionally, add a delay here to avoid rate limits
    }
    console.log(`Imported ${csvPath} to Notion database ${databaseId}`);
}

async function main() {
    let databaseId = databaseIdEnv;
    if (doInit) {
        databaseId = await createDatabase();
        if (csvPaths.length === 0) {
            console.log('Database initialized. No CSVs provided for import.');
            return;
        }
    }
    for (const csvPath of csvPaths) {
        await importCsvToDatabase(databaseId!, csvPath);
    }
    console.log('Import complete!');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});