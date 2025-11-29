// 1. Tailwind Configuration
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

    const params = new URLSearchParams(window.location.search);
    const jobCode = params.get('jobCode');
    const jobDetailsContainer = document.getElementById('job-details-container');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    if (!jobCode) {
        if(loadingState) loadingState.style.display = 'none';
        if(errorState) { errorState.style.display = 'block'; errorState.textContent = 'Error: No Job Code provided.'; }
        return;
    }

    fetch(`/api/job/${jobCode}`)
        .then(response => {
            if (!response.ok) { return response.json().then(err => { throw new Error(err.error || `Status ${response.status}`); }); }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                populateJobDetails(result.data);
                if(loadingState) loadingState.style.display = 'none';
                if(jobDetailsContainer) jobDetailsContainer.style.display = 'block';
            } else {
                throw new Error(result.error || 'Job not found.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            if(loadingState) loadingState.style.display = 'none';
            if(errorState) { errorState.style.display = 'block'; errorState.textContent = `Error: ${error.message}`; }
        });
});

function populateJobDetails(record) {
    const codes = { job: 'Job', jobCode: 'Job_Code', location: 'Location', jobType: 'Job_Type', employmentStatus: 'Employment_Status', shiftAndSchedule: 'Shift_and_Schedule', positionCategory: 'Position_Category', experienceLevel: 'Experience_Level', jobDescription: 'Job_Description', qualifications: 'Qualifications', benefits: 'Benefits', supplementalPay: 'Supplemental_Pay' };
    const data = {
        jobTitle: record[codes.job]?.value || 'N/A',
        jobCode: record[codes.jobCode]?.value || 'N/A',
        location: record[codes.location]?.value || 'N/A',
        jobType: record[codes.jobType]?.value || [],
        employmentStatus: record[codes.employmentStatus]?.value,
        shiftAndSchedule: record[codes.shiftAndSchedule]?.value || [],
        positionCategory: record[codes.positionCategory]?.value,
        experienceLevel: record[codes.experienceLevel]?.value || [],
        jobDescription: record[codes.jobDescription]?.value || '',
        qualifications: record[codes.qualifications]?.value || '',
        benefits: record[codes.benefits]?.value || '',
        supplementalPay: record[codes.supplementalPay]?.value || ''
    };
    
    document.title = `${data.jobTitle} - GGPC`;
    const titleEl = document.getElementById('job-title'); if(titleEl) titleEl.textContent = data.jobTitle;
    const locEl = document.getElementById('job-location'); if(locEl) locEl.textContent = data.location;
    
    const tagsContainer = document.getElementById('tags-container');
    if (tagsContainer) {
        const tagColors = { default: 'blue', Permanent: 'purple', 'Full-time': 'yellow', Open: 'green' };
        const createTag = (text, colorClass) => `<span class="text-xs font-semibold px-3 py-1 bg-${colorClass}-100 text-${colorClass}-800 rounded-full dark:bg-${colorClass}-900/50 dark:text-${colorClass}-300">${text}</span>`;
        tagsContainer.innerHTML = '';
        if (data.jobType) data.jobType.forEach(tag => tagsContainer.innerHTML += createTag(tag, tagColors[tag] || 'gray'));
        if (data.employmentStatus) tagsContainer.innerHTML += createTag(data.employmentStatus, tagColors[data.employmentStatus] || 'green');
        if (data.shiftAndSchedule) data.shiftAndSchedule.forEach(tag => tagsContainer.innerHTML += createTag(tag, 'pink'));
        if (data.positionCategory) tagsContainer.innerHTML += createTag(data.positionCategory, 'indigo');
        if (data.experienceLevel) data.experienceLevel.forEach(tag => tagsContainer.innerHTML += createTag(tag, 'blue'));
    }

    const populateList = (elementId, text) => {
        const list = document.getElementById(elementId);
        if (text && list) {
            list.innerHTML = String(text).split('\n').filter(line => line.trim() !== '').map(item => `<li>${item.trim().replace(/^[\*\-\•]\s*/, '')}</li>`).join('');
        }
    };
    
    const descLead = document.getElementById('job-description-lead'); if(descLead) descLead.textContent = String(data.jobDescription).split('\n')[0];
    populateList('qualifications-list', data.qualifications);
    populateList('description-list', data.jobDescription);
    populateList('benefits-list', data.benefits);
    populateList('supp-pay-list', data.supplementalPay);
    
    const applyButton = document.getElementById('apply-now-button');
    if(applyButton) applyButton.href = `mailto:careers@gunmagohkin.ph?subject=Application for ${data.jobTitle} (${data.jobCode})`;
}

// 4. Window Events
window.addEventListener('load', () => document.getElementById('preloader')?.classList.add('hidden'));
window.addEventListener('scroll', () => {
    document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
    const scrollProgressBar = document.getElementById('scroll-progress');
    if(progressBar) {
        const scrollPercent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
});