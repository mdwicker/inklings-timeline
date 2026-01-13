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
 *  Application Logic
 * ===================== */

// Toggle visibility of a group and refresh views
function toggleGroupVisibility(groupId, toggleStatus) {
    groups.updateOnly({ id: groupId, isToggledOn: toggleStatus });
    groupsView.refresh();
    VisibilityToggles.updateNestedGroups(groupId);
}


// Update which groups are considered in range
function updateGroupsInRange(currentGroups, rangeStart, rangeEnd) {
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

    const groupsToUpdate = groupsInRange.symmetricDifference(
        new Set(currentGroups.map((group) => group.id))
    );

    groupsToUpdate.forEach((id) => {
        groups.updateOnly({ id, isInRange: groupsInRange.has(id) });
    });
}



/* =====================
 *  UI Factories
 * ===================== */

function createVisibilityToggles(groups) {
    const groupList = document.querySelector(".visibility-toggles .group-list");
    const toggles = {}

    function createGroupNode(group) {
        const node = document.createElement("li");
        const name = group.content
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        node.classList.add("group-list-item");
        node.classList.add(group.parent ? "subgroup" : "top-level");

        toggles[group.id] = {};
        node.append(
            createCheckbox(name, group.id),
            createLabel(name, group.content, group.id)
        );

        return node;
    }

    function createCheckbox(name, id) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = name;
        checkbox.dataset.groupId = id;
        checkbox.checked = true;

        toggles[id].checkbox = checkbox;
        return checkbox;
    }

    function createLabel(name, content, id) {
        const label = document.createElement("label");
        label.setAttribute("for", name);
        label.textContent = content;

        toggles[id].label = label;
        return label;
    }

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

    // Control visibility toggles collapse state
    document.querySelector("button.collapse-toggles")
        .addEventListener("click", function (e) {
            const button = e.target;
            const expanded = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", !expanded);
            groupList.classList.toggle("hidden", expanded);
        });

    let onToggle = null;

    groupList.addEventListener("change", e => {
        if (!e.target.matches("input[type='checkbox']")) return;
        if (!onToggle) return;

        const id = Number(e.target.dataset.groupId);
        if (!id) return;

        onToggle(id, e.target.checked);
    })

    const updateNestedGroups = function (parentId) {
        const parent = groups.get(parentId);
        const parentOn = parent.isToggledOn
        const nested = parent.nestedGroups;

        if (!parent || !nested) return;

        for (const id of nested) {
            const toggle = toggles[id];
            if (!toggle) return;

            toggle.checkbox.disabled = !parentOn;
            toggle.label.classList.toggle("parent-toggled-off", !parentOn);
        }
    }

    const updateInRange = function (id, isInRange) {
        toggles[id].label.classList.toggle("out-of-range", !isInRange);
    }

    const setToggleHandler = function (handler) {
        onToggle = handler;
    }

    return { updateNestedGroups, updateInRange, setToggleHandler }
};



/* =====================
 *  State initialization
 * ===================== */

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

const timeline = new Timeline(container, items, groupsView, {
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
    }
});



/* =====================
 *  UI Initialization
 * ===================== */

const VisibilityToggles = createVisibilityToggles(groups);



/* =====================
 *  Event wiring
 * ===================== */

// add Event Listeners to visibility toggles
VisibilityToggles.setToggleHandler(toggleGroupVisibility);

// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
    updateGroupsInRange(
        groupsView.get(),
        properties.start.valueOf(),
        properties.end.valueOf()
    );
});