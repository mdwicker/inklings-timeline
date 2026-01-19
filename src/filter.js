import { groups, items } from "./data/dataProcessor.js";
import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";

const groupIds = groups.get().map(group => group.id);
const itemIds = items.get().map(item => item.id);

const itemView = new DataView(items);

// Start with all groups displayed by default
let groupsInRange = new Set(groupIds);
let groupsToggledOn = new Set(groupIds);

const groupView = new DataView(groups, {
    filter: (group) => {
        // Groups with parents should only display if parent is toggled on
        if (group.parent && !groupsToggledOn.has(group.parent)) {
            return false;
        }
        return groupsToggledOn.has(group.id) && groupsInRange.has(group.id);
    }
});

function updateGroupsInRange(start, end) {
    const newInRange = getGroupsInRange(start, end);

    const left = groupsInRange.difference(newInRange);
    const entered = newInRange.difference(groupsInRange);

    if (left || entered) {
        pubSub.publish(events.groupRangeChange, { left, entered });
    }

    groupsInRange = newInRange;

    function getGroupsInRange(start, end) {
        const itemsInRange = itemView.get({
            filter: item => itemInRange(item, start, end)
        });

        let inRange = new Set(itemsInRange.map(item => item.group));

        // parents count as in range if their children are in range
        const parentsInRange = groups.get({
            filter: (group) => group.nestedGroups?.some((id) => inRange.has(id))
        });
        parentsInRange.forEach(group => inRange.add(group.id));

        return inRange;
    }

    function itemInRange(item, start, end) {
        const itemStart = item.start.valueOf();
        const itemEnd = item.end ? item.end.valueOf() : itemStart;
        return itemStart < end && itemEnd > start
    }
}

function toggleGroup(id, toggleStatus) {
    const isOn = groupsToggledOn.has(id);

    if (isOn && !toggleStatus) {
        groupsToggledOn.delete(id);
    } else if (!isOn && toggleStatus) {
        groupsToggledOn.add(id);
    }

    pubSub.publish(events.toggleGroup, { id, toggleStatus })
}

pubSub.subscribe(events.rangeChange, (range) => {
    updateGroupsInRange(range.start, range.end);
    groupView.refresh();
})

pubSub.subscribe(events.requestGroupToggle, (e) => {
    toggleGroup(e.id, e.toggleStatus);
    groupView.refresh();
});

export { itemView, groupView }

