# Script made with Gemini help. User be warned.

import json
import yaml
import jsonschema
import re
from pathlib import Path
from datetime import date

# Setup paths relative to script location
obsidian_vault = Path('./obsidian/events/')
json_file = Path('./src/data/items.json')
schema_file = Path('./src/data/items.schema.json')

def safe_title(title: str) -> str:
    """Turn a title into a filename-friendly string."""
    s = title.lower()
    s = re.sub(r"[^\w\s-]", "", s)  # remove special characters
    s = re.sub(r"\s+", "_", s)      # spaces → underscores
    return s

def update_items():
    with open(schema_file, 'r', encoding='utf-8') as f:
        full_schema = json.load(f)

    item_schema = full_schema['items']

    all_events = []
    used_ids = set()

    # 1. Iterate through person folders (tolkien, lewis, etc.)
    for person_folder in obsidian_vault.iterdir():
        if person_folder.is_dir():

            # 2. Iterate through .md files in that specific folder
            for md_file in person_folder.glob('*.md'):
                content = md_file.read_text(encoding="utf-8")

                # Split at the YAML markers
                parts = content.split('---')
                if len(parts) >= 3:
                    data = yaml.safe_load(parts[1])

                    if data:

                        # Strip out the Obsidian-only workflow fields
                        data.pop('status', None)

                        # Fix types for the JSON schema
                        if 'id' in data: data['id'] = int(data['id'])
                        if 'priority' in data: data['priority'] = int(data['priority'])
                        
                        # Convert dates to strrings
                        for key in ['start', 'end']:
                            if key in data and isinstance(data[key], date):
                                data[key] = data[key].isoformat()

                        # Check duplicate ids
                        current_id = data.get('id')
                        if current_id in used_ids:
                            print(f"ERROR: Duplicate ID {current_id} found in {md_file.name}. Skipping.")
                            continue

                        # Validate against JSON schema
                        try:
                            jsonschema.validate(instance=data, schema=item_schema)
                        except jsonschema.ValidationError as e:
                            print(f"Validation error in {md_file}: {e.message}")
                            continue  # skip invalid data

                        expected_name = f"EVT{data['id']}_{safe_title(data['title'])}.md"
                        expected_path = person_folder / expected_name

                        if md_file.name != expected_name:
                            # Check if target exists to avoid overwriting
                            if expected_path.exists():
                                print(f"WARNING: Cannot rename {md_file.name} → {expected_name}, target already exists.")
                            else:
                                md_file.rename(expected_path)
                                print(f"Renamed {md_file.name} → {expected_name}")
                                md_file = expected_path  # update reference

                        all_events.append(data)
                        used_ids.add(current_id)


    # 3. Sort by ID so the JSON stays organized
    all_events.sort(key=lambda x: x.get('id', 0))

    # 4. Save to the main project
    with open(json_file, 'w', encoding="utf-8") as f:
        json.dump(all_events, f, indent=2, ensure_ascii=False)

    print(f"Compiled {len(all_events)} events into {json_file}")

if __name__ == "__main__":
    update_items()
