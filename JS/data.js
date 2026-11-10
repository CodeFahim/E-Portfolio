/* =========================================================
   data.js — ALL site content lives here.

   Rules:
   - Only write things you have actually done and can explain.
   - Empty text ("") or empty lists ([]) are hidden on the site.
   - draft: true hides an item everywhere until you fill it in.
   - Search for "TODO" to find everything still missing.
   ========================================================= */

const SITE = {
  name: "Tahsin Ahmed Fahim",
  wordmark: "TAHSIN",
  title: "Aspiring Software Engineer · Web Developer · AI/ML Research Enthusiast",
  badge: "Open for Software Engineering Internships & Research Collaborations",
  university: "American International University-Bangladesh (AIUB)",
  location: "Hemayetpur, Savar, Bangladesh",
  email: "tahsinahmedfahim01611@gmail.com",
  phone: "+880 1611-474583",
  whatsapp: "https://wa.me/8801611474583",
  facebook: "https://www.facebook.com/share/1E7g4z1SqD/",
  github: "https://github.com/CodeFahim",
  linkedin: "",   // TODO: "https://www.linkedin.com/in/your-handle"
  cv: "assets/cv/Tahsin_Ahmed_Fahim_CV.pdf",   // put your CV there with this exact name; the buttons appear by themselves
  photo: "assets/Photo.png",      // TODO: put your photo in assets/photo.jpg, then write "assets/photo.jpg"
};


/* ---------------------------------------------------------
   SKILLS
   icon: file name in assets/icons (without .svg), or "" for none
   --------------------------------------------------------- */
const SKILLS = {
  primary: [
    {
      group: "Frontend",
      items: [
        { name: "Next.js", icon: "nextdotjs" },
        { name: "React", icon: "react" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "TypeScript", icon: "typescript" },
        { name: "JavaScript", icon: "javascript" },
      ],
    },
    {
      group: "Backend",
      items: [
        { name: "NestJS", icon: "nestjs" },
        { name: "Node.js", icon: "nodedotjs" },
        { name: "REST APIs", icon: "" },
        { name: "PHP", icon: "php" },
      ],
    },
    {
      group: "Database",
      items: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MySQL", icon: "mysql" },
        { name: "TypeORM", icon: "typeorm" },
      ],
    },
  ],
  languages: ["C++", "C#", "Java", "Python"],
  other: [".NET", "Git", "GitHub"],
  concepts: [
    "Object-Oriented Programming",
    "Database Design",
    "Authentication and Authorization",
    "MVC Architecture",
    "API Development",
    "Software Engineering",
  ],
};


/* ---------------------------------------------------------
   PROJECTS (5)
   The first 3 are shown big on the home page.
   area: drives the filter buttons ("web" | "desktop" | "graphics")
   --------------------------------------------------------- */
