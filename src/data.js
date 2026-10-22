// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE — all portfolio content lives here.
//  Everything in [brackets] is placeholder text to replace.
// ─────────────────────────────────────────────────────────────
const PORTFOLIO = {
  name: "Nirali",
  logo: "<nirali.dev/>",
  roles: ["Data Analyst", "ML Enthusiast", "Problem Solver"],
  tag: "Data Analytics / Machine Learning",
  availability: "Open to Data Analytics & ML internships",
  location: "Based in India",
  timezone: "Asia/Kolkata",
  pitch: "I turn raw data into insights — and build machine-learning systems that put them to work.",
  heroStat: { label: "Projects built", value: "3+" },
  photo: "/profile.jpg", // put your photo in /public (portrait works best)
  cv: "/Nirali_CV.pdf", // put your CV in /public
  email: "nirali@example.com",
  github: "niralichandra",             // your GitHub username — powers the live stats
  socials: [
    { label: "GitHub", url: "https://github.com/niralichandra" },
    { label: "LinkedIn", url: "https://linkedin.com/in/niralichandra" },
    { label: "Website", url: "https://niralichandra07.com" },
    { label: "Email", url: "mailto:nirali@example.com" },
  ],
  contactLead: "Have a role, a project, or an idea? My inbox is always open — I usually reply within a day.",
  tagline: "Ship fast. Think deeper. Break things. Rebuild better.",

  // "About" section right after the hero.
  about: {
    lead: "A Computer Science Engineering student at SRM University AP, specialising in AI & ML — focused on transforming raw data into insights.",
    body: "I work across data analysis, machine learning and predictive modelling, with a growing focus on NLP, LLMs and computer vision.",
    facts: [
      { label: "Studying", value: "B.Tech in CSE (AI & ML), SRM University AP · 2024–2028" },
      { label: "Currently", value: "Data Analytics Intern, Purple Bean Agro" },
    ],
    cta: { label: "More about me", href: "#timeline" },
  },

  // Text under the strength cards, typed out like an AI reply. Wrap words in **double stars** to highlight them.
  strengthsIntro: {
    prompt: "So Nirali, what are you actually good at?",
    answer: [
      "I turn **raw data into insights** — collecting, cleaning and analysing datasets with Python, SQL and Excel.",
      "My sweet spot is **data analytics and machine learning**: spotting trends, forecasting demand, and evaluating models that predict what comes next.",
      "Lately I've been going deep on **NLP and LLMs** — building a system that summarises and explains Supreme Court judgements.",
    ],
  },

  // Panel beside that text: numbers count up when scrolled into view.
  snapshot: {
    stats: [
      { value: 3, suffix: "+", label: "Projects built" },
      { value: 3, suffix: "", label: "Certifications" },
      { value: 1, suffix: "", label: "Analytics internship" },
      { value: 20, suffix: "+", label: "Tools & technologies" },
    ],
    now: [
      { label: "Interning", value: "Data Analytics at Purple Bean Agro" },
      { label: "Learning", value: "[What you're learning — e.g. deep learning]" },
      { label: "Open to", value: "Data Analytics & ML internships" },
    ],
  },

  // "What I'm Good At" — the cards that pass through the beam. `code` is what each card turns into.
  strengths: [
    {
      glyph: "▤",
      title: "Data Analysis",
      desc: "Collecting, cleaning and analysing datasets to find the trends and patterns that matter.",
      tags: ["Python", "Pandas", "SQL"],
      code: ["df = pd.read_csv('sales.csv', parse_dates=['date'])", "df = df.dropna().drop_duplicates()", "monthly = df.groupby(df.date.dt.month)['units'].sum()", "SELECT region, SUM(units) FROM sales GROUP BY region;"],
    },
    {
      glyph: "∿",
      title: "Machine Learning",
      desc: "Predictive models built and evaluated properly — from regression to forecasting.",
      tags: ["Regression", "NumPy", "Model Evaluation"],
      code: ["X_train, X_test, y_train, y_test = train_test_split(X, y)", "model = LinearRegression().fit(X_train, y_train)", "pred = model.predict(X_test)", "print(r2_score(y_test, pred), mean_absolute_error(y_test, pred))"],
    },
    {
      glyph: "¶",
      title: "NLP & LLMs",
      desc: "Summarising and explaining long, complex text with language models.",
      tags: ["LLMs", "NLP", "Prompt Engineering"],
      code: ["prompt = f'Summarise this judgement: {text}'", "summary = llm.generate(prompt, max_tokens=512)", "score = reward_model(summary, reference)", "tokens = tokenizer(text, truncation=True)"],
    },
    {
      glyph: "◉",
      title: "Computer Vision",
      desc: "Real-time object detection on live camera feeds.",
      tags: ["YOLO", "OpenCV", "Python"],
      code: ["model = YOLO('yolov8n.pt')", "cap = cv2.VideoCapture(0)", "ok, frame = cap.read()", "results = model(frame, conf=0.5)", "cv2.imshow('Drishti', results[0].plot())"],
    },
    {
      glyph: "◫",
      title: "Visualisation & Reporting",
      desc: "Dashboards and reports that turn analysis into clear, actionable decisions.",
      tags: ["Dashboards", "Excel", "Data Viz"],
      code: ["fig, ax = plt.subplots(figsize=(10, 4))", "ax.plot(monthly.index, monthly.values, marker='o')", "ax.set_title('Seasonal demand by month')", "fig.savefig('report.png', dpi=200)"],
    },
    {
      glyph: "</>",
      title: "Web & Tools",
      desc: "Front-ends and APIs that put data and models in front of people.",
      tags: ["React", "REST APIs", "Git"],
      code: ["const res = await fetch('/api/forecast');", "const { data } = await res.json();", "return <Chart data={data} />;", "git commit -m 'Add forecast dashboard'"],
    },
  ],

  experience: [
    {
      role: "Data Analytics Intern",
      org: "Purple Bean Agro",
      period: "Jan 2025 — Present",
      place: "[City / Remote]",
      summary: "Market research and demand analysis across agricultural product categories.",
      points: [
        "Conducted market research and competitive analysis to identify regional demand trends, growth opportunities and business insights across agricultural product categories.",
        "Collected, cleaned and analysed datasets using Python, SQL and Excel to evaluate market patterns, seasonal trends and demand forecasting.",
        "Developed dashboards, visualisations and actionable reports to communicate insights and support data-driven strategic planning and business forecasting.",
      ],
      stack: ["Python", "SQL", "Excel", "Data Viz"],
    },
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
      desc: "A digital platform for financial empowerment and skill-based opportunities.",
      about: "KaushalDhan is a platform focused on financial empowerment and skill-based opportunities, with a user-friendly interface for accessing resources and managing financial goals. Skills and services are exchanged on the blockchain, so every trade and payment is transparent and tamper-proof.",
      highlights: [
        "User-friendly interface for accessing resources and managing financial goals",
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
      title: "Legal Judgment Analysis",
      type: "AI · NLP",
      year: "[2025]",
      desc: "LLM-based analysis and summarisation of Supreme Court judgements.",
      about: "An NLP system that analyses and summarises long Supreme Court of India judgements using LLMs and Python — turning hours of reading into minutes, with explanations of the court's reasoning.",
      highlights: [
        "Summarises lengthy judgements into concise, readable briefs",
        "Evaluated WRR-Tune, reward-based and SAC-based approaches",
        "Compared them on explanation quality and reasoning accuracy",
      ],
      stack: ["Python", "LLMs", "NLP"],
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
      points: [],
      stack: [],
    },
  ],

  skills: [
    { group: "Languages", items: ["Python", "Java", "SQL"] },
    { group: "Data & ML", items: ["Pandas", "NumPy", "Data Visualization", "Regression", "Model Evaluation"] },
    { group: "AI, NLP & CV", items: ["LLMs", "NLP", "Prompt Engineering", "Text Summarization", "YOLO", "OpenCV"] },
    { group: "Web & Tools", items: ["React", "REST APIs", "Git", "GitHub", "MySQL Workbench", "Excel"] },
  ],

  achievements: [
    { title: "[Hackathon Winner]", meta: "[Event · 2025]", desc: "[What you built and placed.]", link: "" },
    { title: "[Competitive Programming]", meta: "[Platform · Rating]", desc: "[e.g. 500+ problems solved]", link: "" },
  ],

  certifications: [
    // add each certificate's verify URL as `link` to show a "Verify credential" link
    { title: "MongoDB Associate Developer", meta: "MongoDB", desc: "", link: "" },
    { title: "Object-Oriented Hierarchy with Java", meta: "Coursera", desc: "", link: "" },
    { title: "OOPs with Java", meta: "Coursera", desc: "", link: "" },
  ],

  leadership: [
    { title: "[Tech Lead, Coding Club]", meta: "[College · 2024 — 2025]", desc: "[Organised workshops for 200+ students.]" },
    { title: "[Volunteer]", meta: "[Organisation · 2023]", desc: "[What you did.]" },
  ],

  timeline: [
    { year: "2024", title: "Started B.Tech at SRM University AP", desc: "Computer Science & Engineering, specialising in AI & ML." },
    { year: "2025", title: "Data Analytics Intern at Purple Bean Agro", desc: "Market research, demand forecasting and dashboards for agricultural products." },
    { year: "2025", title: "Legal Judgment Analysis", desc: "Built an LLM-based system to summarise and explain Supreme Court judgements." },
  ],

};
export default PORTFOLIO;
