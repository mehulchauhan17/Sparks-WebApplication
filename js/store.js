/* ============================================================
   SPARK — store
   State + persistence (localStorage) + every workflow action.
   Each action here is one Power Automate flow in production
   (see docs/SOLUTION_DESIGN.md): the notification side-effects
   are written in the same place as the data change on purpose.
   ============================================================ */
(function () {
  const KEY = "spark.v2";
  const clone = o => JSON.parse(JSON.stringify(o));
  const uid = p => p + "-" + Math.random().toString(36).slice(2, 7);
  const now = () => new Date().toISOString();
  const hoursAgo = h => new Date(Date.now() - h * 3600e3).toISOString();

  const S = {
    state: null,

    load() {
      try { const raw = localStorage.getItem(KEY); if (raw) { this.state = JSON.parse(raw); return; } } catch (e) { /* seed */ }
      this.reset(false);
    },
    reset(persist = true) {
      const st = clone(window.SEED);
      st.opportunities.forEach(o => { o.postedOn = hoursAgo(o.agoH || 0); });
      st.applications.forEach(a => { a.appliedOn = hoursAgo(a.agoH || 0); });
      st.recognitions.forEach(r => { r.date = hoursAgo(r.agoH || 0); });
      st.notifications.forEach(n => { n.time = hoursAgo(n.agoH || 0); });
      st.activity.forEach(a => { a.time = hoursAgo(a.agoH || 0); });
      st.currentUserId = "u-priya";
      st.traces = [];
      this.state = st;
      if (persist) this.save();
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { /* private mode */ } },

    /* ---------- lookups ---------- */
    me() { return this.state.users.find(u => u.id === this.state.currentUserId); },
    setUser(id) { this.state.currentUserId = id; this.save(); },
    person(id) { return this.state.users.find(u => u.id === id) || this.state.people.find(p => p.id === id); },
    opp(id) { return this.state.opportunities.find(o => o.id === id); },
    app(id) { return this.state.applications.find(a => a.id === id); },
    badge(key) { return this.state.badges.find(b => b.key === key); },
    appsFor(oppId) { return this.state.applications.filter(a => a.oppId === oppId); },
    contributors(oppId) { return this.appsFor(oppId).filter(a => a.status === "Accepted").map(a => this.person(a.personId)); },
    myApps() { const me = this.me(); return this.state.applications.filter(a => a.personId === me.id).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)); },
    myProjects() { return this.myApps().filter(a => a.status === "Accepted").map(a => this.opp(a.oppId)); },
    myListings() { const me = this.me(); return this.state.opportunities.filter(o => o.postedBy === me.id).sort((a, b) => b.postedOn.localeCompare(a.postedOn)); },
    hasApplied(oppId) { return this.state.applications.some(a => a.oppId === oppId && a.personId === this.me().id); },
    myApplicationFor(oppId) { return this.state.applications.find(a => a.oppId === oppId && a.personId === this.me().id); },
    recognitionsFor(oppId) { return this.state.recognitions.filter(r => r.oppId === oppId); },
    mySubscription() {
      const me = this.me();
      let s = this.state.subscriptions.find(x => x.userId === me.id);
      if (!s) { s = { userId: me.id, technologies: [] }; this.state.subscriptions.push(s); }
      return s;
    },
    notificationsFor(userId) {
      const me = this.person(userId);
      return this.state.notifications.filter(n => n.to === "all" || n.to === me.id).sort((a, b) => b.time.localeCompare(a.time));
    },
    unreadCount() { return this.notificationsFor(this.state.currentUserId).filter(n => !n.read).length; },
    allSkills() { const s = new Set(); this.state.opportunities.forEach(o => o.skills.forEach(k => s.add(k))); return [...s].sort(); },
    isActive(o) { return ["Open", "Under Review", "Ongoing"].includes(o.status); },

    /* Live numbers for the home page and workspace. */
    stats() {
      const st = this.state;
      const active = st.opportunities.filter(o => this.isActive(o)).length;
      const accepted = st.applications.filter(a => a.status === "Accepted");
      const participating = new Set(accepted.map(a => a.personId)).size;
      const teams = new Set(accepted.map(a => (this.person(a.personId) || {}).team)).size;
      const completed = st.opportunities.filter(o => o.status === "Completed").length;
      const month = Date.now() - 30 * 864e5;
      const recognitions = st.recognitions.filter(r => new Date(r.date).getTime() > month).length;
      const week = Date.now() - 7 * 864e5;
      const postedThisWeek = st.opportunities.filter(o => new Date(o.postedOn).getTime() > week).length;
      const completedThisMonth = st.opportunities.filter(o => o.status === "Completed" && o.completedOn && new Date(o.completedOn).getTime() > month).length;
      const openings = st.opportunities.filter(o => ["Open", "Under Review"].includes(o.status)).reduce((n, o) => n + Math.max(0, o.openings - this.contributors(o.id).length), 0);
      return { active, participating, teams, completed, recognitions, postedThisWeek, completedThisMonth, openings };
    },

    /* ---------- Spark AI (rule-based today) ----------
       Scores a person against an opportunity's required skills.
       Exact skill = Strong, related skill = Good, otherwise Gap.
       Production: Copilot Studio / Azure AI over Graph profile data. */
    match(person, opp) {
      const rel = this.state.related;
      const mine = new Set(person.skills || []);
      const rows = opp.skills.map(sk => {
        if (mine.has(sk)) return { skill: sk, level: "Strong", pct: 100 };
        const related = (rel[sk] || []).some(r => mine.has(r)) || [...mine].some(m => (rel[m] || []).includes(sk));
        return related ? { skill: sk, level: "Good", pct: 75 } : { skill: sk, level: "Gap", pct: 30 };
      });
      const avg = rows.reduce((n, r) => n + r.pct, 0) / rows.length;
      return { pct: Math.round(50 + avg / 2), rows, strong: rows.filter(r => r.level === "Strong").length };
    },
    recommendations(person, limit = 3) {
      return this.state.opportunities
        .filter(o => ["Open", "Under Review"].includes(o.status) && !this.state.applications.some(a => a.oppId === o.id && a.personId === person.id))
        .map(o => ({ opp: o, pct: this.match(person, o).pct }))
        .sort((a, b) => b.pct - a.pct).slice(0, limit);
    },

    /* ---------- automation trace ----------
       Records what the equivalent Power Automate flow would do,
       step by step, so the UI can show it "behind the scenes".
       svc: forms | lists | outlook | teams | sharepoint */
    trace(flow, title, steps) {
      const t = { id: uid("t"), flow, title, steps, time: now() };
      this.state.traces = this.state.traces || [];
      this.state.traces.unshift(t); this.state.traces.length = Math.min(this.state.traces.length, 30);
      this.lastTrace = t; return t;
    },

    /* ---------- communication primitives ---------- */
    notify({ to, channel = "portal", type = "info", title, body = "", link = "#/home" }) {
      this.state.notifications.unshift({ id: uid("n"), to, channel, type, title, body, link, time: now(), read: false });
    },
    log(icon, text) { this.state.activity.unshift({ icon, text, time: now() }); },
    notifySubscribers(opp) {
      const tags = new Set([opp.technology, ...opp.skills]);
      const hits = this.state.subscriptions.filter(s => s.technologies.some(t => tags.has(t)) && s.userId !== opp.postedBy);
      hits.forEach(s => {
        const p = this.person(s.userId);
        this.notify({ to: s.userId, channel: "email", type: "subscription", title: `Subscriber alert: a new ${opp.technology} opportunity matches your interests`, body: `To: ${p ? p.email : s.userId}\n${opp.title} was posted by ${this.person(opp.postedBy).name} · ${opp.openings} openings · ${opp.duration}.`, link: "#/opportunity/" + opp.id });
      });
      return hits.length;
    },

    /* ---------- FLOW 1: opportunity announcement ---------- */
    postOpportunity(data) {
      const me = this.me();
      const opp = Object.assign({ id: uid("opp"), postedBy: me.id, mentorId: me.id, status: "Open", featured: true, postedOn: now() }, data);
      this.state.opportunities.unshift(opp);
      this.notify({ to: "all", channel: "portal", type: "announcement", title: `New opportunity: ${opp.title}`, body: `${this.person(opp.mentorId).name} (${opp.team}) is looking for ${opp.openings} contributors · ${opp.duration} · ${opp.skills.slice(0, 3).join(", ")}.`, link: "#/opportunity/" + opp.id });
      this.notify({ to: "all", channel: "teams", type: "announcement", title: `Posted to Teams › Spark Opportunities: ${opp.title}`, body: "Adaptive card with an Apply button posted to the channel.", link: "#/opportunity/" + opp.id });
      const subs = this.notifySubscribers(opp);
      this.log("post", `${me.name} posted ${opp.title}`);
      this.trace("F1", "Opportunity announcement", [
        { svc: "lists", text: `Trigger · item created in Opportunities: “${opp.title}”` },
        { svc: "sharepoint", text: "Create News post on the SPARK home page" },
        { svc: "teams", text: "Post adaptive card to Teams › Spark Opportunities (Apply button)" },
        { svc: "lists", text: `Get Subscriptions where Technologies contains “${opp.technology}” → ${subs} match${subs === 1 ? "" : "es"}` },
        { svc: "outlook", text: `Send e-mail to ${subs} subscriber${subs === 1 ? "" : "s"} + confirmation to ${this.person(opp.mentorId).email}` }
      ]);
      this.save();
      return { opp, subs };
    },

    /* ---------- FLOW 2: application → manager notification ---------- */
    apply(oppId, form) {
      const me = this.me();
      const opp = this.opp(oppId);
      const mgr = this.person(opp.postedBy);
      const app = Object.assign({ id: uid("app"), oppId, personId: me.id, status: "Under Review", appliedOn: now() }, form);
      this.state.applications.push(app);
      this.notify({ to: opp.postedBy, channel: "email", type: "application", title: `New application received for ${opp.title}`, body: `To: ${mgr.email}\n${me.name} (${form.team}) applied. Skills: ${form.skills.join(", ")}. Availability: ${form.availability}.\nReview in the Manager Workspace.`, link: "#/manager/applicants" });
      this.notify({ to: opp.postedBy, channel: "portal", type: "application", title: `${me.name} applied to ${opp.title}`, body: `${form.skills.join(" • ")} · ${form.availability}`, link: "#/applicant/" + app.id });
      this.notify({ to: me.id, channel: "email", type: "status", title: `Application received: ${opp.title}`, body: `To: ${me.email}\nYour application was sent to ${mgr.name}. They may invite you for a short discussion.`, link: "#/my-applications" });
      const moved = opp.status === "Open";
      if (moved) opp.status = "Under Review";
      this.log("apply", `${me.name} applied to ${opp.title}`);
      this.trace("F2", "Application received", [
        { svc: "forms", text: `Trigger · Microsoft Forms response from ${me.name}` },
        { svc: "lists", text: "Create item in Applications (Status = Under Review)" },
        { svc: "lists", text: `Get Opportunity “${opp.title}” → owner ${mgr.name}` },
        { svc: "outlook", text: `Send e-mail to ${mgr.email} · “New application received”` },
        { svc: "outlook", text: `Send confirmation to ${me.email} · CC line manager ${form.manager}` },
        ...(moved ? [{ svc: "lists", text: "Update Opportunities · Status = Under Review" }] : [])
      ]);
      this.save();
      return app;
    },

    /* ---------- FLOW 3: application status → applicant notification ---------- */
    setAppStatus(appId, status, extra = {}) {
      const app = this.app(appId);
      const opp = this.opp(app.oppId);
      const mgr = this.person(opp.postedBy);
      const who = this.person(app.personId);
      Object.assign(app, extra, { status });
      const copy = {
        "Discussion Scheduled": `${mgr.name} would like a short discussion on ${S.fmtDT(extra.discussionAt)}. A Teams invite has been sent.`,
        "Shortlisted": `Your application has been shortlisted for ${opp.title}. ${mgr.name} will confirm the final selection shortly.`,
        "Rejected": `Thank you for applying to ${opp.title}. ${mgr.name} has selected other contributors this time — new opportunities are posted every week.`,
        "Accepted": `You have been selected for ${opp.title}. ${mgr.name} will share the kick-off details in Teams.`
      };
      const titles = { "Discussion Scheduled": "You're invited to a discussion", "Shortlisted": "Your application has been shortlisted", "Rejected": "Update on your application", "Accepted": `You have been selected for ${opp.title}` };
      this.notify({ to: app.personId, channel: "email", type: "status", title: titles[status], body: `To: ${who.email}\n${copy[status]}`, link: "#/my-applications" });
      const steps = [
        { svc: "lists", text: `Trigger · Applications item modified · Status → ${status}` },
        { svc: "outlook", text: `Send e-mail to ${who.email} · “${titles[status]}”` }
      ];
      if (status === "Discussion Scheduled") steps.push({ svc: "teams", text: `Create Teams meeting · ${S.fmtDT(extra.discussionAt)} · ${mgr.name} + ${who.name}` });
      if (status === "Rejected" && extra.managerComment) steps.push({ svc: "lists", text: "Store Manager Comments on the application" });
      if (status === "Accepted") {
        this.log("join", `${who.name} joined ${opp.title}`);
        steps.push({ svc: "teams", text: `Add ${who.name} to Teams channel › ${opp.title}` });
        steps.push({ svc: "lists", text: "Create / update Projects item · add participant" });
        if (["Open", "Under Review"].includes(opp.status)) {
          opp.status = "Ongoing"; opp.progress = opp.progress || 10;
          this.notify({ to: "all", channel: "portal", type: "status", title: `${opp.title} is now ongoing`, body: `${mgr.name}'s project has kicked off.`, link: "#/opportunity/" + opp.id });
          this.notify({ to: app.personId, channel: "teams", type: "status", title: `Added to Teams › ${opp.title}`, body: "You were added to the project channel.", link: "#/my-projects" });
          this.log("launch", `${opp.title} is now ongoing`);
          steps.push({ svc: "lists", text: "Update Opportunities · Status = Ongoing" });
          steps.push({ svc: "sharepoint", text: "Create News post · “Project kicked off”" });
        }
      }
      this.trace("F3", `Application ${status.toLowerCase()}`, steps);
      this.save();
      return app;
    },

    setOppStatus(oppId, status) {
      const opp = this.opp(oppId);
      if (opp.status === status) return opp;
      opp.status = status;
      if (status === "Ongoing" && opp.progress == null) opp.progress = 10;
      if (status === "Completed") return this.complete(oppId);
      this.appsFor(oppId).filter(a => a.status !== "Rejected").forEach(a => this.notify({ to: a.personId, channel: "portal", type: "status", title: `${opp.title} is now ${status}`, body: status === "On Hold" ? "The manager has paused this opportunity; you will be notified when it resumes." : status === "Closed" ? "This opportunity is no longer accepting applications." : "Status updated by the manager.", link: "#/my-applications" }));
      this.save();
      return opp;
    },
    setProgress(oppId, pct) { const o = this.opp(oppId); o.progress = Math.max(0, Math.min(100, pct)); this.save(); },

    /* ---------- FLOW 4a: project completed ---------- */
    complete(oppId) {
      const opp = this.opp(oppId);
      opp.status = "Completed"; opp.progress = 100; opp.completedOn = now();
      this.contributors(oppId).forEach(p => this.notify({ to: p.id, channel: "email", type: "status", title: `Your project has been completed: ${opp.title}`, body: `To: ${p.email}\nThank you for your contribution. Your participation is now on your profile, and the mentor is reviewing recognitions.`, link: "#/my-projects" }));
      this.notify({ to: "all", channel: "portal", type: "status", title: `${opp.title} was completed`, body: `${this.contributors(oppId).map(p => p.name).join(", ")} delivered with ${this.person(opp.mentorId).name}.`, link: "#/opportunity/" + oppId });
      this.log("done", `${opp.title} was completed`);
      const n = this.contributors(oppId).length;
      this.trace("F4", "Project completed", [
        { svc: "lists", text: `Trigger · Opportunities modified · Status = Completed · “${opp.title}”` },
        { svc: "lists", text: "Update Projects · Status = Completed · Completion Date = today" },
        { svc: "outlook", text: `Send e-mail to ${n} participant${n === 1 ? "" : "s"}` },
        { svc: "teams", text: `Post adaptive card to ${this.person(opp.mentorId).name} · “Recognize contributors” (wait for response)` }
      ]);
      this.save();
      return opp;
    },

    /* ---------- FLOW 4b: recognition ---------- */
    recognize(oppId, awards /* [{personId, badge, citation}] */, outcome = "") {
      const opp = this.opp(oppId);
      const me = this.me();
      if (outcome) opp.outcome = outcome;
      const lines = [];
      awards.filter(a => a.badge).forEach(a => {
        const b = this.badge(a.badge); const p = this.person(a.personId);
        this.state.recognitions.unshift({ id: uid("rec"), oppId, personId: a.personId, badge: a.badge, citation: a.citation || b.blurb, date: now(), awardedBy: me.name });
        lines.push(`${b.name} — ${p.name}`);
        this.notify({ to: a.personId, channel: "email", type: "recognition", title: `You received an ${b.name} recognition`, body: `To: ${p.email}\nFor ${opp.title}: "${a.citation || b.blurb}"\nYour recognition is now on the Spark Recognition wall.`, link: "#/recognition" });
        this.log("award", `${p.name} received ${b.name} for ${opp.title}`);
      });
      if (lines.length) {
        this.notify({ to: "all", channel: "portal", type: "recognition", title: `Recognition announced: ${opp.title}`, body: lines.join(" · "), link: "#/recognition" });
        this.notify({ to: "all", channel: "teams", type: "recognition", title: `Posted to Teams › Spark Recognition: ${opp.title}`, body: lines.join(" · "), link: "#/recognition" });
      }
      this.trace("F4", "Recognition awarded", [
        { svc: "teams", text: `Adaptive card response received from ${me.name}` },
        ...(outcome ? [{ svc: "lists", text: "Update Projects · Outcome recorded" }] : []),
        { svc: "lists", text: `Create ${lines.length} item${lines.length === 1 ? "" : "s"} in Recognition` },
        { svc: "outlook", text: `Send e-mail to each winner · ${lines.join(" · ") || "none"}` },
        { svc: "sharepoint", text: "Create News post · “Recognition announced”" },
        { svc: "teams", text: "Post recognition card to Teams › Spark Recognition" }
      ]);
      this.save();
      return lines.length;
    },

    markRead(id) { const n = this.state.notifications.find(x => x.id === id); if (n && !n.read) { n.read = true; this.save(); } },
    markAllRead() { this.notificationsFor(this.state.currentUserId).forEach(n => n.read = true); this.save(); },
    toggleSubscription(t) { const s = this.mySubscription(); const i = s.technologies.indexOf(t); if (i >= 0) s.technologies.splice(i, 1); else s.technologies.push(t); this.save(); return i < 0; },

    /* ---------- formatting ---------- */
    fmtDT(iso) { if (!iso) return "a date to be confirmed"; return new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); },
    fmtDate(iso) { if (!iso) return "—"; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString(undefined, { day: "numeric", month: "short" }); },
    ago(iso) {
      const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
      if (m < 1) return "just now"; if (m < 60) return m + " min ago";
      const h = Math.round(m / 60); if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
      const d = Math.round(h / 24); if (d < 7) return d + (d === 1 ? " day ago" : " days ago");
      const w = Math.round(d / 7); if (w < 5) return w + (w === 1 ? " week ago" : " weeks ago");
      return this.fmtDate(iso);
    }
  };
  window.Store = S;
})();
