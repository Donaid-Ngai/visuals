# Data Spec

## Purpose
This file is the source-of-truth content spec for the Marven Baseball Sim visual.

It records:
- section structure
- user flow steps
- expanded subflows
- systems involved
- topology nodes
- node values
- intended labels and metadata

If the page code and this file disagree, this file should be reviewed and updated as part of the same change.

---

## Page structure
The current page should contain these major sections in this order:

1. Intro / framing
2. User flow
3. System topology

---

## User flow specification

### Top-level order
1. Visitor Web App
2. Booking Form
3. Payment
4. Access
5. Session
6. Follow-up

### User flow node schema
Each user flow step should support:
- `id`
- `title`
- `summary`
- `badges[]`
- `details`
- `systems[]`
- `subflow[]`

Suggested conceptual shape:

```ts
{
  id: string,
  title: string,
  summary: string,
  badges: string[],
  details: string,
  systems: string[],
  subflow: {
    id: string,
    label: string,
    note: string,
  }[]
}
```

### User flow content

#### 1. Visitor Web App
- summary: `browser-based, usable anywhere`
- badges:
  - `setup: low`
  - `monthly: hosting`
- details:
  - `The customer sees pricing, offer framing, and a clear call to book from any device.`
- systems:
  - `Next.js site`
  - `Hosting`
  - `Analytics`
- subflow:
  1. `Landing page` - `Explains the experience and shows the offer.`
  2. `Pricing + info` - `Answers the basic questions before booking.`
  3. `CTA click` - `Pushes the visitor into the actual booking path.`

#### 2. Booking Form
- summary: `captures the booking request`
- badges:
  - `setup: 1-2 days`
  - `monthly: form/tooling`
- details:
  - `This is the commitment point where the visitor chooses the format, time, and contact details.`
- systems:
  - `Booking UI`
  - `Calendar`
  - `Database`
- subflow:
  1. `Select package` - `Pick session type or pricing option.`
  2. `Choose time` - `Reserve an available slot.`
  3. `Enter details` - `Collect name, contact info, and visit details.`
  4. `Submit request` - `Create the booking record and move to payment.`

#### 3. Payment
- summary: `checkout and confirmation`
- badges:
  - `setup: 1-2 days`
  - `monthly: processor fees`
- details:
  - `Payment confirms intent, captures revenue, and triggers the rest of the automated flow.`
- systems:
  - `Stripe`
  - `Backend/API`
  - `Email`
- subflow:
  1. `Quote shown` - `Display the final price and what is included.`
  2. `Checkout` - `Take payment through the processor.`
  3. `Confirmation sent` - `Receipt and next-step confirmation go out automatically.`

#### 4. Access
- summary: `unlocks Kisi, lights, or entry controls`
- badges:
  - `setup: hardware`
  - `monthly: access SaaS`
- details:
  - `The system turns a paid booking into real-world access and environmental control.`
- systems:
  - `Kisi`
  - `Door controls`
  - `Lights`
  - `Automation`
- subflow:
  1. `Booking verified` - `Check valid booking state and timing.`
  2. `Access rule triggered` - `Grant temporary permissions or entry logic.`
  3. `Door / lights enabled` - `Make the physical session ready for arrival.`

#### 5. Session
- summary: `staff and calendar coordination`
- badges:
  - `setup: ops`
  - `monthly: calendar/tools`
- details:
  - `Once access is ready, the actual operating workflow kicks in for staff, timing, and customer experience.`
- systems:
  - `Calendar`
  - `Staff ops`
  - `Notifications`
- subflow:
  1. `Staff notified` - `Alert staff or operators for the session.`
  2. `Calendar reserved` - `Lock in the facility and staffing window.`
  3. `Visitor arrives` - `Customer enters and checks in.`
  4. `Sim session runs` - `The actual baseball sim experience happens.`

#### 6. Follow-up
- summary: `email, SMS, repeat booking, CRM updates`
- badges:
  - `setup: automation`
  - `monthly: messaging`
- details:
  - `After the visit, the system shifts into retention mode and tries to create the next booking.`
- systems:
  - `Email`
  - `SMS`
  - `CRM`
  - `Automation`
- subflow:
  1. `Thank-you sent` - `Close the loop with a post-visit message.`
  2. `CRM updated` - `Store activity and customer history.`
  3. `Promo / invite` - `Encourage repeat bookings or upsells.`

### User flow interaction rules
- the top-level rail should remain visible during expansion
- one active node at a time is the default behavior
- clicking a node should reveal its subflow
- the expanded area should explain what that stage actually contains
- the loopback should remain secondary to the main left-to-right flow

---

