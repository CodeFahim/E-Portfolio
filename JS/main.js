/* =========================================================
   main.js
   Runs on every page. Content comes from data.js.

   Pattern used everywhere:
   1. find an element by id
   2. build HTML text from data
   3. put it inside the element with innerHTML

   Sections:
   1 Helpers  2 Theme  3 Menu  4 Contact links
   5 Home page  6 Projects page  7 Project page  8 About page
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

// The status pill: Live / In progress / Research
function makeStatus(status) {
  const labels = { "live": "Live", "in-progress": "In progress", "research": "Research" };
  return `<span class="status status-${status}">${labels[status]}</span>`;
}

// One project row (used on home and projects page)
function makeProjectRow(project) {
  return `
    <li class="project-item">
      <a class="project-link" href="project.html?id=${project.id}">
        <h3>${safe(project.title)}</h3>
        <p class="project-desc">${safe(project.tagline)}</p>
        <div class="project-meta">
          ${makeStatus(project.status)}
          <span class="project-stack">${safe(project.stack.slice(0, 4).join(", "))}</span>
        </div>
      </a>
    </li>`;
}

// One research paper card (used on home and about page)
function makePaper(paper) {
  let title = safe(paper.title);
  if (paper.link) {
    title = `<a href="${paper.link}" target="_blank">${title}</a>`;
  }

  let venue = safe(paper.venue);
  if (paper.note) {
    venue += ", " + safe(paper.note.toLowerCase());
  }

  return `
    <li class="paper">
      <div>
        <h3>${title}</h3>
        <p class="paper-venue">${venue}</p>
      </div>
      <span class="status status-live">${safe(paper.status)}</span>
    </li>`;
}

// Shows all papers that are not hidden inside the list with this id
function showPapers(listId) {
  const list = document.getElementById(listId);
  if (!list) return;

  let html = "";
  RESEARCH.forEach(function (paper) {
    if (!paper.hidden && paper.title) {
      html += makePaper(paper);
    }
  });
  list.innerHTML = html;
}


/* 2. THEME (light / dark) --------------------------------- */
// The <head> of each page already set data-theme before the page drew.

function getTheme() {
  return document.documentElement.getAttribute("data-theme");
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme); // remember for next visit
  } catch (error) {
    // storage blocked (private window): theme still works for this visit
  }
}

function toggleTheme() {
  if (getTheme() === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

const themeButton = document.getElementById("theme-btn");
if (themeButton) {
  themeButton.addEventListener("click", toggleTheme);
}


/* 3. MOBILE MENU ------------------------------------------ */

const menuButton = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu after a link is tapped
  navLinks.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", false);
  });
}


/* 4. CONTACT LINKS (filled from SITE in data.js) ---------- */
// An element with class "email-link" gets your email.
// "github-link", "linkedin-link", "cv-link" are removed if empty in data.js.

document.querySelectorAll(".email-link").forEach(function (link) {
  link.href = "mailto:" + SITE.email;
  if (link.textContent.trim() === "") {
    link.textContent = SITE.email;
  }
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

const copyButton = document.getElementById("copy-email");
if (copyButton) {
  copyButton.addEventListener("click", function () {
    const message = document.getElementById("copy-status");
    navigator.clipboard.writeText(SITE.email)
      .then(function () {
        message.textContent = "Email copied.";
      })
      .catch(function () {
        message.textContent = "Copy failed. The address is " + SITE.email;
      });
  });
}

const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


/* Which page are we on? Each <body> has data-page="..." */
const page = document.body.getAttribute("data-page");


/* 5. HOME PAGE -------------------------------------------- */

if (page === "home") {
  // Featured projects
  let html = "";
  PROJECTS.forEach(function (project) {
    if (project.featured) {
      html += makeProjectRow(project);
    }
  });
  document.getElementById("featured-projects").innerHTML = html;

  showPapers("research-list");

  // Highlight the menu link of the section on screen
  const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener("scroll", function () {
    sectionLinks.forEach(function (link) {
      const section = document.querySelector(link.getAttribute("href"));
      const box = section.getBoundingClientRect();
      const onScreen = box.top < window.innerHeight / 2 && box.bottom > window.innerHeight / 2;
      link.classList.toggle("active", onScreen);
    });
  });
}


/* 6. PROJECTS PAGE (with filters) ------------------------- */

if (page === "projects") {
  const filterBox = document.getElementById("filters");
  const projectList = document.getElementById("all-projects");
  const filterNames = ["all", "web", "frontend", "backend", "testing", "research"];

  // Count projects for one filter
  function countProjects(tag) {
    if (tag === "all") return PROJECTS.length;
    return PROJECTS.filter(function (p) { return p.tags.includes(tag); }).length;
  }

  // Make a button for every filter that has at least one project
  let buttons = "";
  filterNames.forEach(function (tag) {
    const count = countProjects(tag);
    if (count > 0) {
      const label = tag.charAt(0).toUpperCase() + tag.slice(1);
      buttons += `<button class="filter-btn" data-tag="${tag}">${label}<span class="filter-count">${count}</span></button>`;
    }
  });
  filterBox.innerHTML = buttons;

  // Show only projects with this tag
  function showProjects(tag) {
    let html = "";
    PROJECTS.forEach(function (project) {
      if (tag === "all" || project.tags.includes(tag)) {
        html += makeProjectRow(project);
      }
    });
    projectList.innerHTML = html;

    // Mark the clicked button as selected
    filterBox.querySelectorAll(".filter-btn").forEach(function (button) {
      const isSelected = button.getAttribute("data-tag") === tag;
      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-pressed", isSelected);
    });
  }

  filterBox.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-btn");
    if (button) {
      showProjects(button.getAttribute("data-tag"));
    }
  });

  // projects.html?tag=web opens with the web filter on
  const startTag = new URLSearchParams(window.location.search).get("tag") || "all";
  showProjects(startTag);
}


