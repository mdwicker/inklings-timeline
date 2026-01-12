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

import "./styles.css";
import "./vis-timeline-graph2d.min.css";
import * as data from "./dataProcessor.js";

import { Timeline } from "vis-timeline/peer"
import { DataSet, DataView } from "vis-data/peer"

/* =====================
 *  Definitions
 * ===================== */

// Create visibility toggle controls and add them to the DOM


function createVisibilityControls(groups) {
    function createGroupNode(group) {
        const node = document.createElement("li");
        const name = group.content
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        node.classList.add("group-list-item");
        if (!group.parent) {
            node.classList.add("top-level")
        } else {
            node.classList.add("subgroup")
        }

        const checkbox = createVisibilityCheckbox(name, group.id);

        const label = document.createElement("label");
        label.setAttribute("for", name);
        label.textContent = group.content;
        node.append(checkbox, label);

        return node;
    }

    function createVisibilityCheckbox(groupName, groupId) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = groupName;
        checkbox.dataset.groupId = groupId;
        checkbox.checked = true;

        return checkbox;
    }

    const groupList = document.querySelector(".visibility-controls .group-list");

    // Create nodes
    groups.get({ filter: (group) => !group.parent })
        .forEach((group) => {
            const node = createGroupNode(group);

            if (group.nestedGroups) {
                const nestedList = document.createElement("ul");
                nestedList.classList.add("subgroup-list");
                for (const id of group.nestedGroups) {
                    nestedList.append(createGroupNode(groups.get(id)));
                }
                node.append(nestedList);
            }

            groupList.append(node);
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
