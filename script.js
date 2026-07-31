document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project, .blog-entry');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const scrollToTopButton = document.getElementById("scrollToTop");

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showProjects(category = 'all', animate = false) {
        let shown = 0;

        projects.forEach(project => {
            // Split rather than substring-match, so a category name can never
            // accidentally match inside a longer one.
            const cats = (project.dataset.categories || '').split(/\s+/);
            const match = category === 'all' || cats.indexOf(category) !== -1;

            if (match) {
                project.style.display = 'block';
                if (animate && !reduceMotion) {
                    project.classList.remove('visible');
                    // Stagger the first few so the new set arrives as a sequence
                    // rather than snapping in all at once.
                    project.style.transitionDelay = Math.min(shown, 5) * 55 + 'ms';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        project.classList.add('visible');
                    }));
                } else {
                    project.style.transitionDelay = '';
                    project.classList.add('visible');
                }
                shown++;
            } else {
                project.style.display = 'none';
                project.style.transitionDelay = '';
                project.classList.remove('visible');
            }
        });

        // Handle about-me section separately
        const aboutMeSection = document.querySelector('.about-me');
        aboutMeSection.style.display = category === 'about' ? 'block' : 'none';
    }

    showProjects();

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;

            document.querySelectorAll('nav a').forEach(item => {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');

            // A new category is a new page as far as the reader is concerned,
            // so return to the top rather than leaving them mid-feed.
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

            showProjects(category, true);

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY || document.documentElement.scrollTop;
            scrollToTopButton.classList.toggle('is-visible', y > 400);
            ticking = false;
        });
    }, { passive: true });

    scrollToTopButton.onclick = function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('open');
        }
    });

    // No tap-to-reveal on touch: below 768px the overlay is laid out as
    // static copy under the image, so there is nothing to reveal.

    // Only play video that is actually on screen. Six autoplaying loops were
    // decoding continuously whether or not they were visible.
    const videos = document.querySelectorAll('.project video');
    videos.forEach(v => { v.pause(); v.preload = 'none'; });

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const v = entry.target;
            if (entry.isIntersecting) {
                if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
                const p = v.play();
                if (p) p.catch(() => {});
            } else {
                v.pause();
            }
        });
    }, { rootMargin: '200px 0px' });

    videos.forEach(v => videoObserver.observe(v));

    // Intersection Observer for fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    projects.forEach(project => {
        observer.observe(project);
    });
});
