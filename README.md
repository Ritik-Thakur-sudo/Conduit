# Conduit

**Give an AI agent a goal. It opens a real browser, does the work, and reports back.**

Conduit is an AI workflow automation platform — think N8N or Zapier, but instead of wiring up rigid API integrations, you give agents plain-English goals and they drive a real Chrome browser to get things done. Configure a product, scrape a page, fill a form, extract data, send an email — all orchestrated on a visual canvas, running reliably in the background even after you close the tab.

> Example: *"Configure a Porsche 911 for me, then email me the link."* The agent opens the configurator, clicks through paint and wheel options on its own, and the finished build lands in your inbox seconds later.

---

## ✨ What makes Conduit different

Most automation tools call APIs. Conduit **drives an actual browser** — powered by [Browserbase](https://browserbase.com) and [Stagehand](https://www.stagehand.dev) — so it can automate *any* website, not just the ones with an API. If a human can do it in a browser, an agent can do it in Conduit.

- 🧩 **Visual canvas, built on [React Flow](https://reactflow.dev)** — start with a trigger, chain together action nodes into a full workflow
- 🤖 **Autonomous agent nodes** — give a goal in plain English; the agent decides what to click, type, and scroll until the job is done
- 🎯 **Purpose-built action nodes** — `Open URL`, `Act` (click/type), `Observe` (find elements), `Extract` (pull structured data), `Send Email`, and more
- 🔗 **Template tokens** — pass data from one step to the next with `{{ nodeId.field }}` references, no glue code required
- 📡 **Real-time execution** — every node lights up as it runs, with a live log panel showing exact duration and output per step
- 🎥 **Full session replay** — every run is a real browser session, and every run is recorded. Nothing is a black box; watch exactly what the agent saw and did
- ⚙️ **Durable background execution** — workflows run as background jobs via [Trigger.dev](https://trigger.dev). Close the tab, the run keeps going
- 👥 **Multiplayer canvas** — build and edit workflows together in real time with live cursors, powered by [Liveblocks](https://liveblocks.io) — just like a Figma file
- 🔐 **Auth, orgs & billing built in** — powered by [Clerk](https://clerk.com)

---

## 🖼️ Preview

**Building a simple scrape-and-agent workflow:**

A `Start` trigger opens a URL, hands off to an `Agent` node with a plain-English instruction ("Login with admin username and admin..."), and the live run log below the canvas shows each step completing with its duration.

**A multi-step workflow with data extraction and email delivery:**

`Open URL` → `Agent` (logs in) → `Extract` ("First 5 quotes") → `Send Email`, wired together with template tokens (`{{ Extract 1.extraction }}`) so the extracted data flows straight into the email body. The right-hand panel shows every available connection between nodes, so you always know what data you can reference.

> *(Add screenshots/GIFs here — the canvas mid-run with nodes lit up and the log panel streaming is the best way to show what Conduit actually does.)*

---

## 🧠 How it works

1. **Design** — build a workflow on the canvas: drag in a trigger, then chain action and agent nodes together
2. **Configure** — each node has a config panel; reference outputs from earlier steps using `{{ }}` template tokens
3. **Run** — hitting Run spins up a real Chrome browser in the cloud (Browserbase + Stagehand)
4. **Execute** — the run streams to Trigger.dev, which executes each step as a durable background job and streams live status back to the canvas over real-time channels
5. **Persist** — every run and its results are saved to Postgres via Drizzle + Neon
6. **Replay** — because it's a real browser session, the whole run is recorded — replay it step by step after the fact

### The Agent node

This is the core of Conduit. Give it a goal in plain English and it takes over the browser completely — deciding what to click, scroll, and type, and figuring out each step on its own until the job is done. Simpler nodes (`Act`, `Observe`, `Extract`) expose the same underlying browser primitives directly, for when you want more deterministic control over a specific step.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Canvas / UI | Next.js, React Flow |
| Browser automation | Browserbase (cloud Chrome), Stagehand (act / observe / extract / agent primitives) |
| Background execution | Trigger.dev (durable jobs, real-time step streaming) |
| Realtime multiplayer | Liveblocks (live cursors, collaborative canvas) |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| Auth, orgs & billing | Clerk |
| Error monitoring | Sentry |
| Deployment | Railway |

---

## 🚀 What can you automate?

Building a Porsche configuration is just one example. Point an agent at almost anything a human could do in a browser:

- Play a full game of chess
- Solve today's Wordle
- Plan a road trip across the country
- Put together a morning news briefing and email it to you
- Log in, extract data from a dashboard, and forward a summary to your team

---

## 📦 Project Structure

```
conduit/
├── app/                    # Next.js app router
├── components/             # UI components
├── features/
│   └── workflows/          # Workflow canvas, node types, execution logic
├── design/                 # Design tokens / UI system
├── templates/              # Pre-built workflow templates
├── lib/                    # Utilities
├── hooks/                  # Custom React hooks
├── liveblocks.config.ts    # Multiplayer/realtime config
├── drizzle.config.ts       # Database schema config
├── trigger.config.ts       # Background job config
└── proxy.ts                # Browser session routing
```

---

## ⚙️ Getting Started

```bash
git clone https://github.com/Ritik-Thakur-sudo/Conduit.git
cd Conduit
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL - Neon)
DATABASE_URL=your_database_url

# Authentication & Billing (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Browser Automation
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id

# Background Jobs (Trigger.dev)
TRIGGER_API_KEY=your_trigger_api_key

# Realtime Multiplayer (Liveblocks)
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

# Email (Resend or similar)
RESEND_API_KEY=your_resend_api_key
```

> Some environment variables are simplified or anonymized for security reasons.

---

## 🗺️ Roadmap

- [ ] Sentry integration for production error tracking
- [ ] Workflow templates marketplace
- [ ] Scheduled/recurring workflow triggers
- [ ] More granular per-node retry & error-handling policies
- [ ] Usage-based billing tiers

---

## 🤝 Contributing

Pull requests are welcome!

---

## 📬 Contact

**Ritik Kumar**
📧 rk7495933@gmail.com
