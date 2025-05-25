import type { Client } from '@notionhq/client';

export async function importRowsToDatabase(notion: InstanceType<typeof Client>, databaseId: string, rows: any[]) {
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
} 