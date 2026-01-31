import yaml
from pathlib import Path
import copy

obsidian_vault = Path('./obsidian/events/')

# Enable dry-run mode to preview changes without writing
DRY_RUN = True

def batch_modify(data: dict) -> tuple[dict, bool]:

    modified = False
    temp_data = copy.deepcopy(data)

    # CHANGE DATA BELOW

    if 'source' in temp_data:
        temp_data['oldsource'] = temp_data['source']
        temp_data.pop('source')
        modified = True


    # END OF CHANGES

    return temp_data, modified

def modify_obsidian_files():
    modified_files = []

    for person_folder in obsidian_vault.iterdir():
        if not person_folder.is_dir():
            continue

        for md_file in person_folder.glob('*.md'):
            content = md_file.read_text(encoding="utf-8")

            # Split YAML frontmatter at first two occurrences of '---'
            parts = content.split('---', 2)
            if len(parts) < 3:
                print(f"Skipping {md_file}: no proper frontmatter")
                continue

            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
            except yaml.YAMLError as e:
                print(f"Error parsing YAML in {md_file}: {e}")
                continue

            # Apply batch modifications
            new_frontmatter, changed = batch_modify(frontmatter)

            if changed:
                yaml_text = yaml.safe_dump(new_frontmatter, sort_keys=False).strip()

                body = parts[2]
                if body.startswith("\n"):
                    body = body[1:]

                new_content = f"---\n{yaml_text}\n---\n{body}"

                if DRY_RUN:
                    print(f"[DRY-RUN] Would modify: {md_file}")
                else:
                    md_file.write_text(new_content, encoding="utf-8")
                    modified_files.append(str(md_file))
                    print(f"Modified: {md_file}")

    print(f"Total files modified: {len(modified_files)}")

if __name__ == "__main__":
    modify_obsidian_files()
