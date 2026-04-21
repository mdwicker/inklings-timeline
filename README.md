# Inklings Timeline
*An interactive timeline of events in the life of the Inklings and its members.*  
[Click here to go to the timeline.](https://mdwicker.github.io/inklings-timeline)

## What This Is
This site is a timeline of the Inklings and its members, focusing especially
on C.S. Lewis and J.R.R. Tolkien. The aim is to include thorough coverage of
their lives as well as their writing process. I have tried to be as rigorous
as possible, and to document my sources in all cases.

Because of the amount of data covered, the timeline cannot display all events
at all zoom levels. The level of detail adjusts intelligently as you zoom based
on event significance. The goal is to have something like a "Google Maps"
timeline, where you get more detail the closer you zoom.

On a technical level, this app uses [vis-timeline](https://github.com/visjs/vis-timeline) for timeline rendering.

## Background

I was looking around to try and find a resource that would help me be able
to visualize the relationship between various events in the Inklings lives.
(*Did Lewis publish any books during his Great War with Owen Barfield?
What was Tolkien working on writing when Charles Williams moved to Oxford?* etc.)
The resources I could find either didn't cover enough material (focused
just on one Inkling, or didn't go into much detail) or they were text-heavy
and difficult to visualize. So I decided to make my own.

I hope to flesh this out much more, both with more events and with more
interactivity.

## Limitations (for now)
- No category-based filtering (tags are in place, but haven't been implemented)
- Not much detail about their writing processes
- Background categories like life and occupation do not increase detail on zoom, even when more detailed information is available.

## Data Roadmap
- Lots more data about writing process (HoME draft dates, etc!)
- More detail on other Inklings. This might need to wait until group aggregation is introduced. ([see Feature Roadmap entry on group aggregation](#group-aggregation))
- Go through Chronologically Lewis and Hammond and Scull's Tolkien chronology to mine for interesting dates of all kinds.

## Feature Roadmap
- Cleaner UI (more color-coding, scrollbars, etc)
- Category-based filtering (life events, publications, writing, etc)
- <a id="group-aggregation">Group aggregation.</a> Collapse together groups (e.g. "Barfield," "Warren Lewis", etc) when they do not have many events on the timeline. If, for instance, there are not many pertinent events for Williams, Havard, Warnie, and Barfield at a particular zoom level, they could all be grouped together into a group called "Other Inklings" or something like that. Then when the user zooms into a period where Warnie did a lot of interesting things, he would pop out of that group and be listed on his own once more.
- Incorporate aggregation into the intelligent zoom system. This will help with background categories, so that for instance one could switch from simply listing "Birmingham" as a location to listing ecah individual address in Birmingham, depending on the zoom level.

## Event Priority Guidelines
The LOD zooming uses priority tags to determine event significance. Here is a
quick-and-dirty guideline to what the priority tags indicate. This is a reference
for me as the developer, since the priority tags are not visible to the user.
Some technical users might be interested in this glimpse behind the scenes.

### Priority 0: Essential Milestones
- Question: Is this a "Top 10" life event (Birth, Death, Marriage, Masterpiece)?
- Scale Check: Does the timeline "break" without this?
- Summary: Fundamental milestones that define a person's global reputation.

### Priority 1: Major Life Events
- Question: Is this a defining pillar of their career or a primary residence?
- Scale Check: Is this recognizable to a well-read non-specialist?
- Summary: The primary structure of a career; significant shifts and transitions.

### Priority 2: Notable Developments
- Question: Is this an important family or professional highlight?
- Scale Check: Does this add biographical "why" to their story?
- Summary: Important context for scholars and fans that isn't necessarily "world-famous."

### Priority 3: Granular Details
- Question: Is this an interesting detail for a dedicated fan?
- Scale Check: Is this "texture" rather than "structure"?
- Summary: Specific addresses, minor publications, and personal anecdotes that add color.

### Priority 4: Incidental or Niche Information
- Question: Is this a "deep-cut" fact or minor piece of trivia?
- Scale Check: Is this purely for archival or specialized research?
- Summary: Trivia, short-term trips, or very early/obscure works that don't impact the overall narrative.

