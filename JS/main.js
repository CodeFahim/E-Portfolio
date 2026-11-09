/* =========================================================
   main.js
   Runs on every page. Content comes from data.js.

   Pattern used everywhere:
   1. find an element by id
   2. build HTML text from data
   3. put it inside the element with innerHTML

   Sections:
   1 Helpers  2 Icons  3 Builders  4 Header + menu
   5 Contact links  6 Reveal on scroll
   7 Home  8 Projects page  9 Project page  10 Paper page
   11 Contact form
   ========================================================= */


/* 1. HELPERS ---------------------------------------------- */

// Makes text safe to put inside HTML (stops code injection / XSS)
function safe(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Turns an array of strings into <li> items
function makeListItems(items) {
  let html = "";
  items.forEach(function (item) {
    html += "<li>" + safe(item) + "</li>";
  });
  return html;
}

// Turns an array of strings into a row of small tags
function makeTags(items) {
  if (!items || items.length === 0) return "";
  return `<ul class="tags">${makeListItems(items)}</ul>`;
}

// Only items that are not drafts
function notDraft(item) {
  return !item.draft;
}

function visibleProjects() {
  return PROJECTS.filter(notDraft);
}

function visiblePapers() {
  return RESEARCH.filter(notDraft);
}

// Puts html inside the element with this id (if it exists on this page)
function fill(id, html) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
}

// Reads ?id=... (or any other name) from the address bar
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}


/* 2. ICONS (small inline SVGs) ---------------------------- */

const ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};


/* 3. BUILDERS: data -> HTML ------------------------------- */

// Status pill: "In progress" -> class "status-in-progress"
function makeStatus(status) {
  const className = status.toLowerCase().replace(" ", "-");
  return `<span class="status status-${className}">${safe(status)}</span>`;
}

// Links under a project: details, GitHub, live demo (only real ones)
function makeProjectLinks(project) {
  let html = `<a href="project.html?id=${project.id}">View Details ${ICONS.arrow}</a>`;
  if (project.links.repo) {
    html += `<a href="${project.links.repo}" target="_blank" rel="noopener">${ICONS.github} GitHub</a>`;
  }
  if (project.links.live) {
    html += `<a href="${project.links.live}" target="_blank" rel="noopener">${ICONS.external} Live Demo</a>`;
  }
  return html;
}

// One project card. size: "wide" | "normal" | "compact"
function makeProjectCard(project, size) {
  const url = "project.html?id=" + project.id;

  let image = "";
  if (project.image) {
    image = `
      <a class="project-img" href="${url}" tabindex="-1" aria-hidden="true">
        <img src="${project.image}" alt="" loading="lazy">
      </a>`;
  }

  return `
    <article class="project-card ${size}">
      ${image}
      <div class="project-body">
        <div class="project-top">
          <span class="project-category">${safe(project.category)}</span>
          ${makeStatus(project.status)}
        </div>
        <h3><a href="${url}">${safe(project.title)}</a></h3>
        <p class="project-desc">${safe(project.tagline)}</p>
        ${makeTags(project.stack)}
        <div class="card-links">${makeProjectLinks(project)}</div>
      </div>
    </article>`;
}

// One research card
function makePaperCard(paper) {
  const url = "paper.html?id=" + paper.id;

  let readButton = "";
  if (paper.link) {
    readButton = `<a href="${paper.link}" target="_blank" rel="noopener">${ICONS.external} Read Paper</a>`;
  }

  return `
    <article class="paper-card">
      <div class="paper-top">
        <p class="paper-venue"><strong>${safe(paper.conference)}</strong>${safe(paper.place)}</p>
        ${makeStatus(paper.status)}
      </div>
      <h3><a href="${url}">${safe(paper.title)}</a></h3>
      ${paper.authors ? `<p class="paper-authors">${safe(paper.authors)}</p>` : ""}
      ${makeTags(paper.areas)}
      <div class="card-links">
        <a href="${url}">Details ${ICONS.arrow}</a>
        ${readButton}
      </div>
    </article>`;
}

// Primary stack: one card per group, logo + name per item
function makeSkillGroups() {
  let html = "";
  SKILLS.primary.forEach(function (group) {
    let items = "";
    group.items.forEach(function (item) {
      let icon = '<span class="skill-icon-empty" aria-hidden="true"></span>';
      if (item.icon) {
        icon = `<img class="skill-icon" src="assets/icons/${item.icon}.svg" alt="" aria-hidden="true">`;
      }
      items += `<li class="skill-item">${icon}${safe(item.name)}</li>`;
    });
    html += `
      <div class="skill-group">
        <h3>${safe(group.group)}</h3>
        <ul class="skill-list">${items}</ul>
      </div>`;
  });
  return html;
}

