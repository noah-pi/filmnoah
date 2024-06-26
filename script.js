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

    // Mobile double-tap feature
    projects.forEach(project => {
        const overlay = project.querySelector('.project-overlay');
        const link = project.querySelector('a');
        let isOverlayVisible = false;
        
        project.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                if (!isOverlayVisible) {
                    overlay.style.opacity = '1';
                    isOverlayVisible = true;
                } else {
                    window.location.href = link.href;
                }
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.project')) {
            projects.forEach(project => {
                project.querySelector('.project-overlay').style.opacity = '0';
                project.isOverlayVisible = false;
            });
        }
    });
    
    document.getElementById('infinite-nature-video').addEventListener('click', function(event) {
        window.location.href = 'https://cloud.google.com/transform/infinite-nature-gen-ai-biodiversity-demo-industry-applications';
    });

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
