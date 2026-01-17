import rawData from './rawData.json'
import { DataSet } from "vis-data/peer"

const formattedData = (function (allGroups) {
  let groupId = 1;
  let itemId = 1;

  const groups = [];
  const items = [];

  (function formatGroups(groupsData, parentId = null) {
    const groupIds = [];

    for (const groupData of groupsData) {
      const newGroupId = groupId++;
      const group = {
        id: newGroupId,
        content: groupData.name,
        parent: parentId,
        className: groupData.tags.join(" ") + ` groupId-${newGroupId}`,
      }
      if ("items" in groupData) {
        const itemIds = [];
        for (const itemData of groupData.items) {
          const newItemId = itemId++;
          const item = {
            id: newItemId,
            group: group.id,
            content: itemData.name,
            description: itemData.description,
            start: new Date(itemData.start),
            end: itemData.end ? new Date(itemData.end) : null,
            type: itemData.displayMode ? itemData.displayMode : itemData.type
          }
          itemIds.push(item.id);
          items.push(item);
        }
        group.items = itemIds;
      } else if ("nestedGroups" in groupData) {
        group.nestedGroups = formatGroups(groupData.nestedGroups, group.id);
      } else {
        console.log(`Recursion error with group ${groupData}.`);
      }
      groups.push(group);
      groupIds.push(group.id);
    }
    return groupIds;
  })(allGroups);

  return { groups, items };
})(rawData.data);

const flattenedData = function () {
  const allGroups = rawData.data;
  let groupId = 1;
  let itemId = 1;

  const groups = [];
  const items = [];
  const groupFields = [];
  const itemFields = [];

  (function formatGroups(groupsData, parentId = null) {
    const groupIds = [];

    for (const group of groupsData) {
      const newGroupId = groupId++;
      group.id = newGroupId;
      if (parentId) {
        group.parentId = parentId;
      }
      groupFields.push(...Object.keys(group));
      if ("items" in group) {
        const itemIds = [];
        for (const item of group.items) {
          const newItemId = itemId++;
          item.id = newItemId;
          item.group = group.id;
          itemFields.push(...Object.keys(item));
          itemIds.push(item.id);
          items.push(item);
        }
        group.items = itemIds;
      } else if ("nestedGroups" in group) {
        group.nestedGroups = formatGroups(group.nestedGroups, group.id);
      } else {
        console.log(`Recursion error with group ${group}.`);
      }
      groups.push(group);
      groupIds.push(group.id);
    }
    return groupIds;
  })(allGroups);

  groups.fields = [...new Set(groupFields)];
  items.fields = [...new Set(itemFields)];

  return { groups, items };
};

// window.flattenedData = flattenedData;

export const groups = new DataSet(formattedData.groups);
export const items = new DataSet(formattedData.items);
