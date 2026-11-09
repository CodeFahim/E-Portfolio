# Tahsin Ahmed Fahim — Portfolio

Personal portfolio of Tahsin Ahmed Fahim, Backend & Full-Stack Software Engineer.
Hand-built in plain HTML, CSS and JavaScript. No framework, no build step.

Live: https://codefahim.github.io/E-Portfolio/

## Structure

```
index.html      home: hero, about, skills, projects, research, education, contact
projects.html   all projects with filters (?area=web)
project.html    one template for every project (?id=pawshome-bd)
paper.html      one template for every paper (?id=stroke-risk-prediction)
about.html      redirects to index.html#about (old links keep working)
404.html        GitHub Pages not-found page
CSS/style.css   all styles (dark theme, colors in section 1)
JS/data.js      ALL content: edit this file to update the site
JS/main.js      rendering, menu, scroll animations, contact form
JS/terminal.js  hero terminal (shown until a photo is added)
assets/         screenshots, icons, link-preview image, CV, photo
sitemap.xml, robots.txt   for search engines
```

## Update content

Everything is in `JS/data.js`. Search for `TODO` to find what's missing.
- Empty fields ("" or []) are hidden on the site, so never type placeholder text.
- `draft: true` hides a project, paper or school until it's filled in.
- Photo: put it in `assets/photo.jpg`, then set `photo: "assets/photo.jpg"` in SITE. It replaces the terminal in the hero.
- CV: put it in `assets/cv.pdf`, then set `cv: "assets/cv.pdf"`. The Download CV buttons appear automatically.

## Code rules

1. One job per file. HTML = structure, CSS = looks, data.js = content, main.js = logic.
2. Content only in data.js, never typed into HTML.
3. Colors only in section 1 of style.css; everything else uses `var(--name)`.
4. JS pattern: find element by id → build HTML string from data → `innerHTML`.
5. Plain functions with a comment above each.
6. Always pass text through `safe()` before putting it in HTML.

## Run locally

Open the folder in VS Code, right-click `index.html`, then **Open with Live Server**.

## Deploy

```
git add .
git commit -m "Update portfolio"
git push
```
GitHub Pages republishes in about a minute.
