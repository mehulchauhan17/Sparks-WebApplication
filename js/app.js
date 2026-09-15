/* ============================================================
   SPARK — app
   Hash router + view components. Components are plain functions
   returning HTML strings; interactions are delegated through
   data-action attributes so every screen shares one event model.

   Components: Header · Hero · StatsRow · OpportunityCard · FilterBar
   · Lifecycle · OpportunityDetail · ApplicationForm · Confirmation
   · ApplicantCard · SkillMatch · ManagerWorkspace · RecognitionCard
   · ActivityFeed · NotificationPanel · Modal · Toast
   ============================================================ */
(function () {
  const S = window.Store; S.load();
  const ui = { open: null, trace: null, q: "", tech: "", team: "", duration: "", location: "", status: "", sort: "match" };

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const cls = s => s.toLowerCase().replace(/[^a-z]+/g, "-");
  const status = s => `<span class="status ${cls(s)}">${esc(s)}</span>`;
  const avatar = (name, extra = "") => `<span class="avatar ${extra}" aria-hidden="true">${esc(initials(name))}</span>`;
  const pills = (arr, extra = "") => arr.map(s => `<span class="pill ${extra}">${esc(s)}</span>`).join("");
  const I = {
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`,
    bell: `<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>`,
    plus: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>`,
    bulb: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.1.9 1.8V16h5.2v-.3c0-.7.3-1.3.9-1.8A6 6 0 0 0 12 3z"/></svg>`,
    hands: `<svg viewBox="0 0 24 24"><path d="M3 11l4-4 5 3 5-3 4 4-4 4-2-1.5M7 15l3 3 4-2 3-2M9 9l3 2"/></svg>`,
    target: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`,
    mail: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
    chat: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>`,
    inbox: `<svg viewBox="0 0 24 24"><path d="M3 13l2.5-8h13L21 13v6H3z"/><path d="M3 13h5l1.5 3h5L16 13h5"/></svg>`,
    rocket: `<svg viewBox="0 0 24 24"><path d="M5 19l3-3M14 4c3-1 5-1 6 0 1 1 1 3 0 6l-6 6-5-5z"/><circle cx="15" cy="9" r="1.5"/><path d="M9 11l-4 1 2 2M13 15l-1 4 2-2"/></svg>`,
    compass: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>`,
    megaphone: `<svg viewBox="0 0 24 24"><path d="M3 10v4h3l7 4V6l-7 4zM17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>`,
    flag: `<svg viewBox="0 0 24 24"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/></svg>`,
    users: `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M17 13.5a6.5 6.5 0 0 1 4.5 6.5"/></svg>`,
    layers: `<svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/></svg>`
  };
  const ico = (name, extra = "") => `<span class="ico-svg ${extra}" aria-hidden="true">${I[name] || I.bell}</span>`;
  const badgeIcon = (b, size = "") => `<span class="medal ${b.cls} ${size}" aria-hidden="true">${I[b.icon] || I.star}</span>`;
  const SVC = { lists: ["Lists", "svc-lists"], outlook: ["Outlook", "svc-outlook"], teams: ["Teams", "svc-teams"], forms: ["Forms", "svc-forms"], sharepoint: ["SharePoint", "svc-sp"], copilot: ["Copilot Studio", "svc-copilot"] };
  const svc = k => `<span class="svc ${SVC[k][1]}">${SVC[k][0]}</span>`;
  const ACT_ICON = { join: "users", launch: "rocket", award: "star", done: "check", post: "sparkle", apply: "inbox" };
  const OPP_STATUSES = ["Open", "Under Review", "Ongoing", "Completed", "On Hold", "Closed"];
  const LIFE = ["Open", "Under Review", "Ongoing", "Completed", "Recognized"];
  const APP_STEPS = ["Under Review", "Shortlisted", "Accepted"];
  const NEXT = {
    "Under Review": m => `${m} will review your profile and may invite you for a short discussion.`,
    "Discussion Scheduled": (m, a) => `Discussion with ${m} on ${S.fmtDT(a.discussionAt)} — join via the Teams invite.`,
    "Shortlisted": m => `${m} is making the final selection. Keep your availability open.`,
    "Accepted": () => `Kick-off details are in the project's Teams channel. Track progress under My Projects.`,
    "Rejected": () => `Explore other opportunities matched to your skills — new ones are posted every week.`
  };

  function toast(title, body, kind = "") {
    const box = document.getElementById("toasts");
    const el = document.createElement("div"); el.className = "toast " + kind; el.setAttribute("role", "status");
    el.innerHTML = `<div class="tt">${esc(title)}</div>${body ? `<div class="tb">${esc(body)}</div>` : ""}`;
    box.appendChild(el); setTimeout(() => el.remove(), 5000);
  }
  function modal(title, body, footer = `<button class="btn secondary" data-action="close-modal">Close</button>`) {
    closeModal();
    const bg = document.createElement("div"); bg.className = "modal-bg"; bg.id = "modal";
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h3>${title}</h3><button class="x" data-action="close-modal" aria-label="Close">×</button></header><div class="body">${body}</div><footer>${footer}</footer></div>`;
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(); });
    document.body.appendChild(bg);
    const f = bg.querySelector("input,select,textarea,button"); if (f) f.focus();
  }
  function closeModal() { const m = document.getElementById("modal"); if (m) m.remove(); }
  function route() { const p = (location.hash || "#/home").replace(/^#\/?/, "").split("/").filter(Boolean); return { name: p[0] || "home", arg: p[1] || "", sub: p[2] || "" }; }
  const go = h => { location.hash = h; };

  /* ============================================================
     SHELL — Header + footer
     ============================================================ */
  function shell(inner) {
    const me = S.me(); const r = route(); const unread = S.unreadCount();
    const nav = me.role === "manager"
      ? [["home", "Home", "#/home"], ["opportunities", "Opportunities", "#/opportunities"], ["manager", "Manager Workspace", "#/manager"], ["recognition", "Recognition", "#/recognition"]]
      : [["home", "Home", "#/home"], ["opportunities", "Opportunities", "#/opportunities"], ["my-applications", "My Applications", "#/my-applications"], ["my-projects", "My Projects", "#/my-projects"], ["recognition", "Recognition", "#/recognition"]];
    const active = k => (r.name === k || (k === "opportunities" && ["opportunity", "apply", "applied"].includes(r.name)) || (k === "manager" && r.name === "applicant")) ? "active" : "";
    const notifs = S.notificationsFor(me.id).slice(0, 6);
    return `
    <header class="hdr">
      <div class="wrap">
        <a class="logo" href="#/home" aria-label="SPARK home"><span class="mark">${I.bolt}</span>SPARK</a>
        <nav class="nav" aria-label="Primary">${nav.map(([k, l, h]) => `<a href="${h}" class="${active(k)}">${l}</a>`).join("")}</nav>
        <span class="spacer"></span>
        <form class="hdr-search" role="search" data-form="hdr-search">${I.search}<input id="hdr-q" placeholder="Search opportunities" aria-label="Search opportunities" value="${esc(ui.q)}"></form>
        <div class="rel">
          <button class="icon-btn" data-action="toggle" data-panel="notif" aria-label="Notifications (${unread} unread)" aria-expanded="${ui.open === "notif"}">${I.bell}${unread ? `<span class="dot">${unread}</span>` : ""}</button>
          ${ui.open === "notif" ? `<div class="notif-panel" id="panel"><div class="hd"><span>Notifications</span><button class="btn ghost sm" data-action="mark-all">Mark all read</button></div><div class="list">${notifs.map(notifRow).join("") || `<div class="notif-row">No notifications yet.</div>`}</div><div class="ft"><a href="#/notifications">View all notifications</a></div></div>` : ""}
        </div>
        <a class="btn on-dark" href="#/manager/new">${I.plus}<span class="cta-txt">Post Opportunity</span></a>
        <div class="rel">
          <button class="avatar hdr-av" data-action="toggle" data-panel="user" aria-label="Account menu" aria-expanded="${ui.open === "user"}">${esc(initials(me.name))}</button>
          ${ui.open === "user" ? `<div class="menu" id="panel"><div class="who"><b>${esc(me.name)}</b><div class="small muted">${esc(me.title)} · ${esc(me.team)}</div></div>
            <a href="#/opportunities">Opportunities</a>${me.role === "manager" ? `<a href="#/manager">Manager Workspace</a>` : `<a href="#/my-applications">My applications</a><a href="#/my-projects">My projects</a>`}<a href="#/recognition">Recognition</a><a href="#/notifications">Notifications</a>
            <div class="lbl">Demo · switch role</div>
            ${S.state.users.filter(u => u.id !== me.id).map(u => `<button data-action="switch-user" data-id="${u.id}">${avatar(u.name)}<span>${esc(u.name)}<span class="small muted" style="display:block">${u.role === "manager" ? "Opportunity owner" : "Employee"} · ${esc(u.team)}</span></span></button>`).join("")}
            <div class="lbl">Demo</div><button data-action="reset-demo">Reset demo data</button></div>` : ""}
        </div>
      </div>
    </header>
    <main class="page" id="main">${inner}</main>
    <footer class="ftr"><div class="wrap"><span><b style="color:#fff">SPARK</b> · Discover. Contribute. Grow. · Internal opportunity marketplace</span><span><a href="#/architecture">How it runs on Microsoft 365</a><a href="#/automation">Automation log</a><a href="#/recognition">Recognition</a></span></div></footer>`;
  }
  function notifRow(n) {
    const name = n.channel === "email" ? "mail" : n.channel === "teams" ? "chat" : n.type === "recognition" ? "star" : n.type === "application" ? "inbox" : n.type === "announcement" ? "megaphone" : "bell";
    return `<a class="notif-row ${n.read ? "" : "unread"}" href="${n.link}" data-action="read-notif" data-id="${n.id}"><span class="nico ${n.channel}">${I[name]}</span><span><span class="t">${esc(n.title)}</span><span class="b" style="display:block">${esc(n.body.split("\n").filter(l => !l.startsWith("To:")).join("\n"))}</span><span class="m" style="display:block">${S.ago(n.time)} · ${n.channel}</span></span></a>`;
  }

  /* ============================================================
     SHARED COMPONENTS
     ============================================================ */
  function lifecycle(opp, dark = false, compact = false) {
    const recognized = S.recognitionsFor(opp.id).length > 0;
    let idx = LIFE.indexOf(opp.status); if (idx < 0) idx = 0; if (recognized) idx = 4;
    const paused = ["On Hold", "Closed"].includes(opp.status);
    const done = idx === 4 || opp.status === "Completed";
    return `<div class="lifecycle ${dark ? "dark" : ""} ${compact ? "compact" : ""}" aria-label="Project lifecycle: ${LIFE[idx]}">${LIFE.map((s, i) => `<div class="st ${cls(s)} ${i < idx || (i === idx && done) ? "done" : i === idx ? "cur" : ""}" title="${s}">${s}</div>`).join("")}</div>${compact ? `<div class="life-cap">${paused ? `Paused · ${esc(opp.status)}` : `${esc(LIFE[idx])} · step ${idx + 1} of 5`}</div>` : paused ? `<div class="small muted mt1">Lifecycle paused — opportunity is ${opp.status.toLowerCase()}.</div>` : ""}`;
  }
  function oppCard(o, { rec, top } = {}) {
    const me = S.me(); const mentor = S.person(o.mentorId);
    const remaining = Math.max(0, o.openings - S.contributors(o.id).length);
    const canApply = ["Open", "Under Review"].includes(o.status);
    const mine = S.myApplicationFor(o.id);
    return `<article class="card hover opp">
      ${rec ? `<span class="rec pill ai">${I.bolt}${top ? "Top match · " : ""}${rec}% match</span>` : ""}
      <div class="card-head"><div><div class="title"><a href="#/opportunity/${o.id}">${esc(o.title)}</a></div><div class="team">${esc(o.team)} · ${esc(o.location)}</div></div>${status(o.status)}</div>
      <p class="desc">${esc(o.description)}</p>
      <div class="facts"><div>Duration<b>${esc(o.duration)}</b></div><div>Effort<b>${esc(o.effort)}</b></div><div>Openings<b>${canApply ? `${remaining} of ${o.openings}` : o.openings}</b></div></div>
      <div class="skills">${o.skills.map(s => `<span class="pill ${me.skills.includes(s) ? "match" : ""}">${esc(s)}</span>`).join("")}</div>
      <div class="foot"><div class="mentor">${avatar(mentor.name)}<div><b>${esc(mentor.name)}</b>Mentor · ${esc(mentor.title.split(",")[0])}</div></div>
        ${mine ? status(mine.status) : canApply && remaining ? `<span class="remaining">${remaining} opening${remaining > 1 ? "s" : ""} remaining</span>` : `<span class="posted">${S.ago(o.postedOn)}</span>`}</div>
      <a class="btn secondary" href="#/opportunity/${o.id}">View opportunity</a>
    </article>`;
  }
  function statTile(n, l, d = "", dark = false) { return `<div class="stat ${dark ? "dark" : ""}"><div class="n">${n}</div><div class="l">${l}</div>${d ? `<div class="d">${d}</div>` : ""}</div>`; }
  function skillMatch(person, opp) {
    const m = S.match(person, opp);
    return `<div class="score"><div class="ring" style="--p:${m.pct}"><b>${m.pct}%</b></div><div><b>${m.pct >= 90 ? "Strong fit" : m.pct >= 75 ? "Good fit" : "Partial fit"}</b><div class="small muted">${m.strong} of ${opp.skills.length} required skills matched exactly</div></div></div>
      <div class="match mt3">${m.rows.map(r => `<div class="r"><span>${esc(r.skill)}</span><span class="bar"><i style="width:${r.pct}%"></i></span><span class="lvl ${r.level.toLowerCase()}">${r.level}</span></div>`).join("")}</div>
      <div class="ai-note mt3"><span class="mark">${I.bolt}</span><div><b>Spark AI</b> · rule-based skill matching today. Roadmap: Copilot Studio + Azure AI over Microsoft Graph profiles and SharePoint project history.</div></div>`;
  }
  function stepsBar(st) {
    if (st === "Rejected") return `<div class="steps"><span class="done"></span><span class="bad"></span><span></span></div><div class="steps-lbl"><span>Applied</span><span>Not selected</span><span></span></div>`;
    const i = st === "Discussion Scheduled" ? 0.5 : APP_STEPS.indexOf(st);
    return `<div class="steps">${APP_STEPS.map((s, k) => `<span class="${k < i ? "done" : k === Math.floor(i) ? (st === "Accepted" ? "done" : "cur") : ""}"></span>`).join("")}</div><div class="steps-lbl"><span>Under review</span><span>Shortlisted</span><span>Selected</span></div>`;
  }
  function empty(title, body, cta = "") { return `<div class="empty"><b>${title}</b>${body}${cta ? `<div class="mt2">${cta}</div>` : ""}</div>`; }

  /* ============================================================
     HOME
     ============================================================ */
  function viewHome() {
    const me = S.me(); const st = S.stats();
    const featured = S.state.opportunities.filter(o => o.featured && ["Open", "Under Review"].includes(o.status)).slice(0, 3);
    const ongoing = S.state.opportunities.filter(o => o.status === "Ongoing");
    const recs = S.recommendations(me);
    const latestRec = S.state.recognitions[0];
    const recsRest = S.state.recognitions.slice(1, 4);
    const activity = S.state.activity.slice(0, 5);
    const topMatch = recs[0];
    return shell(`
    <section class="hero">
      <div class="wrap">
        <div>
          <div class="tag">Discover. Contribute. Grow.</div>
          <h1>Turn your skills into impact.</h1>
          <p class="lead">Discover short-term opportunities, collaborate across teams and build something that matters.</p>
          <div class="ctas"><a class="btn on-dark lg" href="#/opportunities">Explore opportunities ${I.arrow}</a><a class="btn on-dark outline lg" href="#/manager/new">Post an opportunity</a></div>
          <div class="proof"><span><b>${st.openings}</b> open seats this month</span><span><b>${st.postedThisWeek}</b> posted this week</span><span><b>2–6 week</b> commitments</span></div>
        </div>
        <div class="hero-art" aria-hidden="true">${heroArt()}
          ${me.role === "manager" ? (() => { const n = S.myListings().flatMap(o => S.appsFor(o.id)).filter(a => a.status === "Under Review").length; return `<div class="who">${avatar(me.name)}<div><b>${esc(me.name.split(" ")[0])}</b> · ${esc(me.title.split(",")[0])}<br><span style="color:var(--amber)">${n} applicant${n !== 1 ? "s" : ""}</span> waiting for your review</div></div>`; })() : topMatch ? `<div class="who">${avatar(me.name)}<div><b>${esc(me.name.split(" ")[0])}</b> · ${esc(me.skills.slice(0, 3).join(", "))}<br><span style="color:var(--amber)">${topMatch.pct}% match</span> · ${esc(topMatch.opp.title)}</div></div>` : ""}
        </div>
      </div>
    </section>

    <div class="wrap"><div class="stats">
      ${statTile(st.active, "Active opportunities", `${st.postedThisWeek} new this week`)}
      ${statTile(st.participating, "Employees participating", `across ${st.teams} teams`)}
      ${statTile(st.completed, "Projects completed", `${st.completedThisMonth} this month`)}
      ${statTile(st.recognitions, "Recognitions this month", "", true)}
    </div></div>

    ${me.role === "manager" ? managerStrip(me) : recs.length ? `<section class="section tight"><div class="wrap">
      <div class="section-head"><div><span class="pill ai">${I.bolt}Spark AI</span><h2 class="mt1">Recommended for you</h2><p>Based on your skills — ${esc(me.skills.join(", "))}.</p></div><a class="btn ghost" href="#/opportunities">See all opportunities</a></div>
      <div class="grid g3">${recs.map((r, i) => oppCard(r.opp, { rec: r.pct, top: i === 0 })).join("")}</div>
    </div></section>` : ""}

    <section class="section alt"><div class="wrap">
      <div class="section-head"><div><span class="eyebrow">Featured opportunities</span><h2 class="mt1">Find your next opportunity</h2><p>Small commitment. Meaningful impact.</p></div><a class="btn secondary" href="#/opportunities">Browse the marketplace</a></div>
      <div class="grid g3">${featured.map(o => oppCard(o)).join("") || empty("No open opportunities", "Check back soon.")}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="section-head"><div><span class="eyebrow">Active projects</span><h2 class="mt1">What's happening across Spark</h2><p>Projects currently in delivery, and the people behind them.</p></div></div>
      <div class="split">
        <div class="grid g2">${ongoing.map(o => { const c = S.contributors(o.id); const m = S.person(o.mentorId); return `<article class="card hover"><div class="card-head"><div><div class="opp"><div class="title"><a href="#/opportunity/${o.id}">${esc(o.title)}</a></div></div><div class="small muted">${esc(o.team)} · Mentor ${esc(m.name)}</div></div>${status(o.status)}</div>
          <div class="row between mt3"><div class="row"><div class="people">${c.map(p => avatar(p.name)).join("")}</div><span class="small muted">${c.length} contributor${c.length !== 1 ? "s" : ""}</span></div><span class="small muted">${o.progress || 0}% · ${esc(o.duration)}</span></div>
          <div class="progress mt2"><i style="width:${o.progress || 0}%"></i></div></article>`; }).join("") || empty("Nothing in delivery yet", "Accept an applicant to start a project.")}</div>
        <aside class="card"><div class="card-head"><h3>Latest updates</h3><a class="small" href="#/notifications">All activity</a></div>
          <div class="activity mt2">
            <div class="it"><span class="ico">${I.megaphone}</span><div>${st.postedThisWeek} new opportunit${st.postedThisWeek === 1 ? "y was" : "ies were"} posted this week<div class="when">This week</div></div></div>
            ${activity.map(a => `<div class="it"><span class="ico">${I[ACT_ICON[a.icon]] || I.bell}</span><div>${esc(a.text)}<div class="when">${S.ago(a.time)}</div></div></div>`).join("")}
            <div class="it"><span class="ico">${I.check}</span><div>${st.completedThisMonth} project${st.completedThisMonth === 1 ? " was" : "s were"} completed this month<div class="when">This month</div></div></div>
          </div></aside>
      </div>
    </div></section>

    <section class="section alt"><div class="wrap">
      <div class="section-head"><div><span class="eyebrow amber">Recognition</span><h2 class="mt1">Celebrating impact</h2><p>Every completed project ends with recognition from the mentor.</p></div><a class="btn secondary" href="#/recognition">Recognition wall</a></div>
      ${latestRec ? awardHero(latestRec) : ""}
      <div class="grid g3 mt3">${recsRest.map(awardCard).join("")}</div>
    </div></section>

    <section class="section"><div class="wrap"><div class="grid g3">
      ${S.state.testimonials.map(t => { const p = S.person(t.personId); return `<div class="card"><p class="quote" style="font-style:italic;border:none;padding:0">“${esc(t.text)}”</p><div class="person">${avatar(p.name)}<div><b>${esc(p.name)}</b><div class="small muted">${esc(p.title)}</div></div></div></div>`; }).join("")}
    </div></div></section>

    <section class="m365"><div class="wrap"><div class="m365-in"><div><span class="eyebrow">Built for Microsoft 365</span><h3>Every action you just saw is a SharePoint list write and a Power Automate flow.</h3><p class="muted" style="margin:4px 0 0">SharePoint pages · Microsoft Lists · Power Automate · Forms · Outlook · Teams · Copilot Studio (roadmap)</p></div><a class="btn secondary" href="#/architecture">See how SPARK runs on Microsoft 365</a></div></div></section>
    <section class="final"><div class="wrap"><h2>Have a project idea?</h2><p>Turn an engineering challenge into an opportunity for collaboration.</p><a class="btn on-dark lg" href="#/manager/new">${I.plus}Post an opportunity</a></div></section>`);
  }
  function managerStrip(me) {
    const mine = S.myListings(); const apps = mine.flatMap(o => S.appsFor(o.id));
    const pending = apps.filter(a => a.status === "Under Review").length;
    const toRecognize = mine.filter(o => o.status === "Completed" && !S.recognitionsFor(o.id).length && S.contributors(o.id).length).length;
    const ongoing = mine.filter(o => o.status === "Ongoing").length;
    return `<section class="section tight"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Needs your attention</span><h2 class="mt1">Your opportunities at a glance</h2></div><a class="btn secondary" href="#/manager">Open Manager Workspace</a></div>
      <div class="grid g3">
        <a class="card hover" href="#/manager/applicants"><span class="eyebrow">Applicants</span><div class="stat" style="border:none;padding:8px 0 0;box-shadow:none"><div class="n">${pending}</div><div class="l">new applications waiting for review</div></div></a>
        <a class="card hover" href="#/manager/opportunities"><span class="eyebrow">In delivery</span><div class="stat" style="border:none;padding:8px 0 0;box-shadow:none"><div class="n">${ongoing}</div><div class="l">ongoing project${ongoing !== 1 ? "s" : ""} you are mentoring</div></div></a>
        <a class="card hover" href="#/manager/opportunities"><span class="eyebrow amber">Recognition</span><div class="stat" style="border:none;padding:8px 0 0;box-shadow:none"><div class="n">${toRecognize}</div><div class="l">completed project${toRecognize !== 1 ? "s" : ""} awaiting recognition</div></div></a>
      </div></div></section>`;
  }
  function heroArt() {
    const nodes = [[300, 150], [120, 250], [200, 120], [420, 90], [470, 230], [180, 330], [360, 300], [250, 220], [400, 190], [80, 130]];
    const links = [[0, 2], [0, 3], [0, 7], [0, 8], [2, 9], [1, 7], [7, 5], [7, 6], [8, 4], [6, 4], [3, 8], [1, 9], [5, 6]];
    return `<svg viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="fade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <g stroke="url(#fade)" stroke-width="1.5">${[0, 90, 180, 270, 360, 450, 520].map(x => `<path d="M${x} 420 L300 150"/>`).join("")}</g>
      <g stroke="#fff" stroke-opacity=".1"><path d="M0 360H520"/><path d="M0 300H520"/><path d="M0 250H520"/><path d="M0 210H520"/><path d="M0 180H520"/></g>
      <circle cx="300" cy="150" r="70" fill="#0F6CBD" fill-opacity=".28"/><circle cx="300" cy="150" r="26" fill="#0F6CBD" fill-opacity=".5"/>
      <g stroke="#9CC7EE" stroke-opacity=".55" stroke-width="1.2">${links.map(([a, b]) => `<path d="M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}"/>`).join("")}</g>
      <g>${nodes.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 0 ? 7 : 4.5}" fill="${i === 0 || i === 7 || i === 3 ? "#F5A623" : "#fff"}" fill-opacity="${i === 0 ? 1 : .9}"/>`).join("")}</g>
      <g fill="#fff" font-family="Segoe UI,Arial" font-size="11" fill-opacity=".85"><text x="312" y="146">AI</text><text x="132" y="246">Python</text><text x="430" y="86">Data</text><text x="262" y="238">Automation</text><text x="372" y="318">Cloud</text><text x="60" y="126">Embedded</text></g>
    </svg>`;
  }

  /* ============================================================
     OPPORTUNITIES — marketplace
     ============================================================ */
  function viewOpportunities() {
    const me = S.me(); const all = S.state.opportunities;
    const teams = [...new Set(all.map(o => o.team))].sort();
    const locs = [...new Set(all.map(o => o.location.split("/")[0].trim()))].sort();
    let list = all.filter(o =>
      (!ui.q || (o.title + " " + o.description + " " + o.team + " " + S.person(o.mentorId).name + " " + o.skills.join(" ")).toLowerCase().includes(ui.q.toLowerCase())) &&
      (!ui.tech || o.skills.includes(ui.tech) || o.technology === ui.tech) &&
      (!ui.team || o.team === ui.team) &&
      (!ui.duration || (ui.duration === "short" ? o.weeks <= 2 : ui.duration === "mid" ? o.weeks > 2 && o.weeks <= 4 : o.weeks > 4)) &&
      (!ui.location || o.location.startsWith(ui.location)) &&
      (!ui.status || o.status === ui.status));
    const order = { "Open": 0, "Under Review": 1, "Ongoing": 2, "On Hold": 3, "Completed": 4, "Closed": 5 };
    if (ui.sort === "match") list.sort((a, b) => (order[a.status] - order[b.status]) || (S.match(me, b).pct - S.match(me, a).pct));
    if (ui.sort === "newest") list.sort((a, b) => b.postedOn.localeCompare(a.postedOn));
    if (ui.sort === "shortest") list.sort((a, b) => a.weeks - b.weeks);
    const sub = S.mySubscription();
    return shell(`
    <div class="wrap">
      <div class="page-head"><span class="eyebrow">Opportunity Marketplace</span><h1 class="mt1">Find short-term projects where your skills can make an impact.</h1><p>${all.filter(o => ["Open", "Under Review"].includes(o.status)).length} opportunities are accepting applications. Filter by technology, team, duration or location.</p></div>
      <div class="filterbar" role="search">
        <div class="search-wrap">${I.search}<input id="f-q" placeholder="Search by title, skill, team or mentor" aria-label="Search" value="${esc(ui.q)}"></div>
        <select id="f-team" aria-label="Team"><option value="">All teams</option>${teams.map(t => `<option ${ui.team === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>
        <select id="f-duration" aria-label="Duration"><option value="">Any duration</option><option value="short" ${ui.duration === "short" ? "selected" : ""}>Up to 2 weeks</option><option value="mid" ${ui.duration === "mid" ? "selected" : ""}>3–4 weeks</option><option value="long" ${ui.duration === "long" ? "selected" : ""}>5+ weeks</option></select>
        <select id="f-location" aria-label="Location"><option value="">All locations</option>${locs.map(l => `<option ${ui.location === l ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
        <select id="f-status" aria-label="Status"><option value="">All statuses</option>${OPP_STATUSES.map(s => `<option ${ui.status === s ? "selected" : ""}>${s}</option>`).join("")}</select>
        <button class="btn ghost" data-action="clear-filters">Clear</button>
      </div>
      <div class="techs"><span class="lbl">Technology</span><span class="pill click ${!ui.tech ? "on" : ""}" data-action="tech" data-v="" role="button" tabindex="0">All</span>${S.state.technologies.map(t => `<span class="pill click ${ui.tech === t ? "on" : ""}" data-action="tech" data-v="${esc(t)}" role="button" tabindex="0">${esc(t)}</span>`).join("")}</div>
      <div class="results-bar"><span>${list.length} of ${all.length} opportunities${ui.tech ? ` · ${esc(ui.tech)}` : ""}${ui.q ? ` · “${esc(ui.q)}”` : ""}</span><label class="row">Sort <select id="f-sort" aria-label="Sort" class="input" style="width:auto;height:32px"><option value="match" ${ui.sort === "match" ? "selected" : ""}>Best match for me</option><option value="newest" ${ui.sort === "newest" ? "selected" : ""}>Newest</option><option value="shortest" ${ui.sort === "shortest" ? "selected" : ""}>Shortest commitment</option></select></label></div>
      <div class="grid g3">${list.map((o, i) => oppCard(o, ui.sort === "match" && ["Open", "Under Review"].includes(o.status) ? { rec: S.match(me, o).pct, top: i === 0 && !ui.q && !ui.tech } : {})).join("") || empty("No opportunities match these filters", "Try a broader technology or clear the filters.", `<button class="btn secondary" data-action="clear-filters">Clear filters</button>`)}</div>
      <div class="card mt6" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:260px"><h3>Get notified when something matches</h3><p class="muted small" style="margin:4px 0 0">Subscribe to technologies and receive an email the moment a manager posts.${sub.technologies.length ? ` Subscribed as ${esc(me.email)}.` : ""}</p></div><div class="row">${S.state.technologies.map(t => `<span class="pill click ${sub.technologies.includes(t) ? "on" : ""}" data-action="toggle-sub" data-v="${esc(t)}" role="button" tabindex="0">${sub.technologies.includes(t) ? "✓ " : ""}${esc(t)}</span>`).join("")}</div></div>
    </div>`);
  }

  /* ============================================================
     OPPORTUNITY DETAIL
     ============================================================ */
  function viewOpportunity(id) {
    const o = S.opp(id); if (!o) return shell(`<div class="wrap"><div class="page-head">${empty("Opportunity not found", "", `<a class="btn" href="#/opportunities">Back to marketplace</a>`)}</div></div>`);
    const me = S.me(); const mentor = S.person(o.mentorId); const owner = S.person(o.postedBy);
    const contributors = S.contributors(o.id); const recs = S.recognitionsFor(o.id); const apps = S.appsFor(o.id);
    const remaining = Math.max(0, o.openings - contributors.length);
    const canApply = ["Open", "Under Review"].includes(o.status) && remaining > 0;
    const mine = S.myApplicationFor(o.id);
    const isOwner = me.id === o.postedBy;
    const cta = isOwner ? `<h3>${apps.length} applicant${apps.length !== 1 ? "s" : ""} · ${remaining} seat${remaining !== 1 ? "s" : ""} remaining</h3><p>Review profiles, schedule discussions and accept contributors from your workspace.</p><a class="btn on-dark" href="#/manager/applicants">Review applicants</a>`
      : mine ? `<h3>Your application is ${mine.status.toLowerCase()}</h3><p>${NEXT[mine.status](mentor.name, mine)}</p><a class="btn on-dark" href="#/my-applications">Track my application</a>`
      : canApply ? `${(() => { const m = S.match(me, o); const top = S.recommendations(me, 1)[0]; return me.role !== "manager" && m.pct >= 85 ? `<div class="row mb2"><span class="pill ai">${I.bolt}${top && top.opp.id === o.id ? "Your top match · " : ""}${m.pct}% match</span></div>` : ""; })()}<h3>${remaining} of ${o.openings} openings remaining</h3><p>${esc(o.effort)} for ${esc(o.duration)}. Your profile is pre-filled — applying takes about two minutes.</p><a class="btn amber lg" href="#/apply/${o.id}">Apply now ${I.arrow}</a>`
      : `<h3>Not accepting applications</h3><p>This opportunity is ${o.status.toLowerCase()}. Subscribe to ${esc(o.technology)} to hear about the next one.</p><a class="btn on-dark outline" href="#/opportunities">Browse other opportunities</a>`;
    return shell(`
    <div class="detail-head"><div class="wrap">
      <div class="crumb"><a href="#/opportunities">Opportunities</a> / ${esc(o.team)}</div>
      <div class="row mt2">${status(o.status)}<span class="small" style="color:rgba(255,255,255,.7)">Posted ${S.ago(o.postedOn)} by ${esc(owner.name)}</span></div>
      <h1>${esc(o.title)}</h1><p class="lead">${esc(o.description)}</p>
    </div></div>
    <div class="wrap">
      <div class="infogrid">
        <div><div class="k">Duration</div><div class="v">${esc(o.duration)}</div></div><div><div class="k">Effort</div><div class="v">${esc(o.effort)}</div></div><div><div class="k">Openings</div><div class="v">${canApply || mine ? `${remaining} of ${o.openings}` : o.openings}</div></div><div><div class="k">Team</div><div class="v">${esc(o.team)}</div></div><div><div class="k">Location</div><div class="v">${esc(o.location)}</div></div><div><div class="k">Starts</div><div class="v">${o.startDate === "TBD" ? "TBD" : S.fmtDate(o.startDate)}</div></div>
      </div>
      <div class="split mt4">
        <div class="stack">
          <div class="card"><div class="card-head"><h3>Project lifecycle</h3><span class="small muted">Discover → Apply → Collaborate → Deliver → Recognize</span></div><div class="mt3">${lifecycle(o)}</div></div>
          <div class="card pad-lg prose">
            <p class="quote">“${esc(o.statement)}” — ${esc(mentor.name)}</p>
            <h3>What you'll work on</h3><ul>${o.work.map(w => `<li>${esc(w)}</li>`).join("")}</ul>
            ${o.outcome ? `<div class="impact-box">${ico("target")}<div><span class="eyebrow">Project impact</span><p style="margin:2px 0 0;color:var(--ink)">${esc(o.outcome)}</p></div></div>` : ""}
            <h3>Why this matters</h3><p>${esc(o.why)}</p>
            <h3>Who we're looking for</h3><p>${esc(o.who)}</p>
            <h3>Required skills</h3><div class="row">${o.skills.map(s => `<span class="pill ${me.skills.includes(s) ? "match" : ""}">${me.skills.includes(s) ? "✓ " : ""}${esc(s)}</span>`).join("")}</div>
            <h3>Skills you'll build</h3><div class="row">${pills(o.build)}</div>
          </div>
          ${contributors.length ? `<div class="card"><div class="card-head"><h3>Contributors</h3>${o.status === "Ongoing" ? `<span class="small muted">${o.progress || 0}% complete</span>` : ""}</div>${o.status === "Ongoing" ? `<div class="progress mt2"><i style="width:${o.progress || 0}%"></i></div>` : ""}<div class="grid g3 mt3">${contributors.map(p => `<div class="row">${avatar(p.name)}<div><b>${esc(p.name)}</b><div class="small muted">${esc(p.team)}</div></div></div>`).join("")}</div></div>` : ""}
          ${recs.length ? `<div class="card"><h3>Recognition</h3><div class="grid g2 mt2">${recs.map(awardCard).join("")}</div></div>` : ""}
        </div>
        <aside class="sticky stack">
          <div class="cta-box">${cta}</div>
          <div class="card"><span class="eyebrow">Mentor</span><div class="mentor-card mt2">${avatar(mentor.name, "lg")}<div><div class="n">${esc(mentor.name)}</div><div class="r">${esc(mentor.title)} · ${esc(mentor.team)}</div><p class="small mt1" style="color:var(--ink-2)">${esc(mentor.bio || "")}</p><a class="small" href="mailto:${esc(mentor.email)}">${esc(mentor.email)}</a></div></div><div class="small muted mt2">${S.state.opportunities.filter(x => x.mentorId === mentor.id && x.status === "Completed").length} completed Spark projects mentored</div></div>
          ${!isOwner && me.role !== "manager" ? `<div class="card"><span class="eyebrow">Your fit</span><div class="mt2">${skillMatch(me, o)}</div></div>` : ""}
        </aside>
      </div>
    </div>`);
  }

  /* ============================================================
     APPLY + CONFIRMATION
     ============================================================ */
  function viewApply(id) {
    const o = S.opp(id); const me = S.me();
    if (!o) return shell(`<div class="wrap page-head">${empty("Opportunity not found", "")}</div>`);
    if (S.hasApplied(o.id)) return shell(`<div class="wrap page-head">${empty("You have already applied", `Your application to ${esc(o.title)} is on file.`, `<a class="btn" href="#/my-applications">Track my application</a>`)}</div>`);
    if (!["Open", "Under Review"].includes(o.status)) return shell(`<div class="wrap page-head">${empty("This opportunity is not accepting applications", `It is currently ${o.status.toLowerCase()}.`, `<a class="btn" href="#/opportunities">Browse opportunities</a>`)}</div>`);
    const mentor = S.person(o.mentorId);
    const skillSet = [...new Set([...o.skills, ...me.skills])];
    return shell(`<div class="wrap">
      <div class="page-head"><a class="small" href="#/opportunity/${o.id}">← Back to opportunity</a><h1 class="mt1">Apply</h1><p>Tell ${esc(mentor.name)} what you can contribute. Your details are pre-filled from your profile.</p></div>
      <div class="split">
        <form class="card pad-lg form" id="apply-form" data-opp="${o.id}" novalidate>
          <fieldset><legend>About you</legend><div class="stack">
            <div class="f2"><div><label for="a-name">Name <span class="req">*</span></label><input id="a-name" name="name" value="${esc(me.name)}" required></div><div><label for="a-emp">Employee ID <span class="req">*</span></label><input id="a-emp" name="empId" value="${esc(me.empId)}" required></div></div>
            <div class="f2"><div><label for="a-team">Current team <span class="req">*</span></label><input id="a-team" name="team" value="${esc(me.team)}" required></div><div><label for="a-mgr">Manager <span class="req">*</span></label><input id="a-mgr" name="manager" value="${esc(me.manager)}" required><div class="help">Your manager is copied so capacity can be agreed outside the tool.</div></div></div>
            <div><label for="a-proj">Current project</label><input id="a-proj" name="currentProject" value="${esc(me.currentProject || "")}"></div>
          </div></fieldset>
          <fieldset><legend>Skills</legend>
            <div class="skill-pick" id="skill-pick">${skillSet.map(s => `<label class="pill click ${me.skills.includes(s) ? "on" : ""}" style="cursor:pointer"><input type="checkbox" name="skills" value="${esc(s)}" ${me.skills.includes(s) ? "checked" : ""} class="sr-only">${esc(s)}${o.skills.includes(s) ? " ·" : ""}</label>`).join("")}</div>
            <div class="help">Skills marked “·” are required for this opportunity. <input class="input mt1" name="extraSkills" placeholder="Add other skills, comma separated" style="height:36px"></div>
          </fieldset>
          <fieldset><legend>Why are you interested?</legend>
            <div><label for="a-int">Interest statement <span class="req">*</span></label><textarea id="a-int" name="interest" required placeholder="Tell the mentor what you can contribute and what you want to learn."></textarea><div class="help">Two or three sentences is ideal. Mentors read every one.</div></div>
          </fieldset>
          <fieldset><legend>Availability</legend>
            <div class="f2"><div><label for="a-from">Available from <span class="req">*</span></label><input id="a-from" type="date" name="from" required value="${o.startDate && o.startDate !== "TBD" ? o.startDate : ""}"></div><div><label for="a-hrs">Hours per week <span class="req">*</span></label><select id="a-hrs" name="hours"><option>4 hrs/week</option><option>6 hrs/week</option><option>8 hrs/week</option><option selected>10 hrs/week</option><option>12 hrs/week</option></select></div></div>
            <label class="check"><input type="checkbox" name="consent" required> I have informed my manager and can commit ${esc(o.effort)} for ${esc(o.duration)}.</label>
          </fieldset>
          <div class="err" id="apply-err" aria-live="polite"></div>
          <div class="row"><button class="btn amber lg" type="submit">Submit application</button><a class="btn ghost" href="#/opportunity/${o.id}">Cancel</a></div>
        </form>
        <aside class="sticky stack">
          <div class="card summary-opp"><span class="eyebrow">You're applying for</span><div class="t mt1">${esc(o.title)}</div><div class="small muted">${esc(o.team)} · ${esc(o.location)}</div><dl><dt>Duration</dt><dd>${esc(o.duration)}</dd><dt>Effort</dt><dd>${esc(o.effort)}</dd><dt>Mentor</dt><dd>${esc(mentor.name)}</dd><dt>Openings</dt><dd>${Math.max(0, o.openings - S.contributors(o.id).length)} remaining</dd></dl><div class="divider"></div><div class="row">${o.skills.map(s => `<span class="pill ${me.skills.includes(s) ? "match" : ""}">${esc(s)}</span>`).join("")}</div></div>
          <div class="card"><h3>What happens next</h3><ol class="small" style="padding-left:18px;line-height:1.9;color:var(--ink-2)"><li>${esc(mentor.name)} is notified by email and in Spark.</li><li>They review your profile, skills and current project.</li><li>You may be invited for a 20-minute discussion.</li><li>You're shortlisted and selected — you're told at every step.</li><li>On completion, contributors are recognised.</li></ol></div>
        </aside>
      </div></div>`);
  }
  function viewApplied(appId) {
    const a = S.app(appId); if (!a) return viewHome();
    const o = S.opp(a.oppId); const mentor = S.person(o.mentorId);
    return shell(`<div class="wrap"><div class="confirm">
      <div class="tick">${I.check}</div>
      <h1>Application submitted.</h1><p class="lead">Your application has been sent to ${esc(mentor.name)}.</p>
      <div class="row mt3" style="justify-content:center"><span class="small muted">Application status</span>${status(a.status)}</div>
      <div class="next mt4"><div>${ico("clipboard")}</div><div><div class="k">Next step</div><div class="v">The opportunity owner will review your profile and may invite you for a short discussion.</div></div></div>
      <div class="next mt2"><div>${ico("mail")}</div><div><div class="k">Confirmation</div><div class="v">A confirmation email was sent to ${esc(S.me().email)}. ${esc(mentor.name)} received your application by email and in the Manager Workspace.</div></div></div>
      <div class="row mt4" style="justify-content:center"><a class="btn" href="#/my-applications">Track my application</a><a class="btn secondary" href="#/opportunities">Explore more opportunities</a></div>
    </div></div>`);
  }

  /* ============================================================
     MY APPLICATIONS · MY PROJECTS
     ============================================================ */
  function viewMyApplications() {
    const apps = S.myApps();
    return shell(`<div class="wrap">
      <div class="page-head"><h1>My Applications</h1><p>Where each application stands, and what happens next.</p></div>
      ${apps.length ? `<div class="stack">${apps.map(a => { const o = S.opp(a.oppId); const m = S.person(o.mentorId); return `<article class="card"><div class="card-head"><div><div class="opp"><div class="title"><a href="#/opportunity/${o.id}">${esc(o.title)}</a></div></div><div class="small muted">${esc(o.team)} · Mentor ${esc(m.name)} · Applied ${S.fmtDate(a.appliedOn)} (${S.ago(a.appliedOn)})</div></div><div class="row">${status(a.status)}<span class="small muted">Project</span>${status(o.status)}</div></div>
        <div class="mt3" style="max-width:520px">${stepsBar(a.status)}</div>
        <div class="next mt3"><div>${ico(a.status === "Accepted" ? "rocket" : a.status === "Rejected" ? "compass" : "clipboard")}</div><div><div class="k">Next step</div><div class="v">${NEXT[a.status](m.name, a)}</div></div></div></article>`; }).join("")}</div>`
      : empty("No applications yet", "Opportunities you apply to will appear here with their status and next step.", `<a class="btn" href="#/opportunities">Explore opportunities</a>`)}
    </div>`);
  }
  function viewMyProjects() {
    const me = S.me(); const projects = S.myProjects();
    const myRecs = S.state.recognitions.filter(r => r.personId === me.id);
    return shell(`<div class="wrap">
      <div class="page-head"><h1>My Projects</h1><p>Projects you've been selected for — current and completed.</p></div>
      ${myRecs.length ? `<div class="grid g3 mb3">${myRecs.map(awardCard).join("")}</div>` : ""}
      ${projects.length ? `<div class="grid g2">${projects.map(o => { const c = S.contributors(o.id); const m = S.person(o.mentorId); const rec = S.recognitionsFor(o.id).find(r => r.personId === me.id); return `<article class="card"><div class="card-head"><div><div class="opp"><div class="title"><a href="#/opportunity/${o.id}">${esc(o.title)}</a></div></div><div class="small muted">${esc(o.team)} · Mentor ${esc(m.name)} · ${esc(o.duration)}</div></div>${status(o.status)}</div>
        <div class="mt3">${lifecycle(o, false, true)}</div>
        ${o.status === "Ongoing" ? `<div class="row between mt3"><span class="small muted">Project impact tracked by the mentor</span><span class="small muted">${o.progress || 0}%</span></div><div class="progress mt1"><i style="width:${o.progress || 0}%"></i></div>` : ""}
        <div class="row between mt3"><div class="row"><div class="people">${c.map(p => avatar(p.name)).join("")}</div><span class="small muted">${c.map(p => p.name.split(" ")[0]).join(", ")}</span></div>${rec ? `<span class="pill" style="background:var(--amber-50);color:var(--amber-t)">${esc(S.badge(rec.badge).name)}</span>` : ""}</div></article>`; }).join("")}</div>`
      : empty("No projects yet", "When a mentor selects you for an opportunity it appears here with its lifecycle.", `<a class="btn" href="#/opportunities">Find an opportunity</a>`)}
    </div>`);
  }

  /* ============================================================
     MANAGER WORKSPACE
     ============================================================ */
  function viewManager(sub) {
    const me = S.me();
    if (me.role !== "manager") return shell(`<div class="wrap page-head">${empty("The Manager Workspace is for opportunity owners", "Switch to the manager persona to post opportunities and review applicants.", `<button class="btn" data-action="switch-user" data-id="u-arjun">Switch to Arjun Sharma (Manager)</button>`)}</div>`);
    const tab = sub || "overview";
    const mine = S.myListings(); const apps = mine.flatMap(o => S.appsFor(o.id));
    const pending = apps.filter(a => ["Under Review", "Discussion Scheduled", "Shortlisted"].includes(a.status)).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
    const tabs = [["overview", "Overview"], ["applicants", `Applicants${pending.length ? ` (${pending.length})` : ""}`], ["opportunities", "My Opportunities"], ["new", "Post Opportunity"]];
    const stats = `<div class="ws-stats">${statTile(mine.length, "My opportunities")}${statTile(pending.length, "Applicants to review", pending.filter(a => a.status === "Under Review").length + " new")}${statTile(mine.filter(o => o.status === "Ongoing").length, "Ongoing projects")}${statTile(mine.filter(o => o.status === "Completed").length, "Completed projects", "", true)}</div>`;
    let body = "";
    if (tab === "new") body = postForm();
    else if (tab === "applicants") body = pending.length ? groupedApplicants(mine, apps) : empty("No applicants waiting", "New applications will appear here the moment they're submitted.");
    else if (tab === "opportunities") body = oppsTable(mine);
    else body = `<div class="split"><div><div class="section-head"><div><h3>Applicants requiring review</h3><p class="small">Newest first · ${pending.length} waiting</p></div><a class="small" href="#/manager/applicants">See all</a></div><div class="stack">${pending.slice(0, 3).map(a => applicantCard(a, S.opp(a.oppId))).join("") || empty("Inbox zero", "No applicants are waiting for you.")}</div></div>
      <aside class="stack"><div class="card"><h3>My opportunities</h3><div class="mt2 stack" style="gap:10px">${mine.slice(0, 5).map(o => `<div class="row between"><div><a href="#/opportunity/${o.id}"><b>${esc(o.title)}</b></a><div class="small muted">${S.appsFor(o.id).length} applicant${S.appsFor(o.id).length !== 1 ? "s" : ""} · ${S.contributors(o.id).length}/${o.openings} seats</div></div>${status(o.status)}</div>`).join("")}</div><a class="btn secondary mt3" href="#/manager/opportunities" style="width:100%">Manage lifecycle</a></div>
      <div class="ai-note"><span class="mark">${I.bolt}</span><div><b>Spark AI</b> ranks applicants by skill fit against your requirements. Open any profile to see the match breakdown.</div></div></aside></div>`;
    return shell(`<div class="wrap"><div class="page-head"><span class="eyebrow">Manager Workspace</span><h1 class="mt1">Welcome back, ${esc(me.name.split(" ")[0])}.</h1><p>Post opportunities, review applicants and move projects through their lifecycle.</p></div>${stats}<nav class="tabs" aria-label="Workspace sections">${tabs.map(([k, l]) => `<a href="#/manager/${k}" class="${tab === k ? "active" : ""}">${l}</a>`).join("")}</nav>${body}</div>`);
  }
  function groupedApplicants(mine, apps) {
    return mine.map(o => ({ o, list: S.appsFor(o.id).filter(a => a.status !== "Rejected").sort((a, b) => S.match(S.person(b.personId), o).pct - S.match(S.person(a.personId), o).pct) })).filter(g => g.list.length).map(g => `<section class="mb3"><div class="section-head" style="align-items:center"><div><h3><a href="#/opportunity/${g.o.id}">${esc(g.o.title)}</a></h3><p class="small">${g.list.length} applicant${g.list.length !== 1 ? "s" : ""} · ${S.contributors(g.o.id).length} of ${g.o.openings} seats filled · ranked by fit</p></div>${status(g.o.status)}</div><div class="stack">${g.list.map(a => applicantCard(a, g.o)).join("")}</div></section>`).join("");
  }
  function applicantCard(a, o) {
    const p = S.person(a.personId); const m = S.match(p, o); const final = ["Accepted", "Rejected"].includes(a.status);
    return `<article class="card applicant">
      <div>
        <div class="row between"><div class="row" style="gap:12px">${avatar(p.name, "lg")}<div><b style="font-size:15px">${esc(p.name)}</b><div class="small muted">${esc(p.title)} · ${esc(p.team)} · reports to ${esc(p.manager)}</div></div></div><div class="row">${status(a.status)}<span class="fit ${m.pct >= 90 ? "" : "mid"}">${I.bolt.replace("<svg", '<svg style="width:12px;height:12px;fill:currentColor"')}${m.pct}% fit</span></div></div>
        <dl class="meta"><dt>Skills</dt><dd class="row">${p.skills.map(s => `<span class="pill ${o.skills.includes(s) ? "match" : ""}">${esc(s)}</span>`).join("")}</dd><dt>Current project</dt><dd>${esc(p.currentProject)}</dd><dt>Availability</dt><dd>${esc(a.availability)}</dd><dt>Applied</dt><dd>${S.ago(a.appliedOn)} · for <a href="#/opportunity/${o.id}">${esc(o.title)}</a></dd>${a.discussionAt ? `<dt>Discussion</dt><dd>${S.fmtDT(a.discussionAt)}</dd>` : ""}</dl>
        ${a.interest ? `<p class="quote mt2" style="margin-bottom:0">“${esc(a.interest)}”</p>` : ""}
      </div>
      <div class="actions">
        <a class="btn secondary" href="#/applicant/${a.id}">View profile</a>
        <button class="btn secondary" data-action="schedule" data-id="${a.id}" ${final ? "disabled" : ""}>Schedule discussion</button>
        <button class="btn secondary" data-action="app-status" data-status="Shortlisted" data-id="${a.id}" ${final || a.status === "Shortlisted" ? "disabled" : ""}>Shortlist</button>
        <button class="btn success" data-action="app-status" data-status="Accepted" data-id="${a.id}" ${final ? "disabled" : ""}>${I.check}Accept</button>
        <button class="btn danger" data-action="app-status" data-status="Rejected" data-id="${a.id}" ${final ? "disabled" : ""}>Reject</button>
      </div></article>`;
  }
  function oppsTable(mine) {
    if (!mine.length) return empty("You haven't posted anything yet", "", `<a class="btn" href="#/manager/new">Post your first opportunity</a>`);
    return `<div class="table-wrap"><table class="table"><thead><tr><th>Opportunity</th><th>Applicants</th><th>Seats</th><th>Lifecycle</th><th>Status</th><th>Progress</th><th></th></tr></thead><tbody>
      ${mine.map(o => { const apps = S.appsFor(o.id); const c = S.contributors(o.id); const recd = S.recognitionsFor(o.id).length; return `<tr>
        <td><a class="t" href="#/opportunity/${o.id}">${esc(o.title)}</a><div class="sub">${esc(o.team)} · ${esc(o.duration)} · posted ${S.ago(o.postedOn)}</div></td>
        <td>${apps.length}${apps.some(a => a.status === "Under Review") ? ` <span class="pill" style="background:var(--amber-bg);color:var(--amber-t)">${apps.filter(a => a.status === "Under Review").length} new</span>` : ""}</td>
        <td>${c.length}/${o.openings}</td>
        <td style="min-width:260px">${lifecycle(o, false, true)}</td>
        <td><select data-action="opp-status" data-id="${o.id}" aria-label="Status for ${esc(o.title)}">${OPP_STATUSES.map(s => `<option ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td>
        <td style="min-width:140px">${o.status === "Ongoing" ? `<input type="range" min="0" max="100" value="${o.progress || 0}" data-action="opp-progress" data-id="${o.id}" aria-label="Progress" style="width:90px;vertical-align:middle"> <span class="small">${o.progress || 0}%</span>` : o.status === "Completed" ? "100%" : "—"}</td>
        <td>${o.status === "Ongoing" ? `<button class="btn sm success" data-action="complete" data-id="${o.id}">Mark completed</button>` : o.status === "Completed" && !recd && c.length ? `<button class="btn sm amber" data-action="recognize" data-id="${o.id}">${I.star}Recognize contributors</button>` : o.status === "Completed" ? `<a class="btn sm secondary" href="#/recognition">View recognition</a>` : `<a class="btn sm secondary" href="#/manager/applicants">Applicants</a>`}</td>
      </tr>`; }).join("")}</tbody></table></div>
      <p class="small muted mt2">Lifecycle: <b>Open</b> → <b>Under Review</b> (first application) → <b>Ongoing</b> (first contributor accepted) → <b>Completed</b> → <b>Recognized</b>. On Hold and Closed can be set at any time.</p>`;
  }
  function postForm() {
    const me = S.me();
    return `<div class="split"><form class="card pad-lg form" id="opp-form" novalidate>
      <fieldset><legend>The opportunity</legend><div class="stack">
        <div><label for="o-title">Opportunity title <span class="req">*</span></label><input id="o-title" name="title" required placeholder="e.g. Engineering Copilot Evaluation Sprint"></div>
        <div><label for="o-desc">Description <span class="req">*</span></label><textarea id="o-desc" name="description" required placeholder="What will be built, and for whom?" style="min-height:90px"></textarea></div>
        <div><label for="o-stmt">Your statement to applicants</label><input id="o-stmt" name="statement" placeholder="e.g. I'm looking for 2 contributors interested in Python and AI…"></div>
      </div></fieldset>
      <fieldset><legend>Commitment</legend><div class="stack">
        <div class="f2"><div><label for="o-dur">Duration <span class="req">*</span></label><select id="o-dur" name="weeks"><option value="1">1 week</option><option value="2" selected>2 weeks</option><option value="3">3 weeks</option><option value="4">4 weeks</option><option value="6">6 weeks</option><option value="8">8 weeks</option></select></div><div><label for="o-eff">Expected effort <span class="req">*</span></label><select id="o-eff" name="effort"><option>4 hrs/week</option><option>6 hrs/week</option><option>8 hrs/week</option><option selected>10 hrs/week</option><option>12 hrs/week</option></select></div></div>
        <div class="f2"><div><label for="o-open">Number of openings <span class="req">*</span></label><input id="o-open" type="number" name="openings" min="1" max="10" value="2" required></div><div><label for="o-start">Planned start</label><input id="o-start" type="date" name="startDate"></div></div>
      </div></fieldset>
      <fieldset><legend>Skills & team</legend><div class="stack">
        <div><label>Technology area <span class="req">*</span></label><div class="skill-pick">${S.state.technologies.map((t, i) => `<label class="pill click ${i === 1 ? "on" : ""}" style="cursor:pointer"><input type="radio" name="technology" value="${esc(t)}" class="sr-only" ${i === 1 ? "checked" : ""}>${esc(t)}</label>`).join("")}</div><div class="help">Drives subscriber alerts and the marketplace filter.</div></div>
        <div><label for="o-skills">Required skills <span class="req">*</span></label><input id="o-skills" name="skills" required placeholder="Python, AI / ML, Automation"><div class="help">Comma separated · used by Spark AI to rank applicants.</div></div>
        <div class="f2"><div><label for="o-team">Team <span class="req">*</span></label><input id="o-team" name="team" value="${esc(me.team)}" required></div><div><label for="o-loc">Location <span class="req">*</span></label><input id="o-loc" name="location" value="Remote / ${esc(me.location)}" required></div></div>
      </div></fieldset>
      <fieldset><legend>Tell applicants more</legend><div class="stack">
        <div><label for="o-work">What they'll work on</label><textarea id="o-work" name="work" placeholder="One item per line" style="min-height:80px"></textarea></div>
        <div><label for="o-why">Why this matters</label><textarea id="o-why" name="why" style="min-height:70px" placeholder="The business value in two sentences."></textarea></div>
        <div><label for="o-who">Who you're looking for</label><input id="o-who" name="who" placeholder="Describe the ideal contributor."></div>
      </div></fieldset>
      <div class="err" id="opp-err" aria-live="polite"></div>
      <div class="row"><button class="btn amber lg" type="submit">Publish opportunity</button><button class="btn ghost" type="button" data-action="fill-example">Fill with an example</button></div>
    </form>
    <aside class="sticky stack"><div class="card"><h3>What happens when you publish</h3><ol class="small" style="padding-left:18px;line-height:1.9;color:var(--ink-2)"><li>Announcement on the Spark home page and in Teams.</li><li>Email to everyone subscribed to the technology.</li><li>Applications land in your workspace with a skill-fit score.</li><li>Accepting the first contributor moves the project to Ongoing.</li></ol></div>
    <div class="card"><span class="eyebrow">Posting as</span><div class="row mt2" style="gap:12px">${avatar(me.name, "lg")}<div><b>${esc(me.name)}</b><div class="small muted">${esc(me.title)}</div></div></div><div class="small muted mt2">You'll be listed as mentor. ${S.myListings().length} opportunities posted so far.</div></div></aside></div>`;
  }

  /* ============================================================
     APPLICANT PROFILE
     ============================================================ */
  function viewApplicant(appId) {
    const a = S.app(appId); if (!a) return viewManager();
    const me = S.me(); if (me.role !== "manager") return viewManager();
    const p = S.person(a.personId); const o = S.opp(a.oppId); const final = ["Accepted", "Rejected"].includes(a.status);
    const history = S.state.applications.filter(x => x.personId === p.id && x.status === "Accepted" && x.id !== a.id).map(x => S.opp(x.oppId));
    const recs = S.state.recognitions.filter(r => r.personId === p.id);
    return shell(`<div class="wrap">
      <div class="page-head"><a class="small" href="#/manager/applicants">← Back to applicants</a><div class="row mt2" style="gap:16px">${avatar(p.name, "xl")}<div><h1 style="font-size:30px">${esc(p.name)}</h1><p style="margin:2px 0 0">${esc(p.title)} · ${esc(p.team)} · ${esc(p.experience)} experience</p><div class="row mt1">${status(a.status)}<span class="small muted">applied ${S.ago(a.appliedOn)} for <a href="#/opportunity/${o.id}">${esc(o.title)}</a></span></div></div></div></div>
      <div class="split">
        <div class="stack">
          <div class="card"><h3>Profile</h3><dl class="meta applicant" style="display:grid;grid-template-columns:160px 1fr;gap:10px 16px;margin-top:12px;font-size:13px"><dt class="muted">Employee ID</dt><dd style="margin:0">${esc(p.empId)}</dd><dt class="muted">Team</dt><dd style="margin:0">${esc(p.team)}</dd><dt class="muted">Manager</dt><dd style="margin:0">${esc(p.manager)}</dd><dt class="muted">Skills</dt><dd style="margin:0" class="row">${p.skills.map(s => `<span class="pill ${o.skills.includes(s) ? "match" : ""}">${esc(s)}</span>`).join("")}</dd><dt class="muted">Experience</dt><dd style="margin:0">${esc(p.experience)}</dd><dt class="muted">Availability</dt><dd style="margin:0">${esc(a.availability)}</dd><dt class="muted">Current project</dt><dd style="margin:0">${esc(p.currentProject)}</dd><dt class="muted">Email</dt><dd style="margin:0"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></dd></dl></div>
          <div class="card"><h3>Interest statement</h3><p class="quote mt2" style="margin:0">“${esc(a.interest || "—")}”</p></div>
          <div class="card"><h3>Spark history</h3>${history.length ? `<div class="stack mt2">${history.map(x => `<div class="row between"><span><b>${esc(x.title)}</b><span class="small muted"> · ${esc(x.team)}</span></span>${status(x.status)}</div>`).join("")}</div>` : `<p class="small muted mt1" style="margin:0">First Spark application — a great candidate for Rising Star if selected.</p>`}${recs.length ? `<div class="row mt2">${recs.map(r => `<span class="pill" style="background:var(--amber-50);color:var(--amber-t)">${esc(S.badge(r.badge).name)}</span>`).join("")}</div>` : ""}</div>
        </div>
        <aside class="sticky stack">
          <div class="card"><span class="eyebrow">Fit for opportunity</span><div class="mt2">${skillMatch(p, o)}</div></div>
          <div class="card"><h3>Actions</h3><div class="stack mt2" style="gap:8px">
            <button class="btn secondary" data-action="schedule" data-id="${a.id}" ${final ? "disabled" : ""}>Schedule discussion</button>
            <button class="btn secondary" data-action="app-status" data-status="Shortlisted" data-id="${a.id}" ${final || a.status === "Shortlisted" ? "disabled" : ""}>Shortlist</button>
            <button class="btn success" data-action="app-status" data-status="Accepted" data-id="${a.id}" ${final ? "disabled" : ""}>${I.check}Accept for this opportunity</button>
            <button class="btn danger" data-action="app-status" data-status="Rejected" data-id="${a.id}" ${final ? "disabled" : ""}>Reject</button></div>
            ${final ? `<p class="small muted mt2" style="margin:0">This application is ${a.status.toLowerCase()} — the applicant has been notified.</p>` : ""}</div>
        </aside>
      </div></div>`);
  }

  /* ============================================================
     RECOGNITION
     ============================================================ */
  function awardCard(r) {
    const b = S.badge(r.badge); const p = S.person(r.personId); const o = S.opp(r.oppId);
    return `<article class="award ${b.cls}"><div class="kind">${badgeIcon(b, "xs")}${esc(b.name)}</div><div class="who">${avatar(p.name, "lg")}<div><b>${esc(p.name)}</b><span>${esc(p.team)}</span></div></div><p class="cite">“${esc(r.citation)}”</p><div class="for">For <a href="#/opportunity/${o.id}">${esc(o.title)}</a> · ${S.fmtDate(r.date)}</div></article>`;
  }
  function awardHero(r) {
    const b = S.badge(r.badge); const p = S.person(r.personId); const o = S.opp(r.oppId);
    return `<div class="award-hero"><div class="medal hero-medal">${I[b.icon]}</div><div><div class="kind">${esc(b.name)}</div><h3>${esc(p.name)}</h3><p>“${esc(r.citation)}”</p>${o.outcome ? `<p class="small mt2" style="color:rgba(255,255,255,.85)"><b>Project impact:</b> ${esc(o.outcome)}</p>` : ""}<div class="small mt2" style="color:rgba(255,255,255,.6)">${esc(o.title)} · awarded by ${esc(r.awardedBy)} · ${S.ago(r.date)}</div></div></div>`;
  }
  function viewRecognition(filter) {
    const recs = S.state.recognitions.filter(r => !filter || r.badge === filter);
    const counts = S.state.badges.map(b => ({ b, n: S.state.recognitions.filter(r => r.badge === b.key).length }));
    return shell(`<div class="wrap">
      <div class="page-head"><span class="eyebrow amber">Recognition</span><h1 class="mt1">Celebrate impact.</h1><p>Recognition is awarded by mentors when a project completes, announced across Spark and Teams, and stays on the contributor's profile.</p></div>
      ${S.state.recognitions[0] && !filter ? awardHero(S.state.recognitions[0]) : ""}
      <div class="grid g4 mt4">${counts.map(({ b, n }) => `<a class="card hover" href="#/recognition${filter === b.key ? "" : "/" + b.key}" style="display:flex;gap:12px;align-items:center;${filter === b.key ? "border-color:var(--navy-800)" : ""}">${badgeIcon(b)}<span><b style="color:var(--navy-900)">${esc(b.name)}</b><span class="small muted" style="display:block">${esc(b.blurb)}</span><span class="small" style="display:block;margin-top:4px"><b>${n}</b> awarded</span></span></a>`).join("")}</div>
      <div class="section-head mt6"><h2>${filter ? esc(S.badge(filter).name) : "Recognition wall"}</h2>${filter ? `<a class="btn ghost" href="#/recognition">Show all</a>` : ""}</div>
      <div class="grid g3">${recs.map(awardCard).join("") || empty("No recognitions yet", "Complete a project to award the first one.")}</div>
    </div>`);
  }

  /* ============================================================
     NOTIFICATIONS
     ============================================================ */
  function viewNotifications() {
    const me = S.me(); const list = S.notificationsFor(me.id);
    return shell(`<div class="wrap">
      <div class="page-head"><div class="row between"><div><h1>Notifications</h1><p>Everything Spark's automation sent to ${esc(me.name)} — portal alerts, emails and Teams posts. Emails and Teams posts are simulated here and sent by Power Automate in production.</p></div><button class="btn secondary" data-action="mark-all">Mark all as read</button></div></div>
      <div class="table-wrap">${list.map(n => notifRow(n).replace('class="notif-row', 'style="padding:16px" class="notif-row')).join("") || `<div class="empty" style="border:none">No notifications yet.</div>`}</div>
    </div>`);
  }

  /* ============================================================
     ARCHITECTURE · AUTOMATION LOG
     ============================================================ */
  function viewArchitecture() {
    const lists = [
      ["Opportunities", ["Title", "Description", "Duration", "Required Skills", "Team", "Location", "Expected Effort", "Openings", "Mentor (Person)", "Status", "Posted By", "Start / End Date", "Outcome"]],
      ["Applications", ["Applicant (Person)", "Employee ID", "Current Team", "Manager", "Skills", "Interest Statement", "Availability", "Opportunity (Lookup)", "Application Status", "Applied Date", "Manager Comments"]],
      ["Projects", ["Project Name", "Opportunity (Lookup)", "Participants (Person, multi)", "Project Manager", "Status", "Start / End / Completion Date", "Outcome"]],
      ["Recognition", ["Employee (Person)", "Project (Lookup)", "Recognition", "Description", "Award Date", "Awarded By"]],
      ["Subscriptions", ["Subscriber (Person)", "Technologies (multi)"]]
    ];
    const stages = [["SharePoint", "Pages & web parts", "Home · Marketplace · Manager Workspace · Recognition. List web parts with JSON formatting; audience-targeted manager page.", "svc-sp"], ["Microsoft Lists", "System of record", "Five lists, lookups between them, item-level permissions. No custom database.", "svc-lists"], ["Power Automate", "Workflow engine", "Five flows (F1–F5) fire on list changes and Forms responses — exactly the actions traced in this prototype.", "svc-teams"], ["Outlook · Teams", "Communication", "E-mails, adaptive cards, meetings and channel membership from the flows.", "svc-outlook"], ["Copilot Studio", "AI (roadmap)", "“Ask Spark” agent over the lists + Graph profiles; Azure AI for semantic matching.", "svc-copilot"]];
    return shell(`<div class="wrap">
      <div class="page-head"><span class="eyebrow">Architecture</span><h1 class="mt1">How SPARK runs on Microsoft 365.</h1><p>The prototype is the experience. Underneath, it is designed as SharePoint Online + Microsoft Lists + Power Automate + Forms + Outlook/Teams — no custom infrastructure, Entra ID identity, standard governance.</p></div>
      <div class="arch">${stages.map(([n, r, d, c], i) => `<div class="arch-stage"><span class="svc ${c}">${n}</span><b>${r}</b><p class="small muted" style="margin:6px 0 0">${d}</p></div>${i < stages.length - 1 ? `<div class="arch-arrow">${I.arrow}</div>` : ""}`).join("")}</div>
      <div class="section-head mt6"><div><h2>Microsoft Lists</h2><p>The seed data in this prototype uses these columns one-for-one.</p></div></div>
      <div class="grid g3">${lists.map(([n, cols]) => `<div class="card"><div class="row between"><h3>${n}</h3>${svc("lists")}</div><div class="row mt2">${cols.map(c => `<span class="pill" style="background:var(--surface);color:var(--ink-2)">${c}</span>`).join("")}</div></div>`).join("")}</div>
      <div class="section-head mt6"><div><h2>Power Automate flows</h2><p>Every action you take in the prototype shows the matching flow in the “Behind the scenes” panel.</p></div><a class="btn secondary" href="#/automation">Open automation log</a></div>
      <div class="table-wrap"><table class="table"><thead><tr><th>Flow</th><th>Trigger</th><th>What it does</th></tr></thead><tbody>${S.state.flows.map(f => `<tr><td><b>${f.id}</b><div class="sub">${esc(f.name)}</div></td><td>${esc(f.trigger)}</td><td>${f.out.map(o => `<span class="pill" style="background:var(--surface);color:var(--ink-2)">${esc(o)}</span>`).join(" ")}</td></tr>`).join("")}</tbody></table></div>
      <div class="section-head mt6"><div><span class="pill ai">${I.bolt}Spark AI</span><h2 class="mt1">AI roadmap</h2><p>Rule-based today so the demo is reliable; the data model is already what the AI needs.</p></div></div>
      <div class="grid g4">${[["Now", "Rule-based skill match", "Exact skill = Strong, related = Good. Drives recommendations and applicant ranking.", "Prototype"], ["Phase 1", "Profile-driven matching", "Skills from Microsoft Graph profiles; scoring in a flow.", "Microsoft Graph · Power Automate"], ["Phase 2", "Ask Spark agent", "“What Python projects are open?” · “Apply me to…” · “Subscribe me to AI”. Published to Teams.", "Copilot Studio"], ["Phase 3", "Semantic matching", "Interest statements and project history embedded; skill-gap suggestions for growth.", "Azure AI"]].map(([k, t, d, p]) => `<div class="card"><span class="eyebrow">${k}</span><h3 class="mt1" style="font-size:16px">${t}</h3><p class="small muted" style="margin:6px 0 10px">${d}</p><span class="pill">${p}</span></div>`).join("")}</div>
      <div class="card mt6" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">${[["Why this design", "Uses platform the company already licenses and governs; nothing to host or patch."], ["Identity & permissions", "Entra ID sign-in; item-level permissions on Applications; manager page audience-targeted."], ["Time to production", "Phase 1 (lists, marketplace, Forms, F1–F2) in 1–2 weeks; full loop in 4–6 weeks."], ["Data & analytics", "Lists feed Power BI directly: time-to-staff, participation by team, recognition trends."]].map(([h, b]) => `<div><b>${h}</b><p class="small muted" style="margin:4px 0 0">${b}</p></div>`).join("")}</div>
    </div>`);
  }
  function viewAutomation() {
    const traces = S.state.traces || [];
    return shell(`<div class="wrap">
      <div class="page-head"><span class="eyebrow">Automation log</span><h1 class="mt1">What Power Automate would have done.</h1><p>Every workflow action in this session, expressed as the flow steps that run in production. Newest first.</p></div>
      ${traces.length ? `<div class="stack">${traces.map(t => `<div class="card"><div class="row between"><div><span class="eyebrow">${esc(t.flow)}</span><h3 style="font-size:16px">${esc(t.title)}</h3></div><span class="small muted">${S.ago(t.time)}</span></div><ol class="steps-list mt2">${t.steps.map(st => `<li>${svc(st.svc)}<span>${esc(st.text)}</span></li>`).join("")}</ol></div>`).join("")}</div>` : empty("No flows have run yet", "Apply to an opportunity, accept an applicant or complete a project — each action appears here with its flow steps.", `<a class="btn" href="#/opportunities">Explore opportunities</a>`)}
      <div class="ai-note mt4"><span class="mark">${I.bolt}</span><div>These traces are generated by the same store actions that change the data — the prototype and the production flows share one definition of “what happens when”. <a href="#/architecture">See the architecture</a>.</div></div>
    </div>`);
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    const r = route(); closeModal();
    const views = { home: viewHome, opportunities: viewOpportunities, opportunity: () => viewOpportunity(r.arg), apply: () => viewApply(r.arg), applied: () => viewApplied(r.arg), "my-applications": viewMyApplications, "my-projects": viewMyProjects, manager: () => viewManager(r.arg), applicant: () => viewApplicant(r.arg), recognition: () => viewRecognition(r.arg), notifications: viewNotifications, architecture: viewArchitecture, automation: viewAutomation };
    const old = document.getElementById("trace"); if (old) old.remove();
    document.getElementById("app").innerHTML = (views[r.name] || viewHome)();
    if (ui.trace) { showTrace(ui.trace); ui.trace = null; }
    document.title = "SPARK · " + ({ home: "Discover. Contribute. Grow.", opportunities: "Opportunity Marketplace", opportunity: "Opportunity", apply: "Apply", applied: "Application submitted", "my-applications": "My Applications", "my-projects": "My Projects", manager: "Manager Workspace", applicant: "Applicant profile", recognition: "Recognition", notifications: "Notifications", architecture: "Microsoft 365 architecture", automation: "Automation log" }[r.name] || "Home");
  }
  function rerender(keepScroll = true) { const y = window.scrollY; render(); if (keepScroll) window.scrollTo(0, y); }

  /* ============================================================
     EVENTS
     ============================================================ */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) { if (ui.open && !e.target.closest("#panel")) { ui.open = null; rerender(); } return; }
    const act = el.dataset.action, id = el.dataset.id;
    switch (act) {
      case "toggle": ui.open = ui.open === el.dataset.panel ? null : el.dataset.panel; rerender(); break;
      case "close-modal": closeModal(); break;
      case "close-trace": { const t = document.getElementById("trace"); if (t) t.remove(); break; }
      case "switch-user": { S.setUser(id); ui.open = null; const me = S.me(); toast(`Now viewing as ${me.name}`, me.role === "manager" ? "Opportunity owner · Manager Workspace unlocked" : "Employee view"); go(me.role === "manager" ? "#/manager" : "#/home"); render(); break; }
      case "reset-demo": ui.open = null; S.reset(); toast("Demo data reset", "Back to the starting state."); go("#/home"); render(); break;
      case "read-notif": S.markRead(id); ui.open = null; break;
      case "mark-all": S.markAllRead(); rerender(); break;
      case "tech": ui.tech = el.dataset.v; if (route().name !== "opportunities") go("#/opportunities"); else rerender(); break;
      case "clear-filters": Object.assign(ui, { q: "", tech: "", team: "", duration: "", location: "", status: "" }); rerender(); break;
      case "toggle-sub": { const on = S.toggleSubscription(el.dataset.v); toast(on ? `Subscribed to ${el.dataset.v}` : `Unsubscribed from ${el.dataset.v}`, on ? "You'll get an email when a matching opportunity is posted." : "", "email"); rerender(); break; }
      case "schedule": scheduleModal(id); break;
      case "do-schedule": { const dt = document.getElementById("sch-dt").value; if (!dt) { document.getElementById("sch-err").textContent = "Pick a date and time."; break; } const a = S.app(id); S.setAppStatus(id, "Discussion Scheduled", { discussionAt: dt, discussionNote: document.getElementById("sch-note").value }); ui.trace = S.lastTrace; closeModal(); toast("Discussion scheduled", `Teams invite emailed to ${S.person(a.personId).name} for ${S.fmtDT(dt)}.`, "email"); rerender(); break; }
      case "app-status": {
        const a = S.app(id); const o = S.opp(a.oppId); const p = S.person(a.personId); const st = el.dataset.status;
        if (st === "Rejected") { rejectModal(id); break; }
        const before = o.status; S.setAppStatus(id, st); ui.trace = S.lastTrace;
        toast(st === "Accepted" ? `${p.name} accepted` : `${p.name} shortlisted`, `Email sent to ${p.name}.${st === "Accepted" && before !== "Ongoing" && o.status === "Ongoing" ? ` ${o.title} is now Ongoing.` : ""}`, "email");
        rerender(); break;
      }
      case "do-reject": { const a = S.app(id); S.setAppStatus(id, "Rejected", { managerComment: document.getElementById("rej-note").value }); ui.trace = S.lastTrace; closeModal(); toast("Application declined", `${S.person(a.personId).name} has been notified with your note.`, "email"); rerender(); break; }
      case "complete": { const o = S.opp(id); S.complete(id); ui.trace = S.lastTrace; toast(`${o.title} completed`, "Contributors notified. Recognize them to close the loop.", "email"); rerender(); recognizeModal(id); break; }
      case "recognize": recognizeModal(id); break;
      case "do-recognize": {
        const rows = [...document.querySelectorAll("#rec-form [data-person]")].map(r => ({ personId: r.dataset.person, badge: (r.querySelector("input[type=radio]:checked") || {}).value || "", citation: r.querySelector("input[type=text]").value.trim() }));
        const outcome = (document.getElementById("rec-outcome") || {}).value || "";
        closeModal(); const n = S.recognize(id, rows, outcome.trim()); ui.trace = S.lastTrace;
        toast(n ? `${n} recognition${n > 1 ? "s" : ""} awarded` : "Project closed", n ? "Announced on Spark and Teams; winners emailed." : "", "email");
        go("#/recognition"); break;
      }
      case "fill-example": fillExample(); break;
    }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "f-team") { ui.team = t.value; rerender(); }
    if (t.id === "f-duration") { ui.duration = t.value; rerender(); }
    if (t.id === "f-location") { ui.location = t.value; rerender(); }
    if (t.id === "f-status") { ui.status = t.value; rerender(); }
    if (t.id === "f-sort") { ui.sort = t.value; rerender(); }
    if (t.closest && t.closest(".skill-pick") && (t.type === "checkbox" || t.type === "radio")) { const pick = t.closest(".skill-pick"); pick.querySelectorAll("label").forEach(l => l.classList.toggle("on", l.querySelector("input").checked)); }
    if (t.dataset.action === "opp-status") {
      const o = S.opp(t.dataset.id);
      if (t.value === "Completed") { S.complete(o.id); ui.trace = S.lastTrace; toast(`${o.title} completed`, "Contributors notified.", "email"); rerender(); recognizeModal(o.id); return; }
      S.setOppStatus(o.id, t.value); toast(`${o.title} is now ${t.value}`, "Applicants notified."); rerender();
    }
    if (t.dataset.action === "opp-progress") { S.setProgress(t.dataset.id, +t.value); rerender(); }
  });
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "f-q") { ui.q = t.value; const pos = t.selectionStart; rerender(); const n = document.getElementById("f-q"); n.focus(); n.setSelectionRange(pos, pos); }
    if (t.dataset.action === "opp-progress") t.nextElementSibling.textContent = t.value + "%";
  });
  document.addEventListener("submit", e => {
    const f = e.target; e.preventDefault();
    if (f.dataset.form === "hdr-search") { ui.q = document.getElementById("hdr-q").value; go("#/opportunities"); rerender(false); return; }
    if (f.id === "apply-form") {
      const fd = new FormData(f);
      const skills = [...fd.getAll("skills"), ...String(fd.get("extraSkills") || "").split(",").map(s => s.trim()).filter(Boolean)];
      const err = document.getElementById("apply-err");
      if (!f.checkValidity()) { err.textContent = "Please complete the required fields."; f.querySelector(":invalid").focus(); return; }
      if (!skills.length) { err.textContent = "Select at least one skill."; return; }
      const from = fd.get("from"); const fromTxt = from ? new Date(from).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "ASAP";
      const app = S.apply(f.dataset.opp, { name: fd.get("name"), empId: fd.get("empId"), team: fd.get("team"), manager: fd.get("manager"), currentProject: fd.get("currentProject"), skills, interest: fd.get("interest"), availability: `From ${fromTxt} · ${fd.get("hours")}` });
      toast("Application submitted", `Email sent to ${S.person(S.opp(app.oppId).mentorId).name}.`, "email");
      ui.trace = S.lastTrace; go("#/applied/" + app.id);
    }
    if (f.id === "opp-form") {
      const fd = new FormData(f); const err = document.getElementById("opp-err");
      if (!f.checkValidity()) { err.textContent = "Please complete the required fields."; f.querySelector(":invalid").focus(); return; }
      const skills = String(fd.get("skills")).split(",").map(s => s.trim()).filter(Boolean);
      if (!skills.length) { err.textContent = "Add at least one required skill."; return; }
      const weeks = +fd.get("weeks");
      const { opp, subs } = S.postOpportunity({ title: fd.get("title"), description: fd.get("description"), statement: fd.get("statement") || `Looking for ${fd.get("openings")} contributors.`, duration: `${weeks} week${weeks > 1 ? "s" : ""}`, weeks, effort: fd.get("effort"), openings: +fd.get("openings") || 1, startDate: fd.get("startDate") || "TBD", technology: fd.get("technology") || skills[0], skills, team: fd.get("team"), location: fd.get("location"), work: String(fd.get("work") || "").split("\n").map(s => s.trim()).filter(Boolean), why: fd.get("why") || "", who: fd.get("who") || "", build: skills.slice(0, 3) });
      toast("Opportunity published", `Announced on Spark and Teams · ${subs} subscriber email${subs !== 1 ? "s" : ""} sent.`, "email");
      ui.trace = S.lastTrace; go("#/opportunity/" + opp.id);
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); if (ui.open) { ui.open = null; rerender(); } }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".pill.click[role=button]")) { e.preventDefault(); e.target.click(); }
  });

  /* ---------- modals ---------- */
  /* "Behind the scenes" — what the equivalent Power Automate flow just did. */
  function showTrace(t) {
    const el = document.createElement("aside"); el.id = "trace"; el.className = "trace"; el.setAttribute("aria-label", "Automation trace");
    el.innerHTML = `<div class="hd"><div><span class="eyebrow" style="color:var(--amber)">Behind the scenes · Power Automate</span><div class="t">${esc(t.flow)} · ${esc(t.title)}</div></div><button class="x" data-action="close-trace" aria-label="Close" style="color:#fff">×</button></div>
      <ol class="steps-list">${t.steps.map(st => `<li>${svc(st.svc)}<span>${esc(st.text)}</span></li>`).join("")}</ol>
      <div class="ft"><span class="small">${t.steps.length} steps · ran just now</span><span><a href="#/automation">Automation log</a> · <a href="#/architecture">Architecture</a></span></div>`;
    document.body.appendChild(el);
  }
  function scheduleModal(appId) {
    const a = S.app(appId); const p = S.person(a.personId); const o = S.opp(a.oppId);
    const d = new Date(Date.now() + 2 * 864e5); d.setHours(15, 0, 0, 0);
    const def = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    modal("Schedule a discussion", `<div class="form"><p class="small muted" style="margin:0">A 20-minute Teams meeting with <b>${esc(p.name)}</b> about <b>${esc(o.title)}</b>. Both of you receive the invite.</p><div><label for="sch-dt">Date & time</label><input id="sch-dt" type="datetime-local" value="${def}"></div><div><label for="sch-note">Note for the invite</label><input id="sch-note" placeholder="Agenda, what to prepare…" value="Quick intro, walk through your interest statement, agree availability."></div><div class="err" id="sch-err"></div></div>`,
      `<button class="btn secondary" data-action="close-modal">Cancel</button><button class="btn" data-action="do-schedule" data-id="${appId}">Send invite</button>`);
  }
  function rejectModal(appId) {
    const a = S.app(appId); const p = S.person(a.personId);
    modal("Decline this application", `<div class="form"><p class="small muted" style="margin:0"><b>${esc(p.name)}</b> will receive a courteous email. Add a short note — it makes a difference.</p><div><label for="rej-note">Note to applicant (optional)</label><textarea id="rej-note" style="min-height:80px" placeholder="e.g. Strong profile — we went with contributors who had prior LLM experience this time."></textarea></div></div>`,
      `<button class="btn secondary" data-action="close-modal">Cancel</button><button class="btn danger" data-action="do-reject" data-id="${appId}">Decline & notify</button>`);
  }
  function recognizeModal(oppId) {
    const o = S.opp(oppId); const c = S.contributors(oppId); const badges = S.state.badges;
    modal(`Recognize contributors`, `<p class="small muted" style="margin:0 0 16px"><b>${esc(o.title)}</b> is completed. Record the outcome, then choose a recognition for each contributor. Both are announced on Spark and Teams and emailed.</p>
      <div class="form mb3"><div><label for="rec-outcome">Project impact — one line for the announcement</label><input id="rec-outcome" class="input" value="${esc(o.outcome || "")}" placeholder="e.g. Weekly status reporting automated; 4 hours per lead per week returned to engineering."></div></div>
      ${c.length ? `<div id="rec-form" class="stack">${c.map((p, i) => `<div class="card" data-person="${p.id}" style="padding:16px"><div class="row" style="gap:12px">${avatar(p.name)}<div><b>${esc(p.name)}</b><div class="small muted">${esc(p.team)}</div></div></div>
        <div class="badge-pick mt2">${badges.map(b => `<label class="${(i === 0 && b.key === "innovation") ? "sel" : ""}"><input type="radio" name="badge-${p.id}" value="${b.key}" ${(i === 0 && b.key === "innovation") ? "checked" : ""}>${badgeIcon(b, "xs")}${esc(b.name)}</label>`).join("")}</div>
        <input type="text" class="input mt2" placeholder="Citation — why they earned it" value="${i === 0 ? esc(`Outstanding contribution to the ${o.title} prototype.`) : ""}"></div>`).join("")}</div>` : `<div class="empty" id="rec-form">No accepted contributors on this project.</div>`}`,
      `<button class="btn secondary" data-action="close-modal">Later</button><button class="btn amber" data-action="do-recognize" data-id="${oppId}">${I.star}Award recognition</button>`);
    document.querySelectorAll("#rec-form .badge-pick input").forEach(r => r.addEventListener("change", () => { r.closest(".badge-pick").querySelectorAll("label").forEach(l => l.classList.toggle("sel", l.querySelector("input").checked)); }));
  }
  function fillExample() {
    const f = document.getElementById("opp-form"); if (!f) return;
    const set = (n, v) => { const el = f.querySelector(`[name=${n}]`); if (el) el.value = v; };
    set("title", "Engineering Copilot Evaluation Sprint");
    set("description", "Evaluate Microsoft 365 Copilot and GitHub Copilot against ten real engineering workflows and produce an adoption recommendation for the group.");
    set("statement", "I'm looking for 2 contributors who use our engineering tools daily and can measure, not guess, where Copilot saves time.");
    set("weeks", "2"); set("effort", "8 hrs/week"); set("openings", "2"); set("skills", "Python, AI / ML, Prompt Engineering, Testing");
    set("work", "Define ten measurable engineering workflows\nRun before/after timing with real users\nDocument prompts that work and those that don't\nPresent an adoption recommendation to leadership");
    set("why", "Licences are being decided next quarter. Evidence from our own workflows beats vendor claims.");
    set("who", "Curious engineers who care about measurement and can write clearly.");
    const r = f.querySelector('input[name=technology][value="AI / ML"]'); if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    const d = new Date(Date.now() + 10 * 864e5); set("startDate", d.toISOString().slice(0, 10));
    toast("Example loaded", "Edit anything, then publish.");
  }

  window.addEventListener("hashchange", () => { ui.open = null; render(); document.getElementById("main").classList.add("enter"); window.scrollTo(0, 0); });
  render();
})();
