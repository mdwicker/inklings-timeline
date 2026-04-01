import sqlite3
import json


# Create the DB in the current folder
conn = sqlite3.connect('inklings.db')

cur = conn.cursor()

cur.execute("PRAGMA foreign_keys = ON;")

# 1. Setup Tables
cur.executescript('''
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
                  
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
                  
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    group_id INTEGER,
    name TEXT NOT NULL,
    category_id INTEGER,
    description TEXT,
    start TEXT NOT NULL,
    end TEXT,
    edtf TEXT,
    priority INTEGER NOT NULL CHECK(priority BETWEEN 0 AND 4),
    note TEXT,
    source_id INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (source_id) REFERENCES sources(id)
);
''')

# 2. Load and Import Groups
with open('../src/data/groups.json', 'r') as f:
    groups_data = json.load(f)
    for g in groups_data:
        cur.execute("INSERT OR IGNORE INTO groups (id, name) VALUES (?, ?)", (g['id'], g['name']))

# 3. Load and Import Items
with open('../src/data/items.json', 'r') as f:
    items_data = json.load(f)
    for entry in items_data:
        source_id = None
        if entry.get('source'):
            cur.execute("INSERT OR IGNORE INTO sources (name) VALUES (?)", (entry['source'],))
            cur.execute("SELECT id FROM sources WHERE name = ?", (entry['source'],))
            source_id = cur.fetchone()[0]

        cat_id = None
        if entry.get('category'):
            cur.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (entry['category'],))
            cur.execute("SELECT id FROM categories WHERE name = ?", (entry['category'],))
            cat_id = cur.fetchone()[0]

        cur.execute('''
            INSERT OR IGNORE INTO items (group_id, category_id, name, description, start, end, edtf, priority, note, source_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            entry.get('group'), cat_id, entry.get('name'),
            entry.get('description'), entry.get('start'), entry.get('end'), 
            entry.get('edtf'), entry.get('priority'), entry.get('note'), source_id
        ))

conn.commit()
conn.close()
print("Success: 'inklings.db' created with 4 linked tables.")