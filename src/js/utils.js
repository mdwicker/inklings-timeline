export function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function getTotalRange(items) {
  if (items.length === 0) {
    throw new Error("getTotalRange needs a non-empty array of items");
  }

  let min = Infinity;
  let max = -Infinity;

  for (const item of items) {
    if (!("start" in item)) {
      throw new Error("Missing date field.");
    }

    if (!(item.start instanceof Date && !isNaN(item.start))) {
      throw new Error("Invalid date field.");
    }

    if ("end" in item && !(item.end instanceof Date && !isNaN(item.end))) {
      throw new Error("Invalid date field.");
    }

    const start = item.start.valueOf();
    const end = item.end ? item.end.valueOf() : start;

    if (start < min) min = start;
    if (end > max) max = end;
  }

  return { start: new Date(min), end: new Date(max) };
}

export function isInRange({ item, range, rangeMode = "enclose" } = {}) {
  const itemStart = item.start;
  const itemEnd = item.end ? item.end : item.start;

  if (rangeMode === "overlap") {
    // Range items will return true if they are visible anywhere in the range
    return itemStart < range.end && itemEnd >= range.start;
  }
  if (rangeMode === "start") {
    // Range items will return true if their start date is visible in the range
    return itemStart < range.end && itemStart >= range.start;
  }

  // By default, range items return true if they are fully enclosed by the range
  return itemStart >= range.start && itemEnd < range.end;
}

export function inDays(dateValue) {
  return Math.abs(dateValue / 1000 / 60 / 60 / 24);
}

export function getRangeSections({
  totalRange,
  windowSize,
  sectionsPerWindow,
} = {}) {
  if (sectionsPerWindow <= 0) {
    throw new Error("sectionsPerWindow must be positive.");
  }

  if (windowSize <= 0) {
    throw new Error("windowSize must be positive.");
  }

  const sections = [];
  const size = windowSize / sectionsPerWindow;

  let sectionStart = totalRange.start.valueOf();
  const end = totalRange.end.valueOf();

  while (sectionStart < end) {
    sections.push({
      start: new Date(sectionStart),
      end: new Date(sectionStart + size),
    });
    sectionStart += size;
  }

  return sections;
}

export function sortItems(a, b) {
  const typeOrder = {
    range: 0,
    point: 1,
  };

  const categoryOrder = {
    life: 0,
    occupation: 1,
    location: 2,
    "major-pub": 3,
    "minor-pub": 4,
  };

  if (a.priority != b.priority) {
    return a.priority - b.priority;
  }

  if (a.type != b.type) {
    return typeOrder[a.type] - typeOrder[b.type];
  }

  if ("category" in a && "category" in b && a.category != b.category) {
    return categoryOrder[a.category] - categoryOrder[b.category];
  }

  return a.content.localeCompare(b.content);
}

export function getCurrentZoomLevel({ levels, windowSize } = {}) {
  const level = Math.max(...levels.filter((level) => level <= windowSize));

  if (level <= 0) {
    return 0;
  }

  return level;
}

export function calculateZoomLevels({
  rangeStart,
  rangeEnd,
  numberOfLevels,
  levelMultiplier,
}) {
  // calculates the maximum number of milliseconds per window for each zoom level

  // validate parameters
  if (!Number.isInteger(numberOfLevels)) {
    throw new Error("numberOfLevels must be an integer.");
  }

  if (numberOfLevels <= 0) {
    throw new Error("Cannot have less than one zoom level.");
  }

  if (!Number.isFinite(levelMultiplier)) {
    throw new Error("levelMultiplier must be a finite number.");
  }

  if (levelMultiplier <= 1) {
    throw new Error("Level multiplier must be greater than one.");
  }

  if (
    !(rangeStart instanceof Date) ||
    isNaN(rangeStart) ||
    !(rangeEnd instanceof Date) ||
    isNaN(rangeEnd)
  ) {
    throw new Error("Range boundaries must be Date objects.");
  }

  if (rangeEnd.valueOf() <= rangeStart.valueOf()) {
    throw new Error("Range size must be larger than zero.");
  }

  const zoomLevels = [];

  let windowSize = Math.abs(rangeEnd - rangeStart);

  for (let i = numberOfLevels; i > 0; i--) {
    zoomLevels.push(windowSize);
    windowSize = Math.floor(windowSize / levelMultiplier);
  }

  return zoomLevels;
}
