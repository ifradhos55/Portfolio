const { useEffect, useMemo, useRef, useState } = React;

function useRevealOnScroll() {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll(".reveal"));
        if (!("IntersectionObserver" in window)) {
            els.forEach(el => el.classList.add("on"));
            return;
        }
        const io = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) e.target.classList.add("on");
                });
            },
            { threshold: 0.12 }
        );
        els.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);
}

function useActiveSection(sectionIds) {
    const [active, setActive] = useState(sectionIds[0] || "home");

    useEffect(() => {
        const sections = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean);

        if (!("IntersectionObserver" in window)) return;

        const io = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(e => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible?.target?.id) setActive(visible.target.id);
            },
            { root: null, threshold: [0.15, 0.25, 0.35, 0.5] }
        );

        sections.forEach(s => io.observe(s));
        return () => io.disconnect();
    }, [sectionIds.join("|")]);

    return [active, setActive];
}

function Icon({ kind }) {
    const map = {
        code: "⟡",
        shield: "⬡",
        chart: "▦",
        link: "↗",
        eye: "◉",
        github: "⌂",
        li: "in",
    };
    return (
        <span aria-hidden="true" style={{
            display:"inline-flex",
            width: 18, height: 18,
            alignItems:"center",
            justifyContent:"center",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(255,255,255,.06)",
            fontWeight: 900,
            fontSize: 12,
            lineHeight: 1,
        }}>
      {map[kind] || "•"}
    </span>
    );
}

