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
                "text-muted-dark": "#94A3B8",
            },
            fontFamily: { display: ["Poppins", "sans-serif"], },
            borderRadius: { DEFAULT: "0.5rem" },
        },
    },
};

// 2. Utilities
function toggleDarkMode() { document.documentElement.classList.toggle('dark'); localStorage.setItem('darkMode', document.documentElement.classList.contains('dark')); loadParticles(); }
const isDarkMode = () => localStorage.getItem('darkMode') === 'true';
if (isDarkMode()) { document.documentElement.classList.add('dark'); }
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }

function loadParticles() {
    if (!document.getElementById("particles-js")) return;
    if (typeof tsParticles === 'undefined') return;
    const particleColor = isDarkMode() ? "#94a3b8" : "#9ca3af";
    tsParticles.load("particles-js", { background: { color: "transparent" }, particles: { number: { value: 60 }, color: { value: particleColor }, opacity: { value: 0.6 }, size: { value: { min: 1, max: 3 } }, links: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 }, move: { enable: true, speed: 1, direction: "none", out_mode: "out", } }, interactivity: { events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } } }, });
}

// 3. Main Logic
document.addEventListener('DOMContentLoaded', function() {
    loadParticles();

    // --- SPOTLIGHT CURSOR LOGIC ---
    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--x', e.clientX + 'px');
        document.body.style.setProperty('--y', e.clientY + 'px');
    });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent.trim();
        heroTitle.textContent = '';
        originalText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'letter-reveal-hero';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 50}ms`;
            heroTitle.appendChild(span);
        });
        heroTitle.style.opacity = '1';
    }
    
    // Scroll Animations
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('section-visible'); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('main > section:not(#hero-initiatives)').forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
    
    // Staggered Titles
    const staggeredTitles = document.querySelectorAll('.staggered-reveal-title');
    staggeredTitles.forEach(title => {
        const originalText = title.textContent.trim(); title.textContent = '';
        originalText.split('').forEach((char, index) => {
            const span = document.createElement('span'); span.className = 'letter-reveal';
            span.textContent = char === ' ' ? '\u00A0' : char; span.style.animationDelay = `${index * 30}ms`; title.appendChild(span);
        });
    });

    // 3D Tilt for Cards (If VanillaTilt is loaded)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 15, speed: 400, glare: true, "max-glare": 0.1
        });
    }
});

// 4. Window Events
window.addEventListener('load', () => document.getElementById('preloader')?.classList.add('hidden'));
window.addEventListener('scroll', () => {
    document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }
});