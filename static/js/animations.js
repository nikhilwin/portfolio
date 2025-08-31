// Particle Background Effect
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.init();
        this.animate();
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

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(108, 92, 231, ${particle.opacity})`;
            this.ctx.fill();
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

// Enhanced hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add magnetic effect to buttons
    document.querySelectorAll('.btn, .social-button').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});
