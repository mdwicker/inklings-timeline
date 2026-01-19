import { groups, items } from "./data/dataProcessor.js";
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

const updateRange = function (start, end) {
    const itemsInRange = items.get({
        filter: item => itemInRange(item, start, end)
    });

    groupsInRange = new Set(itemsInRange.map(item => item.group));

    // parent groups count as in range if their children are in range
    groups.get({
        filter: (group) => {
            return group.nestedGroups?.some((id) => groupsInRange.has(id));
        }
    })
        .forEach(group => groupsInRange.add(group.id));

    groupView.refresh();
};

function itemInRange(item, start, end) {
    const itemStart = item.start.valueOf();
    const itemEnd = item.end ? item.end.valueOf() : itemStart;
    return itemStart < end && itemEnd > start
}


const toggleGroup = function (id, forcedState = null) {
    const isOn = groupsToggledOn.has(id);

    if (isOn && forcedState !== true) {
        groupsToggledOn.delete(id);
    } else if (!isOn && forcedState !== false) {
        groupsToggledOn.add(id);
    }

    groupView.refresh();
};

const get = function () {
    return {
        inRange: [...groupsInRange],
        toggledOn: [...groupsToggledOn]
    };
};

export { itemView, groupView, updateRange, toggleGroup, get }

