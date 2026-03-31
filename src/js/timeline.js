/**
 * TO-DO
 *  -Improve visuals: color, fonts, etc
 *  -Test scrolling and zooming behavior on different devices
 *  -Implement visualization of timeline width (or maybe scrollbar....)
 * 
 * 
 * Testing targets:
 *  utils, dataProcessor, displayCoordinator (ALL exported functions from each)
 */

import "../styles/vis-timeline-graph2d.min.css";
import "../styles/styles.css";

import rawGroups from '../data/groups.json'
import rawItems from '../data/items.json'

import { validateData, visifyGroup, visifyItem } from './dataProcessor.js'
import { DataSet } from "vis-data/peer";
import { createLodManager, createItemViewManager, createGroupViewManager } from "./displayCoordinator.js";
import { pubSub, events } from "./pubSub.js";

import { Timeline } from "vis-timeline/peer"


/* =====================
 *  State initialization
 * ===================== */

// Initialize data
const validationIssues = validateData({ groups: rawGroups, items: rawItems });

if (validationIssues.length > 0) {
  validationIssues.forEach(issue => {
    console.log(issue);
  })
  throw new Error("Data validation failed. See console for details.");
}

const groupSet = new DataSet(rawGroups.map(group => visifyGroup(group)));
const itemSet = new DataSet(rawItems.map(item => visifyItem(item)));


// Initliaize DataViews and LOD Management

const LodManager = createLodManager({
  itemSet,
  numberOfLevels: 23,
  levelMultiplier: 1.5,
  sectionsPerWindow: 3,
  itemsPerSection: 9
});

const itemViewManager = createItemViewManager(itemSet);
const itemView = itemViewManager.view;

const groupViewManager = createGroupViewManager(groupSet);
const groupView = groupViewManager.view;


// Initialize timeline object

const container = document.getElementById("visualization");

const timeline = new Timeline(container, itemView, groupView, {
  horizontalScroll: true,
  verticalScroll: false,
  zoomKey: "ctrlKey",
  min: "1880-01-01",
  max: "2010-01-01",
  start: "1920-01-01",
  end: "1945-12-31",
  groupOrder: "id",
  stack: true,
  stackSubgroups: true,
  margin: {
    item: {
      vertical: 3,
      horizontal: 0,
    },
  },
  tooltip: {
    template: (item) => item.description || item.content,
  }
});


/* =====================
 *  App Initialization
 * ===================== */

const VisibilityToggles = (function (groups) {
  const groupList = document.querySelector(".visibility-toggles .group-list");
  const toggles = {}

  // Create nodes
  groups.filter(group => !group.parentId)
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
    node.classList.add(group.parentId ? "subgroup" : "top-level");

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
})(groupSet.get());

// Set up initial timeline window
const initialWindow = timeline.getWindow();

itemViewManager.refreshVisibleIds(
  LodManager.getIds({
    windowStart: initialWindow.start,
    windowEnd: initialWindow.end
  }));


/* =====================
 *  Event wiring
 * ===================== */

let currentWindow = initialWindow;

// Listen for range change
timeline.on("rangechange", (properties) => {
  const start = properties.start;
  const end = properties.end;

  const zoomChange = (
    (currentWindow.end.valueOf() - currentWindow.start.valueOf()) !==
    (end - start)
  );
  currentWindow = { start, end };

  pubSub.publish(events.rangeChange, { start, end, zoomChange });
});

// refresh on range change
pubSub.subscribe(events.rangeChange, (range) => {
  const visibleIds = LodManager.getIds({ windowStart: range.start, windowEnd: range.end });
  itemViewManager.refreshVisibleIds(visibleIds);
})

// toggle group upon request
pubSub.subscribe(events.requestGroupToggle, (e) => {
  groupViewManager.toggleGroup({ id: e.id, toggleStatus: e.toggleStatus });
  groupView.refresh();
});
