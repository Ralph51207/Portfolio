document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for nav anchors
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Reveal on scroll
    const sections = document.querySelectorAll('section');
    const revealItems = document.querySelectorAll('.projects li, .education-item');

    function revealOnScroll() {
        [...sections, ...revealItems].forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Nav link active state while scrolling
    const navLinks = document.querySelectorAll('nav a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Animate skill bars when skills section becomes visible
    const skillsSection = document.getElementById('skills');
    const skillCharts = document.querySelectorAll('.skill-chart .chart-bar');

    function animateCharts() {
        if (!skillsSection.classList.contains('visible')) return;
        skillCharts.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = percent + '%';
        });
    }

    window.addEventListener('scroll', animateCharts);
    animateCharts();

    // Touch devices: fallback to tap to toggle open (because hover doesn't exist)
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) {
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // prevent the click from following external links inside the project-content immediately
                const anchor = e.target.closest('a');
                if (anchor) {
                    // Let anchor clicks navigate - do nothing special
                    return;
                }
                item.classList.toggle('open');
            });
        });
        // optional: close other open items when opening a new one
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('open')) return;
                document.querySelectorAll('.project-item').forEach(other => {
                    if (other !== item) other.classList.remove('open');
                });
            });
        });
    }
});
