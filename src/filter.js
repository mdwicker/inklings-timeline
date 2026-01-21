/*
Implementing scaled zooming

Range Change -> Divide into chunks -> Send chunks to budgeter
Budgeter: Find items in range -> pick best x items in range -> return
Item Picker: Filter by priority, then just random for now (TO BE IMPROVED).
  Could be recursive eventually? Performance implications?
WHO HANDLES RANGES? 
Option 1: ranges are free
Option 2: ranges belong to a chunk (based on start, or end, or middle)
Option 3: ranges are budgeted separately
Option 4: Mix of the above.
I THINK that ranges that FULLY belong in a chunk are part of that chunk.
  Other ranges are budgeted separately, or even maybe free? I intend to rather limit the number of large ranges.
  BUT maybe for now we limit it to no more than....6 large ranges? That would
  allow for say, T & L occupation and location, inklings meetings, and great war when zoomed majorly in.
  OH but for ranges, the budget counts non-overlapping ranges as identical. For now maybe big ranges are free.
*/

import { groups, items } from "./data/dataProcessor.js";
import { pubSub, events } from "./pubSub.js";
import { DataView } from "vis-data/peer";

const numberOfSections = 2; // Number of "chunks" to split the range into for event budgeting
const itemsPerSection = 10; // Number of events per range "chunk"
const showAll = false; // Force all events to be shown regardless of filtering rules

function getDaysInRange({ start, end } = {}) {
  const lengthInMs = Math.abs(start - end);
  return Math.ceil(lengthInMs / (1000 * 60 * 60 * 24));
}

export const createItemView = function ({ initialStart, initialEnd } = {}) {
  let itemsToDisplay = [];
  const view = new DataView(items, { filter: item => itemsToDisplay.includes(item.id) });

  function getItemsInRange({ start, end } = {}) {
    console.log(start, end);
    return items.get({
      filter: item => isInRange({ item, start, end })
    });
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

  function updateItems({ start, end } = {}) {
    itemsToDisplay = [];
    const sections = divideRange({ start, end, divisions: numberOfSections });
    for (const section of sections) {
      const itemsInRange = getItemsInRange({ start: section.start, end: section.end });
      itemsToDisplay.push(...getBestItems({ items: itemsInRange, number: itemsPerSection }))
    }
  }

  function divideRange({ start, end, divisions } = {}) {
    const sections = [];
    const sectionSize = Math.abs(end - start) / divisions;

    for (let sectionStart = start; sectionStart < end; sectionStart += sectionSize) {
      sections.push({
        start: sectionStart, end: sectionStart + sectionSize
      });
    }
    return sections;
  }

  function getBestItems({ items, number } = {}) {
    const bestItems = [];

    let priority = 0;
    let itemsTried = 0;
    let numberNeeded = number;

    while (
      numberNeeded &&
      itemsTried < items.length &&
      priority < 5
    ) {
      const itemsToTry = items.filter(item => item.priority == priority);

      if (itemsToTry.length <= numberNeeded) {
        bestItems.push(...itemsToTry);
      } else {
        bestItems.push(...getRandomItems({ items: [...itemsToTry], number: numberNeeded }));
      }

      itemsTried += itemsToTry.length;
      numberNeeded = number - bestItems.length;
      priority++;
    }
    return bestItems.map(item => item.id);
  }

  function getRandomItems({ items, number } = {}) {
    const randomItems = [];

    for (let i = 0; i < number; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      randomItems.push(items.splice(randomIndex, 1)[0])
    }

    return randomItems;
  }

  pubSub.subscribe(events.rangeChange, (range) => {
    updateItems({ start: range.start, end: range.end });
    view.refresh();
  })

  // Initialize with starting range
  // initialStart = new Date(initialStart);
  // initialEnd = new Date(initialEnd);
  // updatePriority({ start: initialStart.valueOf(), end: initialEnd.valueOf() });
  view.refresh();

  return view;
};

export const createGroupView = function ({ initialStart, initialEnd } = {}) {
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