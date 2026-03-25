/*
Minimum input:
group:
id
title
(currently: parentId)

id:
id
group
title
category
edtf
(start/end makes things easier at this point)
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
      subject (person, group, etc. the main domain of the event)
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


const flattenNestedGroups = true;

// These categories are displayed differently
const backgroundCategories = ["location", "occupation"];

// These prefixes get prepended to the display name
const categoryPrefixes = {
  "location": "🏠",
  "occupation": "🎓"
};


// MAIN PIPELINE

validateData({ groups: rawGroups, items: rawItems });

const formattedData = format({ groups: rawGroups, items: rawItems });

const visData = toVis({ groups: formattedData.groups, items: formattedData.items });

function validateData({ groups, items } = {}) {
  // verify that all parentIds exist
  // verify that all item groups exist
  // verify that ids are sequential
  // verify that nested groups are sequential with parent group IDs
  // verify that edtf dates follow spec
}

function format({ groups, items } = {}) {
  const formattedGroups = groups.map(group => deepCopy(group));
  const formattedItems = items.map(item => deepCopy(item));

  // add an array of item ids to each group for its child items
  formattedGroups.forEach(group => {
    group.items = items
      .filter(item => item.group === group.id)
      .map(item => item.id);
  });

  // format date fields
  formattedItems.forEach(item => {
    const start = item.start;
    item.start = new Date(start);

    if (item.end) {
      const end = item.end;
      item.end = new Date(end);
    }
  })

  return {
    groups: formattedGroups, items: formattedItems
  };
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

function getClasses(group) {
  const classes = []
  classes.push(...group.tags);
  classes.push(`groupId-${group.id}`);
  return classes.join(" ");
}

function formatVisItem({ item } = {}) {
  const { id, title, start, priority, type, group, person, category } = item;

  const visItem = {
    id, group, start, priority, type, person, category,
    content: title,
  };

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
  const { person, category, address, name, id, items } = group;

  const visGroup = {
    id, person, category, address,
    content: name,
    className: getClasses(group),
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

function removeNestedGroups({ groups, items }) {
  // Map every group to its root (parent or itself)
  const rootOf = {};
  for (const group of groups) {
    rootOf[group.id] = group.parentId ?? group.id;
  }

  // Create root groups
  const roots = {};
  for (const group of groups) {
    if (!group.parentId) {
      roots[group.id] = {
        ...group,
        items: [...(group.items ?? [])],
      };
    }
  }

  // Push nestedGroup items into their parent
  for (const group of groups) {
    if (group.parentId) {
      delete roots[group.parentId].nestedGroups;
      roots[group.parentId].items.push(...(group.items ?? []));
    }
  }

  const processedGroups = Object.values(roots);

  // Remap items to parent groups
  const processedItems = items.map(item => ({
    ...item,
    group: rootOf[item.group],
  }));

  return { groups: processedGroups, items: processedItems };
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
