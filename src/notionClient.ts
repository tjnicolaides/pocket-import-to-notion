import { Client } from '@notionhq/client';

export function getEnvOrThrow(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required.`);
    }
    return value;
}

function getNotionClient(): InstanceType<typeof Client> {
    const token = getEnvOrThrow('NOTION_TOKEN');
    return new Client({ auth: token });
}

export default getNotionClient;
