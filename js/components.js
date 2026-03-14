window.Portfolio = window.Portfolio || {};

window.Portfolio.Icon = function({ kind }) {
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
