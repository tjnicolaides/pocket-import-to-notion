import type { Client } from '@notionhq/client';

export async function createDatabase(notion: InstanceType<typeof Client>, parentPageId: string): Promise<string> {
    const db = await notion.databases.create({
        parent: { type: 'page_id', page_id: parentPageId },
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