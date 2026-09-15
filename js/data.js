/* ============================================================
   SPARK — seed data
   Maps 1:1 to the Microsoft Lists in docs/SOLUTION_DESIGN.md:
   Opportunities · Applications · Projects (derived) · Recognition
   · Subscriptions · Notifications. Relative times ("agoH") are
   resolved to real timestamps when the demo data is (re)seeded so
   "Posted 2 hours ago" stays true on demo day.
   ============================================================ */
window.SEED = {
  /* Demo personas — switch from the avatar menu. */
  users: [
    { id: "u-priya", name: "Priya Sharma", role: "employee", empId: "VE10234", title: "Software Engineer", team: "Engineering Productivity", manager: "Meera Iyer", location: "Chennai", email: "priya.sharma@company.com", experience: "2 years", skills: ["Python", "AI / ML", "Automation", "Power Automate"], currentProject: "Engineering Metrics Automation", availability: "10 hrs/week", bio: "Builds internal automation for engineering teams; recently shipped a Python service that reconciles Jira and Git activity into weekly reports." },
    { id: "u-arjun", name: "Arjun Sharma", role: "manager", empId: "VE07811", title: "Senior Manager, Digital Engineering", team: "Digital Engineering", manager: "Sunil Rao", location: "Chennai", email: "arjun.sharma@company.com", experience: "14 years", skills: ["AI / ML", "Python", "Product Strategy"], currentProject: "AI Productivity Initiative", availability: "", bio: "Leads the Digital Engineering group's applied-AI initiatives. Mentors on Python, LLM prototyping and turning experiments into adopted tools." },
    { id: "u-kavya", name: "Kavya Deshmukh", role: "manager", empId: "VE06920", title: "Manager, Project Intelligence & Analytics", team: "Project Intelligence & Analytics", manager: "Sunil Rao", location: "Pune", email: "kavya.deshmukh@company.com", experience: "11 years", skills: ["Power BI", "Data", "SQL"], currentProject: "Program Analytics Platform", availability: "", bio: "Runs the analytics program for engineering projects. Mentors on data modelling, DAX and dashboard storytelling." }
  ],

  /* Everyone who appears as an applicant / contributor (from Entra ID in production). */
  people: [
    { id: "p-rahul",  name: "Rahul Mehta",     empId: "VE10188", title: "Software Engineer",        team: "Platform Engineering",       manager: "Anand Krishnan", email: "rahul.mehta@company.com",     experience: "3 years", skills: ["Python", "Automation", "Testing", "Linux"],             currentProject: "CI Pipeline Hardening" },
    { id: "p-sneha",  name: "Sneha Pillai",    empId: "VE10290", title: "Associate Engineer",       team: "Cloud Services",             manager: "Divya Raman",    email: "sneha.pillai@company.com",    experience: "1 year",  skills: ["Python", "Azure", "Cloud", "SQL"],                       currentProject: "Telemetry Ingestion" },
    { id: "p-karthik",name: "Karthik Menon",   empId: "VE09877", title: "Senior Engineer",          team: "Cloud Services",             manager: "Divya Raman",    email: "karthik.menon@company.com",   experience: "6 years", skills: ["Cloud", "Azure", "Power BI", "Data"],                    currentProject: "FinOps Reporting" },
    { id: "p-ananya", name: "Ananya Rao",      empId: "VE10215", title: "Data Analyst",             team: "Program Management Office",  manager: "Kavya Deshmukh", email: "ananya.rao@company.com",      experience: "2 years", skills: ["Power BI", "Data", "SQL", "DAX"],                        currentProject: "Portfolio Reporting" },
    { id: "p-divya",  name: "Divya Raman",     empId: "VE08102", title: "Lead Engineer",            team: "Cloud Services",             manager: "Sunil Rao",      email: "divya.raman@company.com",     experience: "9 years", skills: ["Data", "Python", "Azure", "Power BI"],                   currentProject: "Data Lake Modernisation" },
    { id: "p-rohan",  name: "Rohan Gupta",     empId: "VE10251", title: "Software Engineer",        team: "Cockpit Platform",           manager: "Anand Krishnan", email: "rohan.gupta@company.com",     experience: "2 years", skills: ["Python", "C", "Embedded", "Linux"],                      currentProject: "Boot-time Optimisation" },
    { id: "p-neha",   name: "Neha Verma",      empId: "VE10312", title: "Test Engineer",            team: "Validation Engineering",     manager: "Kavya Deshmukh", email: "neha.verma@company.com",      experience: "2 years", skills: ["Python", "Testing", "Automation", "Prompt Engineering"], currentProject: "HIL Test Automation" },
    { id: "p-vikram", name: "Vikram Joshi",    empId: "VE10190", title: "Software Engineer",        team: "Quality Systems",            manager: "Meera Iyer",     email: "vikram.joshi@company.com",    experience: "3 years", skills: ["Python", "SQL", "Data"],                                 currentProject: "Supplier Scorecard" },
    { id: "p-aditya", name: "Aditya Kulkarni", empId: "VE10334", title: "Associate Engineer",       team: "Digital Engineering",        manager: "Arjun Sharma",   email: "aditya.kulkarni@company.com", experience: "1 year",  skills: ["Python", "GenAI", "Prompt Engineering"],                 currentProject: "Documentation Search" },
    { id: "p-ishita", name: "Ishita Bose",     empId: "VE10277", title: "Data Engineer",            team: "Data Platforms",             manager: "Divya Raman",    email: "ishita.bose@company.com",     experience: "4 years", skills: ["Python", "SQL", "Data", "Azure"],                        currentProject: "Master Data Cleanup" },
    { id: "p-manoj",  name: "Manoj Pillai",    empId: "VE10142", title: "Software Engineer",        team: "Manufacturing Systems",      manager: "Anand Krishnan", email: "manoj.pillai@company.com",    experience: "5 years", skills: ["SQL", "Data", "Power BI"],                               currentProject: "MES Reporting" }
  ],

  opportunities: [
    {
      id: "opp-101", title: "AI Productivity Accelerator", status: "Open", featured: true,
      description: "Build a lightweight AI-powered productivity solution that helps engineering teams automate repetitive knowledge and reporting tasks.",
      statement: "I'm looking for 2 contributors interested in Python and AI to help prototype a productivity solution over a two-week sprint.",
      duration: "2 weeks", weeks: 2, effort: "10 hrs/week", openings: 2,
      skills: ["Python", "AI / ML", "Automation", "Prompt Engineering"], technology: "AI / ML",
      team: "Digital Engineering", location: "Remote / Chennai",
      mentorId: "u-arjun", postedBy: "u-arjun", agoH: 2, startDate: "2026-09-22",
      work: ["Python automation of recurring engineering reports", "AI-assisted summarisation of design reviews and stand-ups", "Knowledge retrieval over existing engineering documentation", "A working prototype demoed to the Digital Engineering leadership team"],
      why: "Engineering leads spend an estimated 4–6 hours a week compiling status, chasing documents and answering repeat questions. A focused two-week prototype will show whether AI-assisted automation can return that time to engineering work — and give the group a reusable pattern for future initiatives.",
      who: "Someone comfortable in Python who is curious about applied AI. You do not need prior LLM experience; you need to enjoy building small things quickly, testing them with real users and iterating.",
      build: ["LLM prototyping", "Prompt design", "Retrieval patterns", "Stakeholder demos"]
    },
    {
      id: "opp-102", title: "Python Engineering Automation Sprint", status: "Ongoing", featured: true, progress: 45,
      description: "Automate the manual steps in our release readiness checks — build a Python toolkit that pulls Jira, Git and test data into a single readiness report.",
      statement: "Three weeks, three contributors, one goal: no more hand-built release readiness decks.",
      duration: "3 weeks", weeks: 3, effort: "8 hrs/week", openings: 3,
      skills: ["Python", "Automation", "REST APIs", "Testing"], technology: "Python",
      team: "Engineering Productivity", location: "Chennai / Hybrid",
      mentorId: "u-arjun", postedBy: "u-arjun", agoH: 24 * 9, startDate: "2026-09-08",
      work: ["Data pullers for Jira, Azure DevOps and test results", "A readiness scoring model agreed with release managers", "Automated weekly report generation", "Hand-over documentation for the release team"],
      why: "Release readiness reviews currently take a full day of manual collation per programme. Automating them removes error-prone work and gives leadership a consistent, comparable view across programmes.",
      who: "Engineers who like clean Python, understand REST APIs and want to see their code adopted by a real team within weeks.",
      build: ["API integration", "Data modelling", "Report automation"]
    },
    {
      id: "opp-103", title: "Power BI Project Intelligence Dashboard", status: "Completed", featured: false, progress: 100,
      description: "Design a Power BI intelligence layer that gives programme leadership a single view of schedule, cost and risk across engineering projects.",
      statement: "We need two people who can turn messy project data into a dashboard leaders actually open.",
      duration: "4 weeks", weeks: 4, effort: "6 hrs/week", openings: 2,
      skills: ["Power BI", "Data", "SQL", "DAX"], technology: "Power BI",
      team: "Project Intelligence & Analytics", location: "Pune / Hybrid",
      mentorId: "u-kavya", postedBy: "u-kavya", agoH: 24 * 50, startDate: "2026-08-03", completedOn: "2026-09-02", outcome: "Programme reviews now run from one trusted view; review preparation cut from a full day to under an hour.",
      work: ["Semantic model over the project data mart", "Schedule, cost and risk KPIs with drill-through", "Executive landing page following brand guidelines", "Row-level security per programme"],
      why: "Programme reviews relied on five different spreadsheets. One trusted view shortens review meetings and makes early risk visible.",
      who: "Analysts or engineers with Power BI experience who care about clarity and can work with programme managers on definitions.",
      build: ["DAX", "Data storytelling", "Executive reporting"]
    },
    {
      id: "opp-104", title: "Generative AI Knowledge Assistant", status: "Open", featured: true,
      description: "Prototype a retrieval-augmented assistant that answers engineers' questions from our internal standards, design guidelines and lessons-learned library.",
      statement: "Looking for two curious builders to prove that our engineering knowledge can be searchable in plain language.",
      duration: "6 weeks", weeks: 6, effort: "8 hrs/week", openings: 2,
      skills: ["Python", "GenAI", "Prompt Engineering", "Azure"], technology: "GenAI",
      team: "Digital Engineering", location: "Bengaluru / Hybrid",
      mentorId: "u-arjun", postedBy: "u-arjun", agoH: 24 * 2 + 5, startDate: "2026-10-05",
      work: ["Document ingestion and chunking pipeline", "Retrieval and grounding with citations", "Evaluation set built with domain experts", "Teams-embedded chat experience"],
      why: "New engineers take months to learn where knowledge lives. A grounded assistant shortens onboarding and reduces repeat questions to senior engineers.",
      who: "Engineers with Python who want hands-on experience with retrieval-augmented generation on Azure. Curiosity and rigour matter more than prior LLM work.",
      build: ["RAG architecture", "Azure AI services", "Evaluation design"]
    },
    {
      id: "opp-105", title: "Engineering Data Quality Accelerator", status: "Under Review", featured: false,
      description: "Profile and fix data-quality issues in the engineering data mart so downstream analytics and AI initiatives can trust their inputs.",
      statement: "One contributor, four weeks, measurable improvement in data quality scores.",
      duration: "4 weeks", weeks: 4, effort: "6 hrs/week", openings: 1,
      skills: ["Python", "SQL", "Data"], technology: "Data",
      team: "Data Platforms", location: "Chennai / Hybrid",
      mentorId: "u-kavya", postedBy: "u-kavya", agoH: 24 * 6, startDate: "2026-09-28",
      work: ["Data profiling across the top 20 engineering tables", "Rule library for completeness, uniqueness and validity", "Automated quality scorecard", "Remediation backlog with owners"],
      why: "Every analytics and AI initiative in the group depends on the same data mart. Raising its quality score lifts all of them.",
      who: "A data-minded engineer who enjoys SQL, is methodical and can work with data owners to fix root causes.",
      build: ["Data profiling", "Quality frameworks", "Stakeholder alignment"]
    },
    {
      id: "opp-106", title: "Test Automation Framework Modernisation", status: "Completed", featured: false, progress: 100,
      description: "Migrate legacy validation scripts to a modern pytest-based framework with reusable fixtures and CI integration.",
      statement: "Two people to retire 400 legacy scripts and give validation a framework they enjoy using.",
      duration: "5 weeks", weeks: 5, effort: "8 hrs/week", openings: 2,
      skills: ["Python", "Testing", "Automation"], technology: "Testing",
      team: "Validation Engineering", location: "Chennai / Onsite",
      mentorId: "u-arjun", postedBy: "u-arjun", agoH: 24 * 80, startDate: "2026-07-06", completedOn: "2026-08-14", outcome: "120 legacy scripts migrated; validation cycle time reduced by 35%.",
      work: ["Framework design and fixture library", "Migration of the top 100 scripts", "CI integration with reporting", "Team enablement sessions"],
      why: "Legacy scripts were slowing every release. The new framework cut validation cycle time by 35%.",
      who: "Engineers with Python and a testing mindset.",
      build: ["pytest", "CI/CD", "Framework design"]
    },
    {
      id: "opp-107", title: "Cloud Cost Observability Dashboard", status: "Completed", featured: false, progress: 100,
      description: "Give engineering teams a live view of their Azure spend, with anomaly alerts and ownership tagging.",
      statement: "Two contributors to make cloud cost visible to the people who create it.",
      duration: "4 weeks", weeks: 4, effort: "6 hrs/week", openings: 2,
      skills: ["Cloud", "Azure", "Power BI", "Data"], technology: "Cloud",
      team: "Cloud Services", location: "Remote",
      mentorId: "u-kavya", postedBy: "u-kavya", agoH: 24 * 110, startDate: "2026-06-08", completedOn: "2026-07-10", outcome: "18% reduction in idle Azure spend in the first quarter after launch.",
      work: ["Cost export pipeline", "Ownership tagging model", "Power BI dashboard with anomaly alerts", "Monthly review ritual"],
      why: "Visibility drove a 18% reduction in idle spend within the first quarter.",
      who: "Engineers who know Azure and want to learn FinOps.",
      build: ["FinOps", "Azure cost management", "Power BI"]
    },
    {
      id: "opp-108", title: "Embedded Diagnostics Log Analyzer", status: "On Hold", featured: false,
      description: "Build a Python tool that parses cockpit ECU diagnostic logs and highlights recurring fault patterns for the platform team.",
      statement: "Paused until the new log format is finalised — expected to reopen in October.",
      duration: "3 weeks", weeks: 3, effort: "6 hrs/week", openings: 1,
      skills: ["Python", "Embedded", "C"], technology: "Embedded",
      team: "Cockpit Platform", location: "Bengaluru / Onsite",
      mentorId: "u-arjun", postedBy: "u-arjun", agoH: 24 * 12, startDate: "TBD",
      work: ["Log parser for the UDS diagnostic format", "Pattern detection and clustering", "Reporting notebook"],
      why: "Platform engineers spend hours reading raw logs after every test drive.",
      who: "Embedded-curious Python developers.",
      build: ["Diagnostics protocols", "Pattern analysis"]
    },
    {
      id: "opp-109", title: "Supplier Quality Data Pipeline", status: "Closed", featured: false,
      description: "Consolidate supplier PPM data from five plants into one curated dataset.",
      statement: "Filled — thanks to everyone who applied.",
      duration: "5 weeks", weeks: 5, effort: "8 hrs/week", openings: 2,
      skills: ["Python", "SQL", "Azure"], technology: "Data",
      team: "Quality Systems", location: "Pune / Hybrid",
      mentorId: "u-kavya", postedBy: "u-kavya", agoH: 24 * 30, startDate: "2026-09-01",
      work: ["Ingestion from plant systems", "Curated supplier table", "Quality report"],
      why: "One trusted supplier dataset for all plants.",
      who: "Data engineers.",
      build: ["Azure Data Factory", "Data modelling"]
    }
  ],

  /* Application status: Under Review → Discussion Scheduled → Shortlisted → Accepted | Rejected */
  applications: [
    { id: "app-01", oppId: "opp-101", personId: "p-rohan",  status: "Under Review", agoH: 20,  availability: "From 22 Sep · 10 hrs/week", interest: "I've been scripting our boot-time analysis in Python and want to see how AI can take over the reporting part of that work." },
    { id: "app-02", oppId: "opp-101", personId: "p-neha",   status: "Under Review", agoH: 9,   availability: "From 22 Sep · 8 hrs/week",  interest: "I use prompt-based test generation in my own work already; I'd like to apply it to knowledge tasks with a mentor." },
    { id: "app-03", oppId: "opp-101", personId: "p-vikram", status: "Under Review", agoH: 3,   availability: "From 29 Sep · 10 hrs/week", interest: "Strong Python and SQL, new to AI — this looks like the right-sized way to learn it on a real problem." },
    { id: "app-04", oppId: "opp-102", personId: "p-rahul",  status: "Accepted",     agoH: 24 * 8, availability: "From 8 Sep · 8 hrs/week", interest: "I maintain our CI pipelines and want to remove the manual readiness step for good." },
    { id: "app-05", oppId: "opp-102", personId: "p-sneha",  status: "Accepted",     agoH: 24 * 8, availability: "From 8 Sep · 8 hrs/week", interest: "Keen to work with REST APIs at scale and learn from the productivity team." },
    { id: "app-06", oppId: "opp-102", personId: "p-karthik",status: "Accepted",     agoH: 24 * 7, availability: "From 8 Sep · 6 hrs/week", interest: "I can bring the reporting layer from our FinOps work." },
    { id: "app-07", oppId: "opp-102", personId: "u-priya",  status: "Shortlisted",  agoH: 24 * 4, availability: "From 15 Sep · 8 hrs/week", interest: "I built the Jira/Git reconciliation service the team already uses — I'd like to extend it into release readiness." },
    { id: "app-08", oppId: "opp-103", personId: "p-ananya", status: "Accepted",     agoH: 24 * 48, availability: "6 hrs/week", interest: "Portfolio reporting is my day job; I want to build the version leadership asks for." },
    { id: "app-09", oppId: "opp-103", personId: "p-divya",  status: "Accepted",     agoH: 24 * 47, availability: "6 hrs/week", interest: "I own the data mart this will sit on." },
    { id: "app-10", oppId: "opp-104", personId: "p-aditya", status: "Under Review", agoH: 30,  availability: "From 5 Oct · 8 hrs/week", interest: "I've prototyped document search for our team; I want to do it properly with retrieval and evaluation." },
    { id: "app-11", oppId: "opp-105", personId: "p-ishita", status: "Discussion Scheduled", agoH: 24 * 4, discussionAt: "2026-09-18T15:00", availability: "From 28 Sep · 6 hrs/week", interest: "Master data cleanup taught me where the quality problems come from — I'd like to fix them upstream." },
    { id: "app-12", oppId: "opp-105", personId: "p-manoj",  status: "Under Review", agoH: 24 * 3, availability: "From 28 Sep · 6 hrs/week", interest: "MES reporting depends on this data; I have a list of issues ready to go." },
    { id: "app-13", oppId: "opp-106", personId: "p-rahul",  status: "Accepted",     agoH: 24 * 75, availability: "8 hrs/week", interest: "" },
    { id: "app-14", oppId: "opp-106", personId: "p-neha",   status: "Accepted",     agoH: 24 * 75, availability: "8 hrs/week", interest: "" },
    { id: "app-15", oppId: "opp-107", personId: "p-karthik",status: "Accepted",     agoH: 24 * 105, availability: "6 hrs/week", interest: "" },
    { id: "app-16", oppId: "opp-107", personId: "p-sneha",  status: "Accepted",     agoH: 24 * 105, availability: "6 hrs/week", interest: "" }
  ],

  badges: [
    { key: "innovation", name: "Innovation Champion", icon: "bulb", cls: "innovation", blurb: "Brought an idea or approach that changed the outcome." },
    { key: "rising",     name: "Rising Star",         icon: "star", cls: "rising",     blurb: "Stepped up far beyond their experience level." },
    { key: "collab",     name: "Best Collaborator",   icon: "hands", cls: "collab",     blurb: "Lifted the whole team — communication, pairing, unblocking." },
    { key: "impact",     name: "Impact Maker",        icon: "target", cls: "impact",     blurb: "Delivered a measurable business result." }
  ],

  recognitions: [
    { id: "rec-01", oppId: "opp-103", personId: "p-ananya",  badge: "collab",     citation: "Kept three programme offices aligned on KPI definitions and ran every review herself.", agoH: 24 * 13, awardedBy: "Kavya Deshmukh" },
    { id: "rec-02", oppId: "opp-103", personId: "p-divya",   badge: "innovation", citation: "Proposed the semantic-model design that made drill-through possible across programmes.", agoH: 24 * 13, awardedBy: "Kavya Deshmukh" },
    { id: "rec-03", oppId: "opp-106", personId: "p-rahul",   badge: "rising",     citation: "Migrated 120 legacy scripts in his first cross-team project and trained the validation team.", agoH: 24 * 32, awardedBy: "Arjun Sharma" },
    { id: "rec-04", oppId: "opp-107", personId: "p-karthik", badge: "impact",     citation: "Cost visibility he built drove an 18% reduction in idle cloud spend within a quarter.", agoH: 24 * 66, awardedBy: "Kavya Deshmukh" },
    { id: "rec-05", oppId: "opp-107", personId: "p-sneha",   badge: "rising",     citation: "Owned the cost export pipeline end to end within a year of joining.", agoH: 24 * 66, awardedBy: "Kavya Deshmukh" }
  ],

  subscriptions: [
    { userId: "u-priya", technologies: ["Python", "AI / ML", "Automation"] },
    { userId: "p-neha", technologies: ["AI / ML", "Testing"] }
  ],

  technologies: ["Python", "AI / ML", "GenAI", "Power BI", "Automation", "Data", "Cloud", "Embedded", "Testing"],

  /* Related-skill map used by Spark AI (rule-based today; Azure AI / Graph later). */
  related: {
    "AI / ML": ["Prompt Engineering", "GenAI", "Data"],
    "GenAI": ["AI / ML", "Prompt Engineering"],
    "Prompt Engineering": ["AI / ML", "GenAI"],
    "Python": ["Automation", "Testing"],
    "Automation": ["Python", "Power Automate", "Testing"],
    "Power BI": ["Data", "DAX", "SQL"],
    "Data": ["SQL", "Power BI", "Python"],
    "SQL": ["Data", "DAX"],
    "DAX": ["Power BI"],
    "Cloud": ["Azure"],
    "Azure": ["Cloud"],
    "Embedded": ["C", "Linux"],
    "C": ["Embedded"],
    "Testing": ["Automation", "Python"],
    "REST APIs": ["Python"]
  },

  notifications: [
    { id: "n-01", to: "u-arjun", channel: "email",  type: "application", title: "New application received for AI Productivity Accelerator", body: "To: arjun.sharma@company.com\nVikram Joshi (Quality Systems) applied. Skills: Python, SQL, Data. Availability: from 29 Sep, 10 hrs/week.", link: "#/manager/applicants", agoH: 3, read: false },
    { id: "n-02", to: "u-arjun", channel: "portal", type: "application", title: "3 applicants are waiting for your review", body: "AI Productivity Accelerator has 3 new applications this week.", link: "#/manager/applicants", agoH: 9, read: false },
    { id: "n-03", to: "u-priya", channel: "email",  type: "status", title: "Your application has been shortlisted", body: "To: priya.sharma@company.com\nArjun Sharma shortlisted you for Python Engineering Automation Sprint. Next step: a short discussion this week.", link: "#/my-applications", agoH: 24 * 2, read: false },
    { id: "n-04", to: "all",     channel: "portal", type: "announcement", title: "New opportunity: Generative AI Knowledge Assistant", body: "Arjun Sharma (Digital Engineering) is looking for 2 contributors · 6 weeks · Python, GenAI, Prompt Engineering.", link: "#/opportunity/opp-104", agoH: 24 * 2 + 5, read: true },
    { id: "n-05", to: "all",     channel: "portal", type: "status", title: "Python Engineering Automation Sprint is now ongoing", body: "Three contributors have been onboarded under Arjun Sharma.", link: "#/opportunity/opp-102", agoH: 24 * 7, read: true },
    { id: "n-06", to: "all",     channel: "portal", type: "recognition", title: "Recognition announced: Power BI Project Intelligence Dashboard", body: "Best Collaborator — Ananya Rao · Innovation Champion — Divya Raman.", link: "#/recognition", agoH: 24 * 13, read: true },
    { id: "n-07", to: "u-priya", channel: "email",  type: "subscription", title: "Subscriber alert: a new AI / ML opportunity matches your interests", body: "To: priya.sharma@company.com\nAI Productivity Accelerator was posted by Arjun Sharma · 2 openings · 2 weeks.", link: "#/opportunity/opp-101", agoH: 2, read: false }
  ],

  /* Home page "Latest updates" feed. Store actions append to this. */
  activity: [
    { icon: "join", text: "Rahul Mehta, Sneha Pillai and Karthik Menon joined Python Engineering Automation Sprint", agoH: 24 * 7 },
    { icon: "launch", text: "Python Engineering Automation Sprint is now ongoing", agoH: 24 * 7 },
    { icon: "award", text: "Ananya Rao received Best Collaborator for Power BI Project Intelligence Dashboard", agoH: 24 * 13 },
    { icon: "done", text: "Power BI Project Intelligence Dashboard was completed", agoH: 24 * 14 }
  ],

  /* Power Automate flow catalogue — the same definitions drive the in-app "Behind the scenes" trace. */
  flows: [
    { id: "F1", name: "Opportunity announcement", trigger: "Opportunities list · item created", out: ["SharePoint News post", "Teams adaptive card", "Outlook e-mail to subscribers"] },
    { id: "F2", name: "Application received", trigger: "Microsoft Forms · response submitted", out: ["Applications list item", "Outlook e-mail to opportunity owner", "Confirmation e-mail to applicant"] },
    { id: "F3", name: "Application status changed", trigger: "Applications list · Status modified", out: ["Outlook e-mail to applicant", "Teams meeting / channel membership", "Projects list item", "Opportunity status update"] },
    { id: "F4", name: "Project completed & recognition", trigger: "Opportunities list · Status = Completed", out: ["Adaptive card to mentor (choose recognition)", "Recognition list items", "Outlook e-mail to winners", "News post + Teams recognition card"] },
    { id: "F5", name: "Weekly digest", trigger: "Recurrence · Monday 09:00", out: ["Outlook digest per subscriber"] }
  ],

  testimonials: [
    { personId: "p-ananya", text: "Spark gave me a real problem, a real mentor and a real deadline. I learned more in four weeks than in my first six months." },
    { personId: "p-rahul",  text: "I could try a completely different stack without leaving my team — and my manager saw the result." },
    { personId: "u-arjun",  text: "I get focused help on work that would otherwise sit in the backlog, and I spot talent I would never have met." }
  ]
};
