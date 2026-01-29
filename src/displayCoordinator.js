import { groups as groupSet, items as itemSet } from "./data/dataProcessor.js";
import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";

const showAll = false; // Force all events to be shown regardless of filtering rules


// Initialize Managers and Event Wiring

const LodManager = createLodManager({
  itemSet,
  numberOfSteps: 23,
  stepSize: 1.5,
  sectionsPerWindow: 3,
  itemsPerSection: 9
});

const itemViewManager = createItemViewManager({ itemSet });

const groupViewManager = createGroupViewManager({ groupSet });

setupEventWiring({ LodManager, itemViewManager, groupViewManager });

// Factory Functions, etc

function createLodManager(
  { itemSet,
    numberOfSteps = 23,
    stepSize = 1.5,
    sectionsPerWindow = 3,
    itemsPerSection = 9
  } = {}
) {
  const idsByZoomLevel = {};
  const totalRange = getTotalRange({ itemSet });

  // extend total range slightly to include items at the outer limits
  totalRange.start = new Date(totalRange.start.valueOf() - 1);
  totalRange.end = new Date(totalRange.end.valueOf() + 1);

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
      ...getForegroundIdsAtZoomLevel({ windowSize }),
      ...getBackgroundIdsAtZoomLevel({ windowSize }),
    ]);
  }

  function getForegroundIdsAtZoomLevel({ windowSize } = {}) {
    const ids = [];

    const itemPool = getPrioritizedItems({ itemSet });
    const sections = getRangeSections({ totalRange, windowSize, sectionsPerWindow });

    for (const section of sections) {
      const itemsInRange = getItemsInRange({ range: section, items: itemPool, rangeMode: "start" });

      ids.push(...itemsInRange.slice(0, itemsPerSection).map(item => item.id));
    }

    return ids;
  }

  function getBackgroundIdsAtZoomLevel({ windowSize } = {}) {
    const items = itemSet.get({
      filter: item => {
        return item.isBackground && item.priority < 2;
      }
    });
    return items.map(item => item.id);
  }

  const getIds = function ({ windowRange }) {
    const windowSize = Math.abs(windowRange.end - windowRange.start);

    // if window Size is smaller than 1 month, show all events
    if (inDays(windowSize) < 30) {
      return itemSet.get().map(item => item.id);
    }

    // otherwise, show the appropriate zoom level
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

function createGroupViewManager({ groupSet } = {}) {
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
}

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
}

function isInRange({ item, range, rangeMode = "enclose" } = {}) {
  const itemStart = item.start;
  const itemEnd = item.end ? item.end : item.start;

  if (rangeMode === "overlap") {
    // Range items will return true if they are visible anywhere in the range
    return itemStart <= range.end && itemEnd > range.start;
  } else if (rangeMode === "start") {
    // Range items will return true if their start date is visible in the range
    return itemStart <= range.end && itemEnd > range.start;
  }

  // By default, range items return true if they are fully enclosed by the range
  return itemStart > range.start && itemEnd <= range.end;
}

function getItemsInRange({ items, range, type = false, rangeMode = "enclose" } = {}) {
  const inRange = items.filter(item => isInRange({ item, range, rangeMode }));

  if (!type) return inRange;

  return inRange.filter(item => item.type === type);
}

function inDays(dateValue) {
  return dateValue / 1000 / 60 / 60 / 24;
}

function inYears(dateValue) {
  return inDays(dateValue) / 365;
}


// Item sorting

function getPrioritizedItems({ itemSet, type = false, background = false } = {}) {
  const prioritizedItems = itemSet.get({
    order: sortItems,
    filter: filterByType
  });

  function sortItems(a, b) {
    if (a.priority != b.priority) {
      return a.priority - b.priority;
    }

    if (a.type != b.type) {
      if (a.type === "range") return -1;
      else if (b.type === "range") return 1;
    }

    return a.content - b.content;
  }

  function filterByType(item) {
    if (type === "background" || background) {
      return item.isBackground
    } else if (!type) {
      return !item.isBackground;
    } else {
      return !item.isBackground && item.type === type;
    }
  }

  return prioritizedItems;
}

export const allGroups = groupSet.get();
export const groupView = groupViewManager.view;
export const itemView = itemViewManager.view;