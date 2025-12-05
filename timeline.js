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

// Get timeline data from data file and format it for vis-js
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
                render: true,
                // encode group id in a class Name
                className: `${rawGroup.tags.join(" ")} groupId-${groupId}`
            };

            if (rawGroup.type == "superGroup") {
                // Recursive call to get subgroup IDs
                group.nestedGroups = processGroups(rawGroup.contents);
            } else {
                // Process the items and push them to the global flat item list
                const processedItems = rawGroup.contents.map((item) => {
                    return {
                        id: nextItemId++,
                        group: group.id,
                        content: item.name,
                        description: item.description ? item.description : undefined,
                        start: new Date(item.start),
                        end: item.end ? new Date(item.end) : undefined,
                        type: item.displayMode ? item.displayMode : item.type
                    };
                });
                items.push(...processedItems);
            }

            // Push the fully processed group to the global flat list of groups
            console.log(group);
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
let groupsDataView = new vis.DataView(groups, {
    filter: (group) => group.render == true,
});

// Configuration for the Timeline
let options = {
    horizontalScroll: true,
    verticalScroll: false,
    zoomKey: "ctrlKey",
    min: "1880-01-01",
    max: "1990-01-01",
    start: "1930-01-01",
    end: "1940-12-31",
    groupOrder: "id",
    margin: {
        item: {
            horizontal: 0,
        },
    },
    tooltip: {
        template: (item) => item.description || item.content,
    },
};

// Create a Timeline
let timeline = new vis.Timeline(container, items, groupsDataView, options);

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

// Click subgroup names to show/hide items
container.addEventListener("click", function (event) {
    const labelSelector = ".vis-label:not(.vis-nesting-group)";
    const clickedLabel = event.target.closest(labelSelector);
    if (clickedLabel) {
        // Retrieve group ID from class list
        const groupId = Array.from(clickedLabel.classList)
            .find((className) => className.startsWith("groupId-"))
            .split("-")[1];

        toggleItemVisibility(Number(groupId));
    }
})

// Only display groups with items in range
timeline.on('rangechange', function (properties) {
    let groupsToUpdate = []
    const rangeStart = properties.start.valueOf();
    const rangeEnd = properties.end.valueOf();

    const itemsInRange = items.get({
        filter: (item => {
            const itemStart = item.start.valueOf();
            const itemEnd = item.end ? item.end.valueOf() : itemStart;

            return itemStart < rangeEnd && itemEnd > rangeStart
        })
    })

    const groupsInRange = new Set(itemsInRange.map(item => item.group));

    for (const group of groups.get({ filter: (group) => !group.nestedGroups })) {
        const render = groupsInRange.has(group.id)
        // Always display groups that are toggled off, so that the name remains
        if (hiddenItemsByGroupId[group.id]) {
            render = true;
        };

        if (render !== group.render) {
            groupsToUpdate.push({
                id: group.id,
                render: render
            })
        }
    }

    if (groupsToUpdate.length > 0) {
        groups.update(groupsToUpdate);
    }
});

