import json
import jsonschema
import copy
from pathlib import Path

json_file = Path('./src/data/items.json')
schema_file = Path('./src/data/items.schema.json')


with open(json_file, 'r', encoding="utf-8") as f:
    items = json.load(f)

with open(schema_file, 'r', encoding='utf-8') as f:
    full_schema = json.load(f)

item_schema = full_schema['items']
items_modified = 0
modified_indices = []

for i, item in enumerate(items):
    try:
        temp_item = copy.deepcopy(item)
        changed = False

        # MAKE CHANGES TO TEMP_ITEM BELOW
        name = temp_item.get('name')
        
        if not name:
            continue

        if "title" not in temp_item:
            changed = True
            temp_item['title'] = name
            temp_item.pop('name')

        # END OF CHANGES
        
        if not changed:
            continue

        jsonschema.validate(instance=temp_item, schema=item_schema)

        items[i] = temp_item
        items_modified += 1
        modified_indices.append(i)
    except jsonschema.ValidationError as e:
        print(f"Validation error for item {item.get('id')}: {e.message}")
        continue  # skip invalid changes



with open(json_file, 'w', encoding="utf-8") as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print(f"Modified {items_modified} items. Indices modified: {modified_indices}")