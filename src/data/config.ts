// ============================================================
// PORTFOLIO CONFIGURATION — Edit all values here
// ============================================================

export const config = {
  // Personal Info
  name: "Bhavesh Kumawat",
  firstName: "Bhavesh",
  lastName: "Kumawat",
  monogram: "BK",
  tagline: "Engineering ideas. Building intelligent experiences.",
  shortBio:
    "I'm Bhavesh Kumawat, a Computer Science Engineering student specializing in AI & ML. I build practical software, explore intelligent systems, and turn ideas into working products.",
  longBio: `I'm pursuing a B.Tech in Computer Science Engineering with a specialization in Artificial Intelligence & Machine Learning, expected to graduate in 2029. My work lives at the intersection of backend engineering, intelligent systems, and software that actually solves problems.

I'm drawn to the parts of engineering that are hard — designing systems that scale, building AI integrations that genuinely help people, and writing backend logic that holds up under pressure. I enjoy learning through implementation: picking up a new technology means building something with it, not just reading the docs.

My interests span backend engineering with Python and Flask, machine learning fundamentals, generative AI integrations, and thoughtful software architecture. I'm currently deepening my understanding of AI systems while building practical projects that apply those concepts.

When I'm not coding, I'm usually debugging something I coded — which is basically the same thing.`,
  location: "Bengaluru, Karnataka, India",
  availability: false,
  availabilityText: "Open to opportunities starting 2025",

  // Academic
  college: "Your College Name", // FILL IN when ready
  degree: "B.Tech in Computer Science Engineering",
  specialization: "Artificial Intelligence & Machine Learning",
  studyPeriod: "2025 – 2029",
  graduationYear: "2029",

  // Contact
  email: "bhaveshkumawat330@gmail.com",
  emailDisplay: "bhaveshkumawat330@gmail.com",

  // Social Links
  github: "https://github.com/bhavshx-collab",
  linkedin: "https://www.linkedin.com/in/bhavesh-kumar-52b46a301/",
  twitter: "",

  // Resume
  resumeUrl: "/resume.pdf",
  resumeVersion: "v2025",
  resumeLastUpdated: "October 2025",

  // Stats (only use real numbers)
  stats: [
    { label: "Technologies Explored", value: "20+", icon: "code" },
    { label: "Projects Built", value: "4+", icon: "box" },
    { label: "Learning Mindset", value: "Always", icon: "brain" },
  ],

  // EmailJS Config (server-side delivery — fill in with your credentials)
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  },
};


// ============================================================
// SKILLS DATA
// ============================================================

export type SkillLevel = "familiar" | "learning" | "experienced";

export interface Skill {
  name: string;
  level: SkillLevel;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    skills: [
      { name: "Python", level: "experienced" },
      { name: "C", level: "familiar" },
      { name: "JavaScript", level: "experienced" },
      { name: "SQL", level: "experienced" },
      { name: "TypeScript", level: "learning" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Flask", level: "experienced" },
      { name: "REST APIs", level: "experienced" },
      { name: "SQLAlchemy", level: "experienced" },
      { name: "Authentication & Auth", level: "experienced" },
      { name: "CRUD Systems", level: "experienced" },
      { name: "React", level: "learning" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "HTML", level: "experienced" },
      { name: "CSS", level: "experienced" },
      { name: "React", level: "learning" },
      { name: "Responsive Design", level: "experienced" },
    ],
  },
  {
    id: "ai-data",
    label: "AI & Data",
    skills: [
      { name: "NumPy", level: "experienced" },
      { name: "Pandas", level: "experienced" },
      { name: "scikit-learn", level: "learning" },
      { name: "ML Fundamentals", level: "learning" },
      { name: "Generative AI", level: "learning" },
    ],
  },
  {
    id: "tools",
    label: "Dev Tools",
    skills: [
      { name: "Git", level: "experienced" },
      { name: "GitHub", level: "experienced" },
      { name: "VS Code", level: "experienced" },
      { name: "SQLite", level: "experienced" },
      { name: "MySQL", level: "familiar" },
      { name: "Vercel", level: "experienced" },
    ],
  },
];

// ============================================================
// PROJECTS DATA
// ============================================================

export type ProjectStatus = "complete" | "in-progress" | "experimental";
export type ProjectCategory = "backend" | "ai-ml" | "web" | "fullstack";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  problem: string;
  features: string[];
  stack: string[];
  category: ProjectCategory[];
  status: ProjectStatus;
  githubUrl: string;
  liveUrl?: string;
  coverColor: string;
  accentColor: string;
  year: string;
  architecture?: string;
  challenges?: string[];
  lessons?: string[];
  futureImprovements?: string[];
}