function App() {
    useRevealOnScroll();

    const sections = ["home", "projects", "certs", "contact"];
    const [activeSection] = useActiveSection(sections);

    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("All");
    const [selected, setSelected] = useState(null);

    const projects = useMemo(() => ([
        {
            title: "Ozark (LMS Dashboard)",
            year: "2026",
            highlight: "Modern React dashboard with clean UI, data management, and responsive components.",
            details:
                "A polished dashboard-style web app focused on structured UI, reusable components, and smooth interactions. Built with a modern frontend approach and attention to layout, state, and UX flow.",
            tags: ["React", "UI/UX", "Dashboard", "State"],
            primaryTag: "React",
            links: [{ label: "Details", type: "modal" }]
        },
        {
            title: "Liberty Pursuit",
            year: "2025",
            highlight: "GTA-style web game UI with overlays, HUD elements, and interactive gameplay systems.",
            details:
                "A 3D game-like web experience with a GTA-inspired interface (health bars, overlays, sector UI). Emphasis on immersive front-end visuals, event-driven input, and smooth animation timing.",
            tags: ["JavaScript", "UI/UX", "Game Dev", "3D"],
            primaryTag: "UI/UX",
            links: [{ label: "Details", type: "modal" }]
        },
        {
            title: "HR Management & Payroll System",
            year: "2025",
            highlight: "Employee management, payroll operations, and data visualization for HR workflows.",
            details:
                "A JavaFX-based HR and Payroll application featuring employee CRUD workflows, payroll calculations, structured reporting, and visualization dashboards. Designed with clean separation of concerns and maintainable architecture.",
            tags: ["Java", "JavaFX", "MVC", "Data Viz"],
            primaryTag: "Java",
            links: [{ label: "Details", type: "modal" }]
        },
        {
            title: "Rickby (AI Voice Calling Bot)",
            year: "2025",
            highlight: "Automation bot for outbound calling flows and voicemail scripting.",
            details:
                "A system designed to automate outbound call attempts, detect voicemail, and handle scripted delivery logic. Built with practical automation constraints in mind (retry/queueing, logging, and predictable call flow).",
            tags: ["Python", "Automation", "APIs", "Telephony"],
            primaryTag: "Automation",
            links: [
                { label: "GitHub", type: "link", href: "https://github.com/ifradhos55/rickby-api" }
            ]
        },
        {
            title: "Gesture-Controlled Calculator",
            year: "2025",
            highlight: "Hand gesture classifier + GUI for touchless interaction.",
            details:
                "A PyQt5 application driven by a gesture recognition pipeline (MediaPipe + TensorFlow). Focus on real-time responsiveness, robust mapping of gestures to UI actions, and clean separation between ML inference and UI updates.",
            tags: ["Python", "TensorFlow", "MediaPipe", "PyQt5"],
            primaryTag: "Python",
            links: [{ label: "Details", type: "modal" }]
        },
        {
            title: "Cosmic Fusion",
            year: "2026",
            highlight: "Interactive 3D Solar System & Galaxy Simulation.",
            details: "A high-performance WebGL simulation featuring real-time orbital physics, procedural texture generation via Canvas API, and a massive 100,000-particle spiral galaxy view.",
            tags: ["Three.js", "WebGL", "JavaScript"],
            primaryTag: "Three.js",
            links: [{ label: "View Details", type: "modal" }]
        }
    ]), []);

    const allTags = useMemo(() => {
        const set = new Set(["All"]);
        projects.forEach(p => p.tags.forEach(t => set.add(t)));
        return Array.from(set);
    }, [projects]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return projects.filter(p => {
            const matchesQ =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.highlight.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q));
            const matchesTag = tag === "All" || p.tags.includes(tag);
            return matchesQ && matchesTag;
        });
    }, [projects, query, tag]);

    function scrollTo(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function copyEmail() {
        const email = "ifrad.hossain04@gmail.com";
        navigator.clipboard?.writeText(email);
    }

    return (
        <>
            <div className="bg-noise" />

            <header className="topbar">
                <div className="container">
                    <div className="nav">
                        <div className="brand" role="banner">
                            <div className="mark" aria-hidden="true"></div>
                            <div>
                                <h1>Ifrad Hossain</h1>
                                <p>Full Stack Developer • React • Java • C# • Python</p>
                            </div>
                        </div>

                        <nav className="navlinks" aria-label="Primary navigation">
                            <a className={`pill ${activeSection === "home" ? "active" : ""}`} href="#home" onClick={(e)=>{e.preventDefault();scrollTo("home");}}>Home</a>
                            <a className={`pill ${activeSection === "projects" ? "active" : ""}`} href="#projects" onClick={(e)=>{e.preventDefault();scrollTo("projects");}}>Projects</a>
                            <a className={`pill ${activeSection === "certs" ? "active" : ""}`} href="#certs" onClick={(e)=>{e.preventDefault();scrollTo("certs");}}>Certifications</a>
                            <a className={`pill ${activeSection === "contact" ? "active" : ""}`} href="#contact" onClick={(e)=>{e.preventDefault();scrollTo("contact");}}>Contact</a>
                        </nav>

                        <div className="ctaRow">
                            <a className="btn btnPrimary" href="#contact" onClick={(e)=>{e.preventDefault();scrollTo("contact");}}>
                                <Icon kind="mail" /> Connect
                            </a>
                            <a className="btn" href="https://github.com/ifradhos55" target="_blank" rel="noreferrer">
                                <Icon kind="github" /> GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* HERO */}
                <section id="home" className="hero">
                    <div className="container">
                        <div className="heroGrid">
                            <div className="card reveal">
                                <div className="gradientRing" aria-hidden="true"></div>
                                <div className="cardInner">
                                    <div className="kicker"><span className="kickerDot"></span> Building clean, fast, production-style apps</div>
                                    <h2 className="headline">
                                        Full Stack Developer focused on modern UI, reliable backend logic, and real-world systems.
                                    </h2>
                                    <p className="subhead">
                                        I build applications that look sharp and behave predictably: dashboards, workflow systems, automation tools, and interactive front-ends.
                                        Recent work includes <strong>Ozark</strong>, <strong>Liberty Pursuit</strong>, and an <strong>HR Management & Payroll</strong> platform with reporting and visualization.
                                    </p>

                                    <div className="tagRow" aria-label="Core skills">
                                        <span className="tag">React</span>
                                        <span className="tag">Java / JavaFX</span>
                                        <span className="tag">C# / .NET</span>
                                        <span className="tag">Python</span>
                                        <span className="tag">SQL / PostgreSQL</span>
                                        <span className="tag">UI Systems</span>
                                    </div>

                                    <div className="heroActions">
                                        <button className="btn btnPrimary" onClick={() => scrollTo("projects")}>
                                            <Icon kind="eye" /> View Projects
                                        </button>
                                        <button className="btn" onClick={copyEmail} title="Copies email to clipboard">
                                            <Icon kind="mail" /> Copy Email
                                        </button>
                                        <a className="btn" href="https://www.linkedin.com/in/ihos25/" target="_blank" rel="noreferrer">
                                            <Icon kind="li" /> LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="card reveal">
                                <div className="gradientRing" aria-hidden="true"></div>
                                <div className="cardInner">
                                    <div className="sectionHead" style={{marginBottom: 12}}>
                                        <div>
                                            <h3 className="sectionTitle" style={{marginBottom: 4}}>What I ship</h3>
                                            <p className="sectionDesc">Practical features, clean structure, and strong UX.</p>
                                        </div>
                                    </div>

                                    <div className="metricGrid">
                                        <div className="metric">
                                            <h3>Dashboards</h3>
                                            <p>Modern UI, component design, state flows, responsiveness.</p>
                                        </div>
                                        <div className="metric">
                                            <h3>Workflows</h3>
                                            <p>CRUD systems, role-based flows, validation, reporting.</p>
                                        </div>
                                        <div className="metric">
                                            <h3>Automation</h3>
                                            <p>APIs, integrations, queued operations, logging.</p>
                                        </div>
                                        <div className="metric">
                                            <h3>Visualization</h3>
                                            <p>Readable charts, summaries, and insight-driven UI.</p>
                                        </div>
                                    </div>

                                    <hr className="hr" />

                                    <p className="sectionDesc">
                                        Current priorities: React front-ends, clean architecture, and projects that prove real engineering discipline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PROJECTS */}
                <section id="projects" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <div>
                                <h2 className="sectionTitle" style={{fontSize: 20}}>Projects</h2>
                                <p className="sectionDesc">No filler, no placeholders — just the work that matters.</p>
                            </div>
                            <div className="filters" aria-label="Project filters">
                                <input
                                    className="input"
                                    value={query}
                                    onChange={(e)=>setQuery(e.target.value)}
                                    placeholder="Search (e.g., Ozark, JavaFX, dashboard)..."
                                    aria-label="Search projects"
                                />
                                <select className="select" value={tag} onChange={(e)=>setTag(e.target.value)} aria-label="Filter by tag">
                                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid2">
                            {filtered.map((p) => (
                                <article key={p.title} className="projectCard reveal">
                                    <div className="projectTop">
                                        <div>
                                            <h3>{p.title}</h3>
                                            <div className="badges" aria-label="Project tags">
                        <span className={`badge ${p.primaryTag === "React" ? "blue" : p.primaryTag === "Java" ? "blue" : "red"}`}>
                          {p.year}
                        </span>
                                                {p.tags.slice(0, 4).map(t => (
                                                    <span key={t} className="badge">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="badge blue"><Icon kind="bolt" /> Featured</span>
                                    </div>

                                    <p>{p.highlight}</p>

                                    <div className="projectLinks">
                                        {p.links.map((l, idx) => {
                                            if (l.type === "link") {
                                                return (
                                                    <a key={idx} className="linkBtn primary" href={l.href} target="_blank" rel="noreferrer">
                                                        <Icon kind="link" /> {l.label}
                                                    </a>
                                                );
                                            }
                                            return (
                                                <button key={idx} className="linkBtn" onClick={() => setSelected(p)}>
                                                    <Icon kind="eye" /> {l.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CERTS */}
                <section id="certs" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <div>
                                <h2 className="sectionTitle" style={{fontSize: 20}}>Certifications</h2>
                                <p className="sectionDesc">Focused credentials that support real build skills.</p>
                            </div>
                        </div>

                        <div className="grid grid3">
                            <div className="projectCard reveal">
                                <h3>IBM AI Engineering</h3>
                                <p>Python, ML workflows, model training fundamentals, and applied AI concepts.</p>
                                <div className="badges">
                                    <span className="badge blue">Python</span>
                                    <span className="badge">ML</span>
                                    <span className="badge">NLP</span>
                                </div>
                            </div>

                            <div className="projectCard reveal">
                                <h3>Google UX Design</h3>
                                <p>User research, wireframing, prototyping, and design decisions that map to real product constraints.</p>
                                <div className="badges">
                                    <span className="badge blue">UX</span>
                                    <span className="badge">Prototyping</span>
                                    <span className="badge">Research</span>
                                </div>
                            </div>

                            <div className="projectCard reveal">
                                <h3>Google IT Support</h3>
                                <p>Systems fundamentals, troubleshooting discipline, and networking basics.</p>
                                <div className="badges">
                                    <span className="badge blue">Systems</span>
                                    <span className="badge">Networking</span>
                                    <span className="badge">Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT */}
                <section id="contact" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <div>
                                <h2 className="sectionTitle" style={{fontSize: 20}}>Contact</h2>
                                <p className="sectionDesc">Internships, junior roles, freelance builds, or collaborations.</p>
                            </div>
                        </div>

                        <div className="grid grid2">
                            <div className="projectCard reveal">
                                <h3>Reach me</h3>
                                <p>
                                    Email is the fastest. If you want GitHub links or a quick walkthrough of Ozark / Liberty Pursuit /
                                    HR Payroll, message me and I’ll send a clean summary.
                                </p>
                                <div className="projectLinks">
                                    <a className="linkBtn primary" href="mailto:ifrad.hossain04@gmail.com">
                                        <Icon kind="mail" /> ifrad.hossain04@gmail.com
                                    </a>
                                    <button className="linkBtn" onClick={copyEmail}>
                                        <Icon kind="mail" /> Copy Email
                                    </button>
                                </div>
                            </div>

                            <div className="projectCard reveal">
                                <h3>Profiles</h3>
                                <p>Check out some of my work, or connect with me through:</p>
                                <div className="projectLinks">
                                    <a className="linkBtn primary" href="https://github.com/ifradhos55" target="_blank" rel="noreferrer">
                                        <Icon kind="github" /> github.com/ifradhos55
                                    </a>
                                    <a className="linkBtn" href="https://www.linkedin.com/in/ihos25/" target="_blank" rel="noreferrer">
                                        <Icon kind="li" /> linkedin.com/in/ihos25
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="footer reveal">
                            <hr className="hr" />
                            © {new Date().getFullYear()} Ifrad Hossain
                        </div>
                    </div>
                </section>
            </main>

            {/* MODAL */}
            {selected && (
                <div
                    className="modalOverlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Project details"
                    onClick={() => setSelected(null)}
                >
                    <div className="modal" onClick={(e)=>e.stopPropagation()}>
                        <div className="modalTop">
                            <div>
                                <h3>{selected.title}</h3>
                                <div className="badges" style={{marginTop: 8}}>
                                    <span className="badge blue">{selected.year}</span>
                                    {selected.tags.map(t => <span key={t} className="badge">{t}</span>)}
                                </div>
                            </div>
                            <button className="modalClose" onClick={() => setSelected(null)}>Close</button>
                        </div>
                        <div className="modalBody">
                            <p>{selected.details}</p>
                            <div className="projectLinks" style={{marginTop: 14}}>
                                {selected.links?.filter(l => l.type === "link").map((l, idx) => (
                                    <a key={idx} className="linkBtn primary" href={l.href} target="_blank" rel="noreferrer">
                                        <Icon kind="link" /> {l.label}
                                    </a>
                                ))}
                                <button className="linkBtn" onClick={() => { setSelected(null); scrollTo("projects"); }}>
                                    <Icon kind="eye" /> Back to Projects
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
