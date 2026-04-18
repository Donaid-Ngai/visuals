# Marven Baseball Sim Visual

## What this visual is
This visual is a business-system explainer for a baseball simulator operation.

It is not just a pretty diagram.
It is meant to help someone quickly understand two things:

1. the customer journey
2. the implementation stack behind that journey

The page is intentionally split into those two views because they answer different questions.

- The **user flow** answers: what does the visitor experience?
- The **system topology** answers: what systems make that experience possible?

This folder exists so any future agent, contributor, or platform can recover the full project context without needing chat history.

## Why this repo documentation exists
The goal is to make the visuals repo self-explanatory.

Any agent should be able to read the files in this folder and understand:

- what the page is trying to communicate
- why the diagrams are organized the way they are
- how the interaction model is supposed to work
- what tabs, nodes, values, labels, and metadata belong in the visual
- how to safely extend or edit the page without breaking the communication goal

## Current implementation target
- App route: `src/app/visuals/marven-baseball-sim/page.tsx`
- Framework: Next.js App Router
- Deployment target: Vercel
- Current page model: one explainer page with two major diagram sections

## Core communication goal
This project should help a viewer understand that:

- the customer experience looks simple
- the system behind it is more complex
- some parts are custom-built
- some parts are better handled by subscriptions or existing services
- cost, setup time, and responsibility spread across multiple systems

The page should make that feel obvious without needing a long verbal explanation.

## The two-diagram rule
This page should continue to follow this sequence:

1. **User flow first**
2. **System topology second**

This order matters.

If the topology appears first, people start reading the project as a technical stack diagram.
That weakens the story.
The story should start with the human-facing journey, then reveal the systems needed to support it.

## Files in this folder
- `README.md` - entry point and project overview
- `context-and-intent.md` - what the visual is trying to say and why it is structured this way
- `diagram-usage-guide.md` - how to read, present, and interact with the diagrams
- `data-spec.md` - source-of-truth content for steps, nodes, labels, values, and interaction rules
- `implementation-notes.md` - implementation guidance for the actual Next.js page

## Editing rule
When the visual changes materially, update these docs too.

That includes changes to:
- user flow steps
- node names
- cost ranges
- interaction model
- section order
- diagram intent
- page framing copy

The docs are not secondary.
They are part of the product and part of the handoff system.
