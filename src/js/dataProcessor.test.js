import { validateGroup } from "./dataProcessor";

describe('validateGroup', () => {
    test('Well-formed', () => {
        expect(validateGroup({
            "id": 1,
            "name": "Test"
        })).toEqual([]);
    });

    test('Well-formed with extra fields', () => {
        expect(validateGroup({
            "id": 1,
            "name": "Test",
            "person": "J.R.R. Tolkien",
        })).toEqual([]);
    });

    test('Missing id', () => {
        const missingId = { "name": "Test" };
        expect(validateGroup(missingId))
            .toEqual([`Missing 'id':\n${JSON.stringify(missingId)}`]);
    });

    test('Missing name', () => {
        const missingName = { "id": 1 };
        expect(validateGroup(missingName))
            .toEqual([`Missing 'name':\n${JSON.stringify(missingName)}`]);
    });

    test('Empty object', () => {
        expect(validateGroup({}).length).toBeGreaterThan(0);
    });
});