const PROJECTS = [
  {
    id: "pawshome-bd",
    draft: false,
    title: "PawsHome BD",
    category: "Full-Stack Web Development",
    course: "Advanced Web Technology",
    area: "web",
    tagline:
      "A multi-role pet adoption management platform that connects pet adopters, pet listers, veterinarians and administrators through a structured management system.",
    stack: ["NestJS", "Next.js", "TypeScript", "TypeORM", "PostgreSQL", "JWT"],
    status: "Completed",
    year: "2026",
    role: "Full-stack developer",
    links: { live: "", repo: "https://github.com/CodeFahim/Paws_Home_BD" },
    image: "assets/pawshome.webp",
    overview:
      "PawsHome BD is a pet adoption platform where listers post pets, admins approve them, adopters find them a new home, and vets look after them. The backend is built with NestJS and PostgreSQL, and the frontend with Next.js.",
    problem: "",                     // TODO: 1-2 sentences on the problem it solves
    features: [
      "Four roles (admins, pet listers, adopters and veterinarians), each with its own sign-up, JWT login, dashboard and navigation",
      "Passwords hashed with bcrypt for every role",
      "Pet listers add pets with photos, see their own listings and remove them",
      "Admins review pending pets and approve, reject or mark them as adopted",
      "Adopters only see pets the admin has approved",
      "Admin dashboard with live counts of users, pets, adoptions and pending approvals",
      "Links between roles: admins assign listers, adopters connect with listers and vets, vets manage their adopters",
      "Profile management for every role: edit details, upload a profile photo, activate or deactivate accounts",
      "Search for listers and vets by name",
      "Welcome emails sent to new users",
    ],
    architecture: [
      "74 REST API endpoints across four NestJS modules (Admin, Pet Lister, Adopter, Vet), with controllers for routes and services for business logic",
      "Next.js frontend with 41 pages, a separate dashboard and navigation for each role",
      "REST API secured with JWT and a custom JwtAuthGuard on protected routes",
      "DTO validation rejects bad input before it reaches the database",
      "Email notifications through a mailer integration, and image uploads with Multer",
    ],
    database: [
      "PostgreSQL database accessed through TypeORM entities",
      "Entities linked with one-to-one and one-to-many relationships",
    ],
    challenges: [
      "Debugged and fixed 401 errors coming from the auth guard",
      "Debugged failing email delivery and foreign key constraint violations",
      "Found hardcoded SMTP credentials in the code and marked them to be moved into environment variables",
    ],
    contribution: [],
    next: [
      "Move secrets to environment variables",
      "Add unit tests for the admin service and end-to-end tests for the auth flow",
      "Deploy the API so the project can be used live",
    ],
  },

  {
    id: "cafe-la-vien",
    draft: false,
    title: "Cafe La Vien",
    category: "Desktop Application Development",
    course: "C#",
    area: "desktop",
    tagline:
      "A cafe management desktop app where admins manage users, the menu and sales records, and cashiers take orders and generate invoices.",
    stack: ["C#", "Windows Forms", "SQL Server"],
    status: "Completed",
    year: "",                        // TODO
    role: "Desktop application developer",
    links: { live: "", repo: "https://github.com/CodeFahim/Cafe_La_vien" },
    image: "assets/cafe-la-vie.webp",
    overview:
      "A cafe management system built for my C# course with Windows Forms and SQL Server. It has two kinds of users: admins run the cafe's data, and cashiers handle orders at the counter.",
    problem: "",                     // TODO: 1-2 sentences
    features: [
      "Login screen that opens the Admin or Cashier panel based on the user's role, with a show-password option",
      "Admins add, update and remove users (Admin or Cashier) with auto-generated IDs",
      "Admins add, update and remove menu items with price and stock quantity; double-click a row to edit it",
      "Sales history for admins and cashiers, with a filter by month",
      "Cashiers search the menu as they type, add items to a cart, change quantities and clear the cart",
      "Stock check stops a cashier from selling more than is available",
      "Bill summary with 1.5% VAT and an optional discount",
      "Confirming an order saves every sale and generates a sales invoice with date, items and totals",
      "Profile page for every user",
    ],
    architecture: [
      "Separate Windows Forms for login, admin panel, cashier panel, user management, menu management, ordering, sales history and profile",
      "A shared DataAccess class handles the SQL Server connection and every query",
    ],
    database: [
      "SQL Server database with 5 tables: LogIn, UserTable, MenuTable, OrderTable and SellTable",
    ],
    challenges: [],
    contribution: [],
    next: [
      "Replace string-built SQL with parameterized queries to prevent SQL injection",
      "Store passwords as hashes instead of plain text",
    ],
  },

  {
    id: "travel-management-system",
    draft: false,
    title: "Travel Management System",
    category: "Web Application Development",
    course: "Web Technology",
    area: "web",
    tagline:
      "A travel guide web app where scouts submit destinations, admins approve them, and users browse, search, save and plan trips.",
    stack: ["PHP", "MySQL", "JavaScript (AJAX)", "HTML", "CSS", "MVC"],
    status: "Completed",
    year: "",                        // TODO
    role: "Full-stack developer",
    links: { live: "", repo: "https://github.com/CodeFahim/Travel_Management" },
    image: "assets/travel-guide.webp",
    overview:
      "A travel guide web application built in PHP using the MVC pattern, with a MySQL database. Scouts add destinations, admins review them, and travellers explore the approved ones.",
    problem: "",                     // TODO
    features: [
      "Three roles (admin, scout, user); new accounts must be verified by an admin before they can use their role",
      "Scouts submit destinations with photos and can request edits to published ones; every submission waits for admin approval",
      "Admins approve or reject submissions with a reason, and manage users, posts, cost estimates and comments",
      "Live AJAX search, plus filters by country, genre (beach, mountain, city, historical, nature) and cost level",
      "Users save destinations to a wishlist and comment on them",
      "Trip cost estimator based on a cost per person per week set by the admin",
      "Profile page with photo upload and password change",
      "Login with a Remember Me option using a secure token cookie",
    ],
    architecture: [
      "MVC structure: models for data, controllers for logic, views for pages",
      "One front controller (index.php) routes 11 pages and 10 AJAX actions",
      "Security: CSRF tokens on forms, prepared statements for database queries, hashed passwords (password_hash) and a new session ID on login",
      "Server-side validation of every form and AJAX input",
    ],
    database: [
      "6 MySQL tables: users, posts, post_requests, wishlist, comments and cost_estimates, linked with foreign keys",
      "Scout submissions are stored as JSON in post_requests until an admin approves them",
      "A unique key stops the same destination being added to a wishlist twice",
    ],
    challenges: [],
    contribution: [],
    next: [],
  },

  {
    id: "bank-management-system",
    draft: false,
    title: "Bank Management System",
    category: "Application Development",
    course: "Java",
    area: "desktop",
    tagline:
      "A Java banking application for deposits, withdrawals and transfers between accounts, with a full transaction history.",
    stack: ["Java"],                 // TODO: add the UI library / storage you used
    status: "Completed",
    year: "",                        // TODO
    role: "",                        // TODO
    links: { live: "", repo: "" },
    image: "assets/bank-system.webp",
    overview: "",                    // TODO
    problem: "",
    features: [
      "Deposits, withdrawals and transfers between accounts",
      "Transaction history with IDs, dates, amounts, senders and receivers",
      "Live account balance shown in taka",
    ],
    architecture: [],                // TODO: e.g. the main classes and how they work together
    database: [],
    challenges: [],
    contribution: [],
    next: [],
  },

  {
    id: "rural-village-life-in-winter",
    draft: false,
    title: "A Day in Winter: Rural Village Life",
    category: "Computer Graphics",
    course: "Computer Graphics",
    area: "graphics",
    tagline: "An animated OpenGL scene of a winter day in a rural Bangladeshi village, from the village houses to the busy market.",
    stack: ["C++", "OpenGL", "GLUT"],
    status: "Completed",
    year: "",                        // TODO
    role: "",                        // TODO
    links: { live: "", repo: "https://github.com/CodeFahim/Graphics-Project" },
    image: "",                       // TODO: screenshot, e.g. "assets/village.webp"
    overview:
      "A computer graphics project in C++ with OpenGL and GLUT that shows a winter day in a rural Bangladeshi village across several animated scenes.",
    problem: "",
    features: [
      "Four scenes, switched from a menu or the keyboard, with an automatic scene timer",
      "Village houses, trees, a boat and a fireplace",
      "A village market with a tea shop, cloth shop and sellers of balloons, pottery, sweets and fruit",
      "Animated people and vehicles, including a pitha van",
    ],
    architecture: [
      "Every object is its own drawing function built from OpenGL primitives (for example drawBoat, drawTeaShop)",
      "A GLUT timer updates positions for the animation; keyboard input switches scenes",
    ],
    database: [],
    challenges: [],
    contribution: [],
    next: [],
  },
];


