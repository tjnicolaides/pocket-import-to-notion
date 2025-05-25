import { Client } from '@notionhq/client';

export function getEnvOrThrow(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required.`);
    }
    return value;
}

export function getNotionClient(): InstanceType<typeof Client> {
    const token = getEnvOrThrow('NOTION_TOKEN');
    return new Client({ auth: token });
} 