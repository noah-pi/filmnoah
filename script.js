document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project, .blog-entry');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const scrollToTopButton = document.getElementById("scrollToTop");

    function showProjects(category = 'all') {
        projects.forEach(project => {
            if (category === 'all' || project.dataset.categories.includes(category)) {
                project.style.display = 'block';
                setTimeout(() => project.classList.add('visible'), 10);
            } else {
                project.style.display = 'none';
                project.classList.remove('visible');
            }
        });

        // Handle about-me section separately
        const aboutMeSection = document.querySelector('.about-me');
        if (category === 'about') {
            aboutMeSection.style.display = 'block';
        } else {
            aboutMeSection.style.display = 'none';
        }
    }

    showProjects();

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;

            document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');

            showProjects(category);

            if (category === 'about') {
                document.querySelector('.about-me').scrollIntoView({ behavior: 'smooth' });
            }

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    });

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopButton.style.display = "block";
        } else {
            scrollToTopButton.style.display = "none";
        }
    };

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