export const projects: Project[] = [
  {
    id: "approval-workflow",
    title: "Approval Workflow",
    subtitle: "Role-based request management system",
    description:
      "A web application for submitting, reviewing, approving, and rejecting requests across user and admin roles.",
    longDescription:
      "Built a full-stack web application that implements a structured approval workflow. Users can submit requests that flow through an admin review process — with approve/reject actions, status tracking, and persistent storage. The system handles role separation cleanly, with protected routes preventing unauthorized access.",
    problem:
      "How do you build a structured approval system where multiple roles interact with requests differently, while keeping data consistent and access controlled?",
    features: [
      "User authentication with session management",
      "Admin and standard user roles",
      "Request submission and tracking",
      "Approve / Reject workflow with status updates",
      "Protected routes per role",
      "SQLite database persistence with SQLAlchemy",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "SQLite", "HTML", "CSS"],
    category: ["backend", "fullstack", "web"],
    status: "complete",
    githubUrl: "https://github.com/bhavshx-collab/approval-workflow",
    liveUrl: "",
    coverColor: "#6C8CFF",
    accentColor: "#A78BFA",
    year: "2024",
    architecture:
      "Flask application with blueprint-based routing, SQLAlchemy ORM models, Jinja2 templates, and session-based authentication. Database relationships handle user–request associations.",
    challenges: [
      "Designing the role-based access control without an external library",
      "Keeping session state consistent across multiple request flows",
      "Modeling the approval state machine in the database cleanly",
    ],
    lessons: [
      "Role-based systems benefit from clearly defined permission boundaries at the route level",
      "SQLAlchemy's ORM simplifies state transitions when models are designed thoughtfully",
    ],
    futureImprovements: [
      "Email notifications on status change",
      "Audit log for all approval actions",
      "REST API layer for frontend decoupling",
    ],
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    subtitle: "Personal finance management application",
    description:
      "A personal finance application for recording, categorizing, and reviewing expenses with database persistence.",
    longDescription:
      "Designed and built a personal expense tracker that allows users to log expenses with categories and view spending history. The application persists data across sessions using SQLite and provides a clean interface for expense management.",
    problem:
      "How do you build a reliable personal finance tool that persists data, handles CRUD operations cleanly, and stays simple to use?",
    features: [
      "Add, edit, and delete expense entries",
      "Category-based organization",
      "Expense history with filtering",
      "Database persistence with SQLAlchemy",
      "Clean, functional UI",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "SQLite", "HTML", "CSS"],
    category: ["backend", "web"],
    status: "complete",
    githubUrl: "https://github.com/bhavshx-collab/expense-tracker",
    liveUrl: "",
    coverColor: "#7EE0B8",
    accentColor: "#6C8CFF",
    year: "2024",
    architecture:
      "Flask web application with SQLAlchemy models for expense and category entities. CRUD routes handle all expense operations with form validation.",
    challenges: [
      "Designing a clean data model for flexible categorization",
      "Handling form validation and user feedback gracefully",
    ],
    lessons: [
      "Clean data models make CRUD implementations straightforward",
      "User feedback on operations (success/error states) is essential even in simple apps",
    ],
    futureImprovements: [
      "Monthly/weekly spending analytics",
      "Budget goal setting",
      "Export to CSV",
    ],
  },
  {
    id: "momentum-habit-tracker",
    title: "Momentum",
    subtitle: "Habit tracking for building consistency",
    description:
      "A habit tracking application focused on building consistency through structured routines and progress visibility.",
    longDescription:
      "Momentum is a habit tracker designed around one core idea: showing up consistently matters more than perfect performance. The app helps users define habits, track daily completions, and maintain visibility into their consistency over time.",
    problem:
      "How do you design a habit tracker that encourages consistency without becoming another task management overhead?",
    features: [
      "Habit creation and management",
      "Daily completion tracking",
      "Streak visualization",
      "Progress history",
      "Clean, focused interface",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "SQLite", "HTML", "CSS"],
    category: ["backend", "web"],
    status: "complete",
    githubUrl: "https://github.com/bhavshx-collab/momentum",
    liveUrl: "",
    coverColor: "#A78BFA",
    accentColor: "#7EE0B8",
    year: "2024",
    challenges: [
      "Designing streak calculation logic that handles missed days correctly",
      "Making the daily check-in feel lightweight and frictionless",
    ],
    lessons: [
      "UX friction matters enormously for habits — every extra click reduces compliance",
      "Date/time handling for daily streaks needs careful timezone consideration",
    ],
    futureImprovements: [
      "Habit grouping and categories",
      "Weekly/monthly analytics",
      "Reminder notifications",
    ],
  },
  {
    id: "ai-resume-scorer",
    title: "AI Resume Scorer",
    subtitle: "ML-based resume evaluation experiment",
    description:
      "An experimental project exploring machine learning-based resume analysis, scoring, and feedback generation.",
    longDescription:
      "An experimental system that applies machine learning and NLP techniques to analyze resumes, produce structured scores, and generate improvement suggestions. Built to explore how ML can be applied to practical document understanding tasks.",
    problem:
      "Can machine learning provide meaningful, actionable feedback on resume quality — and what does implementing that actually require?",
    features: [
      "Resume text extraction and parsing",
      "Structured skill extraction",
      "Rule-based and ML-assisted scoring",
      "Feedback and improvement suggestions",
      "Experimental — actively being refined",
    ],
    stack: ["Python", "Pandas", "NumPy", "scikit-learn", "Flask"],
    category: ["ai-ml", "backend"],
    status: "experimental",
    githubUrl: "https://github.com/bhavshx-collab/ai-resume-scorer",
    liveUrl: "",
    coverColor: "#F59E0B",
    accentColor: "#6C8CFF",
    year: "2025",
    challenges: [
      "Resume text formats vary wildly — preprocessing is nontrivial",
      "Defining what makes a resume 'good' objectively enough for ML",
      "Avoiding biased scoring criteria",
    ],
    lessons: [
      "Data quality and preprocessing dominate ML project outcomes",
      "Rule-based systems complement ML well in hybrid evaluation tasks",
    ],
    futureImprovements: [
      "Integration with real job description matching",
      "More sophisticated NLP using transformers",
      "Structured benchmark dataset for scoring validation",
    ],
  },
];

