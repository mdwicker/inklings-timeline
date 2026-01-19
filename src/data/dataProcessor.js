import rawGroups from './groups.json'
import rawItems from './items.json'
import { DataSet } from "vis-data/peer"

function validateData(rawGroups, rawItems) {
  // verify that all parentIds exist
  // verify that all item groups exist
  // verify that ids are sequential
  // verify that nested groups are sequential with parent group IDs
  // verify that edtf dates follow spec
}

const formattedData = ((rawGroups, rawItems) => {
  const groups = rawGroups.map(group => createVisGroup(group));
  addNestedGroups(groups);

  const items = []
  rawItems.forEach(rawItem => {
    const groupId = getIdFromAddress(rawItem.group);
    const item = createVisItem(rawItem, groupId);
    addLinkToParentGroup(item);
    items.push(item);
  });

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

  function createVisItem(item, groupId) {
    return {
      id: item.id,
      group: groupId,
      content: item.name,
      description: item.description,
      start: new Date(item.start),
      end: item.end ? new Date(item.end) : null,
      type: item.displayMode ? item.displayMode : item.type
    }
  }

  // convert human-readable group address into group id number
  function getIdFromAddress(address) {
    const group = rawGroups.find(group => group.address == address);
    if (!group) {
      throw new Error(`Group ${address} not found.`);
    }

    return group.id
  }

  // Look up an item's parent group and add a link to the item in it
  function addLinkToParentGroup(item) {
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

export const groups = new DataSet(formattedData.groups);
export const items = new DataSet(formattedData.items);
