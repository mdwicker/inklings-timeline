/*
Minimum input:
group:
id
name

id:
id
group
title
category
edtf
(start/end makes things easier at this point, though eventually that can be derived)
metadata (description, etc)

Outputs:
  Dataset of groups with the following fields:
    {
      -REQUIRED-
      id (unique positive integer)
      content (String with group's name)
      className (String with html classes for styling)
      subgroupOrder (rules that correctly position bgnd events)
      subgroupStack (required to enforce correct stacking behavior)

      -REQUIRED FOR SUBGROUPS-
      parentId (int of  parent group's id)

      -REQUIRED FOR PARENT GROUPS-
      nestedGroups (array of subgroup ids)
    }

  Dataset of items with the following fields:
    {
      -REQUIRED, WILL BREAK BEHAVIOR-
      id (unique positive integer)
      group (id of parent group)
      content (string with the event's name)
      category (type of event: location, occupation, publication, etc)
      priority (integer from 0-4)
      start (ISO date)
      type (vis event type: point or range. could use others in future)
      subgroup (specify type of bgnd event, otherwise "normal")
      isBackground (boolean)

      -REQUIRED FOR BGND EVENTS-
      className ("background", this is needed for styling)

      -REQUIRED FOR RANGE EVENTS-
      end (ISO date)

      -OPTIONAL-
      description (string with further details about event)
      source (string with bibliographic info)
      note (string with bibliographic commentary)
      ...other metadata fields, potentially
    }
*/

import rawGroups from '../data/groups.json'
import rawItems from '../data/items.json'
import { DataSet } from "vis-data/peer"
import edtf, { parse } from "edtf"

// These categories are displayed differently
const backgroundCategories = ["location", "occupation"];

// These prefixes get prepended to the display name
const categoryPrefixes = {
  "location": "🏠",
  "occupation": "🎓"
};


// MAIN PIPELINE

/*
validation (filters out invalid data)
deep copy (leaves the raw groups and raw items intact just in case)
format date fields on items
populate "items" group on groups...although I'm not convinced it is ever actually called. 
*/

const validatedData = validateData({ groups: rawGroups, items: rawItems });

const formattedData = format(validatedData);

const visData = toVis(formattedData);

// Returns a list of all issues found in the data
function validateData({ groups = [], items = [] } = {}) {
  const issues = [];

  const groupIds = new Set();
  const itemIds = new Set();

  for (const group of groups) {
    issues.push(...validateGroup(group));

    if ("id" in group) {
      if (groupIds.has(group.id)) {
        issues.push(`Group id '${group.id}' used twice:\n${group}`);
      } else {
        groupIds.add(group.id);
      }
    }
  }

  for (const item of items) {
    issues.push(...validateItem(item));

    if (("id" in item)) {
      if (itemIds.has(item.id)) {
        issues.push(`Item id '${item.id}' used twice:\n${item}`);
      } else {
        itemIds.add(item.id);
      }
    }

    if (("group" in item) && !groupIds.has(item.group)) {
      issues.push(`Group id '${item.group}' does not exist:\n${item}`);
    }
  }

  return issues;
}

function validateGroup(group) {
  const requiredFields = ['id', 'name'];
  const issues = [];

  for (const field of requiredFields) {
    if (!(field in group)) {
      issues.push(`Missing '${field}':\n${group}`)
    }
  }

  return issues;
}

function validateItem(item) {
  const requiredFields = ['id', 'group', 'name', 'priority'];
  const dateFields = ['start', 'end', 'edtf'];
  const issues = [];
  const priorityMin = 0;
  const priorityMax = 4;

  for (const field of requiredFields) {
    if (!(field in item)) {
      issues.push(`Missing '${field}':\n${item}`)
    }
  }

  // Must contain some valid date information
  if (!('edtf' in item) && !('start' in item)) {
    issues.push(`No date field:\n${item}`);

  }

  // check for valid date fields
  for (const field of dateFields) {
    if (!(field in item)) continue;
    try {
      const parsed = parse(item[field]);

      // unless it's an edtf date, it should contain exactly a year, month, and day
      if (field !== 'edtf' && parsed.values.length !== 3) {
        issues.push(`Invalid '${field}' date:\n${item}`);
      }
    } catch {
      issues.push(`Invalid '${field}' date:\n${item}`);
    }
  }

  // check that the priority field contains an integer in range
  if (
    isNaN(Number(item.priority)) ||
    !Number.isInteger(Number(item.priority)) ||
    item.priority < priorityMin ||
    item.priority > priorityMax
  ) {
    issues.push(`Priority must be int ${priorityMin}-${priorityMax}:\n${item}`);
  }

  return issues;
}

function format({ groups, items } = {}) {
  const formattedGroups = groups.map(group => deepCopy(group));
  const formattedItems = items.map(item => deepCopy(item));

  // format date fields
  formattedItems.forEach(item => {
    const start = item.start;
    item.start = new Date(start);

    if (item.end) {
      const end = item.end;
      item.end = new Date(end);
    }
  })

  return { groups: formattedGroups, items: formattedItems };
}

function toVis({ groups, items } = {}) {
  let processedGroups = groups;
  let processedItems = items;

  const visGroups = processedGroups.map(group => formatVisGroup({ group }));
  const visItems = processedItems.map(item => formatVisItem({ item }));

  return { groups: visGroups, items: visItems };
}

function deepCopy(object) {
  const copy = { ...object };
  // copy arrays to avoid mutating raw data
  Object.keys(copy).forEach(key => {
    if (Array.isArray(copy[key])) {
      copy[key] = [...copy[key]];
    }
  });

  return copy;
}

function formatVisItem({ item } = {}) {
  const { id, name, start, priority, group, category } = item;

  const visItem = {
    id, group, start, priority, category,
    content: name,
  };

  visItem.type = item.end ? "range" : "point";

  if (item.end) visItem.end = item.end;
  if (item.description) visItem.description = item.description;
  if (item.source) visItem.source = item.source;
  if (item.note) visItem.note = item.note;
  if (item.tags) visItem.tags = [...item.tags];

  if (backgroundCategories.includes(item.category)) {
    visItem.subgroup = item.category;
    visItem.className = "background";
    visItem.isBackground = true;
  } else {
    visItem.subgroup = "normal";
    visItem.isBackground = false;
  }

  if (item.category in categoryPrefixes) {
    visItem.content = `${categoryPrefixes[item.category]} ${visItem.content}`;
  }

  return visItem;
}

function formatVisGroup({ group } = {}) {
  const { person, category, address, name, id } = group;

  const visGroup = {
    id, person, category, address,
    content: name,
    className: slugify(name),
  };

  if (group.parentId) visGroup.parentId = group.parentId;
  if (group.nestedGroups) visGroup.nestedGroups = [...group.nestedGroups];

  visGroup.subgroupOrder = (a, b) => {
    const ordering = { "normal": 0 };
    let priority = 1
    // reverse the array so that the first items in the array are on top
    for (const category of backgroundCategories.toReversed()) {
      ordering[category] = priority;
      priority++;
    }

    return ordering[a.subgroup] - ordering[b.subgroup];
  };

  const subgroupStack = { "normal": true };
  for (const category of backgroundCategories) {
    subgroupStack[category] = true;
  }
  visGroup.subgroupStack = subgroupStack;

  return visGroup;
}

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

const groups = new DataSet(visData.groups);
const items = new DataSet(visData.items);

export { groups, items }
