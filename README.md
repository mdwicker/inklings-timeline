# Inklings Timeline
*An interactive timeline of events in the life of the Inklings and its members.*

## What This Is
This site is a browser-based interactive timeline of the Inklings and
its members, focusing especially on C.S. Lewis and J.R.R. Tolkien, and
constructed using vis-timeline.

I was looking around to try and find a resource that would help me be able
to visualize the relationship between various events in the Inklings lives.
(*Did Lewis publish any books during his Great War with Owen Barfield?
What was Tolkien working on writing when Charles Williams moved to Oxford?* etc.)
The resources I could find either didn't cover enough material (focused
just on one Inkling, or didn't go into much detail) or they were text-heavy
and difficult to visualize. So I decided to make my own.

I hope to flesh this out much more, both with more events and with more
interactivity.

## Try It Out
All you have to do to try it out is visit[mdwicker.github.io/inklings-timeline]
(https://mdwicker.github.io/inklings-timeline).

## Current Features
- Top-level groups can be filtered with the arrow or with the toggle controls
- Ongoing events like location and occupation are pinned to the bottom of the section
- Level of detail adjusts intelligently as you zoom, based on event significance


## Limitations (for now)
- No category-based filtering
- Data is heavily skewed toward Tolkien and Lewis at the moment
- Not much detail about their writing processes

## Roadmap
- Cleaner UI (more color-coding, etc)
- Add more data! Other Inklings, general life events, creative process

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

