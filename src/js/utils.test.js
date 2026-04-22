import {
  slugify,
  inDays,
  isInRange,
  getTotalRange,
  getRangeSections,
  sortItems,
  getCurrentZoomLevel,
  calculateZoomLevels,
} from "./utils";

const ONEDAYINMS = 86400000;

describe("slugify", () => {
  test("no transformation", () => {
    expect(slugify("test")).toEqual("test");
  });

  test("trims whitespace", () => {
    expect(slugify("   test")).toEqual("test");
    expect(slugify("test ")).toEqual("test");
    expect(slugify(" test ")).toEqual("test");
    expect(slugify("\ntest")).toEqual("test");
    expect(slugify("\ttest")).toEqual("test");
  });

  test("whitespace to hyphens", () => {
    expect(slugify("test test")).toEqual("test-test");
    expect(slugify("test  test")).toEqual("test-test");
    expect(slugify("test\ntest")).toEqual("test-test");
    expect(slugify("test\ttest")).toEqual("test-test");
    expect(slugify("test test test")).toEqual("test-test-test");
  });

  test("punctuation", () => {
    expect(slugify("te.st")).toEqual("test");
    expect(slugify("~!@#$%^&*()+\"\\`';:|}{[]/?.,><test")).toEqual("test");
  });

  test("numbers", () => {
    expect(slugify("test123")).toEqual("test123");
  });

  test("lowercase", () => {
    expect(slugify("TEST")).toEqual("test");
    expect(slugify("Test")).toEqual("test");
    expect(slugify("TEsT")).toEqual("test");
  });

  test("real world test", () => {
    expect(slugify("J.R.R. Tolkien")).toEqual("jrr-tolkien");
  });
});

describe("inDays", () => {
  test("1 day", () => {
    expect(inDays(86400000)).toBe(1);
  });

  test("365 days", () => {
    expect(inDays(31536000000)).toBe(365);
  });

  test("2 and a half days", () => {
    expect(inDays(216000000)).toBe(2.5);
  });

  test("0 days", () => {
    expect(inDays(0)).toBe(0);
  });

  test("negative", () => {
    expect(inDays(-86400000)).toBe(1);
  });
});

