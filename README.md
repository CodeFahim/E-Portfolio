# Fahim's portfolio

Hand-built portfolio in plain HTML, CSS and JavaScript. No framework, no build step.

## Structure

```
index.html      home: hero terminal, selected work, approach, research, contact
projects.html   all projects with filters (?tag=web)
project.html    one template for every case study (?id=pawshome-bd)
about.html      story, education, coursework, skills, research
404.html        GitHub Pages not-found page
CSS/style.css   all styles, light + dark themes
JS/data.js      ALL content: edit this file to update the site
JS/main.js      theme, nav, rendering
JS/terminal.js  interactive test-runner terminal (type "help")
assets/         put cv.pdf and images here
```

## Add a project

Copy one object in `PROJECTS` inside `JS/data.js`, give it a new `id`, fill the fields.
Its card, filter and detail page appear automatically. Empty fields are hidden.

## Run locally

Open the folder in VS Code, right-click `index.html`, then **Open with Live Server**.

## Deploy (GitHub Pages)

Push to a repo named `<username>.github.io`, then the site is live at `https://<username>.github.io`.

## Code rules (follow these when adding code)

1. **One job per file.** HTML = structure, CSS = looks, `data.js` = content, `main.js` = page logic, `terminal.js` = terminal.
2. **Content only in `data.js`.** Never type project text into HTML.
3. **Colors only in section 1 of `style.css`.** Everything else uses `var(--name)`.
4. **One class = one thing.** `.btn`, `.btn-primary`, `.project-row`... no IDs for styling.
5. **JS pattern:** find element by `id` → build HTML string from data → `element.innerHTML = html`.
6. **Plain functions:** `function name() {}` with a comment above saying what it does.
7. **Always pass text through `safe()`** before putting it in HTML.
8. **Phone styles go at the bottom** of `style.css`, in section 13.