// Education card (one university)
function makeEducation() {
  const e = EDUCATION;
  return `
    <div class="edu-card">
      <div class="edu-head">
        <h3>${safe(e.school)}</h3>
        <span class="edu-pill">${safe(e.short)}</span>
      </div>
      <p class="edu-degree">${safe(e.degree)}</p>
      <div class="edu-meta">
        <span class="edu-program">${safe(e.program)}</span>
        <span class="edu-status">${safe(e.status)}</span>
      </div>
      <p class="edu-text">${safe(e.text)}</p>
      <p class="edu-label">Key Relevant Coursework</p>
      ${makeTags(e.coursework)}
    </div>`;
}

// Achievements list
function makeAchievements() {
  let html = "";
  ACHIEVEMENTS.forEach(function (item) {
    html += `
      <li>
        <strong>${safe(item.title)}</strong>
        <span>${safe(item.result)}, ${safe(item.place)}</span>
      </li>`;
  });
  return html;
}

// Research focus cards
function makeFocusCards() {
  let html = "";
  RESEARCH_FOCUS.forEach(function (item) {
    html += `<li class="focus-card"><h4>${safe(item.title)}</h4><p>${safe(item.text)}</p></li>`;
  });
  return html;
}

// A titled section for detail pages: paragraph or list, or nothing if empty
function makeDetailSection(title, content, listClass) {
  if (!content || content.length === 0) return "";
  if (typeof content === "string") {
    return `<section><h2>${title}</h2><p>${safe(content)}</p></section>`;
  }
  return `<section><h2>${title}</h2><ul class="checklist ${listClass || ""}">${makeListItems(content)}</ul></section>`;
}

// One row in a facts sidebar, or nothing if empty
function makeFact(label, value) {
  if (!value) return "";
  return `<div><dt>${label}</dt><dd>${safe(value)}</dd></div>`;
}


/* 4. HEADER + MOBILE MENU --------------------------------- */

const header = document.querySelector(".site-header");

// Blurred background once the page has scrolled a little
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", updateHeader);
updateHeader();

const menuButton = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuButton.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

// Close the menu after a link is tapped, or when Escape is pressed
navLinks.addEventListener("click", function () {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", false);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", false);
  }
});


/* 5. CONTACT LINKS (filled from SITE in data.js) ---------- */
// "email-link" gets a mailto link; "email-text" shows the address.
// "github-link", "linkedin-link", "cv-link" are removed if empty in data.js.

document.querySelectorAll(".email-link").forEach(function (link) {
  link.href = "mailto:" + SITE.email;
});

document.querySelectorAll(".email-text").forEach(function (element) {
  element.textContent = SITE.email;
});

function fillOrRemove(className, url) {
  document.querySelectorAll("." + className).forEach(function (link) {
    if (url) {
      link.href = url;
    } else {
      link.remove();
    }
  });
}

fillOrRemove("github-link", SITE.github);
fillOrRemove("linkedin-link", SITE.linkedin);
fillOrRemove("cv-link", SITE.cv);
fillOrRemove("whatsapp-link", SITE.whatsapp);
fillOrRemove("facebook-link", SITE.facebook);

document.querySelectorAll(".phone-text").forEach(function (element) {
  element.textContent = SITE.phone;
});

const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* 6. REVEAL ON SCROLL ------------------------------------- */
// Elements with class "reveal" fade in once, the first time they appear.

function startReveal() {
  const elements = document.querySelectorAll(".reveal");

  // Old browsers: just show everything
  if (!("IntersectionObserver" in window)) {
    elements.forEach(function (el) { el.classList.add("visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);   // only once
      }
    });
  }, { threshold: 0.05 });

  elements.forEach(function (el) { observer.observe(el); });
}


/* Which page are we on? Each <body> has data-page="..." */
const page = document.body.getAttribute("data-page");


/* 7. HOME PAGE -------------------------------------------- */

if (page === "home") {
  // Hero photo: your picture if SITE.photo is set, otherwise your initials
  if (SITE.photo) {
    fill("portrait", `<img src="${SITE.photo}" alt="Portrait of ${safe(SITE.name)}">`);
  } else {
    fill("portrait", `<div class="portrait-empty" aria-hidden="true">TAF</div>`);
  }

  // Skills
  fill("skill-groups", makeSkillGroups());
  fill("skill-languages", makeTags(SKILLS.languages));
  fill("skill-other", makeTags(SKILLS.other));
  fill("skill-concepts", makeTags(SKILLS.concepts));

  // Projects: first one wide, next two normal, the rest compact
  let projectsHtml = "";
  visibleProjects().forEach(function (project, index) {
    let size = "compact";
    if (index === 0) size = "wide";
    else if (index < 3) size = "normal";
    projectsHtml += makeProjectCard(project, size);
  });
  fill("project-grid", projectsHtml);

  // Research
  let papersHtml = "";
  visiblePapers().forEach(function (paper) {
    papersHtml += makePaperCard(paper);
  });
  fill("paper-grid", papersHtml);
  fill("focus-grid", makeFocusCards());

  // Education + achievements
  fill("education-list", makeEducation());
  fill("achievement-list", makeAchievements());

  // Highlight the menu link of the section on screen
  const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    sectionLinks.forEach(function (link) {
      const section = document.querySelector(link.getAttribute("href"));
      if (!section) return;
      const box = section.getBoundingClientRect();
      const onScreen = box.top < window.innerHeight / 2 && box.bottom > window.innerHeight / 2;
      link.classList.toggle("active", onScreen);
    });
  }
  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();
}


