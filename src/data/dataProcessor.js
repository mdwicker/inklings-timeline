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

import rawGroups from './groups.json'
import rawItems from './items.json'
import { DataSet } from "vis-data/peer"

const ignoreSubGroups = true;

function validateData(rawGroups, rawItems) {
  // verify that all parentIds exist
  // verify that all item groups exist
  // verify that ids are sequential
  // verify that nested groups are sequential with parent group IDs
  // verify that edtf dates follow spec
}

function sortItems(a, b) {
  if (a.priority < b.priority) {
    return -1;
  } else if (a.priority > b.priority) {
    return 1;
  }

  // more sort logic. alphabetical for now
  return a.content > b.content;
}

const formattedData = ((rawGroups, rawItems) => {
  let groups;
  if (ignoreSubGroups) {
    groups = rawGroups.filter(group => !group.parentId).map(group => createVisGroup(group));
  } else {
    groups = rawGroups.map(group => createVisGroup(group));
    addNestedGroups(groups);
  }

  const items = []
  rawItems.forEach(rawItem => {
    const groupId = getIdFromAddress(rawItem.group);
    const item = createVisItem(rawItem, groupId);
    addLinkInParentGroup(item);
    items.push(item);
  });

  // find all subgroups and add links to them in their parent group
  function addNestedGroups(groups) {
    groups.filter(group => group.parent).forEach(subgroup => {
      const parent = groups.find(group => group.id == subgroup.parent);
      if (!parent) {
        throw new Error(`Parent group ${subgroup.parent} not found for ${subgroup.name}.`);
      }

      if (!parent.nestedGroups) parent.nestedGroups = [];
      parent.nestedGroups.push(subgroup.id);
    });
  }

  function getClasses(group) {
    const classes = []
    classes.push(...group.tags);
    classes.push(`groupId-${group.id}`);
    return classes.join(" ");
  }

  function createVisGroup(group) {
    const visGroup = {
      id: group.id,
      content: group.name,
      className: getClasses(group),
    };

    if (group.parentId) visGroup.parent = group.parentId;

    return visGroup;
  }

  function createVisItem(item, groupId) {
    const groupTags = item.group.split(".");
    let person = groupTags[0];
    let category;
    if (groupTags.length === 2) {
      category = groupTags[1];
    }
    const visItem = {
      id: item.id,
      group: groupId,
      content: item.name,
      person, category,
      description: item.description,
      start: new Date(item.start),
      end: item.end ? new Date(item.end) : null,
      priority: item.priority,
      type: item.displayMode ? item.displayMode : item.type,
    }
    return visItem;
  }

  // convert human-readable group address into group id number
  function getIdFromAddress(address) {
    address = ignoreSubGroups ? address.split(".")[0] : address;

    const group = rawGroups.find(group => group.address == address);
    if (!group) {
      throw new Error(`Group ${address} not found.`);
    }

    return group.id
  }

  // Look up an item's parent group and add a link to the item in it
  function addLinkInParentGroup(item) {
    const group = groups.find(group => group.id == item.group);
    if (!group) {
      throw new Error(`Group ${item.group} not found for item ${item.id}`);
    }
    if (!group.items) group.items = [];
    group.items.push(item.id);
  }

  return {
    groups: groups.sort((a, b) => a.id - b.id),
    items: items.sort((a, b) => a.id - b.id)
  };
})(rawGroups, rawItems);

const groups = new DataSet(formattedData.groups);
const items = new DataSet(formattedData.items);

const prioritizedItems = items.get({ order: sortItems });

export { groups, items, prioritizedItems }
