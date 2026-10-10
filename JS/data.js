/* ==========================================================================
   data.js — ALL site content lives here.
   To add a project: copy one object in PROJECTS, change the fields, save.
   Its card, filter tag and detail page (project.html?id=...) appear automatically.
   Empty strings ("") and empty arrays ([]) are hidden on the site, so leave a
   field empty until you have real content. Never ship placeholder text.
   ========================================================================== */

const SITE = {
  name: "Tahsin Ahmed Fahim",          // TODO: confirm full name
  shortName: "Fahim",
  role: "Software Engineering student",
  university: "American International University-Bangladesh (AIUB)",
  location: "Dhaka, Bangladesh",
  availability: "Open to web development and QA internships from January 2027",
  email: "tahsinahmedfahim01611@gmail.com",
  github: "",                         // TODO: "https://github.com/your-username"
  linkedin: "",                       // TODO: "https://www.linkedin.com/in/your-handle"
  cv: "",                             // TODO: put your CV at assets/cv.pdf, then set "assets/cv.pdf"
};

/* status: "live" | "in-progress" | "research"
   tags drive the filters on projects.html: web, backend, frontend, testing, research */
const PROJECTS = [
  {
    id: "pawshome-bd",
    title: "PawsHome BD",
    tagline: "An animal adoption platform for Bangladesh. I built the admin module of the backend.",
    status: "in-progress",
    year: "2026",
    role: "Backend developer, team of students (CSC 4182)",
    tags: ["web", "backend"],
    stack: ["NestJS", "TypeScript", "TypeORM", "JWT", "Nodemailer", "Multer"],
    featured: true,
    links: { live: "", repo: "" },
    summary:
      "PawsHome BD connects people who want to adopt with shelters and owners who need homes for animals. I owned the admin module: authentication, data relationships, email and file uploads.",
    built: [
      "JWT authentication with a custom JwtAuthGuard protecting admin routes",
      "TypeORM entities with one-to-one and one-to-many relationships",
      "DTO validation on every admin endpoint, so bad input is rejected before it reaches the database",
      "Email notifications through a mailer integration",
      "Image uploads with Multer and FileInterceptor",
    ],
    tested: [
      "Traced and fixed 401 errors in the guard, failing email delivery and foreign key constraint violations",
      "Found hardcoded SMTP credentials during review and flagged them as a security issue",
    ],
    next: [
      "Move secrets to environment variables",
      "Add Jest unit tests for the admin service and e2e tests for the auth flow",
      "Deploy the API and a frontend so it can be used live",
    ],
  },
  {
    id: "portfolio",
    title: "This portfolio",
    tagline: "A data-driven, multi-page site in plain HTML, CSS and JavaScript, with no framework.",
    status: "live",
    year: "2026",
    role: "Solo: design and development",
    tags: ["web", "frontend"],
    stack: ["HTML", "CSS", "JavaScript"],
    featured: true,
    links: { live: "", repo: "" },     // TODO: add GitHub Pages URL + repo once deployed
    summary:
      "Every project, paper and skill on this site comes from one data file. Adding a project is one object; its card, filter and detail page are generated from it.",
    built: [
      "One template page renders every project from a URL parameter (project.html?id=...)",
      "An interactive test-runner terminal on the home page that accepts commands",
      "Light and dark themes that follow the system setting and remember your choice",
      "Project filters that sync with the URL, so a filtered view can be shared",
    ],
    tested: [
      "Checked at 360px, 768px and 1440px widths with no horizontal scrolling",
      "Every control works with the keyboard and shows a visible focus ring",
      "Animations switch off when the system asks for reduced motion",
    ],
    next: ["Add Playwright tests that run on every push with GitHub Actions"],
  },
  {
    id: "phishing-url-detection",
    title: "Phishing URL detection",
    tagline: "Comparing 7 machine learning classifiers on about 1.08 million URLs, with explanations for each prediction.",
    status: "research",
    year: "2026",
    role: "Researcher, supervised at AIUB",
    tags: ["research"],
    stack: ["Python", "scikit-learn", "SHAP"],
    featured: true,
    links: { live: "", repo: "", paper: "" },
    summary:
      "Phishing links are the front door for most account takeovers. This study trains and compares 7 classifiers on a dataset of roughly 1.08 million URLs to find which features actually give a phishing link away.",
    built: [
      "Trained and compared 7 classifiers; Random Forest performed best",
      "Used SHAP to show which URL features drove each prediction",
      "Used McNemar's test to check whether differences between models were statistically significant",
    ],
    tested: [],
    next: ["Turn the model into a small web app where you can paste a URL and see the verdict"],
  },
];

/* Research shown on the home page and the about page.
   Set hidden: false once you fill in the real title and link. */
const RESEARCH = [
  {
    title: "Explainability and Calibration of Stroke Risk Prediction Models Based On AI",
    venue: "IEEE COMPAS 2026, University of Dhaka",
    year: "2026",
    status: "Accepted",
    note: "Co-author",
    link: "",
    hidden: false,
  },
  {
    title: "",                         // TODO: paper title
    venue: "IEEE QPAIN 2026",
    year: "2026",
    status: "Accepted",
    note: "",
    link: "",
    hidden: true,
  },
  {
    title: "",                         // TODO: paper title
    venue: "IEEE SPICSCON 2026",
    year: "2026",
    status: "Accepted",
    note: "",
    link: "",
    hidden: true,
  },
];

const SKILLS = [
  { group: "Build", items: ["HTML", "CSS", "JavaScript", "TypeScript", "NestJS", "REST APIs", "TypeORM"] },
  { group: "Specify", items: ["Requirements elicitation", "Use cases", "SRS documents"] },
  { group: "Test", items: ["Test case design", "Debugging", "Code review"] },
  { group: "Also", items: ["C++", "Python", "Git", "scikit-learn"] },
];

const COURSEWORK = [
  "Advanced Web Technologies",
  "Software Quality and Testing",
  "Software Requirements Engineering",
];

const EXTRAS = [
  "Competitive programming in C++ (ICPC)",
];
