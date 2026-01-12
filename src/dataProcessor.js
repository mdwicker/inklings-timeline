import data from './data.json'

let groupId = 1;
let itemId = 1;

let groups = [];
let items = [];

(function formatGroups(groupsData, parentId = null) {
    const groupIds = [];
    for (const groupData of groupsData) {
        const newGroupId = groupId++;
        const group = {
            id: newGroupId,
            content: groupData.name,
            parent: parentId,
            isToggledOn: true,
            isInRange: true,
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

        } else if ("nestedGroups" in groupData) {
            group.nestedGroups = formatGroups(groupData.nestedGroups, group.id);
        } else {
            console.log(`Recursion error with group ${groupData}.`);
        }
        groups.push(group);
        groupIds.push(group.id);
    }
    return groupIds;
})(data.data);

export { groups, items }