/* 7. PROJECT DETAIL PAGE ---------------------------------- */
// project.html?id=pawshome-bd  ->  shows the project with id "pawshome-bd"

if (page === "project") {
  const box = document.getElementById("project");
  const id = new URLSearchParams(window.location.search).get("id");
  const index = PROJECTS.findIndex(function (p) { return p.id === id; });

  if (index === -1) {
    // No project with this id
    box.innerHTML = `
      <section class="page-head wrap">
        <a class="back-link" href="projects.html">← All projects</a>
        <h1>Project not found</h1>
        <p>This link may be old. Every current project is on the projects page.</p>
        <div class="btn-row"><a class="btn btn-primary" href="projects.html">See all projects</a></div>
      </section>`;
  } else {
    const project = PROJECTS[index];
    document.title = project.title + " | " + SITE.shortName;

    // Buttons: live site, code, paper (only the ones that exist)
    let buttons = "";
    if (project.links.live)  buttons += `<a class="btn btn-primary" href="${project.links.live}" target="_blank">Open live site</a>`;
    if (project.links.repo)  buttons += `<a class="btn" href="${project.links.repo}" target="_blank">Source code</a>`;
    if (project.links.paper) buttons += `<a class="btn" href="${project.links.paper}" target="_blank">Read the paper</a>`;

    // A titled list, or nothing if the list is empty
    function makeSection(title, items, extraClass) {
      if (!items || items.length === 0) return "";
      return `
        <section>
          <h2>${title}</h2>
          <ul class="checklist ${extraClass}">${makeListItems(items)}</ul>
        </section>`;
    }

    // Previous and next project (wraps around at the ends)
    const previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
    const next = PROJECTS[(index + 1) % PROJECTS.length];

    box.innerHTML = `
      <section class="page-head wrap">
        <a class="back-link" href="projects.html">← All projects</a>
        <p style="margin-bottom:1rem">${makeStatus(project.status)}</p>
        <h1>${safe(project.title)}</h1>
        <p>${safe(project.tagline)}</p>
        ${buttons ? `<div class="btn-row">${buttons}</div>` : ""}
        <dl class="facts">
          <div><dt>Role</dt><dd>${safe(project.role)}</dd></div>
          <div><dt>Year</dt><dd>${safe(project.year)}</dd></div>
          <div><dt>Stack</dt><dd>${safe(project.stack.join(", "))}</dd></div>
        </dl>
      </section>

      <div class="wrap">
        <div class="project-body">
          <section>
            <h2>Overview</h2>
            <p>${safe(project.summary)}</p>
          </section>
          ${makeSection("What I built", project.built, "")}
          ${makeSection("How I tested and debugged it", project.tested, "")}
          ${makeSection("What’s next", project.next, "todo")}
        </div>

        <nav class="prev-next" aria-label="More projects">
          <a href="project.html?id=${previous.id}"><small>Previous</small><span>${safe(previous.title)}</span></a>
          <a class="next" href="project.html?id=${next.id}"><small>Next</small><span>${safe(next.title)}</span></a>
        </nav>
      </div>`;
  }
}


/* 8. ABOUT PAGE ------------------------------------------- */

if (page === "about") {
  document.getElementById("coursework").innerHTML = makeListItems(COURSEWORK);
  document.getElementById("extras").innerHTML = makeListItems(EXTRAS);

  let skillsHtml = "";
  SKILLS.forEach(function (group) {
    skillsHtml += `<li><strong>${group.group}:</strong> ${safe(group.items.join(", "))}</li>`;
  });
  document.getElementById("skills").innerHTML = skillsHtml;

  showPapers("research-list");
}
