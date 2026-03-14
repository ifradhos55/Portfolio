window.Portfolio = window.Portfolio || {};

window.Portfolio.PROJECTS = [
    {
        title: "Ozark (LMS)",
        year: "2026",
        highlight: "Enterprise-grade Learning Management System with a modern dashboard.",
        details: "Ozark is a comprehensive Learning Management System built for reliability and scale. It features a robust backend powered by ASP.NET and C#, with PostgreSQL for data persistence and Azure for cloud hosting. The frontend offers a premium user experience styled with Tailwind CSS. Includes a student hub, assignment submission systems, and grade tracking.\n(Note: When idle for 20 minutes or longer, the server will deactivate. Upon detecting user activity it will restart within 30-60 seconds.)\n",
        tags: ["ASP .NET", "C#", "Tailwind CSS", "PostgreSQL", "Azure", "MVC"],
        primaryTag: "ASP .NET",
        links: [
            { label: "Visit Ozark", type: "link", href: "https://ozarklms-crakb2dqdqb4crfn.canadacentral-01.azurewebsites.net" },
            { label: "Source Code", type: "link", href: "https://github.com/Luistello87/OzarkLMS/tree/master/OzarkLMS" },
            { label: "View Details", type: "modal" }
        ]
    },
    {
        title: "Cosmic Fusion",
        year: "2026",
        highlight: "Interactive 3D Solar System & Galaxy Simulation.",
        details: "A high-performance WebGL simulation featuring real-time orbital physics, procedural texture generation via Canvas API, and a massive 100,000-particle spiral galaxy view. Built with Three.js for immersive 3D rendering directly in the browser.",
        tags: ["Three.js", "WebGL", "JavaScript"],
        primaryTag: "Three.js",
        links: [
            { label: "Visit Cosmic Fusion", type: "link", href: "https://cosmicfusionsimulator-six.vercel.app" },
            { label: "Source Code", type: "link", href: "https://github.com/ifradhos55/Cosmic-Fusion" },
            { label: "View Details", type: "modal" }
        ]
    },
    {
        title: "Air Cursor",
        year: "2026",
        highlight: "Touchless interaction using hand gestures.",
        details: "A browser-based computer vision project built with MediaPipe Hands. Air Cursor tracks real-time hand hand gestures to control the system's cursor and uses pinch gestures to instantly interact with UI elements. Designed for low latency, natural motion, and responsive visual feedback, with all processing done locally on your machine.",
        tags: ["Python", "Computer Vision", "MediaPipe"],
        primaryTag: "Python",
        links: [
            { label: "Source Code", type: "link", href: "https://github.com/ifradhos55/AirCursor" },
            { label: "View Details", type: "modal" }
        ]
    },
    {
        title: "Markain",
        year: "2026",
        highlight: "Integrated institutional Business Management System for comprehensive organizational operations.",
        details: "Markain is a full-featured Business Management System built with ASP.NET Core MVC and Entity Framework Core. It includes a real-time operational dashboard, a Training Hub for delivering institutional modules, a built-in Applicant Tracking System (ATS) for managing recruitment cycles, a Collaboration Hub for secure team communication, a PDF Toolbox for document processing, and a public-facing Careers Portal for talent acquisition.",
        tags: ["ASP .NET", "C#", "PostgreSQL", "Tailwind CSS", "Entity Framework"],
        primaryTag: "ASP .NET",
        links: [
            { label: "Source Code", type: "link", href: "https://github.com/ifradhos55/Markain" },
            { label: "View Details", type: "modal" }
        ]
    }
];

window.Portfolio.SECTIONS = ["home", "projects", "certs", "resume"];