/* 8. PROJECTS PAGE (with filters) ------------------------- */

if (page === "projects") {
  const filterBox = document.getElementById("filters");
  const projectGrid = document.getElementById("all-projects");
  const areaNames = { all: "All", web: "Web", desktop: "Desktop", graphics: "Graphics" };
  const projects = visibleProjects();

  // Count projects in one area
  function countProjects(area) {
    if (area === "all") return projects.length;
    return projects.filter(function (p) { return p.area === area; }).length;
  }

  // A button for every area that has at least one project
  let buttons = "";
  Object.keys(areaNames).forEach(function (area) {
    const count = countProjects(area);
    if (count > 0) {
      buttons += `<button class="filter-btn" type="button" data-area="${area}">${areaNames[area]}<span class="filter-count">${count}</span></button>`;
    }
  });
  filterBox.innerHTML = buttons;

  // Show only projects in this area
  function showProjects(area) {
    let html = "";
    projects.forEach(function (project) {
      if (area === "all" || project.area === area) {
        html += makeProjectCard(project, "normal");
      }
    });
    projectGrid.innerHTML = html;

    // Mark the clicked button as selected
    filterBox.querySelectorAll(".filter-btn").forEach(function (button) {
      const isSelected = button.getAttribute("data-area") === area;
      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-pressed", isSelected);
    });
  }

  filterBox.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (button) {
      showProjects(button.getAttribute("data-area"));
    }
  });

  // projects.html?area=web opens with the web filter on
  showProjects(getParam("area") || "all");
}


/* 9. PROJECT DETAIL PAGE ---------------------------------- */
// project.html?id=pawshome-bd  ->  shows the project with id "pawshome-bd"

if (page === "project") {
  const projects = visibleProjects();
  const project = projects.find(function (p) { return p.id === getParam("id"); });

  if (!project) {
    fill("detail", `
      <section class="page-head wrap">
        <a class="back-link" href="projects.html">← All Projects</a>
        <h1>Project Not Found</h1>
        <p>This link may be old. Every current project is on the projects page.</p>
        <div class="btn-row" style="margin-top:2rem"><a class="btn btn-primary" href="projects.html">See All Projects</a></div>
      </section>`);
  } else {
    document.title = project.title + " | " + SITE.name;

    // Buttons: GitHub and live demo, only when they exist
    let buttons = "";
    if (project.links.repo) buttons += `<a class="btn" href="${project.links.repo}" target="_blank" rel="noopener">${ICONS.github} GitHub</a>`;
    if (project.links.live) buttons += `<a class="btn btn-primary" href="${project.links.live}" target="_blank" rel="noopener">Live Demo</a>`;

    // Related projects: same area first, then the others, 2 in total
    const others = projects.filter(function (p) { return p.id !== project.id; });
    const sameArea = others.filter(function (p) { return p.area === project.area; });
    const otherArea = others.filter(function (p) { return p.area !== project.area; });
    const related = sameArea.concat(otherArea).slice(0, 2);

    let relatedHtml = "";
    related.forEach(function (p) {
      relatedHtml += makeProjectCard(p, "normal");
    });

    fill("detail", `
      <section class="page-head wrap">
        <a class="back-link" href="projects.html">← All Projects</a>
        <div class="detail-label">
          <span class="project-category">${safe(project.category)}</span>
          ${makeStatus(project.status)}
        </div>
        <h1>${safe(project.title)}</h1>
        <p>${safe(project.tagline)}</p>
      </section>

      <div class="wrap">
        ${project.image ? `<div class="detail-image"><img src="${project.image}" alt="Screenshot of ${safe(project.title)}"></div>` : ""}

        <div class="detail-grid">
          <div class="detail-main">
            ${makeDetailSection("Overview", project.overview)}
            ${makeDetailSection("The Problem", project.problem)}
            ${makeDetailSection("Key Features", project.features)}
            ${makeDetailSection("Architecture & Implementation", project.architecture)}
            ${makeDetailSection("Database", project.database)}
            ${makeDetailSection("Challenges & Solutions", project.challenges)}
            ${makeDetailSection("My Contribution", project.contribution)}
            ${makeDetailSection("Future Improvements", project.next, "todo")}
          </div>

          <aside class="facts-card">
            <dl>
              ${makeFact("Category", project.category)}
              ${makeFact("Course", project.course)}
              ${makeFact("Role", project.role)}
              ${makeFact("Year", project.year)}
              ${makeFact("Technologies", project.stack.join(", "))}
            </dl>
            ${buttons ? `<div class="btn-row">${buttons}</div>` : ""}
          </aside>
        </div>
      </div>

      ${relatedHtml ? `
      <section class="related">
        <div class="wrap">
          <h2 class="sub-title">Related Projects</h2>
          <div class="project-grid">${relatedHtml}</div>
        </div>
      </section>` : ""}`);
  }
}


