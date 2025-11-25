// Enhanced Particle Background Effect
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: 0, y: 0 };
        this.shapes = ['circle', 'square', 'triangle'];

        this.init();
        this.animate();
        this.bindEvents();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';

        document.body.appendChild(this.canvas);
        this.resize();

        window.addEventListener('resize', () => this.resize());

        // Create particles with different shapes and colors
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.1,
                shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
                color: this.getRandomColor(),
                trail: [],
                maxTrail: 5
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(108, 92, 231,', // purple
            'rgba(0, 206, 201,', // teal
            'rgba(255, 111, 97,', // coral
            'rgba(107, 91, 149,', // muted purple
            'rgba(136, 176, 75,' // green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawShape(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;

        switch (particle.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color + particle.opacity + ')';
                this.ctx.fill();
                break;
            case 'square':
                this.ctx.fillStyle = particle.color + particle.opacity + ')';
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
                break;
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y - particle.size);
                this.ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
                this.ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
                this.ctx.closePath();
                this.ctx.fillStyle = particle.color + particle.opacity + ')';
                this.ctx.fill();
                break;
        }

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.02;
                particle.vy += (dy / distance) * force * 0.02;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Wrap around edges with smooth transition
            if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
            if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
            if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;

            // Trail effect
            particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
            if (particle.trail.length > particle.maxTrail) {
                particle.trail.shift();
            }

            // Draw trail
            particle.trail.forEach((point, index) => {
                const trailOpacity = (point.opacity * (index + 1)) / particle.trail.length;
                this.ctx.save();
                this.ctx.globalAlpha = trailOpacity * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color + trailOpacity + ')';
                this.ctx.fill();
                this.ctx.restore();
            });

            // Draw particle
            this.drawShape(particle);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Mouse follower effect
class MouseFollower {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'fixed';
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.background = 'rgba(108, 92, 231, 0.3)';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '9999';
        this.cursor.style.transition = 'all 0.1s ease';

        document.body.appendChild(this.cursor);

        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
    }
}

// Floating elements
function initFloatingElements() {
    const floatElements = document.querySelectorAll('.float');

    floatElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// Parallax effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const rate = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * rate}px)`;
        });
    });
}

// Hero section specific animations
function initHeroAnimations() {
    // Letter-by-letter name animation
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${1.1 + index * 0.1}s`;
    });

    // Role cycling animation
    const roleItems = document.querySelectorAll('.role-item');
    let currentRole = 0;

    function cycleRoles() {
        roleItems.forEach((item, index) => {
            item.classList.remove('active');
        });
        roleItems[currentRole].classList.add('active');
        currentRole = (currentRole + 1) % roleItems.length;
    }

    // Start role cycling after initial animation
    setTimeout(() => {
        cycleRoles();
        setInterval(cycleRoles, 3000);
    }, 3500);

    // Floating shapes animation
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    // Scroll indicator bounce
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.style.animationPlayState = 'running';
        }, 5000);
    }

    // Profile image entrance
    const profileContainer = document.querySelector('.profile-image-container');
    if (profileContainer) {
        setTimeout(() => {
            profileContainer.style.animationPlayState = 'running';
        }, 2500);
    }

    // CTA buttons entrance
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
        setTimeout(() => {
            ctaButtons.style.opacity = '1';
            ctaButtons.style.transform = 'translateY(0)';
        }, 4000);
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background
    new ParticleBackground();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize floating elements
    initFloatingElements();

    // Initialize parallax
    initParallax();

    // Initialize mouse follower
    new MouseFollower();

    // Initialize hero animations
    initHeroAnimations();

    // Add glow effect to buttons on hover
    document.querySelectorAll('.btn, .social-button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('glow');
        });
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('glow');
        });
    });

    // Typing animation for specific elements
    const typingElements = document.querySelectorAll('.typing-animation');
    typingElements.forEach(element => {
        const text = element.dataset.text || element.textContent;
        element.textContent = '';
        new TypingAnimation(element, text);
    });
});

// Enhanced hover effects and new animations
document.addEventListener('DOMContentLoaded', () => {
    // Add magnetic effect to buttons
    document.querySelectorAll('.btn, .social-button').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Add enhanced animations to elements
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('heartbeat');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('heartbeat');
        });
    });

    document.querySelectorAll('.skills-category').forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.classList.add('wobble');
        });
        category.addEventListener('mouseleave', () => {
            category.classList.remove('wobble');
        });
    });

    document.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('shake');
            setTimeout(() => {
                button.classList.remove('shake');
            }, 500);
        });
    });

    // Add stagger animations to lists
    document.querySelectorAll('.skills-list li').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('bounce-in');
    });

    document.querySelectorAll('.project-list .project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('slide-in-bounce');
    });

    // Add morph complex animation to profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('mouseenter', () => {
            profileImg.classList.add('morph-complex');
        });
        profileImg.addEventListener('mouseleave', () => {
            profileImg.classList.remove('morph-complex');
        });
    }

    // Add elastic animation to headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.addEventListener('mouseenter', () => {
            heading.classList.add('elastic');
        });
        heading.addEventListener('mouseleave', () => {
            heading.classList.remove('elastic');
        });
    });

    // Add color pulse to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('color-pulse');
    });

    // Add glow pulse strong to important elements
    document.querySelectorAll('.profile-img, .social-button').forEach(element => {
        element.classList.add('glow-pulse-strong');
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn, .social-button, .project-card, .skills-category').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Stagger animations for lists
    function initStaggerAnimations() {
        const staggerElements = document.querySelectorAll('.stagger-item');
        staggerElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('stagger-animate');
        });
    }

    initStaggerAnimations();

    // Loading screen fade out
    window.addEventListener('load', function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000);
        }
    });

    // Animated counters
    function animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Trigger counter animations on scroll
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    animateCounter(counter, target);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.stats-grid, .code-stats').forEach(stat => {
        counterObserver.observe(stat);
    });

    // 3D tilt effect
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // Morphing icons
    document.querySelectorAll('.morph-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.classList.add('morphing');
        });

        icon.addEventListener('mouseleave', () => {
            icon.classList.remove('morphing');
        });
    });

    // Enhanced scroll animations with 3D effects
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-3d');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.project-card, .skills-category, .cert-item').forEach(card => {
        scrollObserver.observe(card);
    });
});
