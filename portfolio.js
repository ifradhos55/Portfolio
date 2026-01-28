const { useEffect, useMemo, useRef, useState } = React;

function useRevealOnScroll(trigger) {
    useEffect(() => {
        const timer = setTimeout(() => {
            const els = Array.from(document.querySelectorAll(".reveal"));

            if (!("IntersectionObserver" in window)) {
                els.forEach(el => el.classList.add("on"));
                return;
            }

            const io = new IntersectionObserver(
                entries => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add("on");
                            io.unobserve(e.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            els.forEach(el => {
                if (el.classList.contains("on")) return;
                io.observe(el);
            });

            return () => io.disconnect();
        }, 50);

        return () => clearTimeout(timer);
    }, [trigger]);
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
            { root: null, threshold: [0.1, 0.4] }
        );
        sections.forEach(s => io.observe(s));
        return () => io.disconnect();
    }, [sectionIds]);

    return [active, setActive];
}

function Icon({ kind }) {
    const map = {
        code: "/>", shield: "⬡", chart: "▦", link: "↗",
        eye: "◉", github: "Git", li: "in", mail: "@", bolt: "⚡"
    };
    return (
        <span aria-hidden="true" style={{
            fontFamily: "monospace", fontWeight: 800, opacity: 0.8
        }}>
            {map[kind] || "•"}
        </span>
    );
}

