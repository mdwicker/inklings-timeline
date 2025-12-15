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
                isToggledOn: true,
                isInRange: true,
                // encode group id in a class Name
                className: `${rawGroup.tags.join(" ")} groupId-${groupId}`
            };

            if (rawGroup.type == "superGroup") {
                // Recursive call to get subgroup IDs
                group.nestedGroups = processGroups(rawGroup.contents);
            } else {
                group.isParentVisible = true;
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
const container = document.getElementById("visualization");

const timelineData = processData(rawData);
const groups = new vis.DataSet(timelineData.groups);
const items = new vis.DataSet(timelineData.items);

let groupsView = new vis.DataView(groups, {
    filter: (group) => {
        // Groups w/o parents will evaluate as undefined and skip this check
        if (group.isParentVisible === false) {
            return false;
        }
        return group.isToggledOn && group.isInRange;
    },
});

// Configuration for the Timeline
let options = {
    horizontalScroll: true,
    verticalScroll: false,
    zoomKey: "ctrlKey",
    min: "1880-01-01",
    max: "2000-01-01",
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
let timeline = new vis.Timeline(container, items, groupsView, options);

// toggle visibility of timeline items belonging to a given group
function toggleGroupVisibility(groupId, toggleStatus) {
    groups.update({ id: groupId, isToggledOn: toggleStatus });

    const nestedGroups = groups.get(groupId).nestedGroups;
    if (nestedGroups) {
        // update visibility of all subgroups
        for (const subGroupId of nestedGroups) {
            groups.update({
                id: subGroupId,
                isParentVisible: toggleStatus
            })
        }
    }
}

// Toggle visbility of groups using checkbox controls
const visibilityControls = document.querySelectorAll(".group-list-item input[type='checkbox']");
visibilityControls.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        toggleGroupVisibility(Number(checkbox.dataset.groupId), checkbox.checked);
    })
});

// Only display groups with items in range
timeline.on('rangechange', function (properties) {
    let groupsToUpdate = []
    const rangeStart = properties.start.valueOf();
    const rangeEnd = properties.end.valueOf();

    const itemsInRange = items.get({
        filter: (item => {
            const itemStart = item.start.valueOf();
            // Point items should use the same value for start and end
            const itemEnd = item.end ? item.end.valueOf() : itemStart;

            return itemStart < rangeEnd && itemEnd > rangeStart
        })
    })

    let groupsInRange = new Set(itemsInRange.map(item => item.group));

    // parent groups count as in range if their children are in range
    groups.get({
        filter: (group) => {
            return (
                group.nestedGroups &&
                group.nestedGroups.some((id) => groupsInRange.has(id))
            );
        }
    })
        .map(group => group.id)
        .forEach(id => groupsInRange.add(id));

    for (const group of groups.get()) {
        const isInRange = groupsInRange.has(group.id);

        if (isInRange !== group.isInRange) {
            groupsToUpdate.push({
                id: group.id,
                render: render
            });
        }
    }

    if (groupsToUpdate.length > 0) {
        groups.update(groupsToUpdate);
    }
});

/**
 * Desired functionality: Clicking on parent group collapses it. Clicking
 * on other groups EITHER does what it currently does (which is frankly
 * unnecessary at this point) OR does nothing. More likely, all group filtering
 * happens via the controls at the top. When you uncheck the box, the group
 * (and any subGroups) are un-rendered. We might need a way to store the current
 * state, tbh. Maybe more options than just "render"? Because from my perspective,
 * we have a few options. Or rather, there are three different toggles.
 * 1. Hidden b/c it has been unchecked up top
 * 2. Hidden b/c no items in range (checkbox should be disabled)
 * 3. Hidden b/c the parent group has been collapsed. (checkbox should be disabled)
 * 4. Hidden b/c parent group has been unchecked (checkbox should be disabled)
 * In all cases except 1, we need to save the status of the checkbox so that we can
 * display properly when unhidden. so maybe we need to save the states?
 * isEnabled
 * isInRange
 * parentEnabled
 */