/* ==========================================================================
   main.js — shared behaviour + page rendering.
   Content comes from data.js; nothing here needs editing to add projects.
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked: fine */ } },
  };

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  };

  const STATUS_LABEL = { live: "Live", "in-progress": "In progress", research: "Research" };
  const TAG_LABEL = { all: "All", web: "Web", frontend: "Frontend", backend: "Backend", testing: "Testing", research: "Research" };

  const statusBadge = (s) => `<span class="status status-${esc(s)}">${esc(STATUS_LABEL[s] || s)}</span>`;

  const projectRow = (p) => `
    <li class="project-item">
      <a class="project-link" href="project.html?id=${encodeURIComponent(p.id)}">
        <div>
          <h3>${esc(p.title)}</h3>
        </div>
        <p class="tagline">${esc(p.tagline)}</p>
        <div class="project-meta">
          ${statusBadge(p.status)}
          ${has(p.stack) ? `<span class="stack-line">${p.stack.slice(0, 4).map(esc).join(", ")}</span>` : ""}
          <span class="visually-hidden">Open case study</span>
        </div>
      </a>
    </li>`;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  const currentTheme = () =>
    root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const setTheme = (t) => {
    root.dataset.theme = t;
    store.set("theme", t);
    $$(".theme-btn").forEach((b) => b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme"));
  };
  window.__setTheme = setTheme;
  window.__currentTheme = currentTheme;

  $$(".theme-btn").forEach((btn) => {
    btn.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    btn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
  });

  /* ---------- header + mobile menu ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = $(".menu-btn");
  const navLinks = $(".nav-links");
  if (menuBtn && navLinks) {
    const close = () => { navLinks.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); };
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- shared fills: email, links, year ---------- */
  $$("[data-email]").forEach((a) => { a.href = `mailto:${SITE.email}`; if (!a.textContent.trim()) a.textContent = SITE.email; });
  $$("[data-link]").forEach((a) => {
    const url = SITE[a.dataset.link];
    if (url) a.href = url; else a.remove();
  });
  $$("[data-cv]").forEach((a) => { if (SITE.cv) a.href = SITE.cv; else a.remove(); });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  $$("[data-availability]").forEach((el) => (el.textContent = SITE.availability));

  $$("[data-copy-email]").forEach((btn) => {
    const status = $(".copy-status");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(SITE.email);
        if (status) status.textContent = "Email copied to clipboard.";
      } catch {
        if (status) status.textContent = `Copy failed. The address is ${SITE.email}`;
      }
    });
  });

  const page = document.body.dataset.page;

  /* ---------- home ---------- */
  if (page === "home") {
    const list = $("#featured-projects");
    if (list) list.innerHTML = PROJECTS.filter((p) => p.featured).map(projectRow).join("");

    const papers = $("#research-list");
    if (papers) renderPapers(papers);

    // highlight the nav link for the section in view
    const links = $$('.nav-links a[href^="#"]');
    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => io.observe(s));
    }
  }

  /* ---------- projects ---------- */
  if (page === "projects") {
    const list = $("#all-projects");
    const filters = $("#filters");
    const tags = ["all", ...new Set(PROJECTS.flatMap((p) => p.tags))];
    const count = (t) => (t === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(t)).length);

    filters.innerHTML = tags
      .map((t) => `<button type="button" class="filter-btn" data-tag="${esc(t)}" aria-pressed="false">${esc(TAG_LABEL[t] || t)}<span class="count">${count(t)}</span></button>`)
      .join("");

    const apply = (tag, push) => {
      if (!tags.includes(tag)) tag = "all";
      $$(".filter-btn", filters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tag === tag)));
      const shown = tag === "all" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(tag));
      list.innerHTML = shown.length
        ? shown.map(projectRow).join("")
        : `<li class="empty-note">No projects with this tag yet.</li>`;
      $("#filter-status").textContent = `Showing ${shown.length} of ${PROJECTS.length} projects`;
      if (push) {
        const url = new URL(location.href);
        tag === "all" ? url.searchParams.delete("tag") : url.searchParams.set("tag", tag);
        history.replaceState(null, "", url);
      }
    };

    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".filter-btn");
      if (b) apply(b.dataset.tag, true);
    });
    apply(new URLSearchParams(location.search).get("tag") || "all", false);
  }

  /* ---------- project detail ---------- */
  if (page === "project") {
    const id = new URLSearchParams(location.search).get("id");
    const i = PROJECTS.findIndex((p) => p.id === id);
    const mount = $("#project");

    if (i === -1) {
      document.title = `Project not found | ${SITE.shortName}`;
      mount.innerHTML = `
        <section class="page-head wrap">
          <a class="back-link" href="projects.html">${ICON.back} All projects</a>
          <h1>No project called “${esc(id || "")}”</h1>
          <p>The link may be old. Every current project is on the projects page.</p>
          <div class="hero-actions"><a class="btn btn-primary" href="projects.html">See all projects</a></div>
        </section>`;
      return;
    }

    const p = PROJECTS[i];
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    document.title = `${p.title} | ${SITE.shortName}`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.tagline);

    const L = p.links || {};
    const actions = [
      L.live && `<a class="btn btn-primary" href="${esc(L.live)}" target="_blank" rel="noopener">Open live site ${ICON.external}</a>`,
      L.repo && `<a class="btn btn-ghost" href="${esc(L.repo)}" target="_blank" rel="noopener">${ICON.github} Source code</a>`,
      L.paper && `<a class="btn btn-ghost" href="${esc(L.paper)}" target="_blank" rel="noopener">Read the paper ${ICON.external}</a>`,
    ].filter(Boolean).join("");

    const block = (title, items, cls = "") =>
      has(items) ? `<section><h2>${esc(title)}</h2><ul class="checklist ${cls}">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>` : "";

    mount.innerHTML = `
      <section class="page-head wrap">
        <a class="back-link" href="projects.html">${ICON.back} All projects</a>
        <div style="margin-bottom:1rem">${statusBadge(p.status)}</div>
        <h1>${esc(p.title)}</h1>
        <p>${esc(p.tagline)}</p>
        ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
        <dl class="detail-meta">
          ${p.role ? `<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>` : ""}
          ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ""}
          ${has(p.stack) ? `<div><dt>Stack</dt><dd>${p.stack.map(esc).join(", ")}</dd></div>` : ""}
        </dl>
      </section>
      <div class="wrap">
        <div class="detail-body">
          ${p.summary ? `<section><h2>Overview</h2><p>${esc(p.summary)}</p></section>` : ""}
          ${block(p.status === "research" ? "What I did" : "What I built", p.built)}
          ${block("How I tested and debugged it", p.tested)}
          ${block("What’s next", p.next, "is-pending")}
        </div>
        ${PROJECTS.length > 1 ? `
        <nav class="detail-nav" aria-label="More projects">
          <a href="project.html?id=${encodeURIComponent(prev.id)}"><small>Previous</small><span>${esc(prev.title)}</span></a>
          <a class="next" href="project.html?id=${encodeURIComponent(next.id)}"><small>Next</small><span>${esc(next.title)}</span></a>
        </nav>` : ""}
      </div>`;
  }

  /* ---------- about ---------- */
  if (page === "about") {
    const papers = $("#research-list");
    if (papers) renderPapers(papers);
    const fill = (sel, arr) => { const el = $(sel); if (el) el.innerHTML = arr.map((x) => `<li>${esc(x)}</li>`).join(""); };
    fill("#coursework", COURSEWORK);
    fill("#extras", EXTRAS);
    const skills = $("#skills");
    if (skills) skills.innerHTML = SKILLS.map((g) => `<li><strong>${esc(g.group)}:</strong> ${g.items.map(esc).join(", ")}</li>`).join("");
  }

  function renderPapers(el) {
    const shown = RESEARCH.filter((r) => !r.hidden && r.title);
    if (!shown.length) { el.closest("section")?.remove(); return; }
    el.innerHTML = shown
      .map((r) => `
        <li class="paper">
          <div>
            <h3>${r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.title)}</a>` : esc(r.title)}</h3>
            <p class="venue">${esc(r.venue)}${r.note ? `, ${esc(r.note.toLowerCase())}` : ""}</p>
          </div>
          <span class="status status-live">${esc(r.status)}</span>
        </li>`)
      .join("");
  }
})();
