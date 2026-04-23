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
- `systems[]` shown as visible chips in the expanded stage
- `details`
- `hiddenWork`
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
  hiddenWork: string,
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
- summary: `The customer decides whether this sim is worth booking.`
- badges:
  - `setup: low`
  - `monthly: hosting`
- details:
  - `This stage has one job: explain the baseball sim clearly enough that a new visitor understands the offer, price range, and why they should book now instead of bouncing.`
- systems:
  - `Next.js site`
  - `Hosting`
  - `Analytics`
- subflow:
  1. `Landing page` - `Explains the experience and shows the offer.`
  2. `Pricing + info` - `Answers the basic questions before booking.`
  3. `CTA click` - `Pushes the visitor into the actual booking path.`

#### 2. Booking Form
- summary: `The visitor picks a session, slot, and contact details.`
- badges:
  - `setup: 1-2 days`
  - `monthly: form/tooling`
- details:
  - `This is the commitment point. The customer should be able to choose the right package and an available time without needing staff to step in and fix the booking manually.`
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
- summary: `Payment turns interest into a trusted, actionable booking.`
- badges:
  - `setup: 1-2 days`
  - `monthly: processor fees`
- details:
  - `Payment is the point where the business can finally trust the reservation. Once the charge clears, confirmations can go out and the venue can prepare for a real session instead of a maybe.`
- systems:
  - `Stripe`
  - `Backend/API`
  - `Email`
- subflow:
  1. `Quote shown` - `Display the final price and what is included.`
  2. `Checkout` - `Take payment through the processor.`
  3. `Confirmation sent` - `Receipt and next-step confirmation go out automatically.`

#### 4. Access
- summary: `A paid booking unlocks the right door at the right time.`
- badges:
  - `setup: hardware`
  - `monthly: access SaaS`
- details:
  - `This is the hardest handoff in the whole flow. Software has to move from booking data into physical access, temporary permissions, and a room that feels ready when the customer arrives.`
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
- summary: `The customer just shows up, but ops still need to stay aligned.`
- badges:
  - `setup: ops`
  - `monthly: calendar/tools`
- details:
  - `The promise of a self-serve baseball sim is that the customer can arrive and start hitting without friction. That only works if the operating window, support expectations, and venue readiness were handled earlier in the flow.`
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
- summary: `One visit becomes CRM history and a reason to rebook.`
- badges:
  - `setup: automation`
  - `monthly: messaging`
- details:
  - `After the session, the business should not lose the customer. The visit should roll straight into CRM updates, thank-you messaging, and a prompt to book again.`
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
- the top-level user flow should render as a connected flow rail, not a plain card grid
- top-level nodes should read left-to-right with visible arrow connectors between stages
- on smaller screens, horizontal scrolling is acceptable if it preserves the flow relationship better than wrapping into unrelated cards
- one active node at a time is the default behavior
- clicking a node should reveal its subflow below the rail
- the expanded area should explain both the customer-facing action and the hidden work inside that stage
- the active stage should remain visually highlighted in the rail
- the loopback should remain secondary to the main left-to-right flow and imply repeat booking / re-engagement

---

## System topology specification

The topology section now has two layers:

1. **Cost snapshot** — four quick-glance cards for the likely monthly run-rate, one-time software/setup, physical access/setup, and main risk area.
2. **Connected Mermaid system map** — a grouped Mermaid diagram that keeps the visible subsystem relationships while embedding monthly cost, setup cost, setup time, and ownership type in each node.

The map should be easier to interpret than the first basic Mermaid version, but it should still clearly show what connects to what. Do not replace this with disconnected lane cards unless the network becomes unreadable again.

### Current quick-glance cost cards

- likely monthly run-rate: `$90-$630+`
- one-time software/setup: `$2.4k-$8.4k`
- physical access/setup: `$1.5k-$6k`
- real risk area: `access handoff`

These are discussion ranges, not quotes. They are intended to help Marven understand cost shape and hidden scope quickly.

### Topology node schema
Each topology node should support:
- `key`
- `label`
- `lane`
- `kind`
- `monthly`
- `setup`
- `time`
- `summary`
- `connections[]`
- `stages[]`
- `priority`

Suggested conceptual shape:

```ts
{
  key: string,
  label: string,
  lane: "customer" | "core" | "automation" | "venue" | "infrastructure",
  kind: string,
  monthly: string,
  setup: string,
  time: string,
  summary: string,
  connections: string[],
  stages: string[],
  priority: "core" | "supporting"
}
```

### Current topology nodes

#### Customer touchpoints lane

