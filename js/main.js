function init() {
    const P = window.Portfolio;
    if (P && P.App && P.PROJECTS && P.SECTIONS && P.RESUME_DATA && P.Icon && P.useActiveSection && P.HandTracker) {
        const App = P.App;
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(<App />);
    } else {
        setTimeout(init, 50);
    }
}
init();
