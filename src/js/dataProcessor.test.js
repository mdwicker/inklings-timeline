import { validateGroup, validateItem, validateData } from "./dataProcessor";

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

    test('Negative id', () => {
        const negativeId = { "id": -1, "name": "Test" };
        expect(validateGroup(negativeId))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(negativeId)}`]);
    });

    test('Zero id', () => {
        const zeroId = { "id": 0, "name": "Test" };
        expect(validateGroup(zeroId))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(zeroId)}`]);
    });

    test('non-numeric id', () => {
        const nonNumericId = { "id": "One", "name": "Test" };
        expect(validateGroup(nonNumericId))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(nonNumericId)}`])
    });

    test('non-integer id', () => {
        const nonIntegerId = { "id": 1.5, "name": "Test" };
        expect(validateGroup(nonIntegerId))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(nonIntegerId)}`])
    })

    test('Missing name', () => {
        const missingName = { "id": 1 };
        expect(validateGroup(missingName))
            .toEqual([`Missing 'name':\n${JSON.stringify(missingName)}`]);
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
        expect(validateItem(wellFormed)).toEqual([]);
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
        expect(validateItem(withOptional)).toEqual([]);
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
        )).toEqual([]);
    });

    test('non-numeric id', () => {
        const nonNumericID = { ...wellFormed };
        nonNumericID.id = "One";

        expect(validateItem(nonNumericID))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(nonNumericID)}`]);
    });

    test('non-integer id', () => {
        const nonIntID = { ...wellFormed };
        nonIntID.id = 1.5;

        expect(validateItem(nonIntID))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(nonIntID)}`]);
    });

    test('zero id', () => {
        const zeroID = { ...wellFormed };
        zeroID.id = 0;

        expect(validateItem(zeroID))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(zeroID)}`]);
    });

    test('negative id', () => {
        const negativeId = { ...wellFormed };
        negativeId.id = -2;

        expect(validateItem(negativeId))
            .toEqual([`Id must be positive integer:\n${JSON.stringify(negativeId)}`]);
    });

    test('missing ID', () => {
        const missingId = { ...wellFormed };
        delete missingId.id;

        expect(validateItem(missingId))
            .toEqual([`Missing 'id':\n${JSON.stringify(missingId)}`]);
    });

    test('missing name', () => {
        const missingName = { ...wellFormed };
        delete missingName.name;

        expect(validateItem(missingName))
            .toEqual([`Missing 'name':\n${JSON.stringify(missingName)}`]);
    });

    test('missing group', () => {
        const missingGroup = { ...wellFormed };
        delete missingGroup.group;

        expect(validateItem(missingGroup))
            .toEqual([`Missing 'group':\n${JSON.stringify(missingGroup)}`]);
    });

    test('missing priority', () => {
        const missingPriority = { ...wellFormed };
        delete missingPriority.priority;

        expect(validateItem(missingPriority))
            .toEqual([`Missing 'priority':\n${JSON.stringify(missingPriority)}`]);
    });

    test('non-numeric priority', () => {
        const nonNumericPriority = { ...wellFormed };
        nonNumericPriority.priority = "Priority One";

        expect(validateItem(nonNumericPriority))
            .toEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(nonNumericPriority)}`]);
    });

    test('non-integer priority', () => {
        const nonIntPriority = { ...wellFormed };
        nonIntPriority.priority = 1.5;

        expect(validateItem(nonIntPriority))
            .toEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(nonIntPriority)}`]);
    });

    test('valid priorities', () => {
        const validPriority = { ...wellFormed };

        for (let i = minPriority; i <= maxPriority; i++) {
            validPriority.priority = i;
            expect(validateItem(validPriority)).toEqual([]);
        }
    });

    test('negative priority', () => {
        const negativePriority = { ...wellFormed };
        negativePriority.priority = -2;

        expect(validateItem(negativePriority))
            .toEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(negativePriority)}`]);
    });

    test('priority too large', () => {
        const largePriority = { ...wellFormed };
        largePriority.priority = maxPriority + 1;

        expect(validateItem(largePriority))
            .toEqual([`Priority must be int ${minPriority}-${maxPriority}:\n${JSON.stringify(largePriority)}`]);
    });

    test('no date field', () => {
        const noDate = { ...wellFormed };
        delete noDate.start;

        expect(validateItem(noDate))
            .toEqual([`No date field:\n${JSON.stringify(noDate)}`]);
    });

    test('invalid start date', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "Invalid";

        expect(validateItem(invalidStart))
            .toEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('start date: no such day', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "1900-02-31";
        expect(validateItem(invalidStart))
            .toEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('edtf date as start date', () => {
        const invalidStart = { ...wellFormed };
        invalidStart.start = "1900-02-31?";
        expect(validateItem(invalidStart))
            .toEqual([`Invalid 'start' date:\n${JSON.stringify(invalidStart)}`]);
    });

    test('valid end date', () => {
        const validEnd = { ...wellFormed };
        validEnd.end = "1900-01-01";

        expect(validateItem(validEnd)).toEqual([]);
    });

    test('invalid end date', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "Invalid";

        expect(validateItem(invalidEnd))
            .toEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('end date: no such day', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "1900-02-31";
        expect(validateItem(invalidEnd))
            .toEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('edtf date as end date', () => {
        const invalidEnd = { ...wellFormed };
        invalidEnd.end = "1900-02-31?";
        expect(validateItem(invalidEnd))
            .toEqual([`Invalid 'end' date:\n${JSON.stringify(invalidEnd)}`]);
    });

    test('invalid edtf date', () => {
        const invalidEdtf = { ...wellFormed };
        invalidEdtf.edtf = "Invalid";
        expect(validateItem(invalidEdtf))
            .toEqual([`Invalid 'edtf' date:\n${JSON.stringify(invalidEdtf)}`]);
    });

    test('edtf date: no such day', () => {
        const invalidEdtf = { ...wellFormed };
        invalidEdtf.edtf = "1900-02-31";
        expect(validateItem(invalidEdtf))
            .toEqual([`Invalid 'edtf' date:\n${JSON.stringify(invalidEdtf)}`]);
    });

    test('valid edtf-only date', () => {
        const validEdtf = { ...wellFormed };
        validEdtf.edtf = "1900-01-01?";
        expect(validateItem(validEdtf)).toEqual([]);
    });

    test('valid edtf date', () => {
        const validEdtf = { ...wellFormed };
        validEdtf.edtf = "1900-01-01";
        expect(validateItem(validEdtf)).toEqual([]);
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
            .toEqual([]);
    });

    test('duplicate group id', () => {
        expect(validateData({
            groups: [...groups, { id: 1, name: "Duplicate 1" }], items
        })).toEqual(["Group id '1' used twice."]);
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
        })).toEqual(["Item id '1' used twice."]);
    });

    test('invalid id', () => {
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
        })).toEqual(["Group id '5' does not exist."]);
    });
});