describe("isInRange", () => {
  const range = {
    start: new Date("1900-01-01"),
    end: new Date("1910-01-01"),
  };

  const enclosed = {
    start: new Date("1902-01-01"),
    end: new Date("1906-01-01"),
  };

  const beforeRange = {
    start: new Date("1890-01-01"),
    end: new Date("1895-01-01"),
  };

  const afterRange = {
    start: new Date("1920-01-01"),
    end: new Date("1925-01-01"),
  };

  const startInRange = {
    start: new Date("1905-01-01"),
    end: new Date("1915-01-01"),
  };

  const endInRange = {
    start: new Date("1895-01-01"),
    end: new Date("1905-01-01"),
  };

  const largerThanRange = {
    start: new Date("1895-01-01"),
    end: new Date("1915-01-01"),
  };

  const startsOnRangeStart = {
    start: new Date("1900-01-01"),
    end: new Date("1905-01-01"),
  };

  const startsOnRangeEnd = {
    start: new Date("1910-01-01"),
    end: new Date("1915-01-01"),
  };

  const pointInRange = {
    start: new Date("1905-01-01"),
  };

  const pointBeforeRange = {
    start: new Date("1890-01-01"),
  };

  const pointAfterRange = {
    start: new Date("1915-01-01"),
  };

  test("Enclose mode true with item enclosed", () => {
    expect(
      isInRange({
        item: enclosed,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(true);
  });

  test("Enclose mode true with point in range", () => {
    expect(
      isInRange({
        item: pointInRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(true);
  });

  test("Enclose mode false with item out of range (before)", () => {
    expect(
      isInRange({
        item: beforeRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with item out of range (after)", () => {
    expect(
      isInRange({
        item: afterRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with only start in range", () => {
    expect(
      isInRange({
        item: startInRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with only end in range", () => {
    expect(
      isInRange({
        item: endInRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with item larger than range", () => {
    expect(
      isInRange({
        item: largerThanRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with point before range", () => {
    expect(
      isInRange({
        item: pointBeforeRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode false with point after range", () => {
    expect(
      isInRange({
        item: pointAfterRange,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Enclose mode true with item that starts on range start", () => {
    expect(
      isInRange({
        item: startsOnRangeStart,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(true);
  });

  test("Enclose mode false with item that starts on range end", () => {
    expect(
      isInRange({
        item: startsOnRangeEnd,
        range,
        rangeMode: "enclose",
      }),
    ).toBe(false);
  });

  test("Overlap mode true with item enclosed", () => {
    expect(
      isInRange({
        item: enclosed,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode false with item out of range (before)", () => {
    expect(
      isInRange({
        item: beforeRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(false);
  });

  test("Overlap mode false with item out of range (after)", () => {
    expect(
      isInRange({
        item: afterRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(false);
  });

  test("Overlap mode true with only start in range", () => {
    expect(
      isInRange({
        item: startInRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode true with only end in range", () => {
    expect(
      isInRange({
        item: endInRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode true with item larger than range", () => {
    expect(
      isInRange({
        item: largerThanRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode true with point in range", () => {
    expect(
      isInRange({
        item: pointInRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode false with point before range", () => {
    expect(
      isInRange({
        item: pointBeforeRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(false);
  });

  test("Overlap mode false with point after range", () => {
    expect(
      isInRange({
        item: pointAfterRange,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(false);
  });

  test("Overlap mode true with item that starts on range start", () => {
    expect(
      isInRange({
        item: startsOnRangeStart,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(true);
  });

  test("Overlap mode false with item that starts on range end", () => {
    expect(
      isInRange({
        item: startsOnRangeEnd,
        range,
        rangeMode: "overlap",
      }),
    ).toBe(false);
  });

  test("Start mode true with item enclosed", () => {
    expect(
      isInRange({
        item: enclosed,
        range,
        rangeMode: "start",
      }),
    ).toBe(true);
  });

  test("Start mode false with item out of range (before)", () => {
    expect(
      isInRange({
        item: beforeRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode false with item out of range (after)", () => {
    expect(
      isInRange({
        item: afterRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode true with only start in range", () => {
    expect(
      isInRange({
        item: startInRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(true);
  });

  test("Start mode false with only end in range", () => {
    expect(
      isInRange({
        item: endInRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode false with item larger than range", () => {
    expect(
      isInRange({
        item: largerThanRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode true with point in range", () => {
    expect(
      isInRange({
        item: pointInRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(true);
  });

  test("Start mode false with point before range", () => {
    expect(
      isInRange({
        item: pointBeforeRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode false with point after range", () => {
    expect(
      isInRange({
        item: pointAfterRange,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test("Start mode true with item that starts on range start", () => {
    expect(
      isInRange({
        item: startsOnRangeStart,
        range,
        rangeMode: "start",
      }),
    ).toBe(true);
  });

  test("Start mode false with item that starts on range end", () => {
    expect(
      isInRange({
        item: startsOnRangeEnd,
        range,
        rangeMode: "start",
      }),
    ).toBe(false);
  });

  test('Defaults to "enclose" mode', () => {
    expect(isInRange({ item: enclosed, range })).toBe(true);
    expect(isInRange({ item: startInRange, range })).toBe(false);
  });
});

describe("getTotalRange", () => {
  test("Throws error with empty array", () => {
    expect(() => {
      getTotalRange([]);
    }).toThrow();
  });

  test("Throws error with missing date field", () => {
    expect(() => {
      getTotalRange([{}]);
    }).toThrow("Missing date field.");
  });

  test("Throws error with invalid start date", () => {
    expect(() => {
      getTotalRange([{ start: "1900-01-01" }]);
    }).toThrow("Invalid date field.");
  });

  test("Throws error with invalid end date", () => {
    expect(() => {
      getTotalRange([{ start: new Date("1900-01-01"), end: "1910-01-01" }]);
    }).toThrow("Invalid date field.");
  });

  test("Single range", () => {
    expect(
      getTotalRange([
        {
          start: new Date("1900-01-01"),
          end: new Date("1910-01-01"),
        },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1910-01-01"),
    });
  });

  test("Two ranges", () => {
    expect(
      getTotalRange([
        {
          start: new Date("1900-01-01"),
          end: new Date("1910-01-01"),
        },
        {
          start: new Date("1920-01-01"),
          end: new Date("1925-01-01"),
        },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1925-01-01"),
    });
  });

  test("Many ranges sorted", () => {
    expect(
      getTotalRange([
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
        { start: new Date("1914-01-01"), end: new Date("1914-12-31") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1914-12-31"),
    });
  });

  test("Many ranges unsorted", () => {
    expect(
      getTotalRange([
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
        { start: new Date("1910-01-01"), end: new Date("1910-12-31") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1914-12-31"),
    });
  });

  test("Overlapping ranges", () => {
    expect(
      getTotalRange([
        { start: new Date("1900-01-01"), end: new Date("1905-01-01") },
        { start: new Date("1902-01-01"), end: new Date("1908-01-01") },
        { start: new Date("1901-01-01"), end: new Date("1907-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1908-01-01"),
    });
  });

  test("Nested ranges", () => {
    expect(
      getTotalRange([
        { start: new Date("1900-01-01"), end: new Date("1910-01-01") },
        { start: new Date("1902-01-01"), end: new Date("1907-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1910-01-01"),
    });
  });

  test("Single point", () => {
    expect(
      getTotalRange([
        {
          start: new Date("1900-01-01"),
        },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1900-01-01"),
    });
  });

  test("Two points", () => {
    expect(
      getTotalRange([
        { start: new Date("1900-01-01") },
        { start: new Date("1910-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1910-01-01"),
    });
  });

  test("Many points sorted", () => {
    expect(
      getTotalRange([
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
        { start: new Date("1914-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1914-01-01"),
    });
  });

  test("Many points unsorted", () => {
    expect(
      getTotalRange([
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
        { start: new Date("1910-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("1914-01-01"),
    });
  });

  test("Points and ranges mixed", () => {
    expect(
      getTotalRange([
        { start: new Date("1900-01-01") },
        { start: new Date("1890-01-01"), end: new Date("1910-01-01") },
        { start: new Date("1920-01-01") },
      ]),
    ).toEqual({
      start: new Date("1890-01-01"),
      end: new Date("1920-01-01"),
    });
  });

  test("Chaos test", () => {
    expect(
      getTotalRange([
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
        { start: new Date("1950-01-01"), end: new Date("1960-01-01") },
      ]),
    ).toEqual({
      start: new Date("1900-01-01"),
      end: new Date("2000-01-01"),
    });
  });
});

describe("getRangeSections", () => {
  test("one window, one section", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
      windowSize: ONEDAYINMS,
      sectionsPerWindow: 1,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
    ]);
  });

  test("one window, two sections", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-03"),
      },
      windowSize: ONEDAYINMS * 2,
      sectionsPerWindow: 2,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
      {
        start: new Date("1900-01-02"),
        end: new Date("1900-01-03"),
      },
    ]);
  });

  test("two windows, two sections", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-03"),
      },
      windowSize: ONEDAYINMS,
      sectionsPerWindow: 1,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
      {
        start: new Date("1900-01-02"),
        end: new Date("1900-01-03"),
      },
    ]);
  });

  test("two windows, four sections", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-05"),
      },
      windowSize: ONEDAYINMS * 2,
      sectionsPerWindow: 2,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
      {
        start: new Date("1900-01-02"),
        end: new Date("1900-01-03"),
      },
      {
        start: new Date("1900-01-03"),
        end: new Date("1900-01-04"),
      },
      {
        start: new Date("1900-01-04"),
        end: new Date("1900-01-05"),
      },
    ]);
  });

  test("two windows, one sections (less than 1 section/window", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-03"),
      },
      windowSize: ONEDAYINMS,
      sectionsPerWindow: 0.5,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-03"),
      },
    ]);
  });

  test("ten one-day sections", () => {
    const windowSize = ONEDAYINMS * 3;
    const range = {
      start: new Date("1900-01-01"),
      end: new Date("1900-01-11"),
    };
    const sectionsPerWindow = 3;
    const sections = getRangeSections({
      totalRange: range,
      windowSize,
      sectionsPerWindow,
    });
    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-02"),
      },
      {
        start: new Date("1900-01-02"),
        end: new Date("1900-01-03"),
      },
      {
        start: new Date("1900-01-03"),
        end: new Date("1900-01-04"),
      },
      {
        start: new Date("1900-01-04"),
        end: new Date("1900-01-05"),
      },
      {
        start: new Date("1900-01-05"),
        end: new Date("1900-01-06"),
      },
      {
        start: new Date("1900-01-06"),
        end: new Date("1900-01-07"),
      },
      {
        start: new Date("1900-01-07"),
        end: new Date("1900-01-08"),
      },
      {
        start: new Date("1900-01-08"),
        end: new Date("1900-01-09"),
      },
      {
        start: new Date("1900-01-09"),
        end: new Date("1900-01-10"),
      },
      {
        start: new Date("1900-01-10"),
        end: new Date("1900-01-11"),
      },
    ]);
  });

  test("sections go past range end", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-11"),
      },
      windowSize: ONEDAYINMS * 6,
      sectionsPerWindow: 2,
    });

    expect(sections).toStrictEqual([
      {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-04"),
      },
      {
        start: new Date("1900-01-04"),
        end: new Date("1900-01-07"),
      },
      {
        start: new Date("1900-01-07"),
        end: new Date("1900-01-10"),
      },
      {
        start: new Date("1900-01-10"),
        end: new Date("1900-01-13"),
      },
    ]);
  });

  test("range zero", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-01"),
        end: new Date("1900-01-01"),
      },
      windowSize: ONEDAYINMS,
      sectionsPerWindow: 1,
    });

    expect(sections).toStrictEqual([]);
  });

  test("range start after range end", () => {
    const sections = getRangeSections({
      totalRange: {
        start: new Date("1900-01-02"),
        end: new Date("1900-01-01"),
      },
      windowSize: ONEDAYINMS,
      sectionsPerWindow: 1,
    });

    expect(sections).toStrictEqual([]);
  });

  test("zero sections/window", () => {
    expect(() => {
      getRangeSections({
        totalRange: {
          start: new Date("1900-01-01"),
          end: new Date("1900-01-011"),
        },
        windowSize: ONEDAYINMS,
        sectionsPerWindow: 0,
      });
    }).toThrow("sectionsPerWindow must be positive.");
  });

  test("zero windowSize", () => {
    expect(() => {
      getRangeSections({
        totalRange: {
          start: new Date("1900-01-01"),
          end: new Date("1900-01-011"),
        },
        windowSize: 0,
        sectionsPerWindow: 1,
      });
    }).toThrow("windowSize must be positive.");
  });
});

describe("sortItems", () => {
  test("multiple by priority", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "Test 1",
        start: new Date("1900-01-01"),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "Test 2",
        start: new Date("1920-01-01"),
        end: new Date("1922-01-01"),
        priority: 0,
        type: "range",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 3,
        group: 1,
        content: "Test 3",
        start: new Date("1920-01-01"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 4,
        group: 2,
        content: "Test 4",
        start: new Date("1820-01-01"),
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([
      2, 1, 4, 3,
    ]);
  });

  test("by priority", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "Test 1",
        start: new Date("1950-01-01"),
        priority: 0,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "Test 2",
        start: new Date("1920-01-01"),
        end: new Date("1922-01-01"),
        priority: 1,
        type: "range",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([1, 2]);
  });

  test("by priority (2)", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "Test 1",
        start: new Date("1950-01-01"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "Test 2",
        start: new Date("1920-01-01"),
        end: new Date("1922-01-01"),
        priority: 1,
        type: "range",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([2, 1]);
  });

  test("type tie-break", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "Test 1",
        start: new Date("1900-01-01"),
        priority: 3,
        type: "point",
        category: "life",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "Test 2",
        start: new Date("1920-01-01"),
        end: new Date("1922-01-01"),
        priority: 3,
        category: "life",
        type: "range",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([2, 1]);
  });

  test("category tie-break", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "Test 1",
        start: new Date("1940-01-01"),
        priority: 3,
        type: "point",
        category: "life",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "Test 2",
        start: new Date("1920-01-01"),
        priority: 3,
        category: "major-pub",
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([1, 2]);
  });

  test("alphabetical tie-break with no category", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "A Test",
        start: new Date("1900-01-01"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "B Test",
        start: new Date("1920-01-01"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([1, 2]);
  });

  test("alphabetical tie-break with category", () => {
    const items = [
      {
        id: 1,
        group: 1,
        content: "A Test",
        start: new Date("1900-01-01"),
        priority: 3,
        type: "point",
        category: "major-pub",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "B Test",
        start: new Date("1920-01-01"),
        priority: 3,
        category: "major-pub",
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([1, 2]);
  });

  test("chaos data", () => {
    const items = [
      {
        id: 1,
        group: 5,
        content: "Early Monograph",
        start: new Date("1905-03-15"),
        priority: 1,
        type: "point",
        subgroup: "normal",
        category: "major-pub",
        isBackground: false,
      },
      {
        id: 2,
        group: 4,
        content: "First Child Born",
        start: new Date("1907-06-12"),
        priority: 2,
        type: "point",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
      {
        id: 3,
        group: 3,
        content: "University Studies",
        start: new Date("1898-09-01"),
        end: new Date("1902-06-30"),
        priority: 1,
        type: "range",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
      {
        id: 4,
        group: 6,
        content: "Mango Quarterly Review",
        start: new Date("1931-02-14"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        category: "minor-pub",
        isBackground: false,
      },
      {
        id: 5,
        group: 1,
        content: "Research Fellowship",
        start: new Date("1908-01-01"),
        end: new Date("1914-01-01"),
        priority: 2,
        type: "range",
        subgroup: "occupation",
        category: "occupation",
        isBackground: true,
      },
      {
        id: 6,
        group: 5,
        content: "Final Address",
        start: new Date("1950-10-01"),
        priority: 4,
        type: "point",
        subgroup: "normal",
        category: "major-pub",
        isBackground: false,
      },
      {
        id: 7,
        group: 3,
        content: "Childhood in Vienna",
        start: new Date("1880-01-01"),
        end: new Date("1895-01-01"),
        priority: 0,
        type: "range",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
      {
        id: 8,
        group: 5,
        content: "Collected Essays Vol. 1",
        start: new Date("1925-01-01"),
        end: new Date("1927-01-01"),
        priority: 3,
        type: "range",
        subgroup: "normal",
        category: "major-pub",
        isBackground: false,
      },
      {
        id: 9,
        group: 1,
        content: "Academic Post",
        start: new Date("1903-01-01"),
        end: new Date("1910-01-01"),
        priority: 1,
        type: "range",
        subgroup: "occupation",
        category: "occupation",
        isBackground: true,
      },
      {
        id: 10,
        group: 4,
        content: "Later Life",
        start: new Date("1940-01-01"),
        end: new Date("1955-01-01"),
        priority: 4,
        type: "range",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
      {
        id: 11,
        group: 2,
        content: "Residence in London",
        start: new Date("1920-01-01"),
        end: new Date("1935-01-01"),
        priority: 2,
        type: "range",
        subgroup: "location",
        category: "location",
        isBackground: true,
      },
      {
        id: 12,
        group: 6,
        content: "Obituary Notice",
        start: new Date("1958-03-22"),
        priority: 4,
        type: "point",
        subgroup: "normal",
        category: "minor-pub",
        isBackground: false,
      },
      {
        id: 13,
        group: 3,
        content: "Birth",
        start: new Date("1880-01-01"),
        priority: 0,
        type: "point",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
      {
        id: 14,
        group: 6,
        content: "Apple Quarterly Review",
        start: new Date("1930-05-01"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        category: "minor-pub",
        isBackground: false,
      },
      {
        id: 15,
        group: 4,
        content: "Wartime Exile",
        start: new Date("1914-08-01"),
        end: new Date("1918-11-11"),
        priority: 2,
        type: "range",
        subgroup: "normal",
        category: "life",
        isBackground: false,
      },
    ];

    expect(items.sort(sortItems).map((item) => item.id)).toStrictEqual([
      7, 13, 3, 9, 1, 15, 5, 11, 2, 8, 14, 4, 10, 6, 12,
    ]);
  });
});

describe("getCurrentZoomLevel", () => {
  const levels = [10, 20, 30, 40];

  test("widest zoom level", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 45 })).toBe(40);
  });

  test("middle zoom level", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 29 })).toBe(20);
  });

  test("smallest zoom level", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 15 })).toBe(10);
  });

  test("exact zoom level", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 30 })).toBe(30);
  });

  test("extremely large zoom", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 1000000000000 })).toBe(40);
  });

  test("fractional window size", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 33.5 })).toBe(30);
  });

  test("fractional zoom level", () => {
    const fractionalLevels = [1.5, 5.5, 50.5, 80.3];
    expect(
      getCurrentZoomLevel({ levels: fractionalLevels, windowSize: 33 }),
    ).toBe(5.5);
  });

  test("window size smaller than smallest", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 5 })).toBe(0);
  });

  test("window size zero", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: 0 })).toBe(0);
  });

  test("window size negative", () => {
    expect(getCurrentZoomLevel({ levels, windowSize: -5 })).toBe(0);
  });
});

describe("calculateZoomLevels", () => {
  test("zero levels", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 0,
        levelMultiplier: 2,
      });
    }).toThrow("Cannot have less than one zoom level.");
  });

  test("non-integer numberOfLevels", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 1.5,
        levelMultiplier: 2,
      });
    }).toThrow("numberOfLevels must be an integer.");
  });

  test("non-numeric numberOfLevels", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: "1",
        levelMultiplier: 2,
      });
    }).toThrow("numberOfLevels must be an integer.");
  });

  test("non-numeric level multiplier", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 1,
        levelMultiplier: "2",
      });
    }).toThrow("levelMultiplier must be a finite number.");
  });

  test("negative number of levels", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: -1,
        levelMultiplier: 2,
      });
    }).toThrow("Cannot have less than one zoom level.");
  });

  test("level multiplier zero", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 5,
        levelMultiplier: 0,
      });
    }).toThrow("Level multiplier must be greater than one.");
  });

  test("negative level multiplier", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 5,
        levelMultiplier: -1,
      });
    }).toThrow("Level multiplier must be greater than one.");
  });

  test("level multiplier one", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 5,
        levelMultiplier: 1,
      });
    }).toThrow("Level multiplier must be greater than one.");
  });

  test("invalid range start field", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: "1900-01-01",
        rangeEnd: new Date("2000-01-01"),
        numberOfLevels: 5,
        levelMultiplier: 2,
      });
    }).toThrow("Range boundaries must be Date objects.");
  });

  test("invalid range end field", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: "2000-01-01",
        numberOfLevels: 5,
        levelMultiplier: 2,
      });
    }).toThrow("Range boundaries must be Date objects.");
  });

  test("range size of zero", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1900-01-01"),
        numberOfLevels: 2,
        levelMultiplier: 2,
      });
    }).toThrow("Range size must be larger than zero.");
  });

  test("range size of zero", () => {
    expect(() => {
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1800-01-01"),
        numberOfLevels: 2,
        levelMultiplier: 2,
      });
    }).toThrow("Range size must be larger than zero.");
  });

  test("three levels, multiplier 2", () => {
    expect(
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1900-01-21"),
        numberOfLevels: 3,
        levelMultiplier: 2,
      }),
    ).toStrictEqual([ONEDAYINMS * 20, ONEDAYINMS * 10, ONEDAYINMS * 5]);
  });

  test("fractional multiplier", () => {
    expect(
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1900-01-19"),
        numberOfLevels: 3,
        levelMultiplier: 1.5,
      }),
    ).toStrictEqual([ONEDAYINMS * 18, ONEDAYINMS * 12, ONEDAYINMS * 8]);
  });

  test("large multiplier", () => {
    expect(
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1900-01-31"),
        numberOfLevels: 3,
        levelMultiplier: 30,
      }),
    ).toStrictEqual([ONEDAYINMS * 30, ONEDAYINMS, ONEDAYINMS / 30]);
  });

  test("one level", () => {
    expect(
      calculateZoomLevels({
        rangeStart: new Date("1900-01-01"),
        rangeEnd: new Date("1900-01-02"),
        numberOfLevels: 1,
        levelMultiplier: 3,
      }),
    ).toStrictEqual([ONEDAYINMS]);
  });
});
