# Implementation Notes

## Purpose
This file explains how the Marven Baseball Sim visual is implemented in the Next.js repo and how future agents should approach changes.

Current route:
- `src/app/visuals/marven-baseball-sim/page.tsx`

## Current implementation model
The page is currently implemented as a single client component.
It contains:

- page framing content
- a user flow section
- a topology section
- inline data arrays for user flow and topology nodes

This is acceptable for the current size, but it is not necessarily the final structure.

## Recommended future refactor direction
As the project gets deeper, the page should likely be broken into smaller units:

- `components/visuals/marven-baseball-sim/UserFlowRail.tsx`
- `components/visuals/marven-baseball-sim/UserFlowNodeCard.tsx`
- `components/visuals/marven-baseball-sim/ExpandedSubflow.tsx`
- `components/visuals/marven-baseball-sim/TopologyMap.tsx`
- `components/visuals/marven-baseball-sim/SectionCard.tsx`
- `data/visuals/marven-baseball-sim.ts`

That would make the repo easier for future agents to edit safely.

## Recommended source-of-truth direction
The actual page data should eventually be moved out of the page component into a typed data file.

Reason:
- content and presentation should be easier to separate
- future agents should be able to update labels and values without hunting through JSX
- docs and code can map more cleanly

A likely future structure would be:

```text
src/
  app/visuals/marven-baseball-sim/page.tsx
  components/visuals/marven-baseball-sim/*
  data/visuals/marven-baseball-sim.ts

docs/
  visuals/marven-baseball-sim/*
```

## User flow implementation guidance
The user flow should continue to behave like this:

- top-level nodes remain visible
- selected node is highlighted
- only one expanded step is shown by default
- expanded content appears below the rail
- the rail should still read left-to-right even when no one interacts with it

### Future enhancement option
A future enhancement could place the expanded area more directly under the clicked node position instead of in one shared panel below the whole rail.

That may feel more spatially connected, but it must not reduce readability on smaller screens.

## Topology implementation guidance
The topology should preserve a connected system-diagram feel.
Visible subsystem relationships are part of the communication value, so the page should keep a readable network map rather than only grouped lane cards.

That does not mean every possible edge should be shown.
The requirement is a legible connected map with quick-glance subsystem metadata.

If the page later needs richer interactivity, future implementations could still use:
- React Flow
- a custom layout system
- or a light coordinate mapping abstraction

However, the main requirement is still readability plus visible system relationships, not library sophistication.

## Styling guidance
The page should continue to feel:
- clean
- dark and modern
- explanatory
- compact
- legible at a glance

Avoid:
- noisy gradients
- too many line crossings
- excessive motion
- tiny unreadable metadata

## Documentation rules for future contributors
When making material changes, contributors should update:
- the route code
- `docs/visuals/marven-baseball-sim/data-spec.md`
- any intent docs affected by the change

Examples of changes that require doc updates:
- adding/removing a step
- changing labels
- changing cost ranges
- changing interaction behavior
- adding tabs or new diagram sections
- altering the communication goal of the page

## If new tabs or sections are added
If the page grows beyond the current two-diagram pattern, future contributors should document:
- what each new tab or section is for
- why it exists
- what question it answers
- what data powers it
- how it should be read

The repo should always be able to teach a new agent how the visual works without relying on hidden context.
