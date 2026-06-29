# Elite Scope Guard

A white, black, and `#f4af00` gold React scope-management workspace for **Elite Era Development L.L.C.** It analyzes client change requests before they impact margin, delivery capacity, deadlines, or approved scope.

## Workflow

```text
Client change request
→ Scope analysis
→ Cost, margin, staffing, dependency, and timeline calculation
→ Internal approval route
→ Client-safe change request
→ Client approval
→ Delivery planning handoff
```

## What it calculates

- Core specialist, project management, discovery, and QA hours
- Best-fit delivery specialist based on requested skills and capacity
- Internal delivery cost, dependency impact, and risk reserve
- Protected margin floor and recommended client investment
- Discount impact while preventing margin-floor pricing
- Delivery duration, dependency-ready date, forecast finish date, and deadline slip
- Scope risk score: schedule, budget, dependency, urgency, and margin pressure
- Decision: **Approve**, **Negotiate**, **Re-quote**, or **Reject**
- Required approval route: Project Manager, Finance, Founder, and Client when applicable

## Features

- Animated command center with scope exposure and commercial alerts
- Interactive change-request analysis studio
- Scope type catalog: AI assistant, language support, admin dashboard, payments, analytics, automation, and design refresh
- Complexity, urgency, discount, and affected-base-scope controls
- Staffing recommendation and skill-match calculation
- Internal approval workflow
- Client-safe change-request portal that hides internal cost, margin, and team information
- Report snapshot library
- TXT, JSON, and print/PDF exports
- Browser local-storage persistence
- Responsive Elite Era design
- Unit tests and GitHub Actions build workflow

## Run locally

```bash
npm install
npm run dev
```

Open the address shown in the terminal, usually `http://localhost:5173`.

## Run tests

```bash
npm test
```

## Project structure

```text
src/
  data.js          Request catalog, project, team, scope, and demo records
  engine.js        Commercial, staffing, risk, timeline, and approval rules
  App.jsx          State, persistence, export, and workflow actions
  views/           Dashboard, scope analysis, approvals, client view, reports
  styles.css       Shared white/black/gold design imports
```

## Production note

This is a functional browser prototype. A production version should add secure authentication, role-based server enforcement, a cloud database, document storage, email notifications, approval signatures, and integration with Elite OS and Elite Delivery Intelligence.

---

## Author

Made by **Hira Khyzer**

Developed as part of the **Elite Era Development L.L.C** project portfolio.

Brand color: `#f4af00`
