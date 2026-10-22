// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE — all portfolio content lives here.
//  Everything in [brackets] is placeholder text to replace.
// ─────────────────────────────────────────────────────────────
const PORTFOLIO = {
  name: "Nirali",
  logo: "<nirali.dev/>",
  roles: ["Software Engineer", "Full-Stack Developer", "Problem Solver"],
  tag: "Software Engineer / Developer",
  availability: "Open to opportunities",
  location: "Based in India",
  timezone: "Asia/Kolkata",
  pitch: "I write clean, tested, reliable code — and ship products people enjoy using.",
  heroStat: { label: "Projects shipped", value: "10+" },
  photo: "/profile.jpg", // put your photo in /public (portrait works best)
  cv: "/Nirali_CV.pdf", // put your CV in /public
  email: "nirali@example.com",
  github: "",                          // your GitHub username, e.g. "nirali" — powers the live stats
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/in/" },
    { label: "LeetCode", url: "https://leetcode.com/" },
    { label: "Email", url: "mailto:nirali@example.com" },
  ],
  contactLead: "Have a role, a project, or an idea? My inbox is always open — I usually reply within a day.",
  tagline: "Ship fast. Think deeper. Break things. Rebuild better.",

  // "About" section right after the hero.
  about: {
    lead: "A Computer Science Engineering student at SRM University AP, specialising in AI & ML — passionate about building intelligent systems and meaningful digital products.",
    body: "My interests lie at the intersection of Artificial Intelligence, Machine Learning, full-stack development and blockchain.",
    facts: [
      { label: "Studying", value: "B.Tech in CSE (AI & ML), SRM University AP · 2024–2028" },
      { label: "Currently", value: "[Your current role, club or focus]" },
    ],
    cta: { label: "More about me", href: "#timeline" },
  },

  // Text under the strength cards, typed out like an AI reply. Wrap words in **double stars** to highlight them.
  strengthsIntro: {
    prompt: "So Nirali, what are you actually good at?",
    answer: [
      "I turn **ideas into fast, polished products** — from the first sketch in Figma to a live, deployed app.",
      "My sweet spot is **full-stack web development**: React and modern CSS on the front, Node.js and well-designed databases behind it, shipped with CI/CD.",
      "I love **hard problems**. I break them down, write clean and tested code, and sweat the small details that make software feel delightful.",
    ],
  },

  // Panel beside that text: numbers count up when scrolled into view.
  snapshot: {
    stats: [
      { value: 3, suffix: "+", label: "Years of coding" },
      { value: 10, suffix: "+", label: "Projects shipped" },
      { value: 500, suffix: "+", label: "DSA problems solved" },
      { value: 20, suffix: "+", label: "Technologies used" },
    ],
    now: [
      { label: "Building", value: "[The project you're building now]" },
      { label: "Learning", value: "[What you're learning — e.g. system design]" },
      { label: "Open to", value: "Internships & full-time roles" },
    ],
  },

  // "What I'm Good At" — the cards that pass through the beam. `code` is what each card turns into.
  strengths: [
    {
      glyph: "</>",
      title: "Frontend Engineering",
      desc: "Fast, accessible interfaces with React and modern CSS — pixel-precise on every screen.",
      tags: ["React", "Next.js", "Tailwind"],
      code: ["export default function Hero({ user }) {", "const [open, setOpen] = useState(false);", "useEffect(() => { observe(ref.current); }, []);", "return <section className=\"hero\">{user.name}</section>;", "}"],
    },
    {
      glyph: "{ }",
      title: "Backend & APIs",
      desc: "Clean REST and GraphQL services that are secure, tested and built to scale.",
      tags: ["Node.js", "Express", "FastAPI"],
      code: ["app.get('/api/projects', auth, async (req, res) => {", "const rows = await db.query('SELECT * FROM projects');", "res.json({ data: rows, total: rows.length });", "});", "router.post('/login', validate(schema), login);"],
    },
    {
      glyph: "λ",
      title: "Problem Solving",
      desc: "Strong DSA fundamentals — I break hard problems into simple, efficient solutions.",
      tags: ["DSA", "C++", "LeetCode"],
      code: ["int lengthOfLIS(vector<int>& a) {", "vector<int> d; for (int x : a) {", "auto it = lower_bound(d.begin(), d.end(), x);", "if (it == d.end()) d.push_back(x); else *it = x; }", "return d.size(); }"],
    },
    {
      glyph: "◐",
      title: "UI / UX Design",
      desc: "Design systems, motion and micro-interactions that make products feel alive.",
      tags: ["Figma", "Motion", "A11y"],
      code: [":root { --accent: #e8533a; --ease: cubic-bezier(.25,.46,.45,.94); }", ".card:hover { transform: translateY(-4px); }", "@keyframes reveal { from { opacity: 0 } }", "@media (prefers-reduced-motion) { * { animation: none } }"],
    },
    {
      glyph: "▤",
      title: "Databases & Data",
      desc: "Well-modelled schemas and fast queries across SQL and NoSQL stores.",
      tags: ["PostgreSQL", "MongoDB", "Redis"],
      code: ["CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE);", "CREATE INDEX idx_posts_user ON posts(user_id);", "SELECT u.email, COUNT(p.id) FROM users u", "LEFT JOIN posts p ON p.user_id = u.id GROUP BY u.id;"],
    },
    {
      glyph: "☁",
      title: "Cloud & DevOps",
      desc: "Shipping with CI/CD, containers and cloud infra — from laptop to production.",
      tags: ["Docker", "AWS", "GitHub Actions"],
      code: ["FROM node:20-alpine AS build", "WORKDIR /app && COPY . . && RUN npm ci && npm run build", "jobs: deploy: runs-on: ubuntu-latest", "steps: - uses: actions/checkout@v4 - run: npm test"],
    },
  ],

  experience: [
    {
      role: "Summer Research Intern",
      org: "Under Dr. Avinash Trivedi",
      period: "[Month 2025 — Month 2025]",
      place: "[Institute / Remote]",
      summary: "AI summarization of Supreme Court of India judgements.",
      points: [
        "Researched automatic summarization of Supreme Court of India judgements.",
        "Worked with long, complex legal texts — cleaning and structuring judgements so they could be condensed into short, readable summaries.",
        "Compared generated summaries against the original judgements to check they kept the key facts and reasoning.",
      ],
      stack: ["Python", "NLP", "Legal AI"],
    },
    {
      role: "Frontend Developer",
      org: "Purplebean Agro Limited",
      period: "[Month 2024 — Month 2025]",
      place: "[City / Remote]",
      summary: "Built the web frontend for an agro company.",
      points: [
        "Built and maintained the company's web frontend.",
        "Turned designs into responsive pages that work well on phones and desktops.",
      ],
      stack: ["React", "JavaScript", "CSS"],
    },
    {
      role: "Graphic Designer & Social Media Manager",
      org: "HackShastra Student Community",
      period: "[Month 2023 — Month 2024]",
      place: "[College / Remote]",
      summary: "Event creatives and social media for a student tech community.",
      points: [
        "Designed posters, banners and creatives for the community's events and announcements.",
        "Ran the social media pages — planning content and keeping the community engaged.",
      ],
      stack: ["Figma", "Canva", "Social Media"],
    },
  ],

  // Card stack. `desc` shows on the card; `about` + `highlights` show in the panel beside it.
  // `image` is optional (put screenshots in /public, e.g. "/projects/one.png").
  projects: [
    {
      title: "KaushalDhan",
      type: "Blockchain · Web3",
      year: "[2025]",
      desc: "A blockchain economy where skills are the currency.",
      about: "KaushalDhan is a skill-exchange economy that runs entirely on the blockchain. People trade skills and services with each other, and every exchange, payment and activity is an on-chain transaction — transparent, tamper-proof, and with no middleman.",
      highlights: [
        "Skill-for-skill exchange, with every trade recorded as a blockchain transaction",
        "The whole economy — balances, exchanges and activity — runs on-chain",
        "Every transaction is public and verifiable, so the system stays trustworthy",
      ],
      stack: ["Blockchain", "Smart Contracts", "Web3"],
      live: "",
      code: "",
      image: "/projects/kaushaldhan.svg",
    },
    {
      title: "Legal Precedent & Summarization",
      type: "AI · NLP",
      year: "[2025]",
      desc: "Summarizes court judgements and finds relevant precedents.",
      about: "An AI tool for legal research. It condenses long Supreme Court judgements into short, readable summaries and surfaces past judgements (precedents) relevant to a case — turning hours of reading into minutes.",
      highlights: [
        "Summarizes lengthy judgements into concise, readable briefs",
        "Finds precedents related to a given case",
        "Built to handle long, complex legal language",
      ],
      stack: ["Python", "NLP", "Transformers"],
      live: "",
      code: "",
      image: "/projects/legal.svg",
    },
    {
      title: "Drishti Guard",
      type: "AI · Computer Vision",
      year: "[2024]",
      desc: "AI surveillance camera powered by YOLO.",
      about: "Drishti Guard turns an ordinary camera feed into a smart surveillance system. It uses YOLO object detection to spot people and objects in real time, so monitoring no longer depends on someone watching screens all day.",
      highlights: [
        "Real-time object detection on live camera feeds using YOLO",
        "Automated monitoring instead of manual screen-watching",
      ],
      stack: ["Python", "YOLO", "OpenCV"],
      live: "",
      code: "",
      image: "/projects/drishti.svg",
    },
  ],

  education: [
    {
      role: "B.Tech in Computer Science & Engineering (AI & ML)",
      org: "SRM University AP",
      period: "2024 — 2028",
      place: "Amaravati, Andhra Pradesh",
      points: ["[Relevant coursework: DSA, OS, DBMS, Networks]"],
      stack: [],
    },
  ],

  skills: [
    { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "HTML", "CSS", "Tailwind"] },
    { group: "Backend", items: ["Node.js", "Express", "FastAPI", "REST", "GraphQL"] },
    { group: "Data & Cloud", items: ["PostgreSQL", "MongoDB", "Firebase", "AWS", "Docker"] },
    { group: "Tools", items: ["Git", "GitHub Actions", "Figma", "Postman", "Linux"] },
  ],

  achievements: [
    { title: "[Hackathon Winner]", meta: "[Event · 2025]", desc: "[What you built and placed.]", link: "" },
    { title: "[Competitive Programming]", meta: "[Platform · Rating]", desc: "[e.g. 500+ problems solved]", link: "" },
  ],

  certifications: [
    { title: "[Certification Name]", meta: "[Issuer · 2025]", desc: "", link: "#" },
    { title: "[Certification Name]", meta: "[Issuer · 2024]", desc: "", link: "#" },
  ],

  leadership: [
    { title: "[Tech Lead, Coding Club]", meta: "[College · 2024 — 2025]", desc: "[Organised workshops for 200+ students.]" },
    { title: "[Volunteer]", meta: "[Organisation · 2023]", desc: "[What you did.]" },
  ],

  timeline: [
    { year: "2024", title: "Started B.Tech at SRM University AP", desc: "[Wrote my first real program.]" },
    { year: "2023", title: "[First hackathon]", desc: "[What happened.]" },
    { year: "2024", title: "[First internship]", desc: "[What you learned.]" },
    { year: "2025", title: "[Shipped X]", desc: "[Milestone.]" },
  ],

  testimonials: [
    { quote: "[A kind word from a mentor, manager or teammate.]", who: "[Name]", meta: "[Role, Company]" },
  ],
};
export default PORTFOLIO;
