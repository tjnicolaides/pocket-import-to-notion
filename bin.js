#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from '@notionhq/client';
const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
if (!notionToken || !databaseId) {
    console.error('Error: NOTION_TOKEN and NOTION_DATABASE_ID environment variables are required.');
    process.exit(1);
}
const notion = new Client({ auth: notionToken });
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield notion.databases.query({
            database_id: databaseId,
            page_size: 1,
        });
        console.log('Success! First page:', JSON.stringify(response.results[0], null, 2));
    }
    catch (error) {
        console.error('Failed to query Notion database:', error.message || error);
        process.exit(1);
    }
}))();
