# SPARK — Microsoft 365 Solution Design

The prototype in this repository is the clickable specification. This document is the build
plan for the production version on **SharePoint Online → Microsoft Lists → Power Automate →
Microsoft Forms → Outlook / Teams → (optional) Copilot Studio**.

Design rule: every data change in the prototype (`js/store.js`) is one flow here, and every
notification the prototype shows is one e-mail / Teams post a flow sends. The prototype makes this
visible: after each action a **Behind the scenes** panel lists the flow steps, `#/automation` keeps
the session log, and `#/architecture` renders this document inside the product.

---

## 1. Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│ SharePoint Communication Site "SPARK" (hub-associated to the intranet)   │
│  Home · Opportunities · Opportunity detail · Manager Workspace            │
│  My Applications · My Projects · Recognition                              │
│  (modern pages + List web parts with JSON formatting; SPFx optional)      │
└───────────────┬───────────────────────────────────┬───────────────────────┘
                │ reads / writes                    │ triggers
┌───────────────▼───────────────────┐   ┌───────────▼───────────────────────┐
│ Microsoft Lists                   │   │ Power Automate                    │
│  Opportunities                    │◄──┤  F1  Opportunity announcement      │
│  Applications                     │   │  F2  Application → manager         │
│  Projects                         │   │  F3  Application status → applicant│
│  Recognition                      │   │  F4  Project completed → recognition│
│  Subscriptions                    │   │  F5  Weekly digest (optional)      │
└───────────────────────────────────┘   └───────────────────────────────────┘
        ▲                                        ▲
        │ Microsoft Forms (application)          │ Copilot Studio "Ask Spark" (Teams)
        │ → flow writes the row                  │ Azure AI · Microsoft Graph (roadmap)
