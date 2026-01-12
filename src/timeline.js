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

import * as data from "./dataProcessor.js"
// import { Timeline, DataSet, DataView } from "./node_modules/vis-timeline/standalone"

/* =====================
 *  Definitions
 * ===================== */

// Create visibility toggle controls and add them to the DOM
function createVisibilityControls(groups) {
    const groupList = document.querySelector(".visibility-controls .group-list");
    groupList.innerHTML = '';

    // skip nested groups, they will be added by their parent group
    groups.get({
        filter: (group) => !group.parent
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
                const subGroupName = `${groupName}-${subGroup.content.toLowerCase().replace(" ", "-")}`;

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

// Toggle visibility of timeline items belonging to a given group
function toggleGroupVisibility(groupId, toggleStatus) {
    groups.update({ id: groupId, isToggledOn: toggleStatus });

    const nestedGroups = groups.get(groupId).nestedGroups;
    if (nestedGroups) {
        for (const subGroupId of nestedGroups) {
            const checkboxSelector =
                `input[type='checkbox'][data-group-id='${subGroupId}']`;
            document.querySelector(checkboxSelector).disabled = !toggleStatus;
            const label = document.querySelector(`${checkboxSelector} + label`);
            label.classList.toggle("parent-toggled-off", !toggleStatus);
        }
    }
    groupsView.refresh();
}

// Update visible groups with only groups currently in range
function updateGroupsInRange(rangeStart, rangeEnd) {
    const groupsToUpdate = []

    const itemsInRange = items.get({
        filter: (item) => {
            const itemStart = item.start.valueOf();
            // Point items should use the same value for start and end
            const itemEnd = item.end ? item.end.valueOf() : itemStart;

            return itemStart < rangeEnd && itemEnd > rangeStart
        }
    })

    let groupsInRange = new Set(itemsInRange.map(item => item.group));

    // parent groups count as in range if their children are in range
    groups.get({
        filter: (group) => {
            return (
                group.nestedGroups?.some((id) => groupsInRange.has(id))
            );
        }
    })
        .map(group => group.id)
        .forEach(id => groupsInRange.add(id));


    groups.forEach((group) => {
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
            if (label) {
                label.classList.toggle("out-of-range", !isInRange);
            }
        }
    });

    if (groupsToUpdate.length > 0) {
        groups.update(groupsToUpdate);
    }
}

function toggleVisibilityControls(isOpen) {
    // display (or undisplay)
    // change icon
}


/* =====================
 *  State creation
 * ===================== */


// DOM element where the Timeline will be attached
const container = document.getElementById("visualization");

const groups = new DataSet(data.groups);
const items = new DataSet(data.items);
const groupsView = new DataView(groups, {
    filter: (group) => {
        // Groups with parents should only display if parent is toggled on
        if (group.parent && !groups.get(group.parent).isToggledOn) {
            return false;
        }
        return group.isToggledOn && group.isInRange;
    },
});

// Configuration for the Timeline
const options = {
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
const timeline = new Timeline(container, items, groupsView, options);

/* =====================
 *  Initial render
 * ===================== */

// Create visibility toggles
createVisibilityControls(groups);


/* =====================
 *  Event wiring
 * ===================== */

// add Event Listeners to visibility toggles
const visibilityControls = document.querySelectorAll(".group-list-item input[type='checkbox']");
visibilityControls.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        toggleGroupVisibility(Number(checkbox.dataset.groupId), checkbox.checked);
    })
});

// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
    updateGroupsInRange(
        properties.start.valueOf(), properties.end.valueOf()
    );
});

// Toggle visibility controls collapse state
document.querySelector("button.controls-toggle")
    .addEventListener("click", function (e) {
        const button = e.target;
        const controls = document.querySelector(".visibility-controls .group-list");

        const expanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", !expanded);
        controls.classList.toggle("hidden", expanded);
    });
