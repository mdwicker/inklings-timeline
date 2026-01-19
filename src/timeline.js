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
import * as filter from "./filter.js";
import { pubSub } from "./pubSub.js";

import { Timeline } from "vis-timeline/peer"


/* =====================
 *  State initialization
 * ===================== */

const container = document.getElementById("visualization");

const timeline = new Timeline(container, filter.itemView, filter.groupView, {
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
})(filter.groupView);

/* =====================
 *  Event wiring
 * ===================== */

// add Event Listeners to visibility toggles
VisibilityToggles.setToggleHandler((id, toggleStatus) => {
  filter.toggleGroup(id, toggleStatus)
  VisibilityToggles.refresh(filter.get());
});

// Listen for range change to update displayed groups
timeline.on("rangechange", (properties) => {
  filter.updateRange(properties.start.valueOf(), properties.end.valueOf());
  VisibilityToggles.refresh(filter.get());
});