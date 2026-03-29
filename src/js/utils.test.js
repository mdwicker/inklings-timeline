import { inDays, isInRange, getTotalRange, slugify } from "./utils";

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

describe('getTotalRange', () => {

    test('Throws error with no input', () => {
        expect(() => { getTotalRange([]) }).toThrow();
    });

    test('Throws error with missing date field', () => {
        expect(() => {
            getTotalRange([{}]);
        }).toThrow("Missing date field.");
    });

    test('Throws error with invalid date field', () => {
        expect(() => {
            getTotalRange([
                { start: "1900-01-01" }
            ]);
        }).toThrow("Invalid date field.");

        expect(() => {
            getTotalRange([
                { start: new Date("1900-01-01"), end: "1910-01-01" }
            ]);
        }).toThrow("Invalid date field.");
    })

    test('Single range', () => {
        expect(getTotalRange([
            {
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01")
            }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01")
            }
        );
    });

    test('Two ranges', () => {
        expect(getTotalRange([
            {
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01")
            },
            {
                start: new Date("1920-01-01"),
                end: new Date("1925-01-01")
            }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1925-01-01")
            }
        )
    });

    test('Many ranges sorted', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01"), end: new Date("1900-12-31") },
            { start: new Date("1902-01-01"), end: new Date("1902-12-31") },
            { start: new Date("1903-01-01"), end: new Date("1903-12-31") },
            { start: new Date("1904-01-01"), end: new Date("1904-12-31") },
            { start: new Date("1905-01-01"), end: new Date("1905-12-31") },
            { start: new Date("1906-01-01"), end: new Date("1906-12-31") },
            { start: new Date("1907-01-01"), end: new Date("1907-12-31") },
            { start: new Date("1908-01-01"), end: new Date("1908-12-31") },
            { start: new Date("1909-01-01"), end: new Date("1909-12-31") },
            { start: new Date("1910-01-01"), end: new Date("1910-12-31") },
            { start: new Date("1911-01-01"), end: new Date("1911-12-31") },
            { start: new Date("1912-01-01"), end: new Date("1912-12-31") },
            { start: new Date("1913-01-01"), end: new Date("1913-12-31") },
            { start: new Date("1914-01-01"), end: new Date("1914-12-31") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1914-12-31")
            }
        );
    });

    test('Many ranges unsorted', () => {
        expect(getTotalRange([
            { start: new Date("1912-01-01"), end: new Date("1912-12-31") },
            { start: new Date("1904-01-01"), end: new Date("1904-12-31") },
            { start: new Date("1908-01-01"), end: new Date("1908-12-31") },
            { start: new Date("1900-01-01"), end: new Date("1900-12-31") },
            { start: new Date("1914-01-01"), end: new Date("1914-12-31") },
            { start: new Date("1902-01-01"), end: new Date("1902-12-31") },
            { start: new Date("1907-01-01"), end: new Date("1907-12-31") },
            { start: new Date("1911-01-01"), end: new Date("1911-12-31") },
            { start: new Date("1903-01-01"), end: new Date("1903-12-31") },
            { start: new Date("1909-01-01"), end: new Date("1909-12-31") },
            { start: new Date("1905-01-01"), end: new Date("1905-12-31") },
            { start: new Date("1913-01-01"), end: new Date("1913-12-31") },
            { start: new Date("1906-01-01"), end: new Date("1906-12-31") },
            { start: new Date("1910-01-01"), end: new Date("1910-12-31") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1914-12-31")
            }
        );
    });

    test('Overlapping ranges', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01"), end: new Date("1905-01-01") },
            { start: new Date("1902-01-01"), end: new Date("1908-01-01") },
            { start: new Date("1901-01-01"), end: new Date("1907-01-01") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1908-01-01")
            }
        );
    });

    test('Nested ranges', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01"), end: new Date("1910-01-01") },
            { start: new Date("1902-01-01"), end: new Date("1907-01-01") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01")
            }
        );
    });

    test('Single point', () => {
        expect(getTotalRange([
            {
                start: new Date("1900-01-01")
            }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1900-01-01")
            }
        )
    });

    test('Two points', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01") },
            { start: new Date("1910-01-01") }

        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01")
            }
        )
    });

    test('Many points sorted', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01") },
            { start: new Date("1901-01-01") },
            { start: new Date("1902-01-01") },
            { start: new Date("1903-01-01") },
            { start: new Date("1904-01-01") },
            { start: new Date("1905-01-01") },
            { start: new Date("1906-01-01") },
            { start: new Date("1907-01-01") },
            { start: new Date("1908-01-01") },
            { start: new Date("1909-01-01") },
            { start: new Date("1910-01-01") },
            { start: new Date("1911-01-01") },
            { start: new Date("1912-01-01") },
            { start: new Date("1913-01-01") },
            { start: new Date("1914-01-01") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1914-01-01")
            }
        );
    });

    test('Many points unsorted', () => {
        expect(getTotalRange([
            { start: new Date("1907-01-01") },
            { start: new Date("1912-01-01") },
            { start: new Date("1901-01-01") },
            { start: new Date("1914-01-01") },
            { start: new Date("1904-01-01") },
            { start: new Date("1900-01-01") },
            { start: new Date("1909-01-01") },
            { start: new Date("1903-01-01") },
            { start: new Date("1911-01-01") },
            { start: new Date("1906-01-01") },
            { start: new Date("1913-01-01") },
            { start: new Date("1905-01-01") },
            { start: new Date("1908-01-01") },
            { start: new Date("1902-01-01") },
            { start: new Date("1910-01-01") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("1914-01-01")
            }
        );
    });

    test('Points and ranges mixed', () => {
        expect(getTotalRange([
            { start: new Date("1900-01-01") },
            { start: new Date("1890-01-01"), end: new Date("1910-01-01") },
            { start: new Date("1920-01-01") }
        ])).toEqual(
            {
                start: new Date("1890-01-01"),
                end: new Date("1920-01-01")
            }
        );
    });

    test('Chaos test', () => {
        expect(getTotalRange([
            { start: new Date("1950-01-01"), end: new Date("1960-01-01") },
            { start: new Date("1905-06-15") },
            { start: new Date("1920-01-01"), end: new Date("1930-01-01") },
            { start: new Date("1900-01-01"), end: new Date("1910-01-01") },
            { start: new Date("1995-01-01") },
            { start: new Date("1925-01-01"), end: new Date("1935-01-01") },
            { start: new Date("1902-01-01"), end: new Date("1908-01-01") },
            { start: new Date("1970-01-01"), end: new Date("1980-01-01") },
            { start: new Date("1999-12-31"), end: new Date("2000-01-01") },
            { start: new Date("1955-01-01"), end: new Date("1958-01-01") },
            { start: new Date("1910-01-01"), end: new Date("1920-01-01") },
            { start: new Date("1940-01-01") },
            { start: new Date("1985-01-01"), end: new Date("1990-01-01") },
            { start: new Date("1900-01-01"), end: new Date("1910-01-01") },
            { start: new Date("1965-01-01") },
            { start: new Date("1930-01-01"), end: new Date("1945-01-01") },
            { start: new Date("1900-05-01") },
            { start: new Date("1998-01-01"), end: new Date("1999-01-01") },
            { start: new Date("1915-01-01"), end: new Date("1916-01-01") },
            { start: new Date("1950-01-01"), end: new Date("1960-01-01") }
        ])).toEqual(
            {
                start: new Date("1900-01-01"),
                end: new Date("2000-01-01")
            }
        );
    });

});

describe('slugify', () => {
    // what to test
});