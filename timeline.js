/**
 * TO-DO
 * Implement visualization of timeline width (or maybe scrollbar....)
 * better color coding
 * labels for small ranges?
 */

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
                content: rawGroup.name,
                className: rawGroup.className
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
    min: '1880-01-01',
    max: '1990-01-01',
    start: '1920-01-01',
    end: '1950-12-31',
    margin: {
      item : {
        horizontal : 0
      }
    },
    tooltip: {
      template: function (item) {
        if (!('name' in item)){
          return item.content;
        } else {
          return item.name;
        }
      }
    }
};

// Create a Timeline
var timeline = new vis.Timeline(container, items, groups, options); 
