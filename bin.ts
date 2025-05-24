#!/usr/bin/env node

import { Client } from '@notionhq/client';

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!notionToken || !databaseId) {
    console.error('Error: NOTION_TOKEN and NOTION_DATABASE_ID environment variables are required.');
    process.exit(1);
}

const notion = new Client({ auth: notionToken });

(async () => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            page_size: 1,
        });
        console.log('Success! First page:', JSON.stringify(response.results[0], null, 2));
    } catch (error) {
        console.error('Failed to query Notion database:', (error as any).message || error);
        process.exit(1);
    }
})();