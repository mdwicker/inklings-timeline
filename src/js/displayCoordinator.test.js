import { createItemViewManager } from './displayCoordinator.js';
import { DataSet } from 'vis-data';

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