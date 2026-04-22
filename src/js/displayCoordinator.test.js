import {
  createItemViewManager,
  createGroupViewManager,
  createLodManager,
} from "./displayCoordinator.js";
import { DataSet } from "vis-data";
import { pubSub } from "./pubSub.js";

jest.mock("./pubSub.js", () => ({
  pubSub: { publish: jest.fn() },
  events: { toggleGroup: "toggleGroup" },
}));

describe("item view manager", () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const itemSet = new DataSet(items);

  test("empty itemset", () => {
    const emptyItemSet = new DataSet([]);

    expect(() => {
      createItemViewManager(emptyItemSet);
    }).not.toThrow();
  });

  test("initializes with no items in view", () => {
    const itemView = createItemViewManager(itemSet);
    expect(itemView.view.get()).toStrictEqual([]);
  });

  test("all items", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds(items.map((item) => item.id));
    expect(itemView.view.get()).toStrictEqual(items);
  });

  test("filters visible ids", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds([2, 3]);
    expect(itemView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);
  });

  test("ignores order", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds([3, 1]);
    expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);

    itemView.refreshVisibleIds([1, 3]);
    expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);
  });

  test("refreshes visible ids", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds([1, 3]);
    expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);

    itemView.refreshVisibleIds([1, 2]);
    expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 2 }]);
  });

  test("non-existent id", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds([1, 3, 4]);
    expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);
  });

  test("empty refresh array", () => {
    const itemView = createItemViewManager(itemSet);

    itemView.refreshVisibleIds([]);
    expect(itemView.view.get()).toStrictEqual([]);
  });
});

describe("group view manager", () => {
  const groups = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const groupSet = new DataSet(groups);

  const withParents = [
    { id: 4, parentId: 1 },
    { id: 5, parentId: 1 },
    { id: 6, parentId: 3 },
    { id: 7, parentId: 1 },
  ];
  const parentSet = new DataSet([...groups, ...withParents]);

  test("all groups visible", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual(groups);
  });

  test("toggle off", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);
  });

  test("toggle off then on", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    // toggles off
    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);

    // toggles on again
    groupView.toggleGroup({ id: 1, toggleStatus: true });
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  test("toggle on when group is on", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    // toggleStatus true does nothing if group is already toggled on
    groupView.toggleGroup({ id: 1, toggleStatus: true });
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  test("toggle off when group is off", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    // toggle group off
    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);

    // toggling off again does nothing
    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);
  });

  test("toggle multiple groups", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    // toggle 2 groups off
    groupView.toggleGroup({ id: 2, toggleStatus: false });
    groupView.toggleGroup({ id: 3, toggleStatus: false });

    expect(groupView.view.get()).toStrictEqual([{ id: 1 }]);
  });

  test("toggle non-existent group", () => {
    const groupView = createGroupViewManager(groupSet);
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    groupView.toggleGroup({ id: 4, toggleStatus: false });
    expect(groupView.view.get()).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  test("toggleGroup publishes once", () => {
    pubSub.publish.mockClear();
    const groupView = createGroupViewManager(groupSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });

    expect(pubSub.publish.mock.calls).toHaveLength(1);
  });

  test("toggleGroup publishes correct event", () => {
    pubSub.publish.mockClear();
    const groupView = createGroupViewManager(groupSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });

    // pubSub called once
    expect(pubSub.publish.mock.calls[0][0]).toStrictEqual("toggleGroup");
  });

  test("toggleGroup publishes correct info", () => {
    pubSub.publish.mockClear();
    const groupView = createGroupViewManager(groupSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });

    // pubSub called once
    expect(pubSub.publish.mock.calls[0][1]).toStrictEqual({
      id: 1,
      toggleStatus: false,
    });
  });

  test("parent group toggled off", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([
      2, 3, 6,
    ]);
  });

  test("parent group toggled off then on", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });
    groupView.toggleGroup({ id: 1, toggleStatus: true });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  test("multiple parents toggled off", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });
    groupView.toggleGroup({ id: 3, toggleStatus: false });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([2]);
  });

  test("child toggled off", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 5, toggleStatus: false });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([
      1, 2, 3, 4, 6, 7,
    ]);
  });

  test("parent and child toggled off", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 7, toggleStatus: false });
    groupView.toggleGroup({ id: 1, toggleStatus: false });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([
      2, 3, 6,
    ]);
  });

  test("parent toggled on, child left off", () => {
    const groupView = createGroupViewManager(parentSet);

    groupView.toggleGroup({ id: 1, toggleStatus: false });
    groupView.toggleGroup({ id: 7, toggleStatus: false });
    groupView.toggleGroup({ id: 1, toggleStatus: true });
    expect(groupView.view.get().map((group) => group.id)).toStrictEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });
});

