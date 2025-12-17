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
    if(!document.getElementById("particles-js")) return;
    const particleColor = isDarkMode() ? "#94a3b8" : "#9ca3af";
    tsParticles.load("particles-js", { background: { color: "transparent" }, particles: { number: { value: 60 }, color: { value: particleColor }, opacity: { value: 0.6 }, size: { value: { min: 1, max: 3 } }, links: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 }, move: { enable: true, speed: 1, direction: "none", out_mode: "out", } }, interactivity: { events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } } }, });
}

// 3. Main Logic
document.addEventListener('DOMContentLoaded', function() {
    loadParticles();

    // --- SPOTLIGHT CURSOR LOGIC ---
    document.addEventListener('mousemove', e => {
        document.body.style.setProperty('--x', e.clientX + 'px');
        document.body.style.setProperty('--y', e.clientY + 'px');
    });

    const jobListContainer = document.getElementById('job-listings-container');
    const jobLoadingState = document.getElementById('job-loading-state');

    // Fetch data
    fetch('/api/jobs')
        .then(response => {
            if (!response.ok) { return response.json().then(err => { throw new Error(err.error || `Server responded with status ${response.status}`); }); }
            return response.json();
        })
        .then(result => {
            if (jobLoadingState) jobLoadingState.style.display = 'none';
            if (result.success && result.data.length > 0) {
                result.data.forEach((record, index) => {
                    const jobCard = createJobCard(record, index * 150);
                    if (jobListContainer) jobListContainer.innerHTML += jobCard;
                });
            } else if (jobListContainer) {
                jobListContainer.innerHTML = `<p class="text-text-muted-light dark:text-text-muted-dark text-center col-span-full">There are currently no open positions. Please check back later.</p>`;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            if (jobLoadingState) jobLoadingState.style.display = 'none';
            if (jobListContainer) jobListContainer.innerHTML = `<p class="text-red-600 dark:text-red-400 text-center col-span-full">Failed to load job listings. Ensure the server is running.</p>`;
        });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent.trim(); heroTitle.textContent = '';
        originalText.split('').forEach((char, index) => {
            const span = document.createElement('span'); span.className = 'letter-reveal-hero';
            span.innerHTML = (char === ' ') ? '&nbsp;' : char;
            span.style.animationDelay = `${index * 50}ms`;
            heroTitle.appendChild(span);
        });
        heroTitle.style.opacity = '1';
    }
    const sections = document.querySelectorAll('main > section:not(#hero-opportunities)');
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('section-visible'); } }); }, { threshold: 0.1 });
    sections.forEach(section => { section.classList.add('section-hidden'); observer.observe(section); });
    
    const staggeredTitles = document.querySelectorAll('.staggered-reveal-title');
    staggeredTitles.forEach(title => {
        const originalText = title.textContent.trim(); title.textContent = '';
        originalText.split('').forEach((char, index) => {
            const span = document.createElement('span'); span.className = 'letter-reveal';
            span.innerHTML = (char === ' ') ? '&nbsp;' : char;
            span.style.animationDelay = `${index * 30}ms`;
            title.appendChild(span);
        });
    });
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), { max: 15, speed: 400, glare: true, "max-glare": 0.1 });
    }
});

function createJobCard(record, delay) {
    const codes = { job: 'Job_Name', jobCode: 'Job_Code', employmentStatus: 'Employment_Status', jobDescription: 'Job_Description', positionCategory: 'Position_Category', experienceLevel: 'Experience_Level' };
    const job = {
        title: record[codes.job]?.value || 'Untitled Job',
        code: record[codes.jobCode]?.value,
        summary: String(record[codes.jobDescription]?.value || '').split('\n')[0],
        tags: [ record[codes.positionCategory]?.value, ...(record[codes.experienceLevel]?.value || []), record[codes.employmentStatus]?.value ].flat().filter(Boolean)
    };

    if (!job.code) return '';

    const tagColors = { 'Production Staff': 'blue', 'Office Staff': 'indigo', 'Fresh Graduate': 'blue', 'Mid-Career': 'blue', 'Open': 'green' };
    const tagsHtml = job.tags.map(tag => {
        const color = tagColors[tag] || 'gray';
        return `<span class="text-xs font-semibold px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full dark:bg-${color}-900/50 dark:text-${color}-300">${tag}</span>`;
    }).join('');

    return `
        <a href="job-details-template.html?jobCode=${job.code}" class="block group stagger-child" style="transition-delay: ${delay}ms;">
            <div class="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full">
                <div class="flex items-start space-x-4">
                    <span class="material-icons text-3xl text-primary mt-1">work_outline</span>
                    <div>
                        <h3 class="text-xl font-bold text-text-light dark:text-text-dark">${job.title}</h3>
                        <p class="text-text-muted-light dark:text-text-muted-dark mt-1 mb-4 text-sm">${job.summary}</p>
                        <div class="flex flex-wrap gap-2">${tagsHtml}</div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

window.addEventListener('load', () => document.getElementById('preloader')?.classList.add('hidden'));
window.addEventListener('scroll', () => {
    document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
        const scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
    }
});