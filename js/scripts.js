document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. NAVBAR SCROLL & HAMBURGER MENU
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinksItems.forEach((item) => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================================================
       2. TYPING EFFECT IN HERO SECTION
       ========================================================================== */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ['AI Engineer', 'Full Stack Developer', 'GenAI Developer', 'FastAPI Expert'];
    const typingDelay = 100;
    const erasingDelay = 60;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    /* ==========================================================================
       3. SCROLL PROGRESS INDICATOR & BACK TO TOP
       ========================================================================== */
    const progressBar = document.querySelector('.scroll-progress-bar');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    /* ==========================================================================
       4. CUSTOM CURSOR & MOUSE PARALLAX
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate(
            {
                left: `${posX}px`,
                top: `${posY}px`
            },
            { duration: 500, fill: 'forwards' }
        );
    });

    /* ==========================================================================
       5. COUNTER ANIMATION FOR ABOUT SECTION
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const runCounters = () => {
        counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = 200;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(runCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    };

    window.addEventListener('scroll', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const sectionPos = aboutSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;

            if (sectionPos < screenPos && !animated) {
                runCounters();
                animated = true;
            }
        }
    });

    /* ==========================================================================
       6. BUTTON RIPPLE EFFECT
       ========================================================================== */
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* ==========================================================================
       7. CONTACT FORM SUBMISSION HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for reaching out, Sachinkannan will get back to you soon!');
            contactForm.reset();
        });
    }

    /* ==========================================================================
       9. SCROLL REVEAL ENGINE
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       10. SERVICE WORKER REGISTRATION & PWA INSTALL LOGIC
       ========================================================================== */
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('[Service Worker] Registered successfully with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('[Service Worker] Registration failed:', error);
                });
        });
    }

    // PWA Custom Installation Logic
    let deferredPrompt;
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default browser install banner
        e.preventDefault();
        // Save event for triggering install later
        deferredPrompt = e;
        // Make the custom install button visible in navbar
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
        console.log('[PWA] App is installable. Showing install button.');
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            // Show prompt
            deferredPrompt.prompt();
            
            // Wait for user choices
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] Install choice outcome: ${outcome}`);
            
            // Clear deferredPrompt
            deferredPrompt = null;
            
            // Hide install button
            installBtn.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', (evt) => {
        console.log('[PWA] App successfully installed!');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        // Create custom premium success alert
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = '20px';
        alertBox.style.right = '20px';
        alertBox.style.background = 'linear-gradient(135deg, var(--accent-1), var(--accent-3))';
        alertBox.style.color = '#fff';
        alertBox.style.padding = '1rem 2rem';
        alertBox.style.borderRadius = '12px';
        alertBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        alertBox.style.zIndex = '10002';
        alertBox.style.opacity = '0';
        alertBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        alertBox.style.transform = 'translateY(20px)';
        alertBox.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right:8px;"></i> Thank you for installing Sachin\'s Portfolio PWA!';
        
        document.body.appendChild(alertBox);
        
        // Trigger reflow & animate in
        setTimeout(() => {
            alertBox.style.opacity = '1';
            alertBox.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translateY(20px)';
            setTimeout(() => alertBox.remove(), 500);
        }, 4000);
    });
});