describe("LOD manager", () => {
  const items = [
    {
      id: 1,
      group: 1,
      content: "Test 1",
      start: new Date("1901-01-01"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
    },
    {
      id: 2,
      group: 1,
      content: "Test 2",
      start: new Date("1902-01-01"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
    },
    {
      id: 3,
      group: 2,
      content: "Test 3",
      start: new Date("1903-06-01"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
    },
    {
      id: 4,
      group: 1,
      content: "Test 4",
      start: new Date("1904-01-01"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
    },
    {
      id: 5,
      group: 1,
      content: "Test 5",
      start: new Date("1905-01-01"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
    },
  ];
  const extraItems = [
    {
      id: 6,
      group: 1,
      content: "Event 6",
      start: new Date("1900-01-01"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 7,
      group: 2,
      content: "Event 7",
      start: new Date("1900-07-20"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 8,
      group: 1,
      content: "Event 8",
      start: new Date("1900-09-05"),
      priority: 0,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 9,
      group: 3,
      content: "Event 9",
      start: new Date("1900-10-12"),
      end: new Date("1900-10-14"),
      priority: 4,
      type: "range",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 10,
      group: 2,
      content: "Event 10",
      start: new Date("1900-11-22"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 11,
      group: 1,
      content: "Event 11",
      start: new Date("1900-12-01"),
      priority: 3,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 12,
      group: 3,
      content: "Event 12",
      start: new Date("1900-12-15"),
      end: new Date("1908-10-12"),
      priority: 2,
      type: "range",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 13,
      group: 2,
      content: "Event 13",
      start: new Date("1900-12-28"),
      priority: 0,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 14,
      group: 1,
      content: "Event 14",
      start: new Date("1901-01-10"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 15,
      group: 2,
      content: "Event 15",
      start: new Date("1901-02-14"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 16,
      group: 3,
      content: "Event 16",
      start: new Date("1901-03-25"),
      priority: 0,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 17,
      group: 1,
      content: "Event 17",
      start: new Date("1901-04-18"),
      priority: 3,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 18,
      group: 4,
      content: "Event 18",
      start: new Date("1901-06-02"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 19,
      group: 2,
      content: "Event 19",
      start: new Date("1901-08-30"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 20,
      group: 1,
      content: "Event 20",
      start: new Date("1902-01-15"),
      priority: 4,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 21,
      group: 3,
      content: "Event 21",
      start: new Date("1902-04-20"),
      end: new Date("1902-05-20"),
      priority: 0,
      type: "range",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 22,
      group: 2,
      content: "Event 22",
      start: new Date("1902-05-11"),
      end: new Date("1903-05-11"),
      priority: 1,
      type: "range",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 23,
      group: 1,
      content: "Event 23",
      start: new Date("1903-07-04"),
      priority: 3,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 24,
      group: 4,
      content: "Event 24",
      start: new Date("1903-08-15"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 25,
      group: 2,
      content: "Event 25",
      start: new Date("1903-09-10"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 26,
      group: 3,
      content: "Event 26",
      start: new Date("1903-09-29"),
      priority: 4,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "major-pub",
    },
    {
      id: 27,
      group: 1,
      content: "Event 27",
      start: new Date("1904-03-31"),
      priority: 1,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 28,
      group: 2,
      content: "Event 28",
      start: new Date("1904-04-01"),
      priority: 0,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "minor-pub",
    },
    {
      id: 29,
      group: 1,
      content: "Event 29",
      start: new Date("1904-11-15"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
    {
      id: 30,
      group: 1,
      content: "Event 29",
      start: new Date("1909-01-01"),
      priority: 2,
      type: "point",
      subgroup: "normal",
      isBackground: false,
      category: "life",
    },
  ];

  const simpleItemSet = new DataSet(items);
  const extendedItemSet = new DataSet(extraItems);

  test("simple happy path, two sections", () => {
    const LodManager = createLodManager({
      itemSet: simpleItemSet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 2,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1906-01-01"),
      }),
    ).toStrictEqual(new Set([1, 2, 3, 5]));
  });

  test("simple happy path, three sections", () => {
    const LodManager = createLodManager({
      itemSet: simpleItemSet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 3,
      itemsPerSection: 1,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1906-01-01"),
      }),
    ).toStrictEqual(new Set([2, 3, 5]));
  });

  test("closer than 30 days", () => {
    const monthItems = [
      {
        id: 6,
        group: 1,
        content: "Test 6",
        start: new Date("1901-01-03"),
        priority: 4,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 7,
        group: 1,
        content: "Test 7",
        start: new Date("1901-01-15"),
        priority: 3,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 8,
        group: 3,
        content: "Test 8",
        start: new Date("1901-01-15"),
        priority: 4,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 9,
        group: 1,
        content: "Test 9",
        start: new Date("1901-01-20"),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 10,
        group: 2,
        content: "Test 10",
        start: new Date("1901-01-22"),
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];
    const monthSet = new DataSet([...items, ...monthItems]);

    const LodManager = createLodManager({
      itemSet: monthSet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 2,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1901-01-01"),
        windowEnd: new Date("1901-01-25"),
      }),
    ).toStrictEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  });

  test("items out of window range", () => {
    const LodManager = createLodManager({
      itemSet: simpleItemSet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 2,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("2000-01-01"),
        windowEnd: new Date("2006-01-01"),
      }),
    ).toStrictEqual(new Set([1, 2, 3, 5]));
  });

  test("item at beginning and end of range are not ignored", () => {
    const boundaryItems = [
      {
        id: 1,
        group: 1,
        content: "Start boundary",
        start: new Date("1901-01-01"),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 1,
        content: "End boundary",
        start: new Date("1904-12-31"),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];
    const boundarySet = new DataSet(boundaryItems);
    const LodManager = createLodManager({
      itemSet: boundarySet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 2,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1904-12-31"),
      }),
    ).toStrictEqual(new Set([1, 2]));
  });

  test("items on boundary between sections", () => {
    const baseDate = new Date("1900-01-01");

    // large range size to avoid the "closer than 30 = show all"
    const rangeSize = 10000000000;

    const boundaryItems = [
      {
        id: 1,
        group: 1,
        content: "Start boundary",
        start: baseDate,
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 1,
        content: "Before midpoint",
        start: new Date(baseDate.valueOf() + rangeSize / 2 - 1),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 3,
        group: 1,
        content: "Midpoint",
        start: new Date(baseDate.valueOf() + rangeSize / 2),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 4,
        group: 1,
        content: "End boundary",
        start: new Date(baseDate.valueOf() + rangeSize),
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];
    const boundarySet = new DataSet(boundaryItems);
    const LodManager = createLodManager({
      itemSet: boundarySet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 1,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1900-06-01"),
      }),
    ).toStrictEqual(new Set([2, 3]));
  });

  test("boundary items not counted twice", () => {
    const baseDate = new Date("1900-01-01");

    // large range size to avoid the "closer than 30 = show all"
    const rangeSize = 10000000000;

    const boundaryItems = [
      {
        id: 1,
        group: 1,
        content: "Start boundary",
        start: baseDate,
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 2,
        group: 1,
        content: "Before midpoint",
        start: new Date(baseDate.valueOf() + rangeSize / 2 - 1),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 3,
        group: 1,
        content: "Midpoint",
        start: new Date(baseDate.valueOf() + rangeSize / 2),
        priority: 1,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
      {
        id: 4,
        group: 1,
        content: "End boundary",
        start: new Date(baseDate.valueOf() + rangeSize),
        priority: 2,
        type: "point",
        subgroup: "normal",
        isBackground: false,
      },
    ];
    const boundarySet = new DataSet(boundaryItems);
    const LodManager = createLodManager({
      itemSet: boundarySet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 2,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1900-06-01"),
      }),
    ).toStrictEqual(new Set([1, 2, 3, 4]));
  });

  test("zero items per section", () => {
    const LodManager = createLodManager({
      itemSet: simpleItemSet,
      numberOfLevels: 1,
      levelMultiplier: 2,
      sectionsPerWindow: 2,
      itemsPerSection: 0,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1901-01-01"),
        windowEnd: new Date("1910-01-01"),
      }),
    ).toStrictEqual(new Set([]));
  });

  test("negative items per section", () => {
    expect(() => {
      createLodManager({
        itemSet: simpleItemSet,
        numberOfLevels: 1,
        levelMultiplier: 2,
        sectionsPerWindow: 2,
        itemsPerSection: -1,
      });
    }).toThrow("Items per section must be a non-negative integer.");
  });

  test("non-integer items per section", () => {
    expect(() => {
      createLodManager({
        itemSet: simpleItemSet,
        numberOfLevels: 1,
        levelMultiplier: 2,
        sectionsPerWindow: 2,
        itemsPerSection: 1.5,
      });
    }).toThrow("Items per section must be a non-negative integer.");
  });

  test("non-number items per section", () => {
    expect(() => {
      createLodManager({
        itemSet: simpleItemSet,
        numberOfLevels: 1,
        levelMultiplier: 2,
        sectionsPerWindow: 2,
        itemsPerSection: "1",
      });
    }).toThrow("Items per section must be a non-negative integer.");
  });

  test("empty itemset", () => {
    expect(() => {
      createLodManager({
        itemSet: new DataSet([]),
        numberOfLevels: 1,
        levelMultiplier: 2,
        sectionsPerWindow: 2,
        itemsPerSection: 2,
      });
    }).toThrow("LOD Manager requires a non-empty itemSet.");
  });

  test("extended itemset, largest zoom level", () => {
    /** 
        section 1 (1900/01/01- - 1902/04/02+)
            6: 1900-01-01 p1
            7: 1900-07-20 p2
            * 8: 1900-09-05 p0
            9: 1900-10-12 / 1900-10-14 p4
            10: 1900-11-22 p1
            11: 1900-12-01 p3
            12: 1900-12-15 / 1908-10-12 p2
            * 13: 1900-12-28 p0
            14: 1901-01-10 p1
            15: 1901-02-14 p2
            * 16: 1901-03-25 p0
            17: 1901-04-18 p3
            18: 1901-06-02 p1
            19: 1901-08-30 p2
            20: 1902-01-15 p4
        section 2 (1902/04/02+ - 1904/07/02+)
            * 21: 1902-04-20 / 1902-05-20 p0
            * 22: 1902-05-11 / 1903-05-11 p1
            23: 1903-07-04 p3
            24: 1903-08-15 p2
            25: 1903-09-10 p1
            26: 1903-09-29 p4
            27: 1904-03-31 p1
            * 28: 1904-04-01 p0
        section 3 (1904/07/02+ - 1906/10/02+)
            29: 1904-11-15 p2
        section 4 (1906/10/02+ - 1909/01/01+)
            30: 1909-01-01 p2
        */
    const LodManager = createLodManager({
      itemSet: extendedItemSet,
      numberOfLevels: 3,
      levelMultiplier: 3,
      sectionsPerWindow: 4,
      itemsPerSection: 3,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1910-10-01"),
      }),
    ).toStrictEqual(new Set([8, 13, 16, 21, 22, 28, 29, 30]));
  });

  test("extended itemset, middle zoom level", () => {
    /** 
        section 1 (1900/01/01- - 1900/10/01+)
            6: 1900-01-01 p1
            7: 1900-07-20 p2
            8: 1900-09-05 p0
        section 2 (1900/10/01+ - 1901/07/02+)
            9: 1900-10-12 / 1900-10-14 p4
            * 10: 1900-11-22 p1
            11: 1900-12-01 p3
            12: 1900-12-15 / 1908-10-12 p2
            * 13: 1900-12-28 p0
            14: 1901-01-10 p1
            15: 1901-02-14 p2
            * 16: 1901-03-25 p0
            17: 1901-04-18 p3
            18: 1901-06-02 p1
        section 3 (1901/07/02+ - 1902/04/02+)
            19: 1901-08-30 p2
            20: 1902-01-15 p4
        section 4 (1902/04/02+ - 1903/01/01+)
            21: 1902-04-20 / 1902-05-20 p0
            22: 1902-05-11 / 1903-05-11 p1
        section 5 (1903/01/01+ - 1903/10/02+)
            * 23: 1903-07-04 p3
            * 24: 1903-08-15 p2
            * 25: 1903-09-10 p1
            26: 1903-09-29 p4
        section 6 (1903/10/02+ - 1904/07/02+)
            27: 1904-03-31 p1
            28: 1904-04-01 p0
        section 7 (1904/07/02+ - 1905/04/02+)
            29: 1904-11-15 p2
        [...]
        section 13 (1908/12/31+ - 1909-10-01+)
            30: 1909-01-01 p2
        */
    const LodManager = createLodManager({
      itemSet: extendedItemSet,
      numberOfLevels: 3,
      levelMultiplier: 3,
      sectionsPerWindow: 4,
      itemsPerSection: 3,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1904-01-01"),
      }),
    ).toStrictEqual(
      new Set([
        6, 7, 8, 10, 13, 16, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30,
      ]),
    );
  });

  test("extended itemset, smallest zoom level", () => {
    /** 
        (1900/01/01- - 1900/04/02+)
            6: 1900-01-01 p1
        (1900/04/02+ - 1900/07/02+)
            7: 1900-07-20 p2
        (1900/07/02+ - 1900/10/01+)
            8: 1900-09-05 p0
        (1900/10/01+ - 1901/01/01+)
            9: 1900-10-12 / 1900-10-14 p4
            * 10: 1900-11-22 p1
            11: 1900-12-01 p3
            * 12: 1900-12-15 / 1908-10-12 p2
            * 13: 1900-12-28 p0
        (1901/01/01+ - 1901/04/02+)
            14: 1901-01-10 p1
            15: 1901-02-14 p2
            16: 1901-03-25 p0
        (1901/04/02+ - 1901/07/02+)
            17: 1901-04-18 p3
            18: 1901-06-02 p1
        (1901/07/02+ - 1901/10/02+)
            19: 1901-08-30 p2
        (1901/10/02+ - 1902/01/01+)
            20: 1902-01-15 p4
        (1902/01/01+ - 1902/04/02+)
        (1902/04/02+ - 1902/07/03+)
            21: 1902-04-20 / 1902-05-20 p0
            22: 1902-05-11 / 1903-05-11 p1
        [...]
        (1903/07/03+ - 1903/10/02+)
            23: 1903-07-04 p3
            24: 1903-08-15 p2
            25: 1903-09-10 p1
            26: 1903-09-29 p4
        [...]
        (1904/04/02+ - 1904/07/02+)
            27: 1904-03-31 p1
            28: 1904-04-01 p0
        [...]
        (1904/10/01+ - 1905/01/01+)
            29: 1904-11-15 p2
        [...]
        (1909/01/01- - 1909/04/02+)
            30: 1909-01-01 p2
        */
    const LodManager = createLodManager({
      itemSet: extendedItemSet,
      numberOfLevels: 3,
      levelMultiplier: 3,
      sectionsPerWindow: 4,
      itemsPerSection: 3,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1901-02-01"),
      }),
    ).toStrictEqual(
      new Set([
        6, 7, 8, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27,
        28, 29, 30,
      ]),
    );
  });

  test("extended itemset, below smallest zoom level", () => {
    const LodManager = createLodManager({
      itemSet: extendedItemSet,
      numberOfLevels: 3,
      levelMultiplier: 3,
      sectionsPerWindow: 4,
      itemsPerSection: 3,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1900-10-01"),
      }),
    ).toStrictEqual(new Set(extraItems.map((item) => item.id)));
  });

  test("extended itemset, zoom below 30 days", () => {
    const LodManager = createLodManager({
      itemSet: extendedItemSet,
      numberOfLevels: 3,
      levelMultiplier: 3,
      sectionsPerWindow: 4,
      itemsPerSection: 3,
    });

    expect(
      LodManager.getIds({
        windowStart: new Date("1900-01-01"),
        windowEnd: new Date("1900-01-20"),
      }),
    ).toStrictEqual(new Set(extraItems.map((item) => item.id)));
  });
});
