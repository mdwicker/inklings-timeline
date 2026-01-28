import { groups as groupSet, items as itemSet } from "./data/dataProcessor.js";
import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";

const showAll = false; // Force all events to be shown regardless of filtering rules
const currentRangeWindow = {};


const totalRange = getTotalRange({ itemSet });
const size = Math.abs(totalRange.end - totalRange.start) / 20;
const sections = getRangeSections({ totalRange, windowSize: size, sectionsPerWindow: 3 });

const backgroundEvent = itemSet.get(3); // enclosed
const overlapEvent = itemSet.get(7);
const pointEvent = itemSet.get(34);
const outOfRange = itemSet.get(100);
const testRange = { start: new Date("1900-01-01"), end: new Date("1920-01-01") };


// Factory Functions, etc

function createLodManager(
  { itemSet,
    numberOfSteps = 23,
    stepSize = 1.5,
    sectionsPerWindow = 3,
    itemsPerSection = 8
  } = {}
) {
  const idsByZoomLevel = {};
  const totalRange = getTotalRange({ itemSet });

  // populate ids for each zoom level
  let windowSize = Math.abs(totalRange.end - totalRange.start);
  for (let i = numberOfSteps; i > 0; i--) {
    idsByZoomLevel[windowSize] = getIdsAtZoomLevel({ windowSize });
    windowSize = Math.floor(windowSize / stepSize);
  }

  // Set up a normalized array of the zoomLevel values
  const zoomLevels = Object.keys(idsByZoomLevel).map(level => Number(level));


  function getIdsAtZoomLevel({ windowSize } = {}) {
    return new Set([
      ...getPointIdsAtZoomLevel({ windowSize }),
      // ...getRangeIdsAtZoomLevel({ windowSize }),
      // ...getBackgroundIdsAtZoomLevel({ windowSize }),
    ]);
  }

  function getPointIdsAtZoomLevel({ windowSize } = {}) {
    const ids = [];

    const itemPool = getPrioritizedItems({ itemSet, type: "point" });
    const sections = getRangeSections({ totalRange, windowSize, sectionsPerWindow });

    for (const section of sections) {
      const pointsInRange = getItemsInRange({ range: section, items: itemPool });

      ids.push(...pointsInRange.slice(0, itemsPerSection).map(item => item.id));
    }

    return ids;
  } // Tested

  const getIds = function ({ windowRange }) {
    const windowSize = Math.abs(windowRange.end - windowRange.start);
    const zoomLevel = Math.max(...zoomLevels.filter(level => level <= windowSize));
    return idsByZoomLevel[zoomLevel];
  }

  return { getIds };
}

function createItemViewManager({ itemSet } = {}) {
  let idsToDisplay = new Set();

  const view = new DataView(itemSet, {
    filter: item => {
      // THIS LINE MUST CHANGE WHEN AGGREGATION IS INTRODUCED.
      // Otherwise, parent and child items will display simultaneously.
      if (showAll) return true;
      return (idsToDisplay.has(item.id));
    }
  });

  const refreshVisibleIds = function ({ ids }) {
    idsToDisplay = new Set([...ids]);
    view.refresh();
  }

  return { view, refreshVisibleIds };
}

const createGroupViewManager = function ({ groupSet } = {}) {
  const groupIds = groupSet.get().map(group => group.id)
  let groupsToggledOn = new Set(groupIds);

  const view = new DataView(groupSet, {
    filter: (group) => {
      // Groups with parents should only display if parent is toggled on
      if (group.parentId && !groupsToggledOn.has(group.parentId)) {
        return false;
      }
      return groupsToggledOn.has(group.id);
    }
  });

  const toggleGroup = function ({ id, toggleStatus } = {}) {
    const isOn = groupsToggledOn.has(id);

    if (isOn && !toggleStatus) {
      groupsToggledOn.delete(id);
    } else if (!isOn && toggleStatus) {
      groupsToggledOn.add(id);
    }

    pubSub.publish(events.toggleGroup, { id, toggleStatus })
  }

  return { view, toggleGroup };
};

function setupEventWiring({ LodManager, itemViewManager, groupViewManager } = {}) {
  // initialize with starting range values
  pubSub.subscribe(events.initializeTimeline, (range) => {
    const visibleIds = LodManager.getIds({ windowRange: range });
    itemViewManager.refreshVisibleIds({ ids: visibleIds });
  })

  // refresh on range change
  pubSub.subscribe(events.rangeChange, (range) => {
    const visibleIds = LodManager.getIds({ windowRange: range });
    itemViewManager.refreshVisibleIds({ ids: visibleIds });
  })

  // toggle group upon request
  pubSub.subscribe(events.requestGroupToggle, (e) => {
    groupViewManager.toggleGroup({ id: e.id, toggleStatus: e.toggleStatus });
    groupViewManager.view.refresh();
  });
}


// Utility functions

function getTotalRange({ itemSet } = {}) {
  let min = Infinity;
  let max = -Infinity;

  for (const item of itemSet.get()) {
    const start = item.start.valueOf();
    const end = item.end ? item.end.valueOf() : start;


    if (start < min) min = start;
    if (end > max) max = end;
  }

  return { start: new Date(min), end: new Date(max) };
} // Tested

function getRangeSections({ totalRange, windowSize, sectionsPerWindow } = {}) {
  const sections = [];
  const size = windowSize / sectionsPerWindow;

  let sectionStart = totalRange.start.valueOf();
  let end = totalRange.end.valueOf();

  while (sectionStart < end) {
    sections.push({ start: new Date(sectionStart), end: new Date(sectionStart + size) });
    sectionStart += size;
  }

  return sections;
} // Tested

function isInRange({ item, range, overlap = false } = {}) {
  const itemStart = item.start;
  const itemEnd = item.end ? item.end : item.start;

  if (overlap) {
    // Range items will return true if they are visible anywhere in the range,
    // even if they are not fully enclosed
    return itemStart < range.end && itemEnd > range.start;
  }

  return itemStart > range.start && itemEnd < range.end;
} // Tested

function getItemsInRange({ items, range, type = false } = {}) {
  const inRange = items.filter(item => isInRange({ item, range }));

  if (!type) return inRange;

  return inRange.filter(item => item.type === type);
} // Tested


// Item sorting

function getPrioritizedItems({ itemSet, type = false } = {}) {
  const prioritizedItems = itemSet.get({
    order: sortItems,
    filter: filterByType
  });

  function sortItems(a, b) {
    if (a.priority < b.priority) {
      return -1;
    } else if (a.priority > b.priority) {
      return 1;
    }

    return a.content - b.content;
  }

  function filterByType(item) {
    if (!type) return true;
    if (type === "background") {
      return item.isBackground
    } else {
      return !item.isBackground && item.type === type;
    }
  }

  return prioritizedItems;
} // Tested


const LodManager = createLodManager({
  itemSet,
  numberOfSteps: 23,
  stepSize: 1.5,
  sectionsPerWindow: 3,
  itemsPerSection: 8
});

const itemViewManager = createItemViewManager({ itemSet });

const groupViewManager = createGroupViewManager({ groupSet });

setupEventWiring({ LodManager, itemViewManager, groupViewManager });

export const allGroups = groupSet.get();
export const groupView = groupViewManager.view;
export const itemView = itemViewManager.view;