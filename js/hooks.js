const { useEffect, useState } = React;

window.Portfolio = window.Portfolio || {};

window.Portfolio.useRevealOnScroll = function(trigger) {
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

window.Portfolio.useActiveSection = function(sectionIds) {
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