## System topology specification

### Topology node schema
Each topology node should support:
- `key`
- `label`
- `x`
- `y`
- `type`
- `monthly`
- `setup`
- `time`
- `summary`
- `connections[]`

Suggested conceptual shape:

```ts
{
  key: string,
  label: string,
  x: number,
  y: number,
  type: string,
  monthly: string,
  setup: string,
  time: string,
  summary: string,
  connections: string[]
}
```

### Current topology nodes

#### Booking UI
- key: `booking-ui`
- x: `42`
- y: `48`
- type: `custom built`
- monthly: `$20-$100 / mo`
- setup: `$500-$1.5k`
- time: `2-4 days`
- summary: `Captures booking and starts the whole flow.`
- connections:
  - `Backend/API`
  - `Payment processor`

#### Backend / API
- key: `backend`
- x: `58`
- y: `48`
- type: `custom built`
- monthly: `$20-$150 / mo`
- setup: `$1k-$3k`
- time: `3-6 days`
- summary: `Central logic for booking state, access timing, and orchestration.`
- connections:
  - `Database`
  - `Email`
  - `SMS`
  - `n8n / Zapier`
  - `Kisi`

#### Database
- key: `database`
- x: `50`
- y: `13`
- type: `subscription`
- monthly: `$0-$50 / mo`
- setup: `$100-$400`
- time: `0.5-1 day`
- summary: `Stores bookings, users, and system records.`
- connections:
  - `Backend / API`

#### Payment processor
- key: `payment`
- x: `21`
- y: `18`
- type: `subscription`
- monthly: `fees per transaction`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Handles checkout, receipts, and payment confirmation.`
- connections:
  - `Booking UI`
  - `Backend / API`

#### Email
- key: `email`
- x: `16`
- y: `46`
- type: `subscription`
- monthly: `$10-$50 / mo`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Confirmation, reminders, and follow-up communication.`
- connections:
  - `Backend / API`
  - `CRM / records`

#### SMS
- key: `sms`
- x: `18`
- y: `80`
- type: `subscription`
- monthly: `$20+ usage`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Fast reminders and follow-up texts.`
- connections:
  - `Backend / API`
  - `CRM / records`

#### n8n / Zapier
- key: `automation`
- x: `83`
- y: `18`
- type: `subscription`
- monthly: `$20-$100 / mo`
- setup: `$300-$900`
- time: `1-2 days`
- summary: `Bridges systems, updates records, and reduces manual ops.`
- connections:
  - `Backend / API`
  - `CRM / records`
  - `Email`
  - `SMS`

#### Kisi
- key: `kisi`
- x: `86`
- y: `45`
- type: `subscription`
- monthly: `$$ / mo`
- setup: `$500-$2k`
- time: `1-3 days`
- summary: `Access control that ties booking state to entry permissions.`
- connections:
  - `Backend / API`
  - `Door / lights`

#### Door / lights
- key: `door`
- x: `84`
- y: `79`
- type: `mixed hardware`
- monthly: `$0-$50 / mo`
- setup: `$1k-$4k`
- time: `2-5 days`
- summary: `Physical controls that make the visit feel automated.`
- connections:
  - `Kisi`

#### CRM / records
- key: `crm`
- x: `50`
- y: `88`
- type: `subscription`
- monthly: `$0-$100 / mo`
- setup: `$200-$600`
- time: `1-2 days`
- summary: `Tracks customers, history, and repeat engagement.`
- connections:
  - `Email`
  - `SMS`
  - `n8n / Zapier`

#### Hosting / monitoring
- key: `hosting`
- x: `50`
- y: `68`
- type: `subscription`
- monthly: `$20-$80 / mo`
- setup: `$100-$400`
- time: `0.5-1 day`
- summary: `Keeps the app live and gives visibility when things break.`
- connections:
  - `Backend / API`
  - `Booking UI`

### Topology layout principles
- Booking UI and Backend / API should feel central
- satellites should cluster around them
- labels must remain readable at rest
- metadata should stay compact
- the shape should feel like a system map, not a linear process

---

## Copy guidance
Use short, legible phrasing.

Examples:
- `browser-based, usable anywhere`
- `captures the booking request`
- `checkout and confirmation`
- `unlocks Kisi, lights, or entry controls`
- `staff and calendar coordination`
- `email, SMS, repeat booking, CRM updates`

Avoid long marketing copy inside nodes.

---

## Documentation maintenance rule
If a contributor changes the live page, they should review this file and update:
- labels
- values
- subflows
- costs
- metadata
- interaction behavior

This file should stay aligned with `src/app/visuals/marven-baseball-sim/page.tsx`.
