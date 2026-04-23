window.Portfolio = window.Portfolio || {};

window.Portfolio.PROJECTS = [
    {
        title: "Ozark (LMS)",
        highlight: "Enterprise-grade Learning Management System with a modern dashboard.",
        details: "Ozark is a comprehensive Learning Management System built for reliability and scale. It features a robust backend powered by ASP.NET and C#, with PostgreSQL for data persistence and Azure for cloud hosting. The frontend offers a premium user experience styled with Tailwind CSS. Includes a student hub, assignment submission systems, and grade tracking.\n(Note: When idle for 20 minutes or longer, the server will deactivate. Upon detecting user activity it will restart within 30-60 seconds.)\n",
        tags: ["ASP .NET", "C#", "Tailwind CSS", "PostgreSQL", "Azure", "MVC"],
        primaryTag: "ASP .NET",
        images: [
            "assets/img/ozark/SC 2026-03-18 at 11.56.02 PM.jpg",
            "assets/img/ozark/SC 2026-03-18 at 11.56.16 PM.jpg",
            "assets/img/ozark/SC 2026-03-18 at 11.56.40 PM.jpg",
            "assets/img/ozark/SC 2026-03-19 at 12.09.21 AM.jpg",
            "assets/img/ozark/SC 2026-03-19 at 12.17.40 AM.jpg"
        ],
        presentationImages: [
            "assets/img/ozark/presentation/page_0.jpg",
            "assets/img/ozark/presentation/page_1.jpg",
            "assets/img/ozark/presentation/page_2.jpg",
            "assets/img/ozark/presentation/page_3.jpg",
            "assets/img/ozark/presentation/page_4.jpg",
            "assets/img/ozark/presentation/page_5.jpg",
            "assets/img/ozark/presentation/page_6.jpg",
            "assets/img/ozark/presentation/page_7.jpg",
            "assets/img/ozark/presentation/page_8.jpg",
            "assets/img/ozark/presentation/page_9.jpg"
        ],
        links: [
            { label: "Overview", type: "link", href: "assets/Documentations/OzarkLMS_Final_Report (1).pdf" },
            { label: "Testing", type: "link", href: "assets/Documentations/OzarkLMS_Testing_Documentation (1).pdf" },
            { label: "Visit Ozark", type: "link", href: "https://ozarklms-crakb2dqdqb4crfn.canadacentral-01.azurewebsites.net" },
            { label: "Source Code", type: "link", href: "https://github.com/Luistello87/OzarkLMS/tree/master/OzarkLMS" },
            { label: "View Details", type: "modal" }
        ]
    },
    {
        title: "Cosmic Fusion",
        highlight: "Interactive 3D Solar System & Galaxy Simulation.",
        details: "A high-performance WebGL simulation featuring real-time orbital physics, procedural texture generation via Canvas API, and a massive 100,000-particle spiral galaxy view. Built with Three.js for immersive 3D rendering directly in the browser.",
        tags: ["Three.js", "WebGL", "JavaScript"],
        primaryTag: "Three.js",
        preview: "https://cosmicfusionsimulator-six.vercel.app",
        links: [
            { label: "Visit Cosmic Fusion", type: "link", href: "https://cosmicfusionsimulator-six.vercel.app" },
            { label: "Source Code", type: "link", href: "https://github.com/ifradhos55/Cosmic-Fusion" },
            { label: "View Details", type: "modal" }
        ]
    },
    {
        title: "Air Cursor",
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
        title: "Mac Scraper",
        highlight: "High-performance file management tool using the native Spotlight engine.",
        details: "Mac Scraper is a high-performance system utility for macOS built with Python. It leverages the native Spotlight engine to find any file type across the entire system instantly. Users can filter results by file size and age to quickly identify and manage data. The application also provides raw system information, offering a transparent view of memory and battery health.",
        tags: ["Python", "macOS", "Spotlight API", "Tkinter"],
        primaryTag: "Python",
        images: [
            "assets/img/MacScraper/pic1.jpg",
            "assets/img/MacScraper/pic2.jpg",
            "assets/img/MacScraper/pic3.jpg"
        ],
        links: [
            { label: "Source Code", type: "link", href: "https://github.com/ifradhos55/Mac-Scraper" },
            { label: "Overview", type: "link", href: "assets/Documentations/MacScraper_Overview.pdf" },
            { label: "Implementation", type: "link", href: "assets/Documentations/MacScraper_Implementation_v2.pdf" },
            { label: "View Details", type: "modal" }
        ]
    }
];

window.Portfolio.SECTIONS = ["home", "projects", "resume", "education"];

