import sqlite3
import json

DB_PATH = 'data_management/inklings.db'

field_replacements = {
    "group_id": "group"
    }

def format_item(item):
    # Ignore fields that start with workflow, those are reserved for database management
    formatted = {field: item[field] for field in item if not field.startswith('workflow') and item[field] is not None}

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
            continue

        source_id = item[prefix + "source_id"]
        source = {field: value for field, value in sources[source_id].items() if value is not None}
        del formatted[prefix + "source_id"]

        if item[prefix + "source_page"]:
            source["page"] = item[prefix + "source_page"]
            del formatted[prefix + "source_page"]

        if prefix != "":
            source["source_type"] = prefix.replace("_", "")
        else:
            source["source_type"] = "main"

        item_sources.append(source)

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



# Connect to the DB in the current folder
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Get the categories
cats = create_dict_from_ids(get_entries_with_field_names('categories'))

# Get the sources
sources = create_dict_from_ids(get_entries_with_field_names('sources'))

# Get the groups
groups = get_entries_with_field_names('groups')

json_str = json.dumps(groups, indent = 4)
with open("src/data/groups.json", "w") as f:
    f.write(json_str)

# Get the items
raw_items = get_entries_with_field_names('items')
items = [format_item(item) for item in raw_items]

json_str = json.dumps(items, indent = 4)
with open("src/data/items.json", "w") as f:
    f.write(json_str)

conn.close()
