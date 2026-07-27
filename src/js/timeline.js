// TODO: Move VisibilityToggles into its own module

import "../styles/vis-timeline-graph2d.min.css";
import "../styles/styles.css";

import rawGroups from "../data/groups.json";
import rawItems from "../data/items.json";

import { validateData, visifyGroup, visifyItem } from "./dataProcessor.js";
import { DataSet } from "vis-data/peer";
import {
  createLodManager,
  createItemViewManager,
  createGroupViewManager,
} from "./displayCoordinator.js";
import { createVisibilityToggles } from "./visibilityToggles.js";
import { pubSub, events } from "./pubSub.js";

import { Timeline } from "vis-timeline/peer";

/* =====================
 *  State initialization
 * ===================== */

// Initialize data
const validationIssues = validateData({ groups: rawGroups, items: rawItems });

if (validationIssues.length > 0) {
  validationIssues.forEach((issue) => {
    console.log(issue);
  });
  throw new Error("Data validation failed. See console for details.");
}

const groupSet = new DataSet(rawGroups.map((group) => visifyGroup(group)));
const itemSet = new DataSet(rawItems.map((item) => visifyItem(item)));

// Initliaize DataViews and LOD Management

const LodManager = createLodManager({
  itemSet,
  numberOfLevels: 23,
  levelMultiplier: 1.5,
  sectionsPerWindow: 3,
  itemsPerSection: 9,
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
  },
});

/* =====================
 *  App Initialization
 * ===================== */
createVisibilityToggles(groupSet.get());

// Set up initial timeline window
const initialWindow = timeline.getWindow();

itemViewManager.refreshVisibleIds(
  LodManager.getIds({
    windowStart: initialWindow.start,
    windowEnd: initialWindow.end,
  }),
);

/* =====================
 *  Event wiring
 * ===================== */

let currentWindow = initialWindow;

// Listen for range change
timeline.on("rangechange", (properties) => {
  const start = properties.start;
  const end = properties.end;

  const zoomChange =
    currentWindow.end.valueOf() - currentWindow.start.valueOf() !== end - start;
  currentWindow = { start, end };

  pubSub.publish(events.rangeChange, { start, end, zoomChange });
});

// refresh on range change
pubSub.subscribe(events.rangeChange, (range) => {
  const visibleIds = LodManager.getIds({
    windowStart: range.start,
    windowEnd: range.end,
  });
  itemViewManager.refreshVisibleIds(visibleIds);
});

// toggle group upon request
pubSub.subscribe(events.requestGroupToggle, (e) => {
  groupViewManager.toggleGroup({ id: e.id, toggleStatus: e.toggleStatus });
  groupView.refresh();
});
