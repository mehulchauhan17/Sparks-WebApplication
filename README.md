# ⚡ SPARK — Discover. Contribute. Grow.

> Turn skills, ideas and available capacity into measurable project impact.

SPARK is an internal **opportunity marketplace**: managers post short-term project needs
("I need 2 people with Python and AI for two weeks"), employees discover work outside their
immediate project, apply in two minutes, collaborate, deliver — and get recognised.

One loop drives every screen: **DISCOVER → APPLY → COLLABORATE → DELIVER → RECOGNIZE.**

This repository is a fully interactive, front-end MVP (no backend) designed so that every
data change and every notification maps 1:1 to a SharePoint Online / Microsoft Lists /
Power Automate implementation (see `docs/SOLUTION_DESIGN.md`).

---

## Run it

No build step, no dependencies.

```bash
python -m http.server 8765
```

Open <http://localhost:8765>. (Opening `index.html` directly also works.)
State is kept in `localStorage`; **avatar menu → Reset demo data** returns to the seed.

---

## 2-minute demo script

Switch personas from the **avatar menu (top right) → Demo · switch role**.

| # | Persona | Action | What the evaluator sees |
|---|---|---|---|
| 1 | Arjun (manager) | **Post Opportunity → Fill with an example → Publish** | Announcement fan-out: portal + Teams post + 2 subscriber emails — and the **Behind the scenes** panel shows flow F1 step by step |
| 2 | Priya (employee) | **Home** | Live stats, *Spark AI · Recommended for you* — AI Productivity Accelerator 97% match, "Posted 2 hours ago", "2 openings remaining" |
| 3 | Priya | Open **AI Productivity Accelerator** | Lifecycle at OPEN, info grid, what/why/who, mentor card, *Your fit* skill-match, big **Apply now** |
| 4 | Priya | **Apply now** → interest statement → consent → **Submit** | Confirmation: *Application submitted · UNDER REVIEW · Next step*; **Behind the scenes: F2** — Forms → Applications list → Outlook to Arjun |
| 5 | Priya | **My Applications** | Progress bar + next step |
| 6 | Arjun | Bell shows new notification → **Manager Workspace** | Priya at the top of *Applicants requiring review*, 97% fit, ranked by Spark AI |
| 7 | Arjun | **View profile** | Profile, interest statement, Spark history, *Fit for opportunity* bars |
| 8 | Arjun | **Accept** | Priya emailed; opportunity auto-moves to **ONGOING**; **F3 trace**: Teams channel, Projects list, News post |
| 9 | Arjun | **My Opportunities → Mark completed** | Status → **COMPLETED**, contributors notified |
| 10 | Arjun | **Recognize contributors → record project impact → Innovation Champion → Award** | Recognition page opens with Priya as the hero card + project impact; **F4 trace** |
| 11 | Priya | Bell → *You received an Innovation Champion recognition* · **My Projects** | Lifecycle shows RECOGNIZED; badge on her project card |
| 12 | Anyone | **Home** → footer **How it runs on Microsoft 365** / **Automation log** | Stats, activity feed and recognition reflect what just happened; the architecture page and the session's full flow log close the story |

---

## What's implemented (P0 + P1)

| Area | Highlights |
|---|---|
| **Home** | Cinematic hero (original SVG "mobility network" art), live stats, Spark AI recommendations (employee) / needs-attention strip (manager), featured opportunities, active projects with contributors + progress, latest updates feed, recognition hero + cards, testimonials, final CTA |
| **Opportunity Marketplace** | Search, technology chips, team / duration / location / status filters, "best match for me" sort, match badges, skills-you-have highlighting, subscribe-to-technology alerts |
| **Opportunity detail** | Info grid, visual **project lifecycle** (Open → Under Review → Ongoing → Completed → Recognized), statement, what you'll work on / why this matters / who we're looking for / skills you'll build, mentor card, *Your fit*, context-aware CTA |
| **Application** | Pre-filled profile, skill pills, interest statement, availability, consent; confirmation screen with status + next step |
| **My Applications / My Projects** | Stage bars, next-step copy, lifecycle per project, recognition badges |
| **Manager Workspace** | Stats, *Applicants requiring review* ranked by fit, Schedule discussion · Shortlist · Reject (with note) · Accept, lifecycle table with status + progress, Mark completed → Recognize contributors |
| **Applicant profile** | Profile, Spark history, skill-match breakdown (rule-based "Spark AI") |
| **Recognition** | "Celebrate impact." — hero card, badge catalogue with counts, wall, filter by badge |
| **Notifications** | Bell panel + page; every automation event tagged *email / portal / teams* |
| **Behind the scenes** | After every workflow action, a panel shows the equivalent Power Automate flow (F1–F4) step by step — Forms → Lists → Outlook → Teams → SharePoint. `#/automation` keeps the full session log |
| **Architecture page** | `#/architecture` — SharePoint → Lists → Power Automate → Outlook/Teams → Copilot Studio, list schemas, flow catalogue, AI roadmap, rationale |
| **Project impact** | Captured when a project completes; shown on the opportunity, the recognition hero and the announcement |
| **Design system** | Navy/blue palette, single amber accent, 8-px spacing, 6/8/12 radii, one shadow, status colours, focus states, keyboard-operable pills, ARIA labels, responsive to 375 px |

## Architecture

```
index.html          shell
css/styles.css      design tokens + components
js/data.js          seed data  (= Microsoft Lists content)
js/store.js         state, persistence, workflow actions (= Power Automate flows), Spark AI scoring
js/app.js           router + view components:
                    Header · Hero · StatsRow · OpportunityCard · FilterBar · Lifecycle
                    · OpportunityDetail · ApplicationForm · Confirmation · ApplicantCard
                    · SkillMatch · ManagerWorkspace · RecognitionCard · ActivityFeed
                    · NotificationPanel · Modal · Toast
docs/SOLUTION_DESIGN.md   Microsoft 365 mapping, Lists schema, flows, Copilot roadmap
```

Vanilla JS was a deliberate choice for a one-night MVP: zero build risk on demo day, and the
component structure translates directly to React/SPFx if the team wants it.

## What I intentionally did not implement — and why

| Skipped | Why |
|---|---|
| Authentication / RBAC | In production this is Microsoft Entra ID via SharePoint; simulated with a persona switch so the evaluator can see both sides of the workflow in one session |
| Backend / database | `localStorage` keeps the demo reliable offline; the data model is already shaped as Microsoft Lists |
| Real e-mail / Teams | Every message is generated by the same actions that would trigger Power Automate — shown in the Notification centre tagged *email / teams / portal* |
| Real AI matching | "Spark AI" is rule-based (exact skill = Strong, related skill = Good). The UI, data and roadmap are ready for Copilot Studio / Azure AI over Microsoft Graph |
| Calendar integration | "Schedule discussion" records the slot and notifies; production uses the Teams "Create meeting" connector |
| Analytics dashboard | Live stats on Home cover the demo; Power BI over the Lists is the production path |
| Admin console, videos & demos, multi-language | No business value for the core journey in the time available |
