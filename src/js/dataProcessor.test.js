import edtf from "edtf";
import { validateGroup, validateItem, validateData, visifyGroup, visifyItem } from "./dataProcessor";

describe('validateGroup', () => {
    test('Well-formed', () => {
        expect(validateGroup({
            "id": 1,
            "name": "Test"
        })).toStrictEqual([]);
    });

    test('Well-formed with extra fields', () => {
        expect(validateGroup({
            "id": 1,
            "name": "Test",
            "person": "J.R.R. Tolkien",
        })).toStrictEqual([]);
    });

    test('Missing id', () => {
        const missingId = { "name": "Test" };
        expect(validateGroup(missingId))
            .toStrictEqual([`Missing 'id':\n${JSON.stringify(missingId)}`]);
    });

    test('Negative id', () => {
        const negativeId = { "id": -1, "name": "Test" };
        expect(validateGroup(negativeId))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(negativeId)}`]);
    });

    test('Zero id', () => {
        const zeroId = { "id": 0, "name": "Test" };
        expect(validateGroup(zeroId))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(zeroId)}`]);
    });

    test('non-numeric id', () => {
        const nonNumericId = { "id": "One", "name": "Test" };
        expect(validateGroup(nonNumericId))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(nonNumericId)}`])
    });

    test('non-integer id', () => {
        const nonIntegerId = { "id": 1.5, "name": "Test" };
        expect(validateGroup(nonIntegerId))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(nonIntegerId)}`])
    })

    test('Missing name', () => {
        const missingName = { "id": 1 };
        expect(validateGroup(missingName))
            .toStrictEqual([`Missing 'name':\n${JSON.stringify(missingName)}`]);
    });

    test('Empty object', () => {
        expect(validateGroup({}).length).toBeGreaterThan(0);
    });
});

