import "../styles/styles.css";
import "../styles/vis-timeline-graph2d.min.css";
import { Timeline } from "vis-timeline/peer"
import { DataSet } from "vis-data/peer";

const style = document.createElement('style');
style.textContent = `
  .vis-item.vis-background.bottom-half {
    height: 50% !important;
    top: auto !important;
    bottom: 0 !important;
  }
  .vis-item.vis-background.top-half {
    height: 50% !important;
    top: 0 !important;
  }

.spacer {
  height: 55px !important}
`;
document.head.appendChild(style);

const items = new DataSet([
  // { id: 1, content: 'item 1', start: '2013-04-20', end: '2013-04-21', group: 1, subgroup: "1" },
  // { id: 2, content: 'item 2', start: '2013-04-14', end: '2013-04-17', group: 1, subgroup: "2" },
  // { id: 3, content: 'item 3', start: '2013-04-18', end: '2013-04-25', group: 1, subgroup: "1" },
  // { id: 4, content: 'item 4', start: '2013-04-16', group: 1, subgroup: "2" },
  // { id: 5, content: 'item 5', start: '2013-04-25', end: '2013-04-27', group: 1, subgroup: "1" },
  // { id: 6, content: 'item 6', start: '2013-04-27', group: 1, subgroup: "2" },
  {
    id: 1, content: 'item 1', start: '2013-04-20', end: '2013-04-21', group: 1,
    style: "z-index: 10"
  },
  { id: 2, content: 'item 2', start: '2013-04-14', end: '2013-04-17', group: 1 },
  { id: 3, content: 'item 3', start: '2013-04-14', end: '2013-04-27', group: 1, className: "spacer", type: "background" },
  { id: 4, content: 'item 4', start: '2013-04-16', group: 1, style: "z-index: 10" },
  { id: 5, content: 'item 5', start: '2013-04-25', end: '2013-04-27', group: 1 },
  { id: 6, content: 'item 6', start: '2013-04-27', group: 1 },
  {
    id: 7, content: 'item 7', start: '2013-04-14', end: '2013-04-26', group: 1, type: "background", className: "bottom-half",
    style: "background-color: blue; opacity: 0.5; z-index: -1;"
  },
  {
    id: 8, content: 'item 8', start: '2013-04-20', end: '2013-04-22', group: 1, type: "background", className: "top-half",
    style: "background-color: green; opacity: 0.5; z-index: -1;"
  },

]);

const groups = new DataSet([
  { id: 1, content: 'group 1' }
]);

const container = document.getElementById('visualization');

const options = {
};

const timeline = new Timeline(container, items, groups, options);