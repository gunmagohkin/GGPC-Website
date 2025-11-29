// 1. Tailwind Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#00529B", 
                "background-light": "#F8FAFC", 
                "background-dark": "#0B1120",
                "card-light": "#FFFFFF", 
                "card-dark": "#1E293B", 
                "text-light": "#1E293B", 
                "text-dark": "#E2E8F0", 
                "text-muted-light": "#64748B", 
                "text-muted-dark": "#94A3B8"
            },
            fontFamily: { display: ["Poppins", "sans-serif"] },
            borderRadius: { DEFAULT: "0.5rem" },
        },
    },
};

// 2. Utility Functions
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    loadParticles();
}

const isDarkMode = () => localStorage.getItem('darkMode') === 'true';

if (isDarkMode()) {
    document.documentElement.classList.add('dark');
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function loadParticles() {
    if (!document.getElementById("particles-js")) return;
    if (typeof tsParticles === 'undefined') return;

    const particleColor = isDarkMode() ? "#94a3b8" : "#9ca3af";
    tsParticles.load("particles-js", {
        background: { color: "transparent" },
        particles: {
            number: { value: 60 },
            color: { value: particleColor },
            opacity: { value: 0.6 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, direction: "none", out_mode: "out" }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } }
        },
    });
}

// 3. Main Logic (DOM Ready)
document.addEventListener('DOMContentLoaded', function() {
    loadParticles();

    // --- SPOTLIGHT CURSOR LOGIC ---
    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--x', e.clientX + 'px');
        document.body.style.setProperty('--y', e.clientY + 'px');
    });

    // Simple fade-in for sections
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
});

// 4. Window Events
window.addEventListener('load', () => document.getElementById('preloader')?.classList.add('hidden'));

window.addEventListener('scroll', () => {
    // Header background toggle
    document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
    
    // Top Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }
});