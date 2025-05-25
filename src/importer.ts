import type { Client } from '@notionhq/client';

function importRowsToDatabase(
  notion: InstanceType<typeof Client>,
  databaseId: string,
  rows: any[],
) {
  return Promise.all(rows.map((row) => {
    const props: any = {
      Name: { title: [{ text: { content: (row.title ?? row.url ?? '') as string } }] },
      URL: { url: (row.url ?? '') as string },
      Read: { checkbox: (row.status || '') === 'archive' },
    };
    return notion.pages.create({
      parent: { database_id: databaseId },
      properties: props,
    });
  }));
}

export default importRowsToDatabase;
