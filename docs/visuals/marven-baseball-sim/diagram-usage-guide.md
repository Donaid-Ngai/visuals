# Diagram Usage Guide

## Purpose of this guide
This file explains how the diagrams are intended to be used.

It is for:
- future agents
- designers
- developers
- Donald or any collaborator presenting the concept

It should help someone understand not only what the diagrams contain, but how they are supposed to function as communication tools.

## Diagram 1: User flow

### Role of the user flow
The user flow is the first diagram because it anchors the story in the visitor experience.

It should answer:
- what happens first?
- what happens next?
- what does the customer experience?
- where does the loop back into re-engagement happen?

### How to read it
The user flow should be read left to right.

Primary sequence:
1. Visitor Web App
2. Booking Form
3. Payment
4. Access
5. Session
6. Follow-up

Then a loopback should imply repeat booking or re-entry to the flow.

### Interaction model
The user flow is interactive.

Expected behavior:
- the top row remains visible at all times
- clicking a node expands that step
- the expanded area explains the subflow inside that step
- only one step should be expanded at a time unless a future redesign has a very strong reason otherwise

### Why this matters
The user flow needs to serve two types of viewers:

1. people who only scan for 10 seconds
2. people who want to inspect how each stage actually works

The clickable expansion supports both.

### What the expanded state should reveal
Each expanded step should show:
- the child actions within the stage
- a short explanation of what that stage actually means
- the systems involved, if helpful

This is intentionally not a giant detail dump.
It should be concise, structured, and easy to scan.

### What the user flow should not do
It should not:
- become a dense BPMN diagram
- replace the topology diagram
- require interaction to understand the basic story
- overload each node with too much text

## Diagram 2: System topology

### Role of the topology
The topology explains implementation structure.

It should answer:
- what systems exist?
- which systems are central?
- what connects to what?
- what is custom versus subscribed?
- where do costs and setup effort spread?

### How to read it
This should read as a network with a center.

The viewer should notice first:
- Booking UI
- Backend / API

Then surrounding systems should reveal themselves as supporting systems.

### Interaction model
The topology should still be understandable without interaction.

Interaction is there to add extra context, not to reveal the only meaning.

Expected behavior:
- hover = quick summary
- click or hover can reveal detail depending on implementation
- each node should still show enough at rest to be understood

### What node metadata should communicate
Each node should help answer:
- what this system is
- whether it is custom or subscription-based
- monthly cost or cost pattern
- setup cost
- estimated setup time

### What the topology should not do
It should not:
- become a spaghetti mess of long crossing lines
- hide essential labels in tooltips only
- feel like a rigid process diagram
- overfit to engineering exactness at the cost of communication

## How to present these diagrams in conversation
If someone is walking another person through the page, the recommended explanation order is:

1. Start with the customer journey
2. Expand one or two important stages, especially Booking, Access, and Follow-up
3. Transition to the topology and say: "this is what sits behind that simple experience"
4. Explain central systems first
5. Explain the external services and physical systems second
6. Use node metadata to discuss cost and implementation strategy

## Best nodes to emphasize when presenting
If time is short, focus on:

### In the user flow
- Booking Form
- Access
- Follow-up

These usually carry the clearest hidden complexity.

### In the topology
- Booking UI
- Backend / API
- Kisi
- CRM / records
- Payment processor

These nodes best communicate the difference between the experience layer and the system layer.

## How future agents should use this guide
When editing the page, an agent should use this file to check whether a change improves or harms the communication model.

If a change makes the page prettier but harder to explain, it is probably the wrong change.