/* ---------------------------------------------------------
   RESEARCH FOCUS (short cards above the papers)
   --------------------------------------------------------- */
const RESEARCH_FOCUS = [
  {
    title: "Phishing URL Detection",
    text: "Comparing machine learning models on 1,082,664 URLs from eight public sources to find what gives a phishing link away.",
  },
  {
    title: "Explainable AI (SHAP)",
    text: "Using SHAP to show which features drive each prediction, so a model's decisions can be checked and trusted.",
  },
  {
    title: "Healthcare Risk Prediction",
    text: "Predicting stroke risk with Logistic Regression, Random Forest, XGBoost and SVM on imbalanced clinical data.",
  },
  {
    title: "Model Calibration",
    text: "Making predicted probabilities reliable with Platt scaling and isotonic regression, not just accurate.",
  },
  {
    title: "Agentic AI Adoption",
    text: "A predictive framework for balancing autonomy and human oversight when organizations adopt agentic AI.",
  },
];


/* ---------------------------------------------------------
   RESEARCH & PUBLICATIONS (3 papers)
   status: "Published" only when it is on IEEE Xplore.
   --------------------------------------------------------- */
const RESEARCH = [
  {
    id: "phishing-url-detection",
    draft: false,
    conference: "IEEE ICACT 2026",
    fullName: "International Conference on Advanced Computing Technologies",
    place: "Kathmandu, Nepal",
    year: "2026",
    title:
      "Phishing URL Detection Using Machine Learning: A Comparative Study with SHAP Based Explainability on a Large-Scale Multi-Source Dataset",
    authors: "T. A. Fahim, F. Mahmud, S. J. Snegdha, R. A. M. Rudro, T. Sayeed, and K. Nur",
    areas: ["Cybersecurity", "Machine Learning", "Explainable AI", "SHAP"],
    status: "Published",
    contribution: "First author",
    summary:
      "Compares machine learning models on 1,082,664 URLs collected from eight public sources, and uses SHAP to explain which URL features drive each prediction.",
    doi: "10.1109/ICACT70625.2026.11748531",
    link: "https://ieeexplore.ieee.org/document/11748531",
  },
  {
    id: "agentic-ai-adoption",
    draft: false,
    conference: "IEEE ICACT 2026",  // TODO: check the conference name on the IEEE Xplore page
    fullName: "International Conference on Advanced Computing Technologies",
    place: "Kathmandu, Nepal",
    year: "2026",
    title: "Balancing Autonomy and Oversight: A Predictive Framework for Agentic AI Adoption",
    authors: "",                     // TODO: author list from IEEE Xplore
    areas: ["Agentic AI", "Artificial Intelligence"],
    status: "Published",
    contribution: "Second author",
    summary: "",                     // TODO: 2-3 sentences from your abstract
    doi: "",                         // TODO
    link: "https://ieeexplore.ieee.org/document/11748705",
  },
  {
    id: "stroke-risk-prediction",
    draft: false,
    conference: "IEEE COMPAS 2026",
    fullName: "International Conference on Computing, Applications and Systems",
    place: "University of Dhaka, Bangladesh",
    year: "2026",
    title: "Explainability and Calibration of Stroke Risk Prediction Models Based On AI",
    authors: "T. A. Fahim, S. J. Snegdha, T. Rahannum, R. A. M. Rudro, and K. Nur",
    areas: ["Healthcare AI", "Explainable AI", "Machine Learning", "Model Calibration"],
    status: "Accepted",
    contribution: "First author",
    summary:
      "Compares Logistic Regression, Random Forest, XGBoost and SVM for stroke risk prediction on an imbalanced dataset (balanced with SMOTE), explains the models with SHAP, and calibrates their probabilities with Platt scaling and isotonic regression.",
    doi: "",
    link: "",                        // TODO: IEEE Xplore link once published
  },
];


/* ---------------------------------------------------------
   EDUCATION and ACHIEVEMENTS
   --------------------------------------------------------- */
const EDUCATION = {
  school: "American International University-Bangladesh (AIUB)",
  short: "AIUB CSE",
  degree: "Bachelor of Science in Computer Science and Engineering (B.Sc. in CSE)",
  program: "Undergraduate Degree Program",
  status: "B.Sc. in CSE (In Progress)",
  text:
    "Department of Computer Science and Engineering, majoring in Software Engineering. Focusing on software engineering methods, web application development, object-oriented systems and machine learning research.",
  coursework: [
    "Object-Oriented Programming (C++, Java, C#)",
    "Data Structures & Algorithms",
    "Database Management Systems (SQL)",
    "Web Technologies & Application Development",
    "Artificial Intelligence & Machine Learning",
    "Operating Systems",
    "Software Engineering Principles",
  ],
};

const ACHIEVEMENTS = [
  { title: "Three Minute Thesis (3MT) Competition", result: "Participant", place: "Chittagong University of Engineering & Technology (CUET)" },
  { title: "Sciblitz 2.0 Science & Tech Contest", result: "Participant", place: "Chittagong University of Engineering & Technology (CUET)" },
];
