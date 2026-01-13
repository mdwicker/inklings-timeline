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

/*
One idea: have the updateOnlys send a senderId, then subscribe to updates
and do something ONLY when the sender id matches say "toggles" or
"range"

Another idea: try to store view settings somewhere OTHER than on the data. Duh.
THEN the dataview takes the data and passes it through the viewsettings.
SO what do I need to know for the dataview? I need to know what is in range,
and I need to know what is toggled on. SO where would all this view information go?
it is tightly coupled with the timeline, but could be loosely coupled with the data.
right? Or honestly, it could probably be processed elsewhere and just have the
timeline know where it is..... interesting idea.
 */


import "./styles.css";
import "./vis-timeline-graph2d.min.css";
import * as data from "./dataProcessor.js";

import { Timeline } from "vis-timeline/peer"
import { DataView } from "vis-data/peer"



/* =====================
 *  State initialization
 * ===================== */

const container = document.getElementById("visualization");

const groupFilter = (function (groups, items) {
    const allIds = groups.get().map(group => group.id);

    let inRange = new Set(allIds);
    let toggledOn = new Set(allIds);

    const view = new DataView(groups, {
        filter: (group) => {
            // Groups with parents should only display if parent is toggled on
            if (group.parent && !toggledOn.has(group.parent)) {
                return false;
            }
            return toggledOn.has(group.id) && inRange.has(group.id);
        }
    });

    function itemInRange(item, start, end) {
        const itemStart = item.start.valueOf();
        const itemEnd = item.end ? item.end.valueOf() : itemStart;
        // console.log(`itemStart: ${itemStart}, itemEnd: ${itemEnd}`);
        // console.log(`rangeStart: ${start}, rangeEnd: ${end}`);
        return itemStart < end && itemEnd > start
    }

    const updateRange = function (start, end) {
        const itemsInRange = items.get({
            filter: item => itemInRange(item, start, end)
        });

        inRange = new Set(itemsInRange.map(item => item.group));

        // parent groups count as in range if their children are in range
        groups.get({
            filter: (group) => {
                return group.nestedGroups?.some((id) => inRange.has(id));
            }
        })
            .forEach(group => inRange.add(group.id));

        view.refresh();
    };

    const updateToggle = function (id, on) {
        if (!on && toggledOn.has(id)) {
            toggledOn.delete(id);
        }

        if (on && !toggledOn.has(id)) {
            toggledOn.add(id);
        }

        view.refresh();
    };

    const get = function () {
        return {
            inRange: [...inRange],
            toggledOn: [...toggledOn]
        };
    };

    return { view, updateRange, updateToggle, get };
})(data.groups, data.items);

const timeline = new Timeline(container, data.items, groupFilter.view, {
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

const VisibilityToggles = (function (groups) {
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

    const refresh = function (currentState) {
        const toggledOn = currentState.toggledOn;
        const inRange = currentState.inRange;

        for (const group of groups.get()) {
            const id = group.id;
            const toggle = toggles[id];
            if (!toggle) continue;

            if (group.parent) {
                const parentOn = toggledOn.includes(group.parent);
                toggle.checkbox.disabled = !parentOn;
                toggle.label.classList.toggle("parent-toggled-off", !parentOn);
            }

            toggles[id].label.classList.toggle("out-of-range", !inRange.includes(id));
        };
    };

    const setToggleHandler = function (handler) {
        onToggle = handler;
    }

    return { setToggleHandler, refresh }
})(data.groups);



/* =====================
 *  Event wiring
 * ===================== */

// add Event Listeners to visibility toggles
VisibilityToggles.setToggleHandler((id, toggleStatus) => {
    groupFilter.updateToggle(id, toggleStatus)
    VisibilityToggles.refresh(groupFilter.get());
});

// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
    groupFilter.updateRange(properties.start.valueOf(), properties.end.valueOf());
    VisibilityToggles.refresh(groupFilter.get());
});