##### Booking UI
- key: `booking-ui`
- lane: `customer`
- kind: `custom built`
- monthly: `$20-$100 / mo`
- setup: `$500-$1.5k`
- time: `2-4 days`
- summary: `Captures the reservation request and starts the flow.`
- stages:
  - `Visitor Web App`
  - `Booking Form`
- connections:
  - `Payment processor`
  - `Backend / API`

##### Payment processor
- key: `payment`
- lane: `customer`
- kind: `subscription`
- monthly: `fees per transaction`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Handles checkout and confirms payment state.`
- stages:
  - `Payment`
- connections:
  - `Backend / API`
  - `Email`

#### Core platform lane

##### Backend / API
- key: `backend`
- lane: `core`
- kind: `custom built`
- monthly: `$20-$150 / mo`
- setup: `$1k-$3k`
- time: `3-6 days`
- summary: `Central logic for booking state, orchestration, and access timing.`
- stages:
  - `Booking Form`
  - `Payment`
  - `Access`
  - `Session`
- connections:
  - `Database`
  - `n8n / Zapier`
  - `Kisi`
  - `Hosting / monitoring`
  - `Email`
  - `SMS`

##### Database
- key: `database`
- lane: `core`
- kind: `subscription`
- monthly: `$0-$50 / mo`
- setup: `$100-$400`
- time: `0.5-1 day`
- summary: `Stores bookings, users, and operating records.`
- stages:
  - `Booking Form`
  - `Payment`
  - `Follow-up`
- connections:
  - `Backend / API`
  - `CRM / records`

#### Messaging and business ops lane

##### n8n / Zapier
- key: `automation`
- lane: `automation`
- kind: `subscription`
- monthly: `$20-$100 / mo`
- setup: `$300-$900`
- time: `1-2 days`
- summary: `Fans booking events out into business actions and record updates.`
- stages:
  - `Payment`
  - `Access`
  - `Follow-up`
- connections:
  - `Email`
  - `SMS`
  - `CRM / records`
  - `Kisi`

##### Email
- key: `email`
- lane: `automation`
- kind: `subscription`
- monthly: `$10-$50 / mo`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Confirmation, reminders, and post-visit follow-up.`
- stages:
  - `Payment`
  - `Follow-up`
- connections:
  - `CRM / records`

##### SMS
- key: `sms`
- lane: `automation`
- kind: `subscription`
- monthly: `$20+ usage`
- setup: `$100-$300`
- time: `0.5-1 day`
- summary: `Fast reminders and short operational messages.`
- stages:
  - `Access`
  - `Follow-up`
- connections:
  - `CRM / records`

##### CRM / records
- key: `crm`
- lane: `automation`
- kind: `subscription`
- monthly: `$0-$100 / mo`
- setup: `$200-$600`
- time: `1-2 days`
- summary: `Keeps customer history, repeat-booking context, and retention data.`
- stages:
  - `Follow-up`
- connections:
  - none

#### Venue execution lane

##### Kisi
- key: `kisi`
- lane: `venue`
- kind: `subscription`
- monthly: `$$ / mo`
- setup: `$500-$2k`
- time: `1-3 days`
- summary: `Access control that turns valid booking state into entry permissions.`
- stages:
  - `Access`
- connections:
  - `Door / lights`

##### Door / lights
- key: `door`
- lane: `venue`
- kind: `mixed hardware`
- monthly: `$0-$50 / mo`
- setup: `$1k-$4k`
- time: `2-5 days`
- summary: `Physical controls that make the session feel prepared and automated.`
- stages:
  - `Access`
  - `Session`
- connections:
  - none

#### Infrastructure lane

##### Hosting / monitoring
- key: `hosting`
- lane: `infrastructure`
- kind: `subscription`
- monthly: `$20-$80 / mo`
- setup: `$100-$400`
- time: `0.5-1 day`
- summary: `Keeps the application live and helps catch failures early.`
- stages:
  - `Visitor Web App`
  - `Session`
- connections:
  - none

### Topology layout principles
- the stack should appear as a connected system map, not only as grouped lists
- Booking UI and Backend / API should read as the center of the operating graph
- nearby systems should show visible relationships without turning into unreadable spaghetti
- each subsystem card should keep monthly cost, setup, and setup time visible at a glance
- labels must remain readable at rest
- the active user-flow stage should highlight the most relevant nodes and connectors without hiding the rest of the system

---

## Copy guidance
Use short, legible phrasing that says something concrete about the baseball-sim business model.

Examples:
- `browser-based, usable anywhere`
- `captures the booking request`
- `checkout and confirmation`
- `unlocks Kisi, lights, or entry controls`
- `staff and calendar coordination`
- `email, SMS, repeat booking, CRM updates`

Avoid long marketing copy inside nodes. Avoid vague strategy language that does not identify the actual operational handoff or system responsibility.

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
