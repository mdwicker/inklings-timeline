import rawGroups from './data/groups.json'
import rawItems from './data/items.json'
import { DataSet } from "vis-data/peer"

function validateData(rawGroups, rawItems) {
  // verify that all parentIds exist
  // verify that all item groups exist
  // verify that ids are sequential
  // verify that nested groups are sequential with parent group IDs
  // verify that edtf dates follow spec
}

function getClasses(group) {
  const classes = []
  classes.push(...group.tags);
  classes.push(`groupId-${group.id}`);
  return classes.join(" ");
}

const formattedData = ((rawGroups, rawItems) => {
  const groups = []
  const items = []

  groups.push(
    ...rawGroups.filter(group => !group.parentId)
      .map((group) => {
        return {
          id: group.id,
          content: group.name,
          className: getClasses(group)
        }
      })
  )

  for (const group of rawGroups.filter(group => group.parentId)) {
    const parent = groups.find(parent => parent.id == group.parentId);
    if (!parent) {
      throw new Error(`Parent group ${group.parentId} not found for subgroup ${group.name}.`);
    }

    if (!parent.nestedGroups) parent.nestedGroups = [];
    parent.nestedGroups.push(group.id);

    groups.push(
      {
        id: group.id,
        parent: group.parentId,
        content: group.name,
        className: getClasses(group)
      }
    )
  }

  for (const item of rawItems) {
    const group = rawGroups.find(group => group.address === item.group);
    if (!group) {
      throw new Error(`Group address ${item.group} not found for item ${item.id}`);
    }

    if (!group.items) group.items = [];
    group.items.push(item.id);

    items.push(
      {
        id: item.id,
        group: group.id,
        content: item.name,
        description: item.description,
        start: new Date(item.start),
        end: item.end ? new Date(item.end) : null,
        type: item.displayMode ? item.displayMode : item.type
      }
    );
  }

  return {
    groups: groups.sort((a, b) => a.id - b.id),
    items: items.sort((a, b) => a.id - b.id)
  };
})(rawGroups, rawItems);

export const groups = new DataSet(formattedData.groups);
export const items = new DataSet(formattedData.items);
