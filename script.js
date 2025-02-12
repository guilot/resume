document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll and section activation
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            // Remove active classes
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

            // Add active classes
            link.classList.add('active');
            targetSection.classList.add('active');

            // Smooth scroll
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load theme from local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    }

    // Timeline item observer
    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const marker = entry.target.querySelector('.timeline-marker');
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (marker) {
                    marker.style.transform = 'translateX(-50%) scale(1.1)';
                    marker.style.boxShadow = `0 0 0 6px ${getComputedStyle(marker).getPropertyValue('--timeline-color')}40`;
                }
            } else {
                entry.target.classList.remove('visible');
                if (marker) {
                    marker.style.transform = 'translateX(-50%) scale(1)';
                    marker.style.boxShadow = 'none';
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
        if (window.matchMedia("(min-width: 769px)").matches) {
            const content = item.querySelector('.timeline-content');
            if (item.matches(':nth-child(odd)')) {
                content.style.transform = 'translateX(-30px)';
            } else {
                content.style.transform = 'translateX(30px)';
            }
        }
    });

    // Add debouncing for scroll events
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Enhance section observer with debouncing
    const sectionObserver = new IntersectionObserver(debounce(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove previous active classes first
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                document.querySelector(`.nav-item[href="#${id}"]`).classList.add('active');
            }
        });
    }, 100), { threshold: 0.5 });

    document.querySelectorAll('.content-section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Skills section observer
    const skillsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const skillsContainer = entry.target.querySelector('.skills-container');
            if (entry.isIntersecting) {
                skillsContainer.classList.add('active');
                document.querySelectorAll('.skill-list li').forEach((li, index) => {
                    li.style.setProperty('--i', index);
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('#skills').forEach(section => {
        skillsObserver.observe(section);
    });
});
