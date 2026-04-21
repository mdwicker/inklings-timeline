import sqlite3
import json
import os

DB_PATH = 'data_management/inklings.db'

field_replacements = {
    "group_id": "group"
    }

def format_item(item):
    # Ignore fields that start with workflow, those are reserved for database management
    formatted = {field: item[field] for field in item if not field.startswith('workflow')}

    # Perform any required name changes
    for old_field, new_field in field_replacements.items():
        if old_field in formatted:
            formatted[new_field] = formatted.pop(old_field)

    # Populate category name
    cat_id = item["category_id"]
    formatted["category"] = cats[cat_id]["name"]
    del formatted["category_id"]

    # Populate source(s)
    item_sources = []
    source_field_prefixes = ["", "end_"]

    for prefix in source_field_prefixes:
        if not item[prefix + "source_id"]:
            del formatted[prefix + "source_id"]
            del formatted[prefix + "source_page"]
            continue

        source_id = item[prefix + "source_id"]
        source = {field: value for field, value in sources[source_id].items() if value}
        if item[prefix + "source_page"]:
            source["page"] = item[prefix + "source_page"]

        if prefix != "":
            source["source_type"] = prefix.replace("_", "")
        else:
            source["source_type"] = "main"

        item_sources.append(source)

        del formatted[prefix + "source_id"]
        del formatted[prefix + "source_page"]

    formatted["sources"] = item_sources

    return formatted

def create_dict_from_ids(entries):
    by_id = {}

    for entry in entries:
        formatted_entry = entry.copy()
        del formatted_entry["id"]

        by_id[entry["id"]] = formatted_entry

    return by_id

def get_entries_with_field_names(table_name):
    raw_entries = cur.execute(f'SELECT * FROM {table_name}')
    headers = [col[0] for col in cur.description]
    return [dict(zip(headers, entry)) for entry in raw_entries]



# Create the DB in the current folder
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Get the categories
cats = create_dict_from_ids(get_entries_with_field_names('categories'))

# Get the sources
sources = create_dict_from_ids(get_entries_with_field_names('sources'))

# Get the items
item_dicts = get_entries_with_field_names('items')

formatted_items = [format_item(item) for item in item_dicts]

json_str = json.dumps(formatted_items, indent = 4)
with open("src/data/items.json", "w") as f:
    f.write(json_str)





# # 1. Setup Tables
# cur.executescript('''
# CREATE TABLE IF NOT EXISTS groups (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     name TEXT NOT NULL UNIQUE
# );

# CREATE TABLE IF NOT EXISTS sources (
#     id INTEGER PRIMARY KEY,
#     name TEXT NOT NULL UNIQUE
# );
                  
# CREATE TABLE IF NOT EXISTS categories (
#     id INTEGER PRIMARY KEY,
#     name TEXT NOT NULL UNIQUE
# );
                  
# CREATE TABLE IF NOT EXISTS items (
#     id INTEGER PRIMARY KEY,
#     group_id INTEGER,
#     name TEXT NOT NULL,
#     category_id INTEGER,
#     description TEXT,
#     start TEXT NOT NULL,
#     end TEXT,
#     edtf TEXT,
#     priority INTEGER NOT NULL CHECK(priority BETWEEN 0 AND 4),
#     note TEXT,
#     source_id INTEGER,
#     FOREIGN KEY (group_id) REFERENCES groups(id),
#     FOREIGN KEY (category_id) REFERENCES categories(id),
#     FOREIGN KEY (source_id) REFERENCES sources(id)
# );
# ''')

# # 2. Load and Import Groups
# with open('../src/data/groups.json', 'r') as f:
#     groups_data = json.load(f)
#     for g in groups_data:
#         cur.execute("INSERT OR IGNORE INTO groups (id, name) VALUES (?, ?)", (g['id'], g['name']))

# # 3. Load and Import Items
# with open('../src/data/items.json', 'r') as f:
#     items_data = json.load(f)
#     for entry in items_data:
#         source_id = None
#         if entry.get('source'):
#             cur.execute("INSERT OR IGNORE INTO sources (name) VALUES (?)", (entry['source'],))
#             cur.execute("SELECT id FROM sources WHERE name = ?", (entry['source'],))
#             source_id = cur.fetchone()[0]

#         cat_id = None
#         if entry.get('category'):
#             cur.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (entry['category'],))
#             cur.execute("SELECT id FROM categories WHERE name = ?", (entry['category'],))
#             cat_id = cur.fetchone()[0]

#         cur.execute('''
#             INSERT OR IGNORE INTO items (group_id, category_id, name, description, start, end, edtf, priority, note, source_id)
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (
#             entry.get('group'), cat_id, entry.get('name'),
#             entry.get('description'), entry.get('start'), entry.get('end'), 
#             entry.get('edtf'), entry.get('priority'), entry.get('note'), source_id
#         ))

# conn.commit()
# conn.close()
# print("Success: 'inklings.db' created with 4 linked tables.")