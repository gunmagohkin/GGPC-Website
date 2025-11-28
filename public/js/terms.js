
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#00529B", "background-light": "#F8FAFC", "background-dark": "#0B1120",
                        "card-light": "#FFFFFF", "card-dark": "#1E293B", "text-light": "#1E293B",
                        "text-dark": "#E2E8F0", "text-muted-light": "#64748B", "text-muted-dark": "#94A3B8",
                    },
                    fontFamily: { display: ["Poppins", "sans-serif"], },
                    borderRadius: { DEFAULT: "0.5rem", },
                },
            },
        };
        // --- DARK MODE & MOBILE MENU SCRIPT ---
        function toggleDarkMode() { document.documentElement.classList.toggle('dark'); localStorage.setItem('darkMode', document.documentElement.classList.contains('dark')); loadParticles(); }
        const isDarkMode = () => localStorage.getItem('darkMode') === 'true';
        if (isDarkMode()) { document.documentElement.classList.add('dark'); }
        function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }

        // --- PARTICLE LOADER FUNCTION ---
        function loadParticles() {
            if (!document.getElementById("particles-js")) return;
            const particleColor = isDarkMode() ? "#94a3b8" : "#9ca3af";
            tsParticles.load("particles-js", {
                background: { color: "transparent" },
                particles: {
                    number: { value: 60 }, color: { value: particleColor },
                    opacity: { value: 0.6 }, size: { value: { min: 1, max: 3 } },
                    links: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 1, direction: "none", out_mode: "out", }
                },
                interactivity: { events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } } },
            });
        }
        
        // --- DOM CONTENT LOADED SCRIPTS ---
        document.addEventListener('DOMContentLoaded', function() {
            loadParticles();
        });

        // --- WINDOW-LEVEL EVENT LISTENERS ---
        window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            if (preloader) { preloader.classList.add('hidden'); }
        });

        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (header) { window.scrollY > 50 ? header.classList.add('scrolled') : header.classList.remove('scrolled'); }

            const scrollProgressBar = document.getElementById('scroll-progress');
            if (scrollProgressBar) {
                const scrollTop = document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;
                scrollProgressBar.style.width = scrollPercent + '%';
            }
        });