document.addEventListener('DOMContentLoaded', () => {
    const glitchText = document.querySelector('.glitch-text');
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.querySelectorAll('.navbar, .hero-content > *, .profile-image-container');

    // Sequence of texts to display
    // Sequence of texts to display
    const sequence = [
        { text: "Hello.", delay: 200, duration: 1000 },
        { text: "I am Nikhil.", delay: 200, duration: 1000 },
        { text: "Welcome to my world.", delay: 200, duration: 1500 }
    ];

    let currentIndex = 0;

    function scrambleText(element, targetText, duration) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const frameRate = 50; // ms per frame
        const totalFrames = duration / frameRate;
        let frame = 0;

        const interval = setInterval(() => {
            let output = '';
            for (let i = 0; i < targetText.length; i++) {
                if (i < (frame / totalFrames) * targetText.length) {
                    output += targetText[i];
                } else {
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            element.textContent = output;
            element.setAttribute('data-text', output);

            frame++;
            if (frame > totalFrames) {
                clearInterval(interval);
                element.textContent = targetText;
                element.setAttribute('data-text', targetText);
            }
        }, frameRate);
    }

    function playSequence() {
        if (currentIndex >= sequence.length) {
            finishIntro();
            return;
        }

        const item = sequence[currentIndex];

        // Make visible
        glitchText.style.opacity = '1';

        // Start scramble effect
        scrambleText(glitchText, item.text, 800); // 800ms scramble duration

        // Wait for duration, then hide and move to next
        setTimeout(() => {
            glitchText.style.opacity = '0';
            currentIndex++;
            setTimeout(playSequence, item.delay);
        }, item.duration);
    }

    function finishIntro() {
        // Fade out overlay
        gsap.to(introOverlay, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                introOverlay.style.display = 'none';
                revealContent();
            }
        });
    }

    function revealContent() {
        // Animate main content in
        gsap.to(mainContent, {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    }

    // Start the sequence after a short initial delay
    setTimeout(playSequence, 500);

    // Safety timeout
    setTimeout(() => {
        if (introOverlay.style.display !== 'none') {
            finishIntro();
        }
    }, 12000); // 12 seconds max
});