```

---

## 2. Microsoft Lists

### Opportunities
| Column | Type | Prototype field |
|---|---|---|
| Opportunity Title | Single line | `title` |
| Description | Multi-line | `description` |
| Manager Statement | Multi-line | `statement` |
| Duration | Choice (1–8 weeks) | `duration`, `weeks` |
| Required Skills | Choice (multi) / Managed metadata | `skills` |
| Technology | Choice | `technology` |
| Team | Single line | `team` |
| Location | Single line | `location` |
| Expected Effort | Choice | `effort` |
| Openings | Number | `openings` |
| Mentor | Person | `mentorId` |
| Mentor Email | Calculated from Mentor | — |
| Status | Choice: Open · Under Review · Ongoing · Completed · On Hold · Closed | `status` |
| Posted By | Person (Created By) | `postedBy` |
| Start Date / End Date | Date | `startDate`, `completedOn` |
| Progress | Number | `progress` |
| Work / Why / Who / Skills Built | Multi-line | `work`, `why`, `who`, `build` |
| Featured | Yes/No | `featured` |

### Applications
| Column | Type | Prototype field |
|---|---|---|
| Applicant Name / Applicant | Single line / Person | `personId` |
| Employee ID | Single line | `empId` |
| Applicant Email | From Person | — |
| Current Team | Single line | `team` |
| Manager | Person | `manager` |
| Skills | Choice (multi) | `skills` |
| Interest Statement | Multi-line | `interest` |
| Availability | Single line | `availability` |
| Opportunity | Lookup → Opportunities | `oppId` |
| Mentor | Lookup column (Opportunity:Mentor) | — |
| Application Status | Choice: Under Review · Discussion Scheduled · Shortlisted · Accepted · Rejected | `status` |
| Discussion At | Date & time | `discussionAt` |
| Applied Date | Created | `appliedOn` |
| Manager Comments | Multi-line | `managerComment` |

### Projects
Created by F3 when the first applicant is accepted.
| Column | Type |
|---|---|
| Project Name | Single line |
| Opportunity | Lookup |
| Participants | Person (multi) |
| Project Manager | Person |
| Status | Choice: Ongoing · Completed |
| Start Date / End Date / Completion Date | Date |

### Recognition
| Column | Type | Prototype field |
|---|---|---|
| Employee | Person | `personId` |
| Project | Lookup → Projects | `oppId` |
| Recognition | Choice: Innovation Champion · Rising Star · Best Collaborator · Impact Maker | `badge` |
| Description | Multi-line | `citation` |
| Award Date | Date | `date` |
| Awarded By | Person | `awardedBy` |

### Subscriptions
| Subscriber (Person) | Technologies (Choice, multi) |

Permissions: everyone *Read* on Opportunities / Projects / Recognition; *Contribute* with
item-level "edit own items" on Applications and Subscriptions; **Spark Managers** group has
Contribute on Opportunities, Projects and Recognition. Manager Workspace page is
audience-targeted to that group.

---

## 3. Pages → web parts

| Prototype page | SharePoint page | Web parts |
|---|---|---|
| Home | `Home.aspx` | Hero (custom banner image + CTA), **Highlighted content** on Opportunities (`Featured = Yes`), **List** view "Ongoing", **News** (auto-created by flows) for Latest updates, **List** view on Recognition with JSON medal formatting, Quick links, Text CTA band |
| Opportunities | `Marketplace.aspx` | **List** web part, Gallery view, JSON card formatting (status pill, skills, mentor photo, Apply button `openUrl` → Form with `?OpportunityId=`) + filters pane |
| Opportunity detail | List item display form (customised with Power Apps) or page per item | Lifecycle rendered with JSON formatting on the Status column |
| Apply | **Microsoft Forms** (pre-filled OpportunityId) — or the list's Power Apps form | |
| My Applications / My Projects | `Me.aspx` | **List** views filtered `Applicant = [Me]`, `Participants contains [Me]` |
| Manager Workspace | `Manager.aspx` (audience-targeted) | **List** "My opportunities" (`Created By = [Me]`), **List** "Applicants" grouped by Opportunity with JSON buttons `executeFlow` → F3; Status editable in grid |
| Applicant profile | List item view + **People** web part (Graph profile) | |
| Recognition | `Recognition.aspx` | **List** gallery on Recognition, filters by badge |
| Notifications | Outlook + Teams (real) | — |

---

## 4. Power Automate flows

| Flow | Trigger | Steps |
|---|---|---|
| **F1 Opportunity announcement** | Opportunities · *When an item is created* | Create News post → Post Adaptive Card to Teams "Spark Opportunities" (Apply button) → Get Subscriptions where Technologies ∋ Technology → *Send an email (V2)* per subscriber → confirmation e-mail to mentor |
| **F2 Application received** | Forms · *When a new response is submitted* | Get response details → Create item in Applications (Status = Under Review) → Get Opportunity → identify owner (Created By / Mentor) → **e-mail manager** with deep link to Manager Workspace → e-mail applicant confirmation → CC applicant's line manager → if Opportunity.Status = Open set Under Review |
| **F3 Application status** | Applications · *When an item is modified* (trigger condition: Status changed) or instant from JSON buttons | Switch(Status): *Discussion Scheduled* → Create Teams meeting + e-mail · *Shortlisted* → e-mail · *Rejected* → e-mail with Manager Comments · *Accepted* → e-mail, add to Teams channel, **create/update Project** (add Participant), if Opportunity.Status ∈ {Open, Under Review} set **Ongoing**, create News post "Project kicked off" |
| **F4 Project completed → recognition** | Opportunities/Projects · *When modified*, Status = Completed | E-mail participants → post Adaptive Card to mentor ("Recognize contributors": badge + citation per participant, *Post adaptive card and wait for a response*) → create Recognition rows → e-mail winners → News post + Teams recognition card |
| **F5 Weekly digest** | Recurrence · Monday 09:00 | E-mail each subscriber the open opportunities matching their technologies |

E-mail templates use the SPARK navy header and amber mark; every link deep-links to the page
the prototype links to (`link` field on each notification).

---

## 5. Lifecycle (single source of truth)

```
Opportunity   Open ──(F2: first application)──► Under Review ──(F3: first Accept)──► Ongoing
              ──(manager)──► Completed ──(F4)──► Recognized
              On Hold / Closed: set by the manager at any time (F3 notifies applicants)

Application   Under Review ──► Discussion Scheduled ──► Shortlisted ──► Accepted
                    └────────────────────────────────────────────────► Rejected
```

---

## 6. Spark AI — roadmap

Today (prototype): rule-based match — exact required skill = *Strong*, related skill
(`related` map in `data.js`) = *Good*, otherwise *Gap*; score = 50 + average/2.

| Phase | Capability | Platform |
|---|---|---|
| 1 | "Recommended for you" and applicant ranking from profile skills | Microsoft Graph (profile skills) + Power Automate scoring |
| 2 | **Ask Spark** conversational agent: "What Python projects are open?", "Apply me to…", "Subscribe me to AI" | **Copilot Studio** with the Lists as knowledge + flow actions, published to Teams |
| 3 | Semantic matching on interest statements and project history; skill-gap suggestions ("Skills you'll build") | **Azure AI** (embeddings) over Applications + Projects + Recognition |
| 4 | Manager copilot: draft opportunity from a one-line need; summarise applicants | Copilot Studio + Azure OpenAI |

---

## 7. Roll-out

| Phase | Scope | Effort |
|---|---|---|
| 1 | Site, 5 lists, Marketplace page, Forms application, F1 + F2 | 1–2 weeks |
| 2 | Manager Workspace + F3, Projects list, Home page | 1–2 weeks |
| 3 | Recognition (F4), Recognition page, News templates | 1 week |
| 4 | Copilot Studio agent, digest (F5), Power BI on the lists | 1 week |
