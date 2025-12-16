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

/**
 * Get timeline data from data file and format it for vis-js
 */
function processData(rawGroups) {
    // store these globally to allow flat sequential ordering
    let nextGroupId = 1;
    let nextItemId = 1;

    // flat arrays of all groups and items
    let groups = [];
    let items = [];

    function processGroups(currentGroups, parentId) {
        // for nested groups to store Ids to pass to parent group
        let groupIds = [];

        for (const rawGroup of currentGroups) {
            const groupId = nextGroupId++;
            let group = {
                id: groupId,
                content: rawGroup.name,
                isToggledOn: true,
                isInRange: true,
                parentId: parentId,
                // encode group id in a class Name
                className: `${rawGroup.tags.join(" ")} groupId-${groupId}`
            };
            if (rawGroup.type == "superGroup") {
                // Recursive call to get subgroup IDs
                group.nestedGroups = processGroups(rawGroup.contents, groupId);
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
            groups.push(group);
            groupIds.push(group.id);
        }

        // Return the IDs of the groups processed at this level
        return groupIds;
    }

    // parent id starts out as null, since top level items have no parent
    processGroups(rawGroups, null);

    return {
        groups: groups,
        items: items,
    };
}

/**
 * Create visibility toggle controls and add them to the DOM
 */
function createVisibilityControls(groups) {
    const groupList = document.querySelector(".visibility-controls .group-list");
    groupList.innerHTML = '';

    // skip nested groups, they will be added by their parent group
    groups.get({
        filter: (group) => !group.parentId
    }).forEach(group => {
        const groupName = group.content.toLowerCase().replace(" ", "-");

        // all groups at this level of the loop are top-level items
        let groupNode = document.createElement("li");
        groupNode.classList.add("group-list-item", "top-level");
        groupNode.innerHTML = `
            <input type="checkbox"
                   id="${groupName}-toggle"
                   data-group-id="${group.id}"
                   checked>
            <label for="${groupName}-toggle">${group.content}</label>
        `;

        if (group.nestedGroups) {
            let subGroupList = document.createElement("ul");
            subGroupList.classList.add("sub-group-list");

            for (const subGroupId of group.nestedGroups) {
                const subGroup = groups.get(subGroupId);
                const subGroupName = `
                    ${groupName}-${subGroup.content.toLowerCase().replace(" ", "-")}
                `;

                // all groups at this level are sub-groups
                let subGroupNode = document.createElement("li");
                subGroupNode.classList.add("group-list-item", "sub-item");
                subGroupNode.innerHTML = `
                    <input type="checkbox"
                           id="${subGroupName}-toggle"
                           data-group-id="${subGroup.id}"
                           checked>
                    <label for="${subGroupName}-toggle">${subGroup.content}</label>
                `;
                subGroupList.appendChild(subGroupNode);
            }
            groupNode.appendChild(subGroupList);
        }
        groupList.appendChild(groupNode);
    });
}

/**
 * Toggle visibility of timeline items belonging to a given group
 */
function toggleGroupVisibility(groupId, toggleStatus) {
    groups.update({ id: groupId, isToggledOn: toggleStatus });

    const nestedGroups = groups.get(groupId).nestedGroups;
    if (nestedGroups) {
        for (const subGroupId of nestedGroups) {
            const checkboxSelector = `
                input[type='checkbox'][data-group-id='${subGroupId}']
            `;
            checkbox = document.querySelector(checkboxSelector);
            checkbox.disabled = !toggleStatus;
            label = document.querySelector(`${checkboxSelector} + label`);
            label.classList.toggle("parent-toggled-off", !toggleStatus);
        }
    }
    groupsView.refresh();
}


// DOM element where the Timeline will be attached
const container = document.getElementById("visualization");

const timelineData = processData(rawData);
const groups = new vis.DataSet(timelineData.groups);
const items = new vis.DataSet(timelineData.items);


let groupsView = new vis.DataView(groups, {
    filter: (group) => {
        // Groups with parents should only display if parent is toggled on
        if (group.parentId && !groups.get(group.parentId).isToggledOn) {
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

// Create visibility toggles
createVisibilityControls(groups);

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
                isInRange: isInRange
            });

            // Update visibility controls to indicate out of range
            const label = document.querySelector(
                `input[type='checkbox'][data-group-id='${group.id}'] + label`
            );
            label.classList.toggle("out-of-range", !isInRange);
            console.log(label);
        }
    }

    if (groupsToUpdate.length > 0) {
        groups.update(groupsToUpdate);
    }
});
