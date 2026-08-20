# Conduit

<p align="center">
  <strong>AI-powered browser automation, built as visual workflows.</strong>
</p>

<p align="center">
  Give an AI agent a goal. Let it operate a real browser.
</p>

<p align="center">
  <a href="https://github.com/Ritik-Thakur-sudo/Conduit">GitHub</a>
  ·
  <a href="https://conduit-production-a101.up.railway.app">Live Demo</a>
</p>

---

## Overview

Conduit is an AI-powered workflow automation platform that combines a **visual workflow builder** with **real browser automation**.

Instead of building an automation around dozens of rigid API integrations, Conduit lets you create workflows that interact with websites through a real cloud browser.

You can combine deterministic browser actions with autonomous AI agents to build workflows such as:

```text
Open URL → Agent → Extract → Send Email
```

For example:

> "Find the cheapest MacBook on this page, extract the product name and price, and email me the results."

The workflow runs in the background, reports its progress in realtime, and provides a browser session replay after execution.

---

## Preview

### Workflow Builder

<p align="center">
  <img src="./design/canvas.png" alt="Conduit workflow canvas" width="900">
</p>

<p align="center">
  <em>Build browser automation workflows visually.</em>
</p>

### Workflow Configuration

<p align="center">
  <img src="./design/node-editor-1.png" alt="Conduit node configuration" width="900">
</p>

<p align="center">
  <em>Configure each workflow node directly from the editor.</em>
</p>

### Live Execution

<p align="center">
  <img src="./design/node-in-progress.png" alt="Conduit workflow execution" width="900">
</p>

<p align="center">
  <em>Watch workflow nodes execute in real time.</em>
</p>

### Execution Logs

<p align="center">
  <img src="./design/logs-with-output-panel.png" alt="Conduit execution logs" width="900">
</p>

<p align="center">
  <em>Inspect execution steps, duration, and outputs.</em>
</p>

## Why Conduit?

Traditional automation platforms generally depend on predefined API integrations.

That works well when an API exists.

But many websites don't expose the functionality you need through an API.

Conduit takes a different approach:

```text
Traditional automation

Workflow → API → Service


Conduit

Workflow → Real Browser → Website
                    ↑
                  AI Agent
```

If a human can perform the task through a browser, Conduit aims to make it automatable.

---

## Features

### Visual Workflow Builder

Build workflows on a React Flow-powered canvas.

- Drag and connect nodes
- Configure each node independently
- Pass data between nodes
- Validate workflow graphs before execution
- Collaborate with other users in realtime

### AI Agent

The Agent node accepts a natural-language goal and autonomously operates the browser.

```text
Goal:

"Find the cheapest MacBook on this page
and send the product name and price to my email."
```

The agent determines the browser interactions required to complete the task.

### Browser Automation

Conduit uses **Browserbase** and **Stagehand** to operate real cloud browsers.

Supported browser operations include:

- Open URL
- Act
- Observe
- Extract
- Agent

This allows workflows to mix autonomous and deterministic browser automation.

### Data Flow Between Nodes

Node outputs can be referenced by downstream nodes using template expressions:

```text
{{ nodeId.field }}
```

For example:

```text
{{ Extract_1.extraction }}
```

This allows information extracted from one node to become input for another.

### Background Execution

Workflows execute through Trigger.dev as durable background jobs.

Closing the browser tab does not stop the workflow.

```text
User
  │
  ▼
Conduit
  │
  ▼
Trigger.dev
  │
  ▼
Workflow Task
  │
  ├── Open URL
  ├── Agent
  ├── Extract
  └── Send Email
```

### Realtime Execution

Workflow execution is streamed back to the application in realtime.

The console can display:

- Queued
- Executing
- Completed
- Failed
- Individual step status
- Step duration
- Node output
- Errors

### Browser Session Replay

Each browser workflow runs inside a Browserbase session.

Completed sessions can be replayed so you can inspect what happened during execution.

