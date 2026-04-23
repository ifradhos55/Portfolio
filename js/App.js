const { useMemo, useState, useEffect, useRef } = React;

window.Portfolio = window.Portfolio || {};

function Resume({ data }) {
    return (
        <div className="resume-container">
            <div className="resume-summary">
                <p>{data.summary}</p>
            </div>

            <div className="resume-grid">
                <div>
                    <h4 className="resume-column-title">Experience</h4>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="resume-item">
                            <div className="resume-item-header">
                                <span className="resume-item-title">{exp.role}</span>
                                <span className="resume-item-period">{exp.period}</span>
                            </div>
                            <div className="resume-item-org">{exp.company} • {exp.location}</div>
                            <p className="resume-item-details">{exp.details}</p>
                        </div>
                    ))}

                </div>
                <div>
                    <h4 className="resume-column-title">Projects</h4>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="resume-item">
                            <div className="resume-item-header">
                                <span className="resume-item-title">{proj.title}</span>
                                {proj.period && <span className="resume-item-period">{proj.period}</span>}
                            </div>
                            <div className="resume-item-org" style={{ fontSize: 12, color: 'var(--orange)', opacity: 0.8 }}>{proj.tech}</div>
                            <p className="resume-item-details">{proj.details}</p>
                            {proj.links && (
                                <div className="resume-item-links" style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                    {proj.links.map((link, j) => (
                                        <a key={j} href={link.href} target="_blank" className="resume-link" style={{
                                            fontSize: 11, color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.9
                                        }}>
                                            <window.Portfolio.Icon kind="link" /> {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}


                </div>
            </div>

            <div className="skills-section">
                <h4 className="resume-column-title">Technical Skills</h4>
                <div className="skills-grid">
                    {Object.entries(data.skills).map(([cat, list]) => (
                        <div key={cat} className="skill-category">
                            <div className="skill-category-title">
                                {cat}
                            </div>
                            <div className="skill-list">
                                {list.map(s => <span key={s} className="skill-tag">{s}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="skills-section" style={{ marginTop: 40, borderTop: 'none', paddingTop: 0 }}>
                <h4 className="resume-column-title">Certifications</h4>
                <div className="skill-list">
                    {data.certifications.map((c, idx) => (
                        <a key={idx} href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="skill-tag" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {c.name}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
function rewriteHoverStyles() {
    try {
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
            try {
                // Only process local stylesheets to avoid CORS issues
                if (sheet.href && !sheet.href.includes(window.location.origin)) return;

                const rules = Array.from(sheet.cssRules || []);
                rules.forEach(rule => {
                    if (rule.selectorText && rule.selectorText.includes(':hover')) {
                        const newSelector = rule.selectorText.replace(/:hover/g, '.air-hover');
                        try {
                            sheet.insertRule(`${newSelector} { ${rule.style.cssText} }`, sheet.cssRules.length);
                        } catch (e) { }
                    }
                });
            } catch (e) { }
        });
    } catch (e) { }
}
const ThumbUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
    </svg>
);

const ThumbDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.37-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
    </svg>
);

function AirScroll({ active, onError }) {
    const [state, setState] = useState({
        isScrollingUp: false,
        isScrollingDown: false,
        showInstructions: false
    });
    const trackerRef = useRef(null);

    useEffect(() => {
        if (!active) {
            if (trackerRef.current) trackerRef.current.stop();
            setState({ isScrollingUp: false, isScrollingDown: false, showInstructions: false });
            return;
        }

        setState(s => ({ ...s, showInstructions: true }));
        const timer = setTimeout(() => setState(s => ({ ...s, showInstructions: false })), 5000);

        if (!trackerRef.current) {
            trackerRef.current = new window.Portfolio.HandTracker();
            
            trackerRef.current.addEventListener('tracking-update', (e) => {
                const { isScrollingUp, isScrollingDown } = e.detail;
                setState(s => ({ ...s, isScrollingUp, isScrollingDown }));

                const SCROLL_SPEED = 20;
                if (isScrollingUp) window.scrollBy({ top: -SCROLL_SPEED, behavior: 'auto' });
                if (isScrollingDown) window.scrollBy({ top: SCROLL_SPEED, behavior: 'auto' });
            });

            trackerRef.current.addEventListener('tracking-error', (e) => onError(e.detail.message));
        }

        trackerRef.current.start();
        return () => {
            if (trackerRef.current) trackerRef.current.stop();
            clearTimeout(timer);
        };
    }, [active]);

    if (!active) return null;

    return (
        <>
            {state.showInstructions && (
                <div className="air-scroll-instructions">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 12 }}>
                        <ThumbUpIcon /> <span>to Scroll Up</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 16 }}>
                        <ThumbDownIcon /> <span>to Scroll Down</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, borderTop: '1px solid rgba(255, 68, 0, 0.2)', paddingTop: 12 }}>
                        Release any finger(s) --&gt; stop scrolling
                    </div>
                </div>
            )}
            <div className={`air-scroll-indicator ${state.isScrollingUp ? 'up' : ''} ${state.isScrollingDown ? 'down' : ''}`}>
                {state.isScrollingUp && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ThumbUpIcon /> <span>SCROLLING UP</span>
                    </div>
                )}
                {state.isScrollingDown && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ThumbDownIcon /> <span>SCROLLING DOWN</span>
                    </div>
                )}
            </div>
        </>
    );
}






window.Portfolio.App = function () {
    const PROJECTS = window.Portfolio.PROJECTS;
    const SECTIONS = window.Portfolio.SECTIONS;
    const useRevealOnScroll = window.Portfolio.useRevealOnScroll;
    const useActiveSection = window.Portfolio.useActiveSection;
    const Icon = window.Portfolio.Icon;
    const [activeSection] = useActiveSection(SECTIONS);
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("All");
    const [selected, setSelected] = useState(null);
    const [imgIdx, setImgIdx] = useState(0);
    const [airScrollActive, setAirScrollActive] = useState(false);
    const [airScrollError, setAirScrollError] = useState(null);

    const projects = PROJECTS;

    const allTags = useMemo(() => {
        const set = new Set(["All"]);
        projects.forEach(p => p.tags.forEach(t => set.add(t)));
        return Array.from(set);
    }, [projects]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return projects.filter(p => {
            const matchesQ = !q || p.title.toLowerCase().includes(q) || p.highlight.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
            const matchesTag = tag === "All" || p.tags.includes(tag);
            return matchesQ && matchesTag;
        });
    }, [projects, query, tag]);

    // useRevealOnScroll(filtered);

    const [scrollDir, setScrollDir] = useState("up");

    useEffect(() => {
        let lastY = window.scrollY;
        const handleScroll = () => {
            const currY = window.scrollY;
            if (currY > lastY && currY > 50) {
                setScrollDir("down");
            } else if (currY < lastY) {
                setScrollDir("up");
            }
            lastY = currY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollTo(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function copyEmail() {
        navigator.clipboard?.writeText("ifrad.hossain04@gmail.com");
    }

    return (
        <>
            <div className="bg-noise" />
            <header className="topbar">
                <div className="topbar-art">
                    <svg className="topbar-svg" viewBox="0 0 1440 70" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <filter id="traceGlow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <rect width="100%" height="100%" fill="#050505" />

                        <g className="circuit-trace t1" stroke="#FF4400" strokeWidth="0.8" fill="none" strokeLinecap="round" filter="url(#traceGlow)">
                            <path d="M-10 48 H90 L108 30 H240 L258 48 H380" />
                            <path d="M240 30 V12" />
                            <circle cx="90" cy="48" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="240" cy="30" r="2.5" fill="#FF4400" stroke="none" />
                            <circle cx="380" cy="48" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="240" cy="12" r="1.5" fill="#FF4400" stroke="none" />
                        </g>

                        <g className="circuit-trace t2" stroke="#FF4400" strokeWidth="0.8" fill="none" strokeLinecap="round" filter="url(#traceGlow)">
                            <path d="M180 10 H320 L338 28 H470 L488 10 H600" />
                            <path d="M470 28 V55" />
                            <circle cx="320" cy="10" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="470" cy="28" r="2.5" fill="#FF4400" stroke="none" />
                            <circle cx="600" cy="10" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="470" cy="55" r="1.5" fill="#FF4400" stroke="none" />
                        </g>

                        <g className="circuit-trace t3" stroke="#FF4400" strokeWidth="0.8" fill="none" strokeLinecap="round" filter="url(#traceGlow)">
                            <path d="M520 60 H660 L678 42 H800 L818 60 H940" />
                            <path d="M800 42 V18" />
                            <circle cx="660" cy="60" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="800" cy="42" r="2.5" fill="#FF4400" stroke="none" />
                            <circle cx="940" cy="60" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="800" cy="18" r="1.5" fill="#FF4400" stroke="none" />
                        </g>

                        <g className="circuit-trace t4" stroke="#FF4400" strokeWidth="0.8" fill="none" strokeLinecap="round" filter="url(#traceGlow)">
                            <path d="M840 14 H980 L998 32 H1100 L1118 14 H1260" />
                            <path d="M1100 32 V58" />
                            <circle cx="980" cy="14" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="1100" cy="32" r="2.5" fill="#FF4400" stroke="none" />
                            <circle cx="1260" cy="14" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="1100" cy="58" r="1.5" fill="#FF4400" stroke="none" />
                        </g>

                        <g className="circuit-trace t5" stroke="#FF4400" strokeWidth="0.8" fill="none" strokeLinecap="round" filter="url(#traceGlow)">
                            <path d="M1160 56 H1280 L1298 38 H1400 L1418 20 H1450" />
                            <path d="M1400 38 V62" />
                            <circle cx="1280" cy="56" r="2" fill="#FF4400" stroke="none" />
                            <circle cx="1400" cy="38" r="2.5" fill="#FF4400" stroke="none" />
                            <circle cx="1400" cy="62" r="1.5" fill="#FF4400" stroke="none" />
                        </g>

                        <text x="720" y="36" textAnchor="middle" dominantBaseline="middle"
                            className="circuit-name" fill="#FF4400"
                            fontSize="22" fontFamily="'Fira Code', monospace"
                            fontWeight="600" letterSpacing="12">
                            IFRAD
                        </text>
                    </svg>
                </div>
                <div className="container">
                    <div className="nav">
                        <div className="brand">
                            <h1>IFRAD ISTIAQUE HOSSAIN</h1>
                        </div>
                        <nav className="navlinks">
                            {SECTIONS.map(s => (
                                <a key={s} className="pill" href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </a>
                            ))}
                        </nav>
                        <div className={`ctaRow ${scrollDir === 'down' ? 'hidden' : ''}`}>
                            <button
                                className={`btn btn-air-cursor ${airScrollActive ? 'active' : ''}`}
                                onClick={() => setAirScrollActive(!airScrollActive)}
                                title="Air-Scroll: Hand-gesture scrolling"
                            >
                                <span className="status-dot" />
                                Air-Scroll
                            </button>
                            <a className="btn btnPrimary" href="#Contact" onClick={(e) => { e.preventDefault(); scrollTo("Contact"); }}>
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section id="home" className="hero">
                    <div className="container">
                        <div className="heroGrid">
                            <div>
                                <h2 className="headline">Developing reliable<br />systems & solutions.</h2>
                                <p className="subhead">
                                    Full Stack Developer focused on structure and performance.
                                    I build dashboards, automation tools, and interactive web-applications for versitile purposes.
                                </p>
                                <div className="tagRow">
                                    <span className="tag">React</span>
                                    <span className="tag">Next.js</span>
                                    <span className="tag">TypeScript</span>
                                    <span className="tag">Java / JavaFX</span>
                                    <span className="tag">Python</span>
                                    <span className="tag">C#</span>
                                    <span className="tag">TensorFlow</span>
                                    <span className="tag">PyTorch</span>
                                    <span className="tag">MediaPipe</span>
                                    <span className="tag">Django</span>
                                    <span className="tag">SQL</span>
                                    <span className="tag">Node.js</span>
                                    <span className="tag">Express.js</span>
                                    <span className="tag">ASP .NET</span>
                                    <span className="tag">Tailwind</span>
                                    <span className="tag">Figma</span>
                                    <span className="tag">Git</span>
                                    <span className="tag">GitHub</span>
                                    <span className="tag">CI/CD</span>
                                    <span className="tag">DevOps</span>
                                    <span className="tag">Jupyter Notebooks</span>
                                    <span className="tag">RESTful APIs</span>
                                    <span className="tag">Responsive Web Design</span>
                                    <span className="tag">Basic Networking and OS Troubleshooting</span>
                                    <span className="tag">Linux (Terminal)</span>
                                    <span className="tag">AWS</span>
                                    <span className="tag">Azure</span>
                                    <span className="tag">Google Cloud</span>
                                </div>
                                <div className="heroActions">
                                    <button className="btn btnPrimary" onClick={() => scrollTo("projects")}>View Work</button>
                                    <a className="btn" href="https://github.com/ifradhos55" target="_blank">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                        GitHub
                                    </a>
                                    <a className="btn" href="https://linkedin.com/in/ihos25" target="_blank">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        LinkedIn
                                    </a>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" /></svg>
                                        Computer Programming at George Brown Polytechnic
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        Toronto, ON, Canada
                                    </p>
                                </div>
                            </div>

                            <div style={{ transitionDelay: '100ms' }}>
                                <div className="metricGrid">
                                    <h4>What I offer</h4>
                                    <div className="metric">
                                        <h3>Full-Stack Web Apps</h3>
                                        <p>Development with React, Next.js, ASP.NET Core, and Django, from UI to deployment. Relational databases and NoSQL databases. (MongoDB, PostgreSQL, MySQL, SQL Server)</p>
                                    </div>
                                    <div className="metric">
                                        <h3>Backend & Database Engineering</h3>
                                        <p>Scalable APIs and data layers using Node.js, Express.js, PostgreSQL, and SQL Server.</p>
                                    </div>
                                    <div className="metric">
                                        <h3>Desktop & Enterprise Software</h3>
                                        <p>Production-grade applications with Java, JavaFX, Spring Boot, and C#.</p>
                                    </div>
                                    <div className="metric">
                                        <h3>AI & Data Pipelines</h3>
                                        <p>Model training and integration using TensorFlow, PyTorch, and MediaPipe for real-world use cases.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects" className="section">
                    <div className="container">
                        <div className="sectionHead">
                            <div>
                                <h2 className="sectionTitle">Projects</h2>
                                <p className="sectionDesc"></p>
                            </div>
                            <div className="filters">
                                <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
                                <select className="select" value={tag} onChange={(e) => setTag(e.target.value)}>
                                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid2">
                            {filtered.map((p) => (
                                <article key={p.title} className="projectCard">
                                    <div className="projectTop">
                                        <h3>{p.title}</h3>
                                    </div>
                                    <div className="badges" style={{ marginTop: 0, marginBottom: 12 }}>
                                        {p.tags.map(t => <span key={t} className="badge">{t}</span>)}
                                    </div>
                                    <p>{p.highlight}</p>
                                    <div className="projectLinks">
                                        {p.links.map((l, idx) => (
                                            l.type === "link"
                                                ? <a key={idx} className="linkBtn primary" href={l.href} target="_blank"><Icon kind="link" /> {l.label}</a>
                                                : <button key={idx} className="linkBtn" onClick={() => { setSelected(p); setImgIdx(0); }}><Icon kind="eye" /> {l.label}</button>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container">
                    <div id="resume" className="resumeSection">
                        <div className="resumeHeader">
                            <div>
                                <h3 id="resumeTitle" className="resumeTitle">Resume</h3>
                                <p className="resumeDesc">
                                    A interactive look at my professional journey.
                                </p>
                            </div>
                            <a className="btn btnPrimary" href="assets/resume/IfradHossain.pdf" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                Download PDF
                            </a>
                        </div>

                        <Resume data={window.Portfolio.RESUME_DATA} />
                    </div>

                    <section id="education" className="section" style={{ marginTop: 80 }}>
                        <div className="edu-header-container">
                            <h2 className="sectionTitle" style={{ textTransform: 'uppercase', marginBottom: 0 }}>Education & Acknowledgements</h2>

                        </div>
                        <hr className="hr" style={{ marginTop: 20, marginBottom: 40 }} />
                        
                        <div className="edu-grid">
                            <div className="edu-col">
                                <h3 className="edu-section-title">
                                    Education
                                </h3>
                                {window.Portfolio.RESUME_DATA.education.map((edu, i) => (
                                    <div key={i} className="edu-card">
                                        <h4 className="edu-card-title">{edu.degree}</h4>
                                        <div className="edu-card-subtitle">{edu.school} • {edu.period}</div>
                                        <p className="edu-card-text">{edu.details}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="edu-col">
                                <h3 className="edu-section-title">
                                    Academic Transcripts & Letters
                                </h3>
                                <div className="edu-card">
                                    <h4 className="edu-card-title">Official Academic Transcript</h4>
                                    <div className="edu-card-text" style={{ marginBottom: 20, marginTop: 12 }}>George Brown Polytechnic</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                                        <a href="assets/Documentations/Transcript.pdf" target="_blank" rel="noopener noreferrer" className="edu-transcript-btn" style={{ marginTop: 0 }}>
                                            View Transcript Document
                                        </a>
                                        <a href="assets/Documentations/deanslist/firstsemdeanslist.jpg" target="_blank" rel="noopener noreferrer" className="edu-transcript-btn" style={{ marginTop: 0 }}>
                                            Dean's List Letter Semester 1
                                        </a>
                                        <a href="assets/Documentations/deanslist/secondsemdeanslist.jpg" target="_blank" rel="noopener noreferrer" className="edu-transcript-btn" style={{ marginTop: 0 }}>
                                            Dean's List Letter Semester 2
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="edu-section-title" style={{ marginTop: 80, marginBottom: 0 }}>
                            Professional Certifications
                        </h3>
                        <div className="cert-grid">
                            {window.Portfolio.RESUME_DATA.certifications.map((c, idx) => (
                                <div key={idx} className="cert-card">
                                    <img src={c.image} alt={c.name} className="cert-img" />
                                    <div className="cert-overlay">
                                        <div style={{ textAlign: 'center', padding: '0 20px' }}>
                                            <h3 style={{ fontSize: 18, marginBottom: 12, color: 'white' }}>{c.name}</h3>
                                            <a
                                                href={c.verifyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cert-verify-btn"
                                            >
                                                Verify Cert
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="Contact" className="section" style={{ marginTop: 80 }}>
                        <div className="sectionHead">
                            <h2 className="sectionTitle">Reach Out Today!</h2>
                        </div>
                        <div className="projectCard" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <h3 style={{ fontSize: 24, marginBottom: 10 }}>Ready to build.</h3>
                            <p style={{ maxWidth: 400, margin: "0 auto 30px" }}>
                                Available for internships and freelance projects.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                                <a className="btn btnPrimary" href="mailto:ifrad.hossain04@gmail.com">ifrad.hossain04@gmail.com</a>
                                <button className="btn" onClick={copyEmail}>Copy</button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40 }}>
                                <a href="https://github.com/ifradhos55" target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/ihos25/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                            </div>
                        </div>
                    </section>

                    <div className="footer">
                        <hr className="hr" />
                        © {new Date().getFullYear()} Ifrad Hossain
                    </div>
                </div>
            </main>

            {selected && (
                <div className="modalOverlay" onClick={() => setSelected(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalTop">
                            <h3>{selected.title}</h3>
                            <button className="modalClose" onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <div className="modalBody">
                            <p>{selected.details}</p>
                            {selected.presentationImages && (
                                <div className="modalPreview" style={{ 
                                    display: 'flex', 
                                    gap: '16px', 
                                    overflowX: 'auto', 
                                    paddingBottom: '16px', 
                                    scrollSnapType: 'x mandatory',
                                    scrollBehavior: 'smooth',
                                    marginBottom: '20px'
                                }}>
                                    {selected.presentationImages.map((src, i) => (
                                        <img 
                                            key={i} 
                                            src={src} 
                                            alt={`Slide ${i + 1}`} 
                                            style={{ 
                                                width: '85%',
                                                height: 'auto',
                                                maxHeight: '340px',
                                                borderRadius: '8px',
                                                scrollSnapAlign: 'start',
                                                objectFit: 'contain',
                                                backgroundColor: '#fff',
                                                flexShrink: 0,
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }} 
                                        />
                                    ))}
                                </div>
                            )}
                            {selected.preview && (
                                <div className="modalPreview">
                                    <iframe
                                        src={selected.preview}
                                        title={`${selected.title} Preview`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                            {selected.images && (
                                <div className="modalPreview slideshow">
                                    <img
                                        src={selected.images[imgIdx]}
                                        alt={`${selected.title} screenshot ${imgIdx + 1}`}
                                        className="slideshowImg"
                                    />
                                    {selected.images.length > 1 && (
                                        <div className="slideshowNav">
                                            <button className="ssBtn" onClick={() => setImgIdx((imgIdx - 1 + selected.images.length) % selected.images.length)}>←</button>
                                            <div className="ssDots">
                                                {selected.images.map((_, i) => (
                                                    <span key={i} className={`ssDot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                                                ))}
                                            </div>
                                            <button className="ssBtn" onClick={() => setImgIdx((imgIdx + 1) % selected.images.length)}>→</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="projectLinks" style={{ marginTop: 24 }}>
                                {selected.links.filter(l => l.type === "link").map((l, idx) => (
                                    <a key={idx} className="linkBtn primary" href={l.href} target="_blank" rel="noopener noreferrer">
                                        <Icon kind="link" /> {l.label}
                                    </a>
                                ))}
                            </div>
                            <div className="badges" style={{ marginTop: 20 }}>
                                {selected.tags.map(t => <span key={t} className="badge">{t}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {airScrollError && (
                <div style={{
                    position: 'fixed', bottom: 20, right: 20, background: '#811', color: 'white',
                    padding: '12px 20px', borderRadius: 8, zIndex: 10001, fontSize: 13, border: '1px solid #f44'
                }}>
                    {airScrollError}
                    <button style={{ marginLeft: 15, color: 'white', opacity: 0.7 }} onClick={() => setAirScrollError(null)}>✕</button>
                </div>
            )}

            <AirScroll active={airScrollActive} onError={(msg) => { setAirScrollError(msg); setAirScrollActive(false); }} />
        </>
    );
}
