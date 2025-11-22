/* 
==============================================
   PORTFOLIO INTERACTIVITY
==============================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------
    // 1. Custom Cursor Logic
    // ------------------------------------------------
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with delay (using animate for smoothness)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effects for links and buttons
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });

            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // ------------------------------------------------
    // 2. Vanta.js 3D Background
    // ------------------------------------------------
    try {
        VANTA.NET({
            el: ".hero",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x64ffda,       // Teal accent
            backgroundColor: 0x0a0a0a, // Dark bg
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00
        });
    } catch (e) {
        console.log("Vanta.js failed to load (likely due to missing Three.js dependency in some environments)", e);
    }

    // ------------------------------------------------
    // 3. GSAP Animations
    // ------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Reveal
    const tl = gsap.timeline();
    tl.from(".hero-greeting", { y: 20, opacity: 0, duration: 0.5, delay: 0.5 })
        .from(".hero-name", { y: 20, opacity: 0, duration: 0.5 })
        .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.5 })
        .from(".hero-description", { y: 20, opacity: 0, duration: 0.5 })
        .from(".hero-btns", { y: 20, opacity: 0, duration: 0.5 }); // Updated selector

    // Section Headers
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });
    });

    // About Section
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 70%"
        },
        x: -50,
        opacity: 0,
        duration: 1
    });

    gsap.from(".about-image-wrapper", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 70%"
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2
    });

    // Skills Stagger
    gsap.from(".skill-item", {
        scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%"
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
    });

    // Projects Stagger
    // Use fromTo for better reliability - explicitly defines start and end states
    gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.fromTo(card,
            {
                y: 50,
                opacity: 0
            },
            {
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: i * 0.2, // Manual stagger
                clearProps: "transform" // Clear transform after animation
            }
        );
    });

    // Refresh ScrollTrigger after all assets are loaded to ensure correct positions
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Smooth Scroll for Anchor Links (Native + GSAP)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Use GSAP for smoother scrolling
                gsap.to(window, { duration: 1, scrollTo: target });
            }
        });
    });

    // ------------------------------------------------
    // 4. Project Modals
    // ------------------------------------------------
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const closeModal = document.querySelector('.close-modal');

    const projectDetails = {
        'weather': {
            title: 'Weather App',
            desc: 'A robust weather application that fetches real-time data from OpenWeatherMap API. Features include geolocation support, 5-day forecast, and dynamic background changes based on weather conditions.',
            tech: ['Flask', 'JavaScript', 'OpenWeather API', 'CSS3']
        },
        'task': {
            title: 'Task Manager',
            desc: 'A comprehensive task management system allowing users to create, read, update, and delete tasks. Includes priority sorting, due dates, and a clean user interface.',
            tech: ['Python', 'SQLite', 'Bootstrap', 'Jinja2']
        },
        'portfolio': {
            title: 'Portfolio Website',
            desc: 'This very website! Built to showcase my skills and projects. Features a custom design system, 3D interactive background, and advanced GSAP animations.',
            tech: ['Flask', 'HTML5', 'CSS3', 'GSAP', 'Vanta.js']
        }
    };

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const project = projectDetails[projectId];

            if (project) {
                modalTitle.textContent = project.title;
                modalDesc.textContent = project.desc;
                modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join('');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ------------------------------------------------
    // 5. Contact Form Handling
    // ------------------------------------------------
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            // Simulate sending (replace with actual API call later)
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#64ffda';
                btn.style.color = '#0a0a0a';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }
});
