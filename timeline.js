/**
 * TO-DO
 * Implement visualization of timeline width (or maybe scrollbar....)
 * scrolling vertical AND horizontal.
 * better color coding
 * labels for small ranges?
 * add icon to represent group visibility
 * add Inklings data
 * 
 * EVENTUALLY:
 * add zoom level detail adjustment (Google Maps style)
 * Full Detail mode
 * Scaling mode
 * Maybe Summary mode?
 * make line disappear when nothing's visible in it.
 * 
 * random note: if it gets too laggy change rangechange to rangechanged
 */


// Get timeline data from data file
function processData(rawGroups) {
    // store these globally to allow flat sequential ordering
    let nextGroupId = 1;
    let nextItemId = 1;

    // flat arrays of all groups and items
    let groups = [];
    let items = [];

    function processGroups(currentGroups) {
        let groupIds = [];

        for (const rawGroup of currentGroups) {
            const groupId = nextGroupId++;
            let group = {
                id: groupId,
                content: rawGroup.name,
                // encode group id in a class Name
                className: rawGroup.className + " groupId-" + groupId
            };

            if (rawGroup.hasSubgroups) {
                // Recursive call to get subgroup IDs
                group.nestedGroups = processGroups(rawGroup.contents);
            } else {
                // Process the items and push them to the global flat item list
                const processedItems = rawGroup.contents.map((item) => {
                    return {
                        ...item,
                        id: nextItemId++,
                        group: group.id,
                    };
                });
                group.className += " subgroup";
                items.push(...processedItems);
            }

            // Push the fully processed group to the global flat list of groups
            groups.push(group);
            groupIds.push(group.id);
        }

        // Return the IDs of the groups processed at this level
        return groupIds;
    }

    processGroups(rawGroups);

    return {
        groups: groups,
        items: items,
    };
}

// DOM element where the Timeline will be attached
let container = document.getElementById("visualization");

// Dict to temporarily store hidden timeline items
let hiddenItemsByGroupId = {};

const timelineData = processData(rawData);

let groups = new vis.DataSet(timelineData.groups);
let items = new vis.DataSet(timelineData.items);

// toggle visibility of timeline items belonging to a given group
function toggleItemVisibility(groupId) {
    // check if items are already hidden
    if (hiddenItemsByGroupId[groupId]) {
        // put the items back on the timeline
        items.add(hiddenItemsByGroupId[groupId]);
        // remove them from the cache of hidden items
        delete hiddenItemsByGroupId[groupId];
    } else {
        // Retreive the items to be hidden
        const itemsToHide = items.get({
            filter: function (item) {
                return (item.group == groupId);
            }
        });

        // Do not proceed if no items were found
        if (itemsToHide.length > 0) {
            // cache the items to be hidden
            hiddenItemsByGroupId[groupId] = itemsToHide;
            // remove the items from the timeline
            items.remove(itemsToHide.map((item) => item.id));
        }
    }
}

// Configuration for the Timeline
let options = {
    horizontalScroll: true,
    verticalScroll: false,
    zoomKey: "ctrlKey",
    min: "1880-01-01",
    max: "1990-01-01",
    start: "1925-01-01",
    end: "1960-12-31",
    margin: {
        item: {
            horizontal: 0,
        },
    },
    tooltip: {
        template: function (item) {
            if (!("name" in item)) {
                return item.content;
            } else {
                return item.name;
            }
        },
    },
};

// Create a Timeline
let timeline = new vis.Timeline(container, items, groups, options);

// Click subgroup names to show/hide items
container.addEventListener("click", function (event) {
    const labelSelector = ".vis-label:not(.vis-nesting-group)";
    const clickedLabel = event.target.closest(labelSelector);
    if (clickedLabel) {
        // Retrieve group ID from class list
        const groupId = Array.from(clickedLabel.classList)
            .find((className) => className.startsWith("groupId-"))
            .split("-")[1];

        toggleItemVisibility(groupId);
    }
})

timeline.on('rangechanged', function (properties) {
    const subgroupSelector = ".vis-itemset .vis-foreground .vis-group.subgroup"
    document.querySelectorAll(subgroupSelector).forEach(subgroup => {
        const groupId = Array.from(subgroup.classList)
            .find((className) => className.startsWith("groupId-"))
            .split("-")[1];
        const hidden = subgroup.classList.contains("hidden");
        const empty = subgroup.childElementCount == 0;

        if (hidden && !empty) {
            const toShow = document.querySelectorAll(`.groupId-${groupId}`);
            toShow.forEach(element => { element.classList.remove("hidden") });
        } else if (empty && !hidden && !hiddenItemsByGroupId[groupId]) {
            const toHide = document.querySelectorAll(`.groupId-${groupId}`);
            toHide.forEach(element => { element.classList.add("hidden") });
        }
    });
});
// Check each visible group for visible items. If none, hide.
// For now, ONLY if it doesn't have hidden items.
// Check each hidden group for visible items. If so, unhide.
