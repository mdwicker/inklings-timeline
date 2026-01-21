/**
 * TO-DO
 *  -Improve visuals: color, fonts, etc
 *  -Test scrolling and zooming behavior on different devices
 *  -Implement visualization of timeline width (or maybe scrollbar....)
 * 
 * Notes:
 *  -Consider changing group behavior: get rid of subgroups,
 *   leave all groups always visible (UNLESS they get collapsed at certain
 *   zoom leveels, maybe).
 */


import "./styles.css";
import "./vis-timeline-graph2d.min.css";
import { createItemView, createGroupView, allGroups } from "./filter.js";
import { pubSub, events } from "./pubSub.js";

import { Timeline } from "vis-timeline/peer"

const initialStart = "1920-01-01";
const initialEnd = "1945-12-31";


/* =====================
 *  State initialization
 * ===================== */

const container = document.getElementById("visualization");

const items = createItemView({ initialStart, initialEnd });
const groups = createGroupView({ initialStart, initialEnd }).view;
const timeline = new Timeline(container, items, groups, {
  horizontalScroll: true,
  verticalScroll: false,
  zoomKey: "ctrlKey",
  min: "1880-01-01",
  max: "2010-01-01",
  start: initialStart,
  end: initialEnd,
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

  // Create nodes
  groups.filter(group => !group.parent)
    .forEach((group) => {
      const node = createGroupNode(group);
      if (group.nestedGroups != undefined) {
        toggles[group.id].nestedGroups = [];
        const nestedList = document.createElement("ul");
        nestedList.classList.add("subgroup-list");
        for (const id of group.nestedGroups) {
          nestedList.append(
            createGroupNode(groups.find(subGroup => subGroup.id == id))
          );
          toggles[group.id].nestedGroups.push(id);
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

  // Publish group toggle changes
  groupList.addEventListener("change", e => {
    if (!e.target.matches("input[type='checkbox']")) return;

    const id = Number(e.target.dataset.groupId);
    if (!id) return;

    pubSub.publish(events.requestGroupToggle, { id, toggleStatus: e.target.checked });
  })

  // update toggle status
  pubSub.subscribe(events.toggleGroup, (e) => {
    toggles[e.id].checkbox.checked = e.toggleStatus;

    if (toggles[e.id].nestedGroups) {
      updateChildToggles(e.id, e.toggleStatus);
    }
  });

  // update groups out of range
  pubSub.subscribe(events.groupRangeChange, (e) => {
    e.left.forEach(id => {
      toggles[id].label.classList.toggle("out-of-range", true);
    })
    e.entered.forEach(id => {
      toggles[id].label.classList.toggle("out-of-range", false);
    })
  });

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

  function updateChildToggles(id, toggleOn) {
    toggles[id].nestedGroups.forEach(toggleId => {
      const toggle = toggles[toggleId];
      toggle.checkbox.disabled = !toggleOn;
      toggle.label.classList.toggle("parent-toggled-off", !toggleOn);
    });
  }
})(allGroups);

/* =====================
 *  Event wiring
 * ===================== */


// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
  const start = properties.start.valueOf();
  const end = properties.end.valueOf();
  pubSub.publish(events.rangeChange, { start, end });
});