This is particularly useful when debugging autonomous agents.

### Multiplayer Collaboration

Liveblocks provides realtime collaboration for workflow editing.

Multiple members of an organization can work on the same workflow canvas.

### Authentication & Organizations

Clerk handles authentication and organization membership.

Workflow operations are scoped to the active organization.

### Production Observability

Sentry provides observability across the application and workflow infrastructure.

Conduit monitors:

- Next.js errors
- API request errors
- Client errors
- Navigation errors
- Trigger.dev task failures
- Production exceptions

---

## Architecture

```text
                         ┌──────────────────┐
                         │     Conduit      │
                         │    Next.js 16    │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        React Flow             Clerk             Liveblocks
         Workflow            Auth / Orgs         Realtime
          Canvas
             │
             ▼
       Server Actions
             │
             ▼
        Trigger.dev
       Background Jobs
             │
             ▼
      Workflow Execution
             │
       ┌─────┼─────┐
       │     │     │
       ▼     ▼     ▼
   Stagehand Browserbase Resend
       │
       ▼
   Cloud Browser
```

### Execution Flow

```text
1. User creates a workflow
            │
            ▼
2. Workflow graph is validated
            │
            ▼
3. Graph is persisted
            │
            ▼
4. Trigger.dev run is created
            │
            ▼
5. Workflow task executes
            │
            ▼
6. Browser actions / AI agent execute
            │
            ▼
7. Run state streams back to UI
            │
            ▼
8. Browser session becomes available for replay
```

---

## Workflow Nodes

Conduit currently supports several workflow primitives:

| Node | Purpose |
|---|---|
| **Start** | Workflow entry point |
| **Open URL** | Navigate to a website |
| **Act** | Perform browser interactions |
| **Observe** | Inspect elements on a page |
| **Extract** | Extract structured information |
| **Agent** | Autonomously operate the browser |
| **Send Email** | Deliver workflow results through email |

The real power comes from combining them.

For example:

```text
Start
  │
  ▼
Open URL
  │
  ▼
Agent
  │
  ▼
Extract
  │
  ▼
Send Email
```

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19 |
| Workflow Canvas | React Flow |
| Authentication | Clerk |
| Collaboration | Liveblocks |
| Workflow Execution | Trigger.dev |
| Browser Automation | Browserbase |
| AI Browser Control | Stagehand |
| Database | PostgreSQL |
| Database Provider | Neon |
| ORM | Drizzle |
| Email | Resend |
| Observability | Sentry |
| Deployment | Railway |

---

## Project Structure

```text
Conduit/
├── app/
│   ├── api/                  # API routes
│   └── (dashboard)/          # Dashboard routes
│
├── components/
│   └── ui/                   # Shared UI components
│
├── features/
│   └── workflows/
│       ├── components/       # Workflow UI
│       ├── tasks/            # Trigger.dev tasks
│       ├── actions.ts        # Server actions
│       └── data.ts           # Database operations
│
├── hooks/                    # React hooks
├── lib/                      # Shared infrastructure
├── templates/                # Workflow templates
├── design/                   # Design resources
│
├── liveblocks.config.ts      # Liveblocks configuration
├── drizzle.config.ts         # Drizzle configuration
├── trigger.config.ts         # Trigger.dev configuration
├── instrumentation.ts        # Next.js instrumentation
├── next.config.ts            # Next.js configuration
├── proxy.ts                  # Request middleware
└── package.json
```

---

## Getting Started

### Prerequisites

You will need accounts and API credentials for the services used by Conduit:

- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Trigger.dev](https://trigger.dev/)
- [Liveblocks](https://liveblocks.io/)
- [Browserbase](https://www.browserbase.com/)
- [Resend](https://resend.com/)
- [Sentry](https://sentry.io/)

### Clone the repository

```bash
git clone https://github.com/Ritik-Thakur-sudo/Conduit.git
cd Conduit
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create:

```text
.env.local
```

Use the repository's `.env.example` as the reference for the required variables.

```bash
cp .env.example .env.local
```

Then add your own credentials.

> Never commit `.env.local` or production credentials.

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

The project uses environment variables for authentication, database access, workflow execution, browser automation, collaboration, email, and observability.

The current `.env.example` contains the required variable names.

### Clerk

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### Database

```env
NEON_BRANCH=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
```

### Trigger.dev

```env
TRIGGER_SECRET_KEY=
```

### Liveblocks

```env
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
```

### Browserbase

```env
BROWSERBASE_API_KEY=
```

### Resend

```env
RESEND_API_KEY=
```

### Sentry

```env
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

> `SENTRY_AUTH_TOKEN` is a server/build credential and must never be exposed to the browser.

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates the production build.

### Production Server

```bash
npm run start
```

Starts the production Next.js server.

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript type checking.

### Linting

```bash
npm run lint
```

Runs ESLint.

### Formatting

```bash
npm run format
```

Formats the TypeScript and TSX source files.

### Database

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

---

## Deployment

Conduit v1 is deployed on Railway.

The application depends on several external services:

```text
                         GitHub
                            │
                            ▼
                         Railway
                            │
                            ▼
                      Next.js App
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
        Clerk              Neon          Liveblocks
          │                 │                 │
          │                 │                 │
          └────────────┬────┴────────────┬─────┘
                       │                 │
                       ▼                 ▼
                  Trigger.dev       Browserbase
                       │                 │
                       ▼                 ▼
                 Workflow Tasks      Stagehand
                       │
                       ▼
                     Sentry
```

Trigger.dev runs workflow tasks independently from the Next.js runtime.

---

## Development Checks

Before pushing changes, run:

```bash
npm run typecheck
npm run lint
npm run build
```

The production build is especially important because Conduit spans multiple runtimes:

- Next.js server
- Next.js client
- Edge instrumentation
- Trigger.dev workers
- Cloud browser sessions

---

## Roadmap

### v1 — Completed

- [x] Visual workflow builder
- [x] React Flow canvas
- [x] Workflow node system
- [x] AI Agent node
- [x] Browser automation
- [x] Browserbase integration
- [x] Stagehand integration
- [x] Trigger.dev background execution
- [x] Realtime execution monitoring
- [x] Workflow run cancellation
- [x] Liveblocks collaboration
- [x] Clerk authentication
- [x] Clerk organizations
- [x] PostgreSQL persistence
- [x] Neon integration
- [x] Drizzle ORM
- [x] Browser session replay
- [x] Email delivery
- [x] Pro feature gating
- [x] Sentry observability
- [x] Railway deployment

### v2 — Planned

- [ ] Workflow templates
- [ ] Scheduled workflows
- [ ] Recurring workflow triggers
- [ ] Webhook triggers
- [ ] More workflow nodes
- [ ] Improved retry policies
- [ ] Advanced workflow error handling
- [ ] Workflow analytics
- [ ] Usage-based billing
- [ ] Expanded agent capabilities
- [ ] Improved workflow history
- [ ] Automated E2E testing

---

## Project Status

**Conduit v1 is complete and deployed.**

The first version establishes the core Conduit platform:

```text
Visual Workflows
       +
AI Browser Automation
       +
Background Execution
       +
Realtime Collaboration
       +
Browser Session Replay
       +
Production Observability
```

The next stage of development will focus on reliability, testing, user experience, and expanding the capabilities of the automation engine.

---

## Contributing

Contributions and suggestions are welcome.

If you find a bug or have an idea for Conduit, feel free to open an issue or submit a pull request.

Before submitting a change, run:

```bash
npm run typecheck
npm run lint
npm run build
```

---

## Author

**Ritik Kumar**

GitHub:  
https://github.com/Ritik-Thakur-sudo

---

## License

License information will be added in a future release.