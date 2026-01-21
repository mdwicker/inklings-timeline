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

const rangeDivisions = 4; // Number of "chunks" to split the range into for event budgeting
const eventsPerDivision = 10; // Number of events per range "chunk"
const showAll = false; // Force all events to be shown regardless of filtering rules

function getDaysInRange({ start, end } = {}) {
  const lengthInMs = Math.abs(start - end);
  return Math.ceil(lengthInMs / (1000 * 60 * 60 * 24));
}


export const createViews = function ({ initialStart, initialEnd } = {}) {
  const itemView = (function () {
    let priority;

    const view = new DataView(
      items,
      {
        filter: (item) => {
          // priority = "all" includes all items
          if (priority === "all") return true;

          return (item.priority <= priority);
        }
      }
    );

    const getItemsInRange = function ({ start, end } = {}) {
      return view.get({
        filter: item => isInRange({ item, start, end })
      });
    };

    const isInRange = function ({ item, start, end, overlap = false } = {}) {
      const itemStart = item.start.valueOf();
      const itemEnd = item.end ? item.end.valueOf() : itemStart;

      if (overlap) {
        // Range items will return true if they are visible anywhere in the range,
        // even if they are not fully enclosed
        return itemStart < end && itemEnd > start
      }

      return itemStart > start && itemEnd < end
    };

    const updatePriority = function ({ start, end } = {}) {
      const daysInRange = getDaysInRange({ start, end });

      if (daysInRange > (365 * 30)) {
        priority = 0;
      } else if (daysInRange > (365 * 10)) {
        priority = 1;
      } else if (daysInRange > (365 * 7)) {
        priority = 2;
      } else if (daysInRange > (365 * 2)) {
        priority = 3;
      } else {
        priority = 4;
      }
    };

    // Initialize with starting range
    initialStart = new Date(initialStart);
    initialEnd = new Date(initialEnd);
    updatePriority({ start: initialStart.valueOf(), end: initialEnd.valueOf() });

    return { view, getItemsInRange, updatePriority }
  })();

  const groupView = (function () {
    const groupIds = groups.get().map(group => group.id)
    let groupsInRange = new Set(groupIds);
    let groupsToggledOn = new Set(groupIds);

    const view = new DataView(groups, {
      filter: (group) => {
        // Groups with parents should only display if parent is toggled on
        if (group.parent && !groupsToggledOn.has(group.parent)) {
          return false;
        }
        return groupsToggledOn.has(group.id) && groupsInRange.has(group.id);
      }
    });

    const updateGroupsInRange = function ({ start, end } = {}) {
      const newInRange = getGroupsInRange({ start, end });

      const left = groupsInRange.difference(newInRange);
      const entered = newInRange.difference(groupsInRange);

      if (left || entered) {
        pubSub.publish(events.groupRangeChange, { left, entered });
      }

      groupsInRange = newInRange;
    };

    function getGroupsInRange({ start, end } = {}) {
      let inRange = new Set(
        itemView.getItemsInRange({ start, end })
          .map(item => item.group)
      );

      // parents count as in range if their children are in range
      const parentsInRange = groups.get({
        filter: (group) => group.nestedGroups?.some((id) => inRange.has(id))
      });
      parentsInRange.forEach(group => inRange.add(group.id));

      return inRange;
    }

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

    // Initialize with starting range parameters
    updateGroupsInRange({ start: initialStart, end: initialEnd });

    return { view, updateGroupsInRange };
  })();

  // Update on range change
  pubSub.subscribe(events.rangeChange, (range) => {
    itemView.updatePriority(range);
    itemView.view.refresh();
    groupView.updateGroupsInRange(range);
    groupView.view.refresh();
  })

  return {
    items: itemView.view,
    groups: groupView.view
  }
};

export { groups as allGroups }
