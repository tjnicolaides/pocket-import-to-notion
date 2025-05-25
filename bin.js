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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { Client } from '@notionhq/client';
import fs from 'fs';
import { parse } from 'csv-parse';
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
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield notion.databases.create({
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
    });
}
function importCsvToDatabase(databaseId, csvPath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e, _f;
        // Read and parse all rows first
        const rows = [];
        const parser = fs.createReadStream(csvPath).pipe(parse({ columns: true }));
        try {
            for (var _g = true, parser_1 = __asyncValues(parser), parser_1_1; parser_1_1 = yield parser_1.next(), _a = parser_1_1.done, !_a; _g = true) {
                _c = parser_1_1.value;
                _g = false;
                const row = _c;
                if ((row.status || '').toLowerCase() !== 'done') {
                    rows.push(row);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = parser_1.return)) yield _b.call(parser_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Sort by time_added (ascending)
        rows.sort((a, b) => Number(a.time_added) - Number(b.time_added));
        for (const row of rows) {
            const props = {
                Name: { title: [{ text: { content: ((_e = (_d = row.title) !== null && _d !== void 0 ? _d : row.url) !== null && _e !== void 0 ? _e : '') } }] },
                URL: { url: ((_f = row.url) !== null && _f !== void 0 ? _f : '') },
                Read: { checkbox: (row.status || '') === 'archive' }
            };
            yield notion.pages.create({
                parent: { database_id: databaseId },
                properties: props
            });
            // Optionally, add a delay here to avoid rate limits
        }
        console.log(`Imported ${csvPath} to Notion database ${databaseId}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let databaseId = databaseIdEnv;
        if (doInit) {
            databaseId = yield createDatabase();
            if (csvPaths.length === 0) {
                console.log('Database initialized. No CSVs provided for import.');
                return;
            }
        }
        for (const csvPath of csvPaths) {
            yield importCsvToDatabase(databaseId, csvPath);
        }
        console.log('Import complete!');
    });
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
