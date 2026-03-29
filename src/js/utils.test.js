import { inDays, isInRange, getItemsInRange, getTotalRange, slugify } from "./utils";

describe('inDays', () => {
    test('1 day', () => {
        expect(inDays(86400000)).toBe(1);
    });

    test('365 days', () => {
        expect(inDays(31536000000)).toBe(365);
    });

    test('2 and a half days', () => {
        expect(inDays(216000000)).toBe(2.5);
    })

    test('0 days', () => {
        expect(inDays(0)).toBe(0);
    })
});

describe('isInRange', () => {
    const range = {
        start: new Date("1900-01-01"),
        end: new Date("1910-01-01")
    };

    const enclosed = {
        start: new Date("1902-01-01"),
        end: new Date("1906-01-01")
    };

    const beforeRange = {
        start: new Date("1890-01-01"),
        end: new Date("1895-01-01")
    };

    const afterRange = {
        start: new Date("1920-01-01"),
        end: new Date("1925-01-01")
    };

    const startInRange = {
        start: new Date("1905-01-01"),
        end: new Date("1915-01-01")
    };

    const endInRange = {
        start: new Date("1895-01-01"),
        end: new Date("1905-01-01")
    };

    const largerThanRange = {
        start: new Date("1895-01-01"),
        end: new Date("1915-01-01")
    };

    const startsOnRangeStart = {
        start: new Date("1900-01-01"),
        end: new Date("1905-01-01")
    }

    const startsOnRangeEnd = {
        start: new Date("1910-01-01"),
        end: new Date("1915-01-01")
    };

    const pointInRange = {
        start: new Date("1905-01-01")
    };

    const pointBeforeRange = {
        start: new Date("1890-01-01")
    };

    const pointAfterRange = {
        start: new Date("1915-01-01")
    };

    test('Enclose mode true with item enclosed', () => {
        expect(isInRange({
            item: enclosed, range, rangeMode: "enclose"
        })).toBe(true);
    });

    test('Enclose mode true with point in range', () => {
        expect(isInRange({
            item: pointInRange, range, rangeMode: "enclose"
        })).toBe(true);
    });

    test('Enclose mode false with item out of range (before)', () => {
        expect(isInRange({
            item: beforeRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with item out of range (after)', () => {
        expect(isInRange({
            item: afterRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with only start in range', () => {
        expect(isInRange({
            item: startInRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with only end in range', () => {
        expect(isInRange({
            item: endInRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with item larger than range', () => {
        expect(isInRange({
            item: largerThanRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with point before range', () => {
        expect(isInRange({
            item: pointBeforeRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode false with point after range', () => {
        expect(isInRange({
            item: pointAfterRange, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Enclose mode true with item that starts on range start', () => {
        expect(isInRange({
            item: startsOnRangeStart, range, rangeMode: "enclose"
        })).toBe(true);
    });

    test('Enclose mode false with item that starts on range end', () => {
        expect(isInRange({
            item: startsOnRangeEnd, range, rangeMode: "enclose"
        })).toBe(false);
    });

    test('Overlap mode true with item enclosed', () => {
        expect(isInRange({
            item: enclosed, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode false with item out of range (before)', () => {
        expect(isInRange({
            item: beforeRange, range, rangeMode: "overlap"
        })).toBe(false);
    });

    test('Overlap mode false with item out of range (after)', () => {
        expect(isInRange({
            item: afterRange, range, rangeMode: "overlap"
        })).toBe(false);
    });

    test('Overlap mode true with only start in range', () => {
        expect(isInRange({
            item: startInRange, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode true with only end in range', () => {
        expect(isInRange({
            item: endInRange, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode true with item larger than range', () => {
        expect(isInRange({
            item: largerThanRange, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode true with point in range', () => {
        expect(isInRange({
            item: pointInRange, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode false with point before range', () => {
        expect(isInRange({
            item: pointBeforeRange, range, rangeMode: "overlap"
        })).toBe(false);
    });

    test('Overlap mode false with point after range', () => {
        expect(isInRange({
            item: pointAfterRange, range, rangeMode: "overlap"
        })).toBe(false);
    });

    test('Overlap mode true with item that starts on range start', () => {
        expect(isInRange({
            item: startsOnRangeStart, range, rangeMode: "overlap"
        })).toBe(true);
    });

    test('Overlap mode false with item that starts on range end', () => {
        expect(isInRange({
            item: startsOnRangeEnd, range, rangeMode: "overlap"
        })).toBe(false);
    });

    test('Start mode true with item enclosed', () => {
        expect(isInRange({
            item: enclosed, range, rangeMode: "start"
        })).toBe(true);
    });

    test('Start mode false with item out of range (before)', () => {
        expect(isInRange({
            item: beforeRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode false with item out of range (after)', () => {
        expect(isInRange({
            item: afterRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode true with only start in range', () => {
        expect(isInRange({
            item: startInRange, range, rangeMode: "start"
        })).toBe(true);
    });

    test('Start mode false with only end in range', () => {
        expect(isInRange({
            item: endInRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode false with item larger than range', () => {
        expect(isInRange({
            item: largerThanRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode true with point in range', () => {
        expect(isInRange({
            item: pointInRange, range, rangeMode: "start"
        })).toBe(true);
    });

    test('Start mode false with point before range', () => {
        expect(isInRange({
            item: pointBeforeRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode false with point after range', () => {
        expect(isInRange({
            item: pointAfterRange, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Start mode true with item that starts on range start', () => {
        expect(isInRange({
            item: startsOnRangeStart, range, rangeMode: "start"
        })).toBe(true);
    });

    test('Start mode false with item that starts on range end', () => {
        expect(isInRange({
            item: startsOnRangeEnd, range, rangeMode: "start"
        })).toBe(false);
    });

    test('Defaults to "enclose" mode', () => {
        expect(isInRange({ item: enclosed, range })).toBe(true);
        expect(isInRange({ item: startInRange, range })).toBe(false);
    });
});

describe('getItemsInRange', () => {
    // what to test
});

describe('getTotalRange', () => {
    // what to test
});

describe('slugify', () => {
    // what to test
});