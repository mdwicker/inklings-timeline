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

import edtf, { parse } from "edtf";
import { slugify } from "./utils.js";

/**
 * Constants for data formatting
 */
const backgroundCategories = ["location", "occupation"];
const categoryPrefixes = {
  "location": "🏠",
  "occupation": "🎓"
};


/** 
 * Subgroup sorting parameters for visifying groups
*/
const subgroupStack = { "normal": true };
for (const category of backgroundCategories) {
  subgroupStack[category] = true;
}

const subgroupOrdering = { "normal": 0 };
let priority = 1
// reverse the array so that the first items in the array are on top
for (const category of backgroundCategories.toReversed()) {
  subgroupOrdering[category] = priority;
  priority++;
}

const subgroupOrder = function (a, b) {
  return subgroupOrdering[a.subgroup] - subgroupOrdering[b.subgroup];
};


// Returns a list of all issues found in the data
function validateData({ groups = [], items = [] } = {}) {
  const issues = [];

  const groupIds = new Set();
  const itemIds = new Set();

  for (const group of groups) {
    issues.push(...validateGroup(group));

    if ("id" in group) {
      if (groupIds.has(group.id)) {
        issues.push(`Group id '${group.id}' used twice:\n${JSON.stringify(group)}`);
      } else {
        groupIds.add(group.id);
      }
    }
  }

  for (const item of items) {
    issues.push(...validateItem(item));

    if (("id" in item)) {
      if (itemIds.has(item.id)) {
        issues.push(`Item id '${item.id}' used twice:\n${JSON.stringify(item)}`);
      } else {
        itemIds.add(item.id);
      }
    }

    if (("group" in item) && !groupIds.has(item.group)) {
      issues.push(`Group id '${item.group}' does not exist:\n${JSON.stringify(item)}`);
    }
  }

  return issues;
}

// Returns a list of issues found in the group
function validateGroup(group) {
  const requiredFields = ['id', 'name'];
  const issues = [];

  for (const field of requiredFields) {
    if (!(field in group)) {
      issues.push(`Missing '${field}':\n${JSON.stringify(group)}`);
    }
  }

  if ('id' in group && !isValidId(group.id)) {
    issues.push(`Id must be positive integer:\n${JSON.stringify(group)}`);
  }

  return issues;
}

// Returns a list of issues found in the item
function validateItem(item) {
  const requiredFields = ['id', 'group', 'name', 'priority'];
  const dateFields = ['start', 'end', 'edtf'];
  const priorityMin = 0;
  const priorityMax = 4;

  const issues = [];


  for (const field of requiredFields) {
    if (!(field in item)) {
      issues.push(`Missing '${field}':\n${JSON.stringify(item)}`)
    }
  }

  if ('id' in item && !isValidId(item.id)) {
    issues.push(`Id must be positive integer:\n${JSON.stringify(item)}`);
  }

  // Must contain some valid date information
  if (!('edtf' in item) && !('start' in item)) {
    issues.push(`No date field:\n${JSON.stringify(item)}`);
  }

  // check for valid date fields
  for (const field of dateFields) {
    if (!(field in item)) continue;
    try {
      const parsed = parse(item[field]);

      // unless it's an edtf date, it should contain exactly a year, month, and day
      if (field !== 'edtf' && parsed.values.length !== 3) {
        issues.push(`Invalid '${field}' date:\n${JSON.stringify(item)}`);
      }
    } catch {
      issues.push(`Invalid '${field}' date:\n${JSON.stringify(item)}`);
    }
  }

  // check that the priority field contains an integer in range
  if (
    'priority' in item &&
    (isNaN(Number(item.priority)) ||
      !Number.isInteger(Number(item.priority)) ||
      item.priority < priorityMin ||
      item.priority > priorityMax)
  ) {
    issues.push(`Priority must be int ${priorityMin}-${priorityMax}:\n${JSON.stringify(item)}`);
  }

  return issues;
}

function isValidId(id) {
  if (isNaN(Number(id))) {
    return false;
  }

  if (!Number.isInteger(Number(id))) {
    return false;
  }

  if (Number(id) <= 0) {
    return false;
  }

  return true;
}

// Returns an item formatted for use with visTimeline
function visifyItem(item) {
  // create a shallow copy to ensure no unexpected mutation of the raw data
  item = { ...item };

  item.id = Number(item.id);

  if ("category" in item && item.category in categoryPrefixes) {
    item.content = categoryPrefixes[item.category];
  } else {
    item.content = "";
  }
  item.content += item.name;
  delete item.name;

  if ("category" in item && backgroundCategories.includes(item.category)) {
    item.subgroup = item.category;
    item.className = "background";
    item.isBackground = true;
  } else {
    item.subgroup = "normal";
    item.isBackground = false;
  }

  item.start = new Date(item.start);
  if ("edtf" in item) item.edtf = edtf(item.edtf);
  if ("end" in item) item.end = new Date(item.end);

  item.type = item.end ? "range" : "point";

  return item;
}

// Returns a group formatted for use with visTimeline
function visifyGroup(group) {
  // create a shallow copy to ensure no unexpected mutation of the raw data
  group = { ...group };

  group.id = Number(group.id);

  group.content = group.name;
  group.className = slugify(group.name);
  delete group.name;

  group.subgroupOrder = subgroupOrder;
  group.subgroupStack = subgroupStack;

  return group;
}

export {
  validateData, validateItem, validateGroup,
  visifyItem, visifyGroup
}
