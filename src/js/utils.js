export function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
}

export function getTotalRange(items) {
    let min = Infinity;
    let max = -Infinity;

    for (const item of items) {
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
        return itemStart <= range.end && itemEnd > range.start;
    } else if (rangeMode === "start") {
        // Range items will return true if their start date is visible in the range
        return itemStart <= range.end && itemStart > range.start;
    }

    // By default, range items return true if they are fully enclosed by the range
    return itemStart > range.start && itemEnd <= range.end;
}

export function getItemsInRange({ items, range, rangeMode = "enclose" } = {}) {
    return items.filter(item => isInRange({ item, range, rangeMode }));
}

export function inDays(dateValue) {
    return dateValue / 1000 / 60 / 60 / 24;
}
