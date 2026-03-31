import { createItemViewManager, createGroupViewManager, createLodManager } from './displayCoordinator.js';
import { getTotalRange, isInRange, inDays } from './utils.js';
import { DataSet } from 'vis-data';
import { pubSub, events } from './pubSub.js';

jest.mock("./pubSub.js", () => ({
    pubSub: { publish: jest.fn() },
    events: { toggleGroup: "toggleGroup" }
}));

describe('item view manager', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const itemSet = new DataSet(items);

    test('empty itemset', () => {
        const emptyItemSet = new DataSet([]);

        expect(() => {
            const emptyItemView = createItemViewManager(emptyItemSet);
        }).not.toThrow();
    });

    test('initializes with no items in view', () => {
        const itemView = createItemViewManager(itemSet);
        expect(itemView.view.get()).toStrictEqual([]);
    });

    test('all items', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds(items.map(item => item.id));
        expect(itemView.view.get()).toStrictEqual(items);
    });

    test('filters visible ids', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds([2, 3]);
        expect(itemView.view.get()).toStrictEqual([{ id: 2 }, { id: 3 }]);
    });

    test('ignores order', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds([3, 1]);
        expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);

        itemView.refreshVisibleIds([1, 3]);
        expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);
    });

    test('refreshes visible ids', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds([1, 3]);
        expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);

        itemView.refreshVisibleIds([1, 2]);
        expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 2 }]);
    });

    test('non-existent id', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds([1, 3, 4]);
        expect(itemView.view.get()).toStrictEqual([{ id: 1 }, { id: 3 }]);
    });

    test('empty refresh array', () => {
        const itemView = createItemViewManager(itemSet);

        itemView.refreshVisibleIds([]);
        expect(itemView.view.get()).toStrictEqual([]);
    });
});

describe('group view manager', () => {
    const groups = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const groupSet = new DataSet(groups);

    const withParents = [
        { id: 4, parentId: 1 },
        { id: 5, parentId: 1 },
        { id: 6, parentId: 3 },
        { id: 7, parentId: 1 }
    ];
    const parentSet = new DataSet([...groups, ...withParents]);

    test('all groups visible', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual(groups);
    });

    test('toggle off', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get()).toStrictEqual([
            { id: 2 }, { id: 3 }
        ]);
    });

    test('toggle off then on', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        // toggles off
        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get()).toStrictEqual([
            { id: 2 }, { id: 3 }
        ]);

        // toggles on again
        groupView.toggleGroup({ id: 1, toggleStatus: true });
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);
    });

    test('toggle on when group is on', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        // toggleStatus true does nothing if group is already toggled on
        groupView.toggleGroup({ id: 1, toggleStatus: true });
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);
    });

    test('toggle off when group is off', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        // toggle group off
        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get()).toStrictEqual([
            { id: 2 }, { id: 3 }
        ]);

        // toggling off again does nothing
        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get()).toStrictEqual([
            { id: 2 }, { id: 3 }
        ]);
    });

    test('toggle multiple groups', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        // toggle 2 groups off
        groupView.toggleGroup({ id: 2, toggleStatus: false });
        groupView.toggleGroup({ id: 3, toggleStatus: false });

        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }
        ]);
    });

    test('toggle non-existent group', () => {
        const groupView = createGroupViewManager(groupSet);
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);

        groupView.toggleGroup({ id: 4, toggleStatus: false });
        expect(groupView.view.get()).toStrictEqual([
            { id: 1 }, { id: 2 }, { id: 3 }
        ]);
    });

    test('toggleGroup publishes once', () => {
        pubSub.publish.mockClear();
        const groupView = createGroupViewManager(groupSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });

        expect(pubSub.publish.mock.calls).toHaveLength(1);
    });

    test('toggleGroup publishes correct event', () => {
        pubSub.publish.mockClear();
        const groupView = createGroupViewManager(groupSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });

        // pubSub called once
        expect(pubSub.publish.mock.calls[0][0])
            .toStrictEqual('toggleGroup');
    });

    test('toggleGroup publishes correct info', () => {
        pubSub.publish.mockClear();
        const groupView = createGroupViewManager(groupSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });

        // pubSub called once
        expect(pubSub.publish.mock.calls[0][1])
            .toStrictEqual({ id: 1, toggleStatus: false });
    });

    test('parent group toggled off', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([2, 3, 6]);
    });

    test('parent group toggled off then on', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });
        groupView.toggleGroup({ id: 1, toggleStatus: true });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('multiple parents toggled off', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });
        groupView.toggleGroup({ id: 3, toggleStatus: false });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([2]);
    });

    test('child toggled off', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 5, toggleStatus: false });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([1, 2, 3, 4, 6, 7]);

    });

    test('parent and child toggled off', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 7, toggleStatus: false });
        groupView.toggleGroup({ id: 1, toggleStatus: false });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([2, 3, 6]);
    });

    test('parent toggled on, child left off', () => {
        const groupView = createGroupViewManager(parentSet);

        groupView.toggleGroup({ id: 1, toggleStatus: false });
        groupView.toggleGroup({ id: 7, toggleStatus: false });
        groupView.toggleGroup({ id: 1, toggleStatus: true });
        expect(groupView.view.get().map(group => group.id))
            .toStrictEqual([1, 2, 3, 4, 5, 6]);
    });
});

describe('LOD manager', () => {
    // getIds shows all events when zoomed in closer than 30 days
    // getIds retreives the appropriate ids in a simple set of items
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
            group: 1,
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
    const itemSet = new DataSet(items);

    test('simple happy path, two sections', () => {
        const LodManager = createLodManager({
            itemSet,
            numberOfLevels: 1,
            levelMultiplier: 2,
            sectionsPerWindow: 2,
            itemsPerSection: 2
        });

        expect(LodManager.getIds({
            windowStart: new Date("1900-01-01"),
            windowEnd: new Date("1906-01-01")
        })).toStrictEqual(new Set([1, 2, 3, 5]));
    });

    test('simple happy path, three sections', () => {
        const LodManager = createLodManager({
            itemSet,
            numberOfLevels: 1,
            levelMultiplier: 2,
            sectionsPerWindow: 3,
            itemsPerSection: 1
        });

        expect(LodManager.getIds({
            windowStart: new Date("1900-01-01"),
            windowEnd: new Date("1906-01-01")
        })).toStrictEqual(new Set([2, 3, 5]));
    });

    /**
     * so to break it down systematically. while STAYING at only a single zoom level, I can verify the following:
    * closer than 30 days shows all items (though I think I'm gonna add a clause for zoom level 0 to do the same thing,
    * aka, whenever it's smaller than the smallest).
    * try it with more itemsPerSection than exist (say, 3 or 4?)
    * idk if I need to check with ranges, etc, because theoretically my tests for sortItems is already covering all that.
    * I worked quite hard on it, lol.
    * check that backgrounds are doing what I say they are

    then try with different zoom levels:
    * add more items, probably, so that I can do more fine-grained tests.
    say, a dozen maybe? set them up so that at the closest zoom level it looks like:
   * one section with 5 items
   * one section with no items
   * one section with 1 item that doesn't get shown
   * one section where all of the items fit perfectly
   * and there are 3 zoom levels, each of which shows different levels of detail.
   * 
   * also edge cases:
   * empty itemSet
   * all items outside the window range
   * 0 items per section
     */
});