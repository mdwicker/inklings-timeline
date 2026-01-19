/**
 * TO-DO
 * Implement visualization of timeline width (or maybe scrollbar....)
 * scrolling vertical AND horizontal.
 * better color coding
 * labels for small ranges?
 * 
 * EVENTUALLY:
 * add zoom level detail adjustment (Google Maps style)
 * Full Detail mode
 * Scaling mode
 * Maybe Summary mode?
 * 
 * random note: if it gets too laggy change rangechange to rangechanged
 */

/*
Priority 0: Essential Milestones
    Question: Is this a "Top 10" life event (Birth, Death, Marriage, Masterpiece)?
    Scale Check: Does the timeline "break" without this?
    Summary: Fundamental milestones that define a person's global reputation.

Priority 1: Major Life Events
    Question: Is this a defining pillar of their career or a primary residence?
    Scale Check: Is this recognizable to a well-read non-specialist?
    Summary: The primary structure of a career; significant shifts and transitions.

Priority 2: Notable Developments
    Question: Is this an important family or professional highlight?
    Scale Check: Does this add biographical "why" to their story?
    Summary: Important context for scholars and fans that isn't necessarily "world-famous."

Priority 3: Granular Details
    Question: Is this an interesting detail for a dedicated fan?
    Scale Check: Is this "texture" rather than "structure"?
    Summary: Specific addresses, minor publications, and personal anecdotes that add color.

Priority 4: Incidental or Niche Information
    Question: Is this a "deep-cut" fact or minor piece of trivia?
    Scale Check: Is this purely for archival or specialized research?
    Summary: Trivia, short-term trips, or very early/obscure works that don't impact the overall narrative.
 */


import "./styles.css";
import "./vis-timeline-graph2d.min.css";
import { groupView as groups, itemView as items } from "./filter.js";
import { pubSub, events } from "./pubSub.js";

import { Timeline } from "vis-timeline/peer"


/* =====================
 *  State initialization
 * ===================== */

const container = document.getElementById("visualization");

const timeline = new Timeline(container, items, groups, {
  horizontalScroll: true,
  verticalScroll: false,
  zoomKey: "ctrlKey",
  min: "1880-01-01",
  max: "2010-01-01",
  start: "1920-01-01",
  end: "1945-12-31",
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
  groups.get({ filter: (group) => !group.parent })
    .forEach((group) => {
      const node = createGroupNode(group);

      if (group.nestedGroups) {
        toggles[group.id].nestedGroups = [];
        const nestedList = document.createElement("ul");
        nestedList.classList.add("subgroup-list");
        for (const id of group.nestedGroups) {
          nestedList.append(createGroupNode(groups.get(id)));
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
})(groups);

/* =====================
 *  Event wiring
 * ===================== */


// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
  const start = properties.start.valueOf();
  const end = properties.end.valueOf();
  const lengthInMs = Math.abs(start - end);
  const lengthInDays = Math.ceil(lengthInMs / (1000 * 60 * 60 * 24));

  pubSub.publish(events.rangeChange, { start, end, lengthInMs, lengthInDays });
});