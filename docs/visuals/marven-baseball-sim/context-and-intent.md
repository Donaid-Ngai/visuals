# Context and Intent

## What problem this visual solves
The baseball sim business concept involves multiple layers:

- a public-facing booking journey
- payment and confirmation logic
- access control and physical environment automation
- operational coordination
- follow-up, CRM, and retention systems

Without a structured visual, this kind of concept usually gets explained as a long messy description.
That creates two problems:

1. the business flow becomes hard to follow
2. the technical/system complexity becomes invisible until too late

This visual solves that by separating the explanation into two clean views.

## What the visual is trying to convey
This project should communicate all of the following:

### 1. The customer journey is simple
From the visitor's perspective, the flow should feel straightforward:

- arrive on web app
- book
- pay
- get access
- run session
- receive follow-up

This simplicity is important because it represents the user-facing promise.

### 2. The underlying stack is not simple
The system topology should reveal that many systems sit behind that seemingly simple journey.

That is a core message of the page.
The viewer should understand that operational simplicity for the customer often requires backend complexity.

### 3. Ownership is mixed
Some parts should be custom-built.
Some parts should be bought as services.

The visual should help a viewer understand where custom software makes sense and where SaaS or external tooling is more practical.

### 4. Cost and setup are distributed
The topology should make it clear that the real cost is not one thing.
It spreads across:

- app and backend work
- payment tools
- messaging tools
- automation tools
- access control tools
- hardware and physical integration
- CRM and monitoring

### 5. The diagrams are explanation tools, not internal engineering diagrams
These visuals should stay legible to non-technical viewers.
They are not meant to be precise infrastructure schematics.
They are meant to be business explanation diagrams that still carry meaningful implementation context.

## Why the page is organized this way
The organization is intentional.

## Section order
The page should begin with the journey, then move to the stack.

Reason:
- people understand flows faster than systems
- the journey gives the topology meaning
- the topology lands better once the viewer knows what the systems are supporting

## Why the user flow is interactive
The top-level user flow is intentionally high-level.
If it stayed static, each step would need too much text to feel useful.

The expandable interaction solves that by letting the page do both:

- remain readable at a glance
- reveal more detail on demand

This allows the user flow to work as a compact story on first read and a deeper process map on second read.

## Why the expanded subflows exist
Each main step hides real sub-processes.
For example:
- booking is not just "booking"
- access is not just "open door"
- follow-up is not just "send email"

The expandable subflows expose those hidden mini-sequences.
This helps the viewer understand what each step actually means without turning the top row into clutter.

## Why the topology is floating instead of linear
The topology should not look like a pipeline.
It is a network.

A floating network layout communicates these things better:
- central systems versus satellites
- clusters of related responsibilities
- shared dependencies
- non-linear system relationships

If the topology becomes too linear, it falsely suggests the system behaves like a simple chain.
That weakens the explanation.

## Communication priorities
When making design choices, keep these priorities in order:

1. clarity
2. readable labels
3. understandable grouping
4. enough metadata to support discussion
5. visual polish

If there is a tradeoff between polish and comprehension, choose comprehension.

## What should remain true even after redesigns
Future redesigns can change styling, motion, or layout details, but these truths should remain:

- the journey comes first
- the system map comes second
- the journey should feel simple
- the topology should reveal layered complexity
- nodes should be readable without requiring clicks
- expanded interaction should add detail, not hide the main story
- ownership, cost, and setup implications should remain visible
