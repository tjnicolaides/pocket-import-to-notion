# Pocket Import to Notion

This CLI tool lets you import your Pocket saves into a Notion database, preserving titles, URLs, and read status. It can create a new Notion database for you, or import into an existing one.

---

## Features
- Import Pocket CSV exports into Notion
- Optionally initialize a new Notion database with the correct schema
- Preserves title, URL, and read/archive status
- Skips items marked as "Done" in Pocket
- Imports in chronological order

---

## Getting Started

### 1. **Export your Pocket saves**
- Follow the official guide: [How to export your Pocket list](https://support.mozilla.org/en-US/kb/exporting-your-pocket-list)
- You will get a CSV file with your saves.

#### Example CSV format

| title                 | url                        | time_added   | tags      | status   |
|-----------------------|----------------------------|--------------|-----------|----------|
| Example Article 1     | https://example.com/1      | 1600000000   | reading   | archive  |
| Example Article 2     | https://example.com/2      | 1600000001   | tech      | unread   |
| Example Article 3     | https://example.org/3      | 1600000002   | science   | archive  |
| Example Article 4     | https://example.net/4      | 1600000003   | news      | unread   |
| Example Read Item     | https://example.com/read   | 1600000004   | misc      | archive  |
| Example Unread Item   | https://example.com/unread | 1600000005   | misc      | unread   |
| Example Done Item     | https://example.com/done   | 1600000006   | misc      | Done     |

### 2. **Create a Notion integration and get your token**
- Go to [Notion Integrations](https://www.notion.so/profile/integrations)
- Click **+ New integration**
- Copy the **Internal Integration Token** (this is your `NOTION_TOKEN`)

### 3. **Grant your integration access to a Notion page**
- Open the Notion page where you want to create/import the database
- Click the `...` menu (top right)
- Scroll to **+ Add Connections**
- Select your integration
- [Full instructions here](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)

### 4. **Set up environment variables**
- `NOTION_TOKEN`: Your Notion integration token
- `NOTION_PARENT_PAGE_ID`: The ID of the Notion page where you want to create a new database (required for `--init`)
- `NOTION_DATABASE_ID`: The ID of an existing Notion database (required if not using `--init`)

---

## Usage

### **Initialize a new Notion database**
This will create a new database with the correct properties (Name, URL, Read):

```sh
NOTION_TOKEN=your_token NOTION_PARENT_PAGE_ID=your_page_id npx . --init
```

### **Import a Pocket CSV into Notion**
- To import into a new database (create and import in one step):
  ```sh
  NOTION_TOKEN=your_token NOTION_PARENT_PAGE_ID=your_page_id npx . --init mypocket.csv
  ```
- To import into an existing database:
  ```sh
  NOTION_TOKEN=your_token NOTION_DATABASE_ID=your_database_id npx . mypocket.csv
  ```
- You can specify multiple CSVs:
  ```sh
  NOTION_TOKEN=your_token NOTION_DATABASE_ID=your_database_id npx . mypocket1.csv mypocket2.csv
  ```

---

## Notes
- The Notion database must have the properties: `Name` (title), `URL` (url), and `Read` (checkbox).
- If you use `--init`, the tool creates a database with the correct schema and icon (📚).
- The tool skips Pocket items with a status of "Done".
- Imported pages are sorted by the time they were added to Pocket.
- You may need to manually set up a gallery view or filters in Notion after import (the API cannot do this yet).

---

## Troubleshooting
- **"Read is not a property that exists"**: The Notion database you are importing into does not have a `Read` property. Use `--init` to create a new database, or add the property manually.
- **Permission errors**: Make sure your integration has access to the parent page/database. See [granting permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions).

---

## Resources
- [Create a Notion integration & get your token](https://www.notion.so/profile/integrations)
- [Grant integration permission to a page](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
- [Export your Pocket list](https://support.mozilla.org/en-US/kb/exporting-your-pocket-list) 