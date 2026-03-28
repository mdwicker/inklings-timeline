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
    // true for enclosed item
    // false for non-enclosed item
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