/*
Priority 0: Essential Milestones
    Question: Is this a "Top 10" life event (Birth, Death, Marriage, Masterpiece)?
    Scale Check: Does the timeline "break" without this?
    Summary: Fundamental milestones that define a person's global reputation.

Priority 1: Major Life Events
    Question: Is this a defining pillar of their career or a primary residence?
    Scale Check: Is this recognizable to a well-read non-specialist?
    Summary: The primary structure of a career; significant shifts and transitions.

Priority 2: Notable Developments
    Question: Is this an important family or professional highlight?
    Scale Check: Does this add biographical "why" to their story?
    Summary: Important context for scholars and fans that isn't necessarily "world-famous."

Priority 3: Granular Details
    Question: Is this an interesting detail for a dedicated fan?
    Scale Check: Is this "texture" rather than "structure"?
    Summary: Specific addresses, minor publications, and personal anecdotes that add color.

Priority 4: Incidental or Niche Information
    Question: Is this a "deep-cut" fact or minor piece of trivia?
    Scale Check: Is this purely for archival or specialized research?
    Summary: Trivia, short-term trips, or very early/obscure works that don't impact the overall narrative.
 */

import rawGroups from '../data/groups.json'
import rawItems from '../data/items.json'
import { DataSet } from "vis-data/peer"


const flattenNestedGroups = true;
const backgroundCategories = ["location", "occupation"];
const categoryPrefixes = {
  "location": "🏠",
  "occupation": "🎓"
};

validateData({ groups: rawGroups, items: rawItems });

const formattedData = format({ groups: rawGroups, items: rawItems });

const visData = toVis({ groups: formattedData.groups, items: formattedData.items, flattenNestedGroups });


function validateData({ groups, items } = {}) {
  // verify that all parentIds exist
  // verify that all item groups exist
  // verify that ids are sequential
  // verify that nested groups are sequential with parent group IDs
  // verify that edtf dates follow spec
}

function format({ groups, items } = {}) {
  const addressBook = groups.reduce((addresses, group) => {
    addresses[group.address] = group.id
    return addresses;
  }, {});
  const relationships = getRelationships({ groups, items, addressBook });

  const formattedGroups = groups.map(group => {
    return normalizeGroup({ group, relationships: relationships[group.id] });
  });

  const formattedItems = items.map(item => {
    return normalizeItem({ item, groupId: addressBook[getAddress(item)] });
  });

  return {
    groups: formattedGroups, items: formattedItems
  };
}

function toVis({ groups, items, flattenNestedGroups } = {}) {
  let processedGroups = groups;
  let processedItems = items;

  if (flattenNestedGroups) {
    const data = removeNestedGroups({ groups, items });
    processedGroups = data.groups;
    processedItems = data.items;
  }

  const visGroups = processedGroups.map(group => formatVisGroup({ group }));
  const visItems = processedItems.map(item => formatVisItem({ item }));

  return { groups: visGroups, items: visItems };
}

function getRelationships({ groups, items, addressBook } = {}) {
  // initialize with empty arrays;
  const relationships = {};
  groups.forEach(group => {
    relationships[group.id] = { nestedGroups: [], items: [] };
  })

  groups.forEach(group => {
    if (!group.parentId) return;
    relationships[group.parentId].nestedGroups.push(group.id);
  });

  items.forEach(item => {
    const address = getAddress(item);

    const groupId = addressBook[address];
    if (!groupId) {
      throw new Error(`Address ${address} not found for item ${item.title}`);
    }
    relationships[groupId].items.push(item.id);
  })

  return relationships;
}

function normalizeGroup({ group, relationships } = {}) {
  const normalized = normalize({ object: group });

  if (relationships) {
    const nestedGroups = relationships.nestedGroups;
    if (nestedGroups) normalized.nestedGroups = [...nestedGroups];

    const items = relationships.items;
    if (items) normalized.items = [...items];
  }

  return normalized;
}

function normalizeItem({ item, groupId } = {}) {
  const normalized = normalize({ object: item });

  normalized.start = new Date(normalized.start);

  if (normalized.end) {
    normalized.end = new Date(normalized.end);
  }

  normalized.group = groupId;


  return normalized;
}

function normalize({ object } = {}) {
  const normalized = { ...object };
  // copy arrays to avoid mutating raw data
  Object.keys(normalized).forEach(key => {
    if (Array.isArray(normalized[key])) {
      normalized[key] = [...normalized[key]];
    }
  });

  return normalized;
}

function getClasses(group) {
  const classes = []
  classes.push(...group.tags);
  classes.push(`groupId-${group.id}`);
  return classes.join(" ");
}

function getAddress(item) {
  const itemAddressElements = [slugify(item.person)];
  if (item.category) itemAddressElements.push(item.category)
  return itemAddressElements.join(".");
}

function formatVisItem({ item } = {}) {
  const { id, title, start, priority, type, group, person, category } = item;

  const visItem = {
    id, group, start, priority, type, person, category,
    content: title,
  };

  if (item.end) visItem.end = item.end;
  if (item.edtf) visItem.edtf = item.edtf;
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
  if (group.tags) visGroup.tags = [...group.tags];
  if (items) visGroup.items = [...group.items];
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
