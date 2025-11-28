
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
        function toggleDarkMode() { document.documentElement.classList.toggle('dark'); localStorage.setItem('darkMode', document.documentElement.classList.contains('dark')); loadParticles(); }
        const isDarkMode = () => localStorage.getItem('darkMode') === 'true';
        if (isDarkMode()) { document.documentElement.classList.add('dark'); }
        function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }
        function loadParticles() {
            if (!document.getElementById("particles-js")) return;
            const particleColor = isDarkMode() ? "#94a3b8" : "#9ca3af";
            tsParticles.load("particles-js", { background: { color: "transparent" }, particles: { number: { value: 60 }, color: { value: particleColor }, opacity: { value: 0.6 }, size: { value: { min: 1, max: 3 } }, links: { enable: true, distance: 150, color: particleColor, opacity: 0.4, width: 1 }, move: { enable: true, speed: 1, direction: "none", out_mode: "out", } }, interactivity: { events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } } }, });
        }
        
        // --- MAIN INITIALIZATION SCRIPT (UPDATED TO INCLUDE HERO ANIMATION) ---
        document.addEventListener('DOMContentLoaded', function() {
            loadParticles();
            
            // Staggered Hero Title Animation (Copied from homepage)
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
            
            const sectionObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('section-visible'); } });
            }, { threshold: 0.1 });
            document.querySelectorAll('main > section:not(#profile-hero)').forEach(section => {
                section.classList.add('section-hidden');
                sectionObserver.observe(section);
            });

            // Number Counter Animation
            const counterCard = document.getElementById('company-overview-card');
            if (counterCard) {
                const counterObserver = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting) {
                        const counters = entries[0].target.querySelectorAll('.counter');
                        counters.forEach(counter => {
                            if (counter.getAttribute('data-animated') === 'true') return;
                            counter.setAttribute('data-animated', 'true');
                            const target = +counter.getAttribute('data-target'); const duration = 1500; const increment = target / (duration / 16); let current = 0;
                            const updateCount = () => { current += increment; if (current < target) { counter.innerText = Math.ceil(current).toLocaleString(); requestAnimationFrame(updateCount); } else { counter.innerText = target.toLocaleString(); } }; updateCount();
                        });
                        counterObserver.unobserve(entries[0].target);
                    }
                }, { threshold: 0.8 });
                counterObserver.observe(counterCard);
            }

            // Staggered Titles for Sections
            const staggeredTitles = document.querySelectorAll('.staggered-reveal-title');
            staggeredTitles.forEach(title => {
                const originalText = title.textContent.trim(); title.textContent = '';
                originalText.split('').forEach((char, index) => {
                    const span = document.createElement('span'); span.className = 'letter-reveal';
                    span.textContent = char === ' ' ? '\u00A0' : char; span.style.animationDelay = `${index * 30}ms`; title.appendChild(span);
                });
            });

            // History Carousel Initialization
            const historyCaption = document.getElementById('history-caption');
            function updateCaption(swiperInstance) {
                if (historyCaption) {
                    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
                    historyCaption.innerHTML = `<p class="font-bold text-lg">${activeSlide.getAttribute('data-title')}</p><p class="text-sm text-text-muted-light dark:text-text-muted-dark">${activeSlide.getAttribute('data-year')}</p>`;
                }
            }
            const historySwiper = new Swiper(".history-carousel", {
                effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true, },
                coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false, },
                navigation: { nextEl: ".history-button-next", prevEl: ".history-button-prev", },
                on: { init: function() { updateCaption(this); }, slideChange: function () { updateCaption(this); } }
            });

            // Philosophy Carousel Initialization
            const philosophySwiper = new Swiper(".philosophy-carousel", {
                loop: true, slidesPerView: 1, spaceBetween: 20,
                pagination: { el: ".philosophy-pagination", clickable: true, },
                navigation: { nextEl: ".philosophy-button-next", prevEl: ".philosophy-button-prev", },
                breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }
            });

            // Parallax Image Hover Effect
            const parallaxContainers = document.querySelectorAll('.parallax-hover-container');
            parallaxContainers.forEach(container => {
                const img = container.querySelector('.parallax-img'); const intensity = 20;
                container.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.1)'; });
                container.addEventListener('mousemove', (e) => {
                    const rect = container.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                    const dx = (x - rect.width / 2) / (rect.width / 2); const dy = (y - rect.height / 2) / (rect.height / 2);
                    const tiltX = -dy * intensity; const tiltY = dx * intensity;
                    img.style.transform = `scale(1.1) translate(${tiltY}px, ${tiltX}px)`;
                });
                container.addEventListener('mouseleave', () => { img.style.transform = 'scale(1) translate(0, 0)'; });
            });
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