window.Portfolio.RESUME_DATA = {
    summary: "Full stack software developer with hands-on experience building and maintaining web applications across modern frontend and backend stacks. Proficient in JavaScript, TypeScript, React, Java, C#, and Python with practical experience developing RESTful services using Spring Boot and ASP.NET MVC. Strong foundation in SQL and PostgreSQL, version control with Git, and Linux-based development workflows, complemented by DevOps practices including CI/CD to deliver reliable production-ready software.",
    education: [
        {
            school: "George Brown Polytechnic",
            degree: "Associates in Computer Programming",
            period: "April 2026",
            location: "Toronto, ON",
            details: "Relevant Coursework: Data Structures and Algorithms, Object-Oriented Software Development, Server-Side Web Development, Database Systems, Linux Systems, and Bash Scripting."
        }
    ],
    experience: [
        {
            company: "Sky Group Residence",
            role: "Coordinator",
            period: "Jan 2025 – Dec 2025",
            location: "Toronto, ON",
            details: "Coordinated with prospective tenants, provided walkthroughs, and addressed inquiries. Scheduled and conducted property showings and acted as a primary point of contact for operational needs."
        },
        {
            company: "Cineplex VIP Theatres",
            role: "VIP Cast Member",
            period: "Dec 2023 – Dec 2024",
            location: "Saskatoon, SK",
            details: "Delivered high-quality customer service in a fast-paced VIP environment. Performed opening/closing duties and maintained facility cleanliness and safety standards."
        },
        {
            company: "Access Research",
            role: "Market Research Interviewer",
            period: "Nov 2022 – Jun 2023",
            location: "Saskatoon, SK",
            details: "Conducted structured surveys for public and private organizations. Followed strict data collection protocols to ensure accuracy and confidentiality."
        }
    ],
    projects: [
        {
            title: "Ozark LMS",
            tech: "ASP.NET Core, C#, PostgreSQL, Tailwind CSS, Azure, MVC",
            details: "Developed a role-based LMS with administrative and assessment workflows. Implemented client-side data persistence and deployed to Azure.",
            links: [
                { label: "Visit Ozark", href: "https://ozarklms-crakb2dqdqb4crfn.canadacentral-01.azurewebsites.net" },
                { label: "Source Code", href: "https://github.com/Luistello87/OzarkLMS/tree/master/OzarkLMS" }
            ]
        },
        {
            title: "Mac Scraper",
            tech: "Python, Tkinter, Spotlight API, macOS",
            details: "Built a high-performance file management tool utilizing the macOS Spotlight engine for instant system-wide file searching and filtering.",
            links: [
                { label: "Source Code", href: "https://github.com/ifradhos55/Mac-Scraper" }
            ]
        },
        {
            title: "Cosmic Fusion",
            tech: "Three.js, WebGL, JavaScript, Canvas API",
            details: "Built an interactive 3D Solar System simulation with procedural texture generation and optimized WebGL rendering for a 100,000-particle galaxy view.",
            links: [
                { label: "Visit Cosmic Fusion", href: "https://cosmicfusionsimulator-six.vercel.app" },
                { label: "Source Code", href: "https://github.com/ifradhos55/Cosmic-Fusion" }
            ]
        }
    ],
    skills: {
        "Full Stack": ["C#", ".NET Core", "ASP.NET MVC", "Java", "Spring Boot", "Python"],
        "Frontend": ["JavaScript", "TypeScript", "React", "HTML5", "CSS3", "Tailwind CSS", "Three.js"],
        "Database": ["SQL", "PostgreSQL", "MySQL", "Schema Design", "Query Optimization"],
        "Tools & Cloud": ["Azure", "AWS", "Git", "GitHub", "CI/CD", "Linux", "Bash Scripting"]
    },
    certifications: [
        { 
            name: "IBM AI Engineering", 
            issuer: "IBM", 
            image: "assets/certs/IBM_AI_Engineering.jpg",
            verifyUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/GBRFNXIBZ8KG"
        },
        { 
            name: "IBM AI Enterprise Workflow", 
            issuer: "IBM", 
            image: "assets/certs/IBM_AI_Enterprise.jpg",
            verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/3IWCRQQCG8X3"
        },
        { 
            name: "Google UX Design", 
            issuer: "Google", 
            image: "assets/certs/Google_UX.jpg",
            verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/T4YGQEUTVT80"
        },
        { 
            name: "Google IT Support", 
            issuer: "Google", 
            image: "assets/certs/Google_IT_Support.jpg",
            verifyUrl: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/EJBEM2OYWJER"
        }
    ]
};