/* 10. PAPER DETAIL PAGE ----------------------------------- */
// paper.html?id=phishing-url-detection

if (page === "paper") {
  const papers = visiblePapers();
  const paper = papers.find(function (p) { return p.id === getParam("id"); });

  if (!paper) {
    fill("detail", `
      <section class="page-head wrap">
        <a class="back-link" href="index.html#research">← Research</a>
        <h1>Paper Not Found</h1>
        <p>This link may be old. All papers are in the research section.</p>
        <div class="btn-row" style="margin-top:2rem"><a class="btn btn-primary" href="index.html#research">See Research</a></div>
      </section>`);
  } else {
    document.title = paper.title + " | " + SITE.name;

    let readButton = "";
    if (paper.link) {
      readButton = `<div class="btn-row"><a class="btn btn-primary" href="${paper.link}" target="_blank" rel="noopener">${ICONS.external} Read on IEEE Xplore</a></div>`;
    }

    let otherHtml = "";
    papers.forEach(function (p) {
      if (p.id !== paper.id) otherHtml += makePaperCard(p);
    });

    fill("detail", `
      <section class="page-head wrap">
        <a class="back-link" href="index.html#research">← Research</a>
        <div class="detail-label">
          <span class="project-category">${safe(paper.conference)}, ${safe(paper.place)}</span>
          ${makeStatus(paper.status)}
        </div>
        <h1>${safe(paper.title)}</h1>
      </section>

      <div class="wrap">
        <div class="detail-grid">
          <div class="detail-main">
            ${makeDetailSection("Summary", paper.summary)}
            ${makeDetailSection("Authors", paper.authors)}
            ${paper.areas.length ? `<section><h2>Research Areas</h2>${makeTags(paper.areas)}</section>` : ""}
          </div>

          <aside class="facts-card">
            <dl>
              ${makeFact("Conference", paper.fullName)}
              ${makeFact("Location", paper.place)}
              ${makeFact("Year", paper.year)}
              ${makeFact("Status", paper.status)}
              ${makeFact("My Role", paper.contribution)}
              ${makeFact("DOI", paper.doi)}
            </dl>
            ${readButton}
          </aside>
        </div>
      </div>

      ${otherHtml ? `
      <section class="related">
        <div class="wrap">
          <h2 class="sub-title">Other Papers</h2>
          <div class="paper-grid">${otherHtml}</div>
        </div>
      </section>` : ""}`);
  }
}


/* 11. CONTACT FORM ---------------------------------------- */
// There is no server, so the form checks the fields and then opens the
// visitor's email app with the message already written. Nothing is faked.

const form = document.getElementById("contact-form");

if (form) {
  const status = document.getElementById("form-status");

  // Shows or clears the error under one field
  function setError(fieldName, message) {
    const input = form.elements[fieldName];
    const box = input.closest(".field");
    box.classList.toggle("has-error", message !== "");
    box.querySelector(".field-error").textContent = message;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the page from reloading

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();

    // Spam trap: real people never see or fill this field
    if (form.elements.website.value !== "") return;

    // Check every field
    let ok = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }
    else setError("name", "");

    if (!emailPattern.test(email)) { setError("email", "Please enter a valid email address."); ok = false; }
    else setError("email", "");

    if (subject.length < 2) { setError("subject", "Please add a subject."); ok = false; }
    else setError("subject", "");

    if (message.length < 10) { setError("message", "Please write at least 10 characters."); ok = false; }
    else setError("message", "");

    if (!ok) {
      status.className = "form-status error";
      status.textContent = "Some fields need fixing before the message can be sent.";
      return;
    }

    // Open the email app with everything filled in
    const body = message + "\n\n" + name + "\n" + email;
    window.location.href = "mailto:" + SITE.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.className = "form-status success";
    status.textContent = "Your email app should open with the message ready to send. If it didn't, email me at " + SITE.email + ".";
  });
}


/* Start the scroll animations last, after all content is on the page */
startReveal();