describe('validateItem', () => {
    const minPriority = 0;
    const maxPriority = 4;

    const wellFormed = {
        id: 1,
        group: 1,
        name: "Test",
        start: "1900-01-01",
        priority: 1,
    };

    test('well-formed', () => {
        expect(validateItem(wellFormed)).toStrictEqual([]);
    });

    test('well-formed with optional fields', () => {
        const withOptional = {
            ...wellFormed,
            end: "1910-01-01",
            category: "life",
            description: "Test description.",
            edtf: "1900-01/1910-01-01?",
            source: "Test source",
            note: "Note here"
        };
        expect(validateItem(withOptional)).toStrictEqual([]);
    });

    test('well-formed with unknown fields', () => {
        expect(validateItem(
            {
                ...wellFormed,
                extraString: "test",
                anotherNumber: 123,
                isTest: true,
                bonusArray: [1, 2, "test"],
            }
        )).toStrictEqual([]);
    });

    test('non-numeric id', () => {
        const nonNumericID = { ...wellFormed };
        nonNumericID.id = "One";

        expect(validateItem(nonNumericID))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(nonNumericID)}`]);
    });

    test('non-integer id', () => {
        const nonIntID = { ...wellFormed };
        nonIntID.id = 1.5;

        expect(validateItem(nonIntID))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(nonIntID)}`]);
    });

    test('zero id', () => {
        const zeroID = { ...wellFormed };
        zeroID.id = 0;

        expect(validateItem(zeroID))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(zeroID)}`]);
    });

    test('negative id', () => {
        const negativeId = { ...wellFormed };
        negativeId.id = -2;

        expect(validateItem(negativeId))
            .toStrictEqual([`Id must be positive integer:\n${JSON.stringify(negativeId)}`]);
    });

    test('missing ID', () => {
        const missingId = { ...wellFormed };
        delete missingId.id;

        expect(validateItem(missingId))
            .toStrictEqual([`Missing 'id':\n${JSON.stringify(missingId)}`]);
    });

    test('missing name', () => {
        const missingName = { ...wellFormed };
        delete missingName.name;

        expect(validateItem(missingName))
            .toStrictEqual([`Missing 'name':\n${JSON.stringify(missingName)}`]);
    });

    test('missing group', () => {
        const missingGroup = { ...wellFormed };
        delete missingGroup.group;

        expect(validateItem(missingGroup))
            .toStrictEqual([`Missing 'group':\n${JSON.stringify(missingGroup)}`]);
    });

    test('missing priority', () => {
        const missingPriority = { ...wellFormed };
        delete missingPriority.priority;

        expect(validateItem(missingPriority))
            .toStrictEqual([`Missing 'priority':\n${JSON.stringify(missingPriority)}`]);
    });

    test('non-numeric priority', () => {
        const nonNumericPriority = { ...wellFormed };
        nonNumericPriority.priority = "Priority One";

        expect(validateItem(nonNumericPriority))
            .toStrictEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(nonNumericPriority)}`]);
    });

    test('non-integer priority', () => {
        const nonIntPriority = { ...wellFormed };
        nonIntPriority.priority = 1.5;

        expect(validateItem(nonIntPriority))
            .toStrictEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(nonIntPriority)}`]);
    });

    test('valid priorities', () => {
        const validPriority = { ...wellFormed };

        for (let i = minPriority; i <= maxPriority; i++) {
            validPriority.priority = i;
            expect(validateItem(validPriority)).toStrictEqual([]);
        }
    });

    test('negative priority', () => {
        const negativePriority = { ...wellFormed };
        negativePriority.priority = -2;

        expect(validateItem(negativePriority))
            .toStrictEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(negativePriority)}`]);
    });

    test('priority too large', () => {
        const largePriority = { ...wellFormed };
        largePriority.priority = maxPriority + 1;

        expect(validateItem(largePriority))
            .toStrictEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(largePriority)}`]);
    });

    test('no date field', () => {
        const noDate = { ...wellFormed };
        delete noDate.start;

        expect(validateItem(noDate))
            .toStrictEqual([`No date field:\n${JSON.stringify(noDate)}`]);
    });

    test('invalid start date', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "Invalid";

        expect(validateItem(invalidStart))
            .toStrictEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('start date: no such day', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "1900-02-31";
        expect(validateItem(invalidStart))
            .toStrictEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('edtf date as start date', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "1900-02-31?";
        expect(validateItem(invalidStart))
            .toStrictEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('valid end date', () => {
        const validEnd = { ...wellFormed };
        validEnd.end = "1900-01-01";

        expect(validateItem(validEnd)).toStrictEqual([]);
    });

    test('invalid end date', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "Invalid";

        expect(validateItem(invalidEnd))
            .toStrictEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('end date: no such day', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "1900-02-31";
        expect(validateItem(invalidEnd))
            .toStrictEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('edtf date as end date', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "1900-02-31?";
        expect(validateItem(invalidEnd))
            .toStrictEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('invalid edtf date', () => {
        const invalidEdtf = { ...wellFormed };
        invalidEdtf.edtf = "Invalid";
        expect(validateItem(invalidEdtf))
            .toStrictEqual([`Invalid 'edtf' date:\n${JSON.stringify(invalidEdtf)}`]);
    });

    test('edtf date: no such day', () => {
        const invalidEdtf = { ...wellFormed };
        invalidEdtf.edtf = "1900-02-31";
        expect(validateItem(invalidEdtf))
            .toStrictEqual([`Invalid 'edtf' date:\n${JSON.stringify(invalidEdtf)}`]);
    });

    test('valid edtf-only date', () => {
        const validEdtf = { ...wellFormed };
        validEdtf.edtf = "1900-01-01?";
        expect(validateItem(validEdtf)).toStrictEqual([]);
    });

    test('valid edtf date', () => {
        const validEdtf = { ...wellFormed };
        validEdtf.edtf = "1900-01-01";
        expect(validateItem(validEdtf)).toStrictEqual([]);
    });
});

describe('validateData', () => {
    const groups = [
        {
            id: 1,
            name: "Group 1"
        },
        {
            id: 2,
            name: "Group 2"
        },
        {
            id: 3,
            name: "Group 3"
        }
    ];

    const items = [
        {
            id: 1,
            group: 1,
            name: "Item One",
            start: "1900-01-01",
            priority: 1,
        },
        {
            id: 2,
            group: 1,
            name: "Item Two",
            start: "1901-01-01",
            priority: 1,
        },
        {
            id: 3,
            group: 2,
            name: "Item Three",
            start: "1902-01-01",
            priority: 1,
        },
        {
            id: 4,
            group: 3,
            name: "Item Four",
            start: "1903-01-01",
            priority: 1,
        }
    ];

    test('well-formed data', () => {
        expect(validateData({ groups, items }))
            .toStrictEqual([]);
    });

    test('duplicate group id', () => {
        expect(validateData({
            groups: [...groups, { id: 1, name: "Duplicate 1" }], items
        })).toStrictEqual(["Group id '1' used twice."]);
    });

    test('duplicate item id', () => {
        expect(validateData({
            groups,
            items: [...items,
            {
                id: 1,
                group: 1,
                name: "Duplicate One",
                start: "1900-01-01",
                priority: 1,
            }]
        })).toStrictEqual(["Item id '1' used twice."]);
    });

    test('non-existent group id', () => {
        expect(validateData({
            groups, items: [
                ...items,
                {
                    id: 5,
                    group: 5,
                    name: "Invalid Group",
                    start: "1900-01-01",
                    priority: 1,
                }
            ]
        })).toStrictEqual(["Group id '5' does not exist."]);
    });

    test('no arguments', () => {
        expect(validateData()).toStrictEqual([]);
    });

    test('empty array arguments', () => {
        expect(validateData({ groups: [], items: [] })).toStrictEqual([]);
    });
});

describe('visifyGroup', () => {
    const basic = visifyGroup({
        "id": 1,
        "name": "Test"
    });

    const withAdditionalFields = visifyGroup({
        "id": 1,
        "name": "Test",
        "category": "person",
        "tags": ["tag1", "tag2"]
    });

    test('basic group keys', () => {
        const keys = Object.keys(basic);

        expect(keys).toStrictEqual(expect.arrayContaining([
            'id',
            'content',
            'className',
            'subgroupOrder',
            'subgroupStack'
        ]));
    });

    test('group with additional fields keys', () => {
        const keys = Object.keys(withAdditionalFields);

        expect(keys).toStrictEqual(expect.arrayContaining([
            'id',
            'content',
            'className',
            'subgroupOrder',
            'subgroupStack',
            'category',
            'tags'
        ]));
    });

    test('content field', () => {
        expect(basic.content).toStrictEqual("Test");
    });

    test('name field deleted', () => {
        expect(Object.keys(basic)).not.toContain('name');
    });

    test('id field', () => {
        expect(basic.id).toBe(1);
    });

    test('id from string', () => {
        expect(visifyGroup({
            id: "1",
            name: "Test"
        }).id).toBe(1);
    });

    test('className field', () => {
        expect(basic.className).toStrictEqual("test");
    });

    test('additional fields', () => {
        expect(withAdditionalFields.category).toStrictEqual("person");
        expect(withAdditionalFields.tags).toStrictEqual(["tag1", "tag2"]);
    });

    test('subgroup stack', () => {
        expect(basic.subgroupStack).toStrictEqual({
            "normal": true,
            "location": true,
            "occupation": true
        });
    });

    test('subgroup order', () => {
        const locationItem = { subgroup: "location" };
        const occupationItem = { subgroup: "occupation" };
        const normalItem = { subgroup: "normal" };

        expect(basic.subgroupOrder(locationItem, normalItem)).toBeGreaterThan(0);
        expect(basic.subgroupOrder(normalItem, locationItem)).toBeLessThan(0);

        expect(basic.subgroupOrder(occupationItem, normalItem)).toBeGreaterThan(0);
        expect(basic.subgroupOrder(normalItem, occupationItem)).toBeLessThan(0);

        // actual order of background categories doesn't matter,
        // but they shouldn't be the same.
        expect(basic.subgroupOrder(locationItem, occupationItem)).not.toBe(0);
    });
});

describe('visifyItem', () => {
    const basicPoint = {
        id: 1,
        group: 1,
        name: "Test",
        start: "1900-01-01",
        priority: 1,
    };

    const basicRange = {
        id: 1,
        group: 1,
        name: "Test",
        start: "1900-01-01",
        end: "1910-01-01",
        priority: 1,
    };

    const backgroundItem = {
        id: 1,
        group: 1,
        name: "Test",
        start: "1900-01-01",
        end: "1910-01-01",
        priority: 1,
        category: "location"
    };

    test('basic point', () => {
        expect(visifyItem(basicPoint))
            .toStrictEqual({
                id: 1,
                group: 1,
                content: "Test",
                start: new Date("1900-01-01"),
                priority: 1,
                type: "point",
                subgroup: "normal",
                isBackground: false,
            });
    });

    test('id from string', () => {
        const withStringId = { ...basicPoint };
        withStringId.id = "1";

        expect(visifyItem(withStringId))
            .toStrictEqual({
                id: 1,
                group: 1,
                content: "Test",
                start: new Date("1900-01-01"),
                priority: 1,
                type: "point",
                subgroup: "normal",
                isBackground: false,
            });
    });

    test('basic range', () => {
        expect(visifyItem(basicRange))
            .toStrictEqual({
                id: 1,
                group: 1,
                content: "Test",
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01"),
                priority: 1,
                type: "range",
                subgroup: "normal",
                isBackground: false,
            });
    });

    test('optional fields', () => {
        expect(visifyItem({
            ...basicPoint,
            category: "life",
            description: "Test description.",
            edtf: "1900-01?",
            source: "Test source",
            note: "Test note"
        })).toStrictEqual({
            id: 1,
            group: 1,
            content: "Test",
            start: new Date("1900-01-01"),
            edtf: edtf("1900-01?"),
            priority: 1,
            category: "life",
            description: "Test description.",
            source: "Test source",
            note: "Test note",
            type: "point",
            subgroup: "normal",
            isBackground: false,
        });
    });

    test('unknown fields', () => {
        expect(visifyItem({
            ...basicPoint,
            extraString: "test",
            anotherNumber: 123,
            isTest: true,
            bonusArray: [1, 2, "test"],
        })).toStrictEqual({
            id: 1,
            group: 1,
            content: "Test",
            start: new Date("1900-01-01"),
            priority: 1,
            type: "point",
            subgroup: "normal",
            isBackground: false,
            extraString: "test",
            anotherNumber: 123,
            isTest: true,
            bonusArray: [1, 2, "test"],
        });
    });

    test('background item', () => {
        expect(visifyItem(backgroundItem))
            .toStrictEqual({
                id: 1,
                group: 1,
                content: "🏠Test",
                className: "background",
                start: new Date("1900-01-01"),
                end: new Date("1910-01-01"),
                priority: 1,
                category: "location",
                type: "range",
                subgroup: "location",
                isBackground: true,
            });
    });
});
