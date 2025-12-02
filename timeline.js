// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

// Get timeline data from data file
function processData(rawGroups) {
    // store these globally to allow flat sequential ordering
    let nextGroupId = 1;
    let nextItemId = 1;

    // flat arrays of all groups and items
    let groups = [];
    let items = [];

    function processGroups(currentGroups) {
        let groupIds = [];

        for (const rawGroup of currentGroups) {
            let group = {
                id: nextGroupId++,
                content: rawGroup.name
            };

            if (rawGroup.hasSubgroups) {
                // Recursive call to get subgroup IDs
                group.nestedGroups = processGroups(rawGroup.contents);
            } else {
                // Process the items and push them to the global flat item list
                const processedItems = rawGroup.contents.map(item => {
                    return {
                        ...item,
                        id: nextItemId++,
                        group: group.id
                    }
                })

                items.push(...processedItems);
            }

            // Push the fully processed group to the global flat list of groups
            groups.push(group);
            groupIds.push(group.id);
        }

        // Return the IDs of the groups processed at this level
        return groupIds;
    }

    processGroups(rawGroups);

    return {
        groups: groups,
        items: items
    }
}

const timelineData = processData(rawData);

var groups = new vis.DataSet(timelineData.groups);
var items = new vis.DataSet(timelineData.items);

// Configuration for the Timeline
var options = {
    horizontalScroll: true,
    verticalScroll: false,
    zoomKey: 'ctrlKey',
    min: '1850-01-01',
    max: '2000-01-01',
};

// Create a Timeline
var timeline = new vis.Timeline(container, items, groups, options); 