function App() {
    const sections = ["home", "projects", "certs", "contact"];
    const [activeSection] = useActiveSection(sections);
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("All");
    const [selected, setSelected] = useState(null);

    const projects = useMemo(() => ([
        {
            title: "Ozark (LMS)",
            year: "2026",
            highlight: "Clean React dashboard with strict data management.",
            details: "A polished dashboard-style web app focused on structured UI, reusable components, and smooth interactions. Built with a modern frontend approach and attention to layout, state, and UX flow.",
            tags: ["React", "Dashboard", "JS"],
            primaryTag: "React",
            links: [{ label: "View Details", type: "modal" }]
        },
        {
            title: "Liberty Pursuit",
            year: "2025",
            highlight: "Real-time 3D space combat experience in the browser.",
            details: "A browser-based 3D shooting game focused on fast-paced combat and interactive environments. Liberty Pursuit allows players to load and use custom 3D spaceship models via .glb files, combining dynamic gameplay with flexible asset selection. Built with an emphasis on smooth rendering, responsive controls, and immersive visual feedback.",
            tags: ["JavaScript", "Game Development", "3D Graphics"],
            primaryTag: "Game Dev",
            links: [{ label: "View Details", type: "modal" }]
        },
        {
            title: "HR & Payroll System",
            year: "2025",
            highlight: "JavaFX CRUD system with payroll algorithms.",
            details: "A JavaFX-based HR and Payroll application featuring employee CRUD workflows, payroll calculations, structured reporting, and visualization dashboards.",
            tags: ["Java", "JavaFX", "MVC"],
            primaryTag: "Java",
            links: [{ label: "View Details", type: "modal" }]
        },
        {
            title: "Air Gems",
            year: "2026",
            highlight: "Touchless gem interaction using hand gestures.",
            details: "A browser-based computer vision project built with MediaPipe Hands. Air Gems tracks real-time hand landmarks to control a smooth on-screen cursor and uses pinch gestures to instantly interact with UI elements. Designed for low latency, natural motion, and responsive visual feedback, with all processing done locally in the browser.",
            tags: ["JavaScript", "Computer Vision", "MediaPipe"],
            primaryTag: "JavaScript",
            links: [{ label: "View Details", type: "modal" }]

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
            const matchesQ = !q || p.title.toLowerCase().includes(q) || p.highlight.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
            const matchesTag = tag === "All" || p.tags.includes(tag);
            return matchesQ && matchesTag;
        });
    }, [projects, query, tag]);

    useRevealOnScroll(filtered);

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
                <div className="container">
                    <div className="nav">
                        <div className="brand">
                            <h1>Ifrad Hossain</h1>
                        </div>
                        <nav className="navlinks">
                            {sections.map(s => (
                                <a key={s} className={`pill ${activeSection === s ? "active" : ""}`} href={`#${s}`} onClick={(e)=>{e.preventDefault();scrollTo(s);}}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </a>
                            ))}
                        </nav>
                        <div className="ctaRow">
                            <a className="btn btnPrimary" href="#contact" onClick={(e)=>{e.preventDefault();scrollTo("contact");}}>
                                Connect
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section id="home" className="hero">
                    <div className="container">
                        <div className="heroGrid">
                            <div className="reveal">
                                <h2 className="headline">Developing reliable<br/>systems & solutions.</h2>
                                <p className="subhead">
                                    Full Stack Developer focused on structure and performance.
                                    I build dashboards, automation tools, and interactive web-applications that work cleanly.
                                </p>
                                <div className="tagRow">
                                    <span className="tag">React</span>
                                    <span className="tag">Java / JavaFX</span>
                                    <span className="tag">Python</span>
                                    <span className="tag">SQL</span>
                                    <span className="tag">.NET</span>
                                </div>
                                <div className="heroActions">
                                    <button className="btn btnPrimary" onClick={() => scrollTo("projects")}>View Work</button>
                                    <a className="btn" href="https://github.com/ifradhos55" target="_blank">GitHub</a>
                                    <a className="btn" href="https://linkedin.com/in/ihos25" target="_blank">LinkedIn</a>
                                </div>
                            </div>

                            <div className="reveal" style={{transitionDelay: '100ms'}}>
                                <div className="metricGrid">
                                    <div className="metric">
                                        <h3>Dashboards</h3>
                                        <p>React State & UX</p>
                                    </div>
                                    <div className="metric">
                                        <h3>Backends</h3>
                                        <p>Java & Python Logic</p>
                                    </div>
                                    <div className="metric">
                                        <h3>Systems</h3>
                                        <p>CRUD & Workflows</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <div>
                                <h2 className="sectionTitle">Selected Projects</h2>
                                <p className="sectionDesc">Real world builds. No filler.</p>
                            </div>
                            <div className="filters">
                                <input className="input" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search..." />
                                <select className="select" value={tag} onChange={(e)=>setTag(e.target.value)}>
                                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid2">
                            {filtered.map((p) => (
                                <article key={p.title} className="projectCard reveal">
                                    <div className="projectTop">
                                        <h3>{p.title}</h3>
                                        <div className="badges">
                                            <span className={`badge ${p.primaryTag === "React" || p.primaryTag === "Java" ? "blue" : "red"}`}>
                                                {p.year}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="badges" style={{marginTop:0, marginBottom: 12}}>
                                        {p.tags.map(t => <span key={t} className="badge">{t}</span>)}
                                    </div>
                                    <p>{p.highlight}</p>
                                    <div className="projectLinks">
                                        {p.links.map((l, idx) => (
                                            l.type === "link"
                                                ? <a key={idx} className="linkBtn primary" href={l.href} target="_blank"><Icon kind="link"/> {l.label}</a>
                                                : <button key={idx} className="linkBtn" onClick={() => setSelected(p)}><Icon kind="eye"/> {l.label}</button>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="certs" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <div>
                                <h2 className="sectionTitle">Certifications</h2>
                            </div>
                        </div>
                        <div className="grid grid3">
                            <div className="projectCard reveal">
                                <h3>IBM AI Engineering</h3>
                                <p>Python, ML workflows, and model training fundamentals.</p>
                                <div className="badges"><span className="badge blue">Python</span></div>
                            </div>
                            <div className="projectCard reveal">
                                <h3>Google UX Design</h3>
                                <p>Wireframing, prototyping, and user research logic.</p>
                                <div className="badges"><span className="badge blue">Figma</span></div>
                            </div>
                            <div className="projectCard reveal">
                                <h3>Google IT Support</h3>
                                <p>Networking basics and system troubleshooting.</p>
                                <div className="badges"><span className="badge blue">Systems</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section">
                    <div className="container">
                        <div className="sectionHead reveal">
                            <h2 className="sectionTitle">Contact</h2>
                        </div>
                        <div className="projectCard reveal" style={{textAlign:'center', padding: '60px 20px'}}>
                            <h3 style={{fontSize:24, marginBottom: 10}}>Ready to build.</h3>
                            <p style={{maxWidth: 400, margin: "0 auto 30px"}}>
                                Available for internships and freelance projects.
                            </p>
                            <div style={{display:'flex', justifyContent:'center', gap: 10}}>
                                <a className="btn btnPrimary" href="mailto:ifrad.hossain04@gmail.com">ifrad.hossain04@gmail.com</a>
                                <button className="btn" onClick={copyEmail}>Copy</button>
                            </div>
                        </div>
                        <div className="footer">
                            <hr className="hr"/>
                            © {new Date().getFullYear()} Ifrad Hossain
                        </div>
                    </div>
                </section>
            </main>

            {selected && (
                <div className="modalOverlay" onClick={() => setSelected(null)}>
                    <div className="modal reveal on" onClick={(e)=>e.stopPropagation()}>
                        <div className="modalTop">
                            <h3>{selected.title}</h3>
                            <button className="modalClose" onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <div className="modalBody">
                            <p>{selected.details}</p>
                            <div className="badges" style={{marginTop:20}}>
                                {selected.tags.map(t => <span key={t} className="badge">{t}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