// ============================================================
// JOURNEY / EDUCATION DATA
// ============================================================

export interface JourneyItem {
  id: string;
  type: "education" | "milestone" | "certification" | "project";
  title: string;
  organization: string;
  period: string;
  description: string;
  tags?: string[];
  link?: string;
}

export const journey: JourneyItem[] = [
  {
    id: "btech",
    type: "education",
    title: "B.Tech in Computer Science Engineering (AI & ML)",
    organization: "Your College Name", // FILL IN when ready
    period: "2025 – 2029",
    description:
      "Specializing in Artificial Intelligence & Machine Learning. Core coursework includes Data Structures & Algorithms, Database Management Systems, Computer Networks, Operating Systems, Machine Learning, and Software Engineering.",
    tags: [
      "AI & ML",
      "Data Structures",
      "DBMS",
      "Computer Networks",
      "Software Engineering",
    ],
  },
  {
    id: "ml-milestone",
    type: "milestone",
    title: "Machine Learning Fundamentals",
    organization: "Self-Directed Learning",
    period: "2023",
    description:
      "Studied core ML concepts including supervised and unsupervised learning, model evaluation, feature engineering, and hands-on experimentation with scikit-learn and NumPy.",
    tags: ["scikit-learn", "NumPy", "Pandas", "ML Theory"],
  },
  {
    id: "backend-milestone",
    type: "milestone",
    title: "Backend Development with Flask",
    organization: "Project-Based Learning",
    period: "2023 – 2024",
    description:
      "Built multiple full-stack web applications using Flask, SQLAlchemy, and SQLite. Developed practical skills in REST API design, authentication systems, and database modeling.",
    tags: ["Flask", "SQLAlchemy", "REST API", "Authentication"],
  },
  {
    id: "gen-ai-milestone",
    type: "milestone",
    title: "Generative AI Exploration",
    organization: "Self-Directed",
    period: "2024 – Present",
    description:
      "Exploring generative AI integrations, prompt engineering, and the practical application of language models in software systems.",
    tags: ["Generative AI", "LLMs", "Prompt Engineering"],
  },
];

// ============================================================
// ACHIEVEMENTS & CERTIFICATIONS
// ============================================================

export interface Achievement {
  id: string;
  type: "certification" | "academic" | "hackathon" | "milestone";
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl?: string;
  credentialId?: string;
  skills?: string[];
  featured?: boolean;
}

export const achievements: Achievement[] = [
  // Add your real certifications here. Examples below are placeholders.
  // {
  //   id: "cert-1",
  //   type: "certification",
  //   title: "Your Certificate Name",
  //   issuer: "Issuing Organization",
  //   date: "Month Year",
  //   description: "Brief description of what you learned.",
  //   credentialUrl: "https://...",
  //   skills: ["Skill 1", "Skill 2"],
  //   featured: true,
  // },
];
