import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";
import {
  getTotalRange, isInRange, inDays,
  getRangeSections, sortItems, getCurrentZoomLevel
} from "./utils.js";

const showAll = false; // Force all events to be shown regardless of filtering rules


function createLodManager(
  { itemSet,
    numberOfSteps = 23,
    stepSize = 1.5,
    sectionsPerWindow = 3,
    itemsPerSection = 9
  } = {}
) {
  const idsByZoomLevel = {};
  const totalRange = getTotalRange(itemSet.get());

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

    const itemPool = itemSet.get({
      order: sortItems, filter: item => !item.isBackground
    });
    const sections = getRangeSections({ totalRange, windowSize, sectionsPerWindow });

    for (const section of sections) {
      const itemsInRange = itemPool.filter(
        item => isInRange({ item, range: section, rangeMode: "start" })
      );

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

    return idsByZoomLevel[getCurrentZoomLevel({ levels: zoomLevels, windowSize })];
  }

  return { getIds };
}

function createItemViewManager(itemSet) {
  let idsToDisplay = new Set();

  const view = new DataView(itemSet, {
    filter: item => {
      // THIS LINE MUST CHANGE WHEN AGGREGATION IS INTRODUCED.
      // Otherwise, parent and child items will display simultaneously.
      if (showAll) return true;
      return (idsToDisplay.has(item.id));
    }
  });

  const refreshVisibleIds = function (ids) {
    idsToDisplay = new Set([...ids]);
    view.refresh();
  }

  return { view, refreshVisibleIds };
}

function createGroupViewManager(groupSet) {
  const groupIds = groupSet.get().map(group => group.id);
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
    if (!groupIds.includes(id)) {
      return;
    }

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

export { createLodManager, createGroupViewManager, createItemViewManager }