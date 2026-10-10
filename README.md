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
