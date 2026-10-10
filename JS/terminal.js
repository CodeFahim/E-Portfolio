/* =========================================================
   terminal.js
   The terminal on the home page.
   Part 1: plays a fake test run about you.
   Part 2: lets visitors type commands (help, projects, ...).
   To change the test lines, edit TESTS below.
   ========================================================= */

const TESTS = [
  { name: "builds full-stack web apps", time: 14 },
  { name: "writes requirements before code", time: 9 },
  { name: "tests what he ships", time: 17 },
  { name: "publishes research (IEEE, 2026)", time: 11 },
];

const termScreen = document.getElementById("term-screen");
const commandForm = document.getElementById("term-form");
const commandInput = document.getElementById("term-input");
const rerunButton = document.getElementById("term-rerun");

// If someone turned off animations in system settings, show everything at once
const noAnimation = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let isRunning = false;


/* Helpers ------------------------------------------------- */

// Adds one line to the terminal screen
function printLine(html, extraClass) {
  const line = document.createElement("div");
  line.className = "term-line " + (extraClass || "");
  line.innerHTML = html;
  termScreen.appendChild(line);
  termScreen.scrollTop = termScreen.scrollHeight; // keep the newest line visible
}

// Waits for some milliseconds (used with await)
function wait(ms) {
  if (noAnimation) ms = 0;
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}


/* Part 1: the test run ------------------------------------ */

async function runTests() {
  if (isRunning) return; // don't start twice
  isRunning = true;
  termScreen.innerHTML = "";

  printLine('<span class="green">$</span> npm test fahim');
  await wait(600);
  printLine('<span class="dim">&gt; jest --verbose fahim.spec.js</span>');
  await wait(500);
  printLine(" ");
  printLine('<span class="pass-badge">PASS</span> fahim.spec.js');
  printLine("Fahim", "indent-1");

  for (const test of TESTS) {
    await wait(500);
    printLine(`<span class="green">✓</span> ${test.name} <span class="dim">(${test.time} ms)</span>`, "indent-2");
  }

  await wait(700);
  printLine('<span class="yellow">○ starts an internship</span> <span class="dim">(pending: Jan 2027)</span>', "indent-2");
  await wait(400);
  printLine(" ");
  printLine(`<span class="dim">Tests:</span> <span class="green">${TESTS.length} passed</span>, <span class="yellow">1 pending</span>, ${TESTS.length + 1} total`);
  printLine('<span class="dim">Type</span> help <span class="dim">to explore.</span>');

  isRunning = false;
}


/* Part 2: commands ---------------------------------------- */

function runCommand(text) {
  const words = text.toLowerCase().split(" ");
  const command = words[0];
  const extra = words[1];

  switch (command) {
    case "help":
      printLine('<span class="blue">Commands</span>');
      printLine("  projects   list my projects");
      printLine("  open 1     open project number 1");
      printLine("  skills     what I work with");
      printLine("  research   my papers");
      printLine("  contact    how to reach me");
      printLine("  cv         download my CV");
      printLine("  theme      switch light / dark");
      printLine("  run        run the tests again");
      printLine("  clear      clear the screen");
      break;

    case "projects":
      PROJECTS.forEach(function (project, i) {
        printLine(`  <span class="blue">${i + 1}</span>  ${project.title} <span class="dim">(${project.status})</span>`);
      });
      printLine('<span class="dim">Type</span> open 1 <span class="dim">to read one.</span>');
      break;

    case "open": {
      const project = PROJECTS[Number(extra) - 1];
      if (project) {
        printLine(`<span class="dim">Opening ${project.title}...</span>`);
        window.location.href = "project.html?id=" + project.id;
      } else {
        printLine(`<span class="red">No project number "${extra || ""}".</span> Pick 1 to ${PROJECTS.length}.`);
      }
      break;
    }

    case "skills":
      SKILLS.forEach(function (group) {
        printLine(`  <span class="blue">${group.group}:</span> ${group.items.join(", ")}`);
      });
      break;

    case "research":
      RESEARCH.forEach(function (paper) {
        if (!paper.hidden && paper.title) {
          printLine(`  <span class="green">✓</span> ${paper.title} <span class="dim">(${paper.venue})</span>`);
        }
      });
      break;

    case "contact":
      printLine(`  email     <a href="mailto:${SITE.email}">${SITE.email}</a>`);
      if (SITE.github) printLine(`  github    <a href="${SITE.github}" target="_blank">${SITE.github}</a>`);
      if (SITE.linkedin) printLine(`  linkedin  <a href="${SITE.linkedin}" target="_blank">${SITE.linkedin}</a>`);
      break;

    case "cv":
      if (SITE.cv) {
        printLine('<span class="dim">Opening CV...</span>');
        window.open(SITE.cv);
      } else {
        printLine('<span class="yellow">CV not uploaded yet.</span> Email me and I will send it.');
      }
      break;

    case "theme":
      toggleTheme(); // from main.js
      printLine(`<span class="dim">Theme is now ${getTheme()}.</span>`);
      break;

    case "run":
      runTests();
      break;

    case "clear":
      termScreen.innerHTML = "";
      break;

    case "sudo":
      printLine('<span class="red">Permission denied.</span> <span class="dim">Hire me first.</span>');
      break;

    default:
      printLine(`<span class="red">command not found: ${safe(command)}</span>. Type help to see what works.`);
  }
}

// When the visitor presses Enter
commandForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  const text = commandInput.value.trim();
  commandInput.value = "";
  if (text === "" || isRunning) return;

  printLine(`<span class="green">$</span> ${safe(text)}`);
  runCommand(text);
});

rerunButton.addEventListener("click", runTests);

// Start the test run when the page opens
runTests();
