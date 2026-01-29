import json
import yaml
import re
from pathlib import Path

json_file = Path('../src/data/items.json')
vault_folder = Path('../obsidian/events/')

with open(json_file, 'r', encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    person = item['address'].split(".")[0]
    person_folder = vault_folder / person
    person_folder.mkdir(parents=True, exist_ok=True)

    safe_title = item["name"].lower()
    safe_title = re.sub(r"[^\w\s-]", "", safe_title)   # remove special characters
    safe_title = re.sub(r"\s+", "_", safe_title)       # spaces → underscore

    filename = person_folder / f"EVT{item['id']}_{safe_title}.md"


    yaml_front = yaml.safe_dump(item, sort_keys=False, allow_unicode=True)
    content = f"---\n{yaml_front}---\n\n"

    with open(filename, 'w', encoding="utf-8") as f:
        f.write(content)

print(f"Exported {len(items)} events to Obsidian vault.")