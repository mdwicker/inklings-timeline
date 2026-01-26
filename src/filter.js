import { groups, items, prioritizedItems } from "./data/dataProcessor.js";
import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";

const numberOfSections = 3; // Number of "chunks" to split the range into for event budgeting
const itemsPerSection = 8; // Number of events per range "chunk"
const showAll = false; // Force all events to be shown regardless of filtering rules

export const createItemView = function () {
  let minDate, maxDate;

  let itemsToDisplay = [];
  let rangesToDisplay = [];

  prepareBackgroundItems();

  const view = new DataView(items, {
    filter: item => {
      // for now, include all range items
      if (item.type === "range" || item.type === "background") return true;

      return itemsToDisplay.includes(item.id);
    }
  });

  function prepareBackgroundItems() {
    const backgroundItems = items.get({
      filter: item => {
        return (item.category === "location" || item.category === "occupation");
      }
    });

    backgroundItems.forEach(item => {
      // add colored background that covers entire range
      items.add({
        id: `${item.id}-background`,
        group: item.group,
        category: item.category,
        type: "background",
        start: item.start,
        end: item.end,
        className: item.category === "location" ? "top-half" : 'bottom-half'
      });

      // make label that sticks to the edge of the screen
      item.className = "sticky-label";
      item.end = new Date(item.start);
      item.end.setDate(item.end.getDate() + 1);
    });
  }

  function getItemsInRange({ start, end, itemPool = items } = {}) {
    return itemPool.filter(item => isInRange({ item, start, end }));
  }

  function isInRange({ item, start, end, overlap = false } = {}) {
    const itemStart = item.start.valueOf();
    const itemEnd = item.end ? item.end.valueOf() : itemStart;

    if (overlap) {
      // Range items will return true if they are visible anywhere in the range,
      // even if they are not fully enclosed
      return itemStart < end && itemEnd > start
    }

    return itemStart > start && itemEnd < end
  }

  function divideRange({ start, end, divisions } = {}) {
    const sections = [];
    const size = Math.abs(end - start) / divisions;

    let sectionStart = minDate;

    while (sectionStart < maxDate) {
      sections.push({ start: sectionStart, end: sectionStart + size });
      sectionStart += size;
    }

    return sections;
  }

  function updateItemsToDisplay({ start, end } = {}) {
    itemsToDisplay = [];

    const sections = divideRange({ start, end, divisions: numberOfSections });

    for (const section of sections) {
      const itemsInRange = getItemsInRange({
        start: section.start,
        end: section.end,
        itemPool: prioritizedItems
      });


      // add prioritized point events
      itemsToDisplay.push(
        ...itemsInRange
          .filter(item => item.type === "point")
          .slice(0, itemsPerSection)
          .map(item => item.id)
      );
    }
  }

  function updateRangesToDisplay({ start, end } = {}) {
    rangesToDisplay = [];

    const sections = divideRange({ start, end, divisions: numberOfSections });

    for (const section of sections) {
      const itemsInRange = getItemsInRange({
        start: section.start,
        end: section.end,
        itemPool: prioritizedItems
      });


      // add prioritized point events
      itemsToDisplay.push(
        ...itemsInRange
          .filter(item => item.type === "range")
          .slice(0, itemsPerSection)
          .map(item => item.id)
      );
    }
  }

  function refreshView({ start, end } = {}) {
    updateItemsToDisplay({ start, end });
    updateRangesToDisplay({ start, end });
    view.refresh();
  }

  // initialize with starting range values
  pubSub.subscribe(events.initializeTimeline, (range) => {
    minDate = range.start;
    maxDate = range.end;

    refreshView({ start: range.initialStart, end: range.initialEnd });
  })

  // refresh on range change
  pubSub.subscribe(events.rangeChange, (range) => {
    if (range.zoomChange) {
      refreshView({ start: range.start, end: range.end });
    }
  })

  return view;
};

function getDaysInRange({ start, end } = {}) {
  const lengthInMs = Math.abs(start - end);
  return Math.ceil(lengthInMs / (1000 * 60 * 60 * 24));
}

export const createGroupView = function () {
  const groupIds = groups.get().map(group => group.id)
  let groupsToggledOn = new Set(groupIds);

  const view = new DataView(groups, {
    filter: (group) => {
      // Groups with parents should only display if parent is toggled on
      if (group.parent && !groupsToggledOn.has(group.parent)) {
        return false;
      }
      return groupsToggledOn.has(group.id);
    }
  });

  function toggleGroup({ id, toggleStatus } = {}) {
    const isOn = groupsToggledOn.has(id);

    if (isOn && !toggleStatus) {
      groupsToggledOn.delete(id);
    } else if (!isOn && toggleStatus) {
      groupsToggledOn.add(id);
    }

    pubSub.publish(events.toggleGroup, { id, toggleStatus })
  }

  // toggle group upon request
  pubSub.subscribe(events.requestGroupToggle, (e) => {
    toggleGroup({ id: e.id, toggleStatus: e.toggleStatus });
    view.refresh();
  });

  return { view };
};

export const allGroups = groups.get();