import json
import yaml
import re
from pathlib import Path

json_file = Path('./src/data/items.json')
vault_folder = Path('./obsidian/events/')

def safe_title(title: str) -> str:
    """Turn a title into a filename-friendly string."""
    s = title.lower()
    s = re.sub(r"[^\w\s-]", "", s)  # remove special characters
    s = re.sub(r"\s+", "_", s)      # spaces → underscores
    return s

with open(json_file, 'r', encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    person = item['address'].split(".")[0]
    person_folder = vault_folder / person
    person_folder.mkdir(parents=True, exist_ok=True)

    filename = person_folder / f"EVT{item['id']}_{safe_title(item['name'])}.md"

    yaml_front = yaml.safe_dump(item, sort_keys=False, allow_unicode=True)
    content = f"---\n{yaml_front}---\n\n"

    with open(filename, 'w', encoding="utf-8") as f:
        f.write(content)

print(f"Exported {len(items)} events to Obsidian vault.")