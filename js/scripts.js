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
    const textArray = ['AI Engineer', 'GenAI Specialist', 'RAG & Agent Developer', 'LLM & FastAPI Architect'];
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

    /* ==========================================================================
       8. DARK & LIGHT MODE THEME CONTROLLER
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeColorMeta = document.getElementById('themeColorMeta');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sachin-theme', theme);

        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', theme === 'dark' ? '#030a0e' : '#f8fafc');
        }

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-checked', theme === 'light' ? 'true' : 'false');
            themeToggleBtn.setAttribute(
                'title',
                theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
            );
        }
    }

    // Determine current theme
    const savedTheme = localStorage.getItem('sachin-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // React to system color scheme changes if user hasn't explicitly set one
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('sachin-theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /* ==========================================================================
       9. AI NEURAL NETWORK & DATA TOKENS BACKGROUND ANIMATION
       ========================================================================== */
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = 1;
        let animationFrameId = null;
        let isRunning = true;

        const mouse = {
            x: null,
            y: null,
            radius: 160
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        window.addEventListener('resize', resize);
        resize();

        // 1. Moving Neural Nodes
        const isMobile = window.innerWidth < 768;
        const nodeCount = isMobile ? 24 : 52;
        const maxDistance = isMobile ? 95 : 135;
        const nodes = [];

        class NeuralNode {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.65;
                this.vy = (Math.random() - 0.5) * 0.65;
                this.baseRadius = Math.random() * 1.6 + 1.6;
                this.radius = this.baseRadius;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.03 + 0.015;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce at edges smoothly
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Gentle pulse
                this.pulse += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.pulse) * 0.6;

                // Interactive mouse reaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.4;
                        this.y -= (dy / dist) * force * 1.4;
                    }
                }
            }

            draw(isDark) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
                ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.85)' : 'rgba(37, 99, 235, 0.75)';
                ctx.fill();
            }
        }

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new NeuralNode());
        }

        // 2. Floating AI Data Glyphs / Moving Objects
        const symbols = ['{ }', 'f(x)', 'λ', 'AI', 'RAG', '< / >', '01', 'w·x', 'σ(z)', '1.3s', 'LLM', 'MCP'];
        const glyphCount = isMobile ? 6 : 12;
        const glyphs = [];

        class FloatingGlyph {
            constructor(initAnywhere = false) {
                this.reset(initAnywhere);
            }

            reset(initAnywhere = false) {
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.x = Math.random() * width;
                this.y = initAnywhere ? Math.random() * height : height + 25;
                this.vy = -(Math.random() * 0.35 + 0.2); // upward drift
                this.vx = (Math.random() - 0.5) * 0.25;
                this.alpha = 0;
                this.maxAlpha = Math.random() * 0.25 + 0.18;
                this.size = Math.floor(Math.random() * 4) + 12;
                this.angle = (Math.random() - 0.5) * 0.2;
                this.rotSpeed = (Math.random() - 0.5) * 0.005;
                this.sineOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.vy;
                this.x += this.vx + Math.sin(this.sineOffset + this.y * 0.01) * 0.2;
                this.angle += this.rotSpeed;

                // Fade in near bottom, fade out near top
                if (this.y > height - 100) {
                    this.alpha = Math.min(this.maxAlpha, ((height - this.y) / 100) * this.maxAlpha);
                } else if (this.y < 120) {
                    this.alpha = Math.max(0, (this.y / 120) * this.maxAlpha);
                } else {
                    this.alpha = this.maxAlpha;
                }

                if (this.y < -30) {
                    this.reset(false);
                }
            }

            draw(isDark) {
                if (this.alpha <= 0.01) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.font = `600 ${this.size}px "Fira Code", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isDark
                    ? `rgba(96, 165, 250, ${this.alpha})`
                    : `rgba(37, 99, 235, ${this.alpha * 0.9})`;
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            }
        }

        for (let i = 0; i < glyphCount; i++) {
            glyphs.push(new FloatingGlyph(true));
        }

        // 3. Animation Loop
        function animate() {
            if (!isRunning) return;

            ctx.clearRect(0, 0, width, height);
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

            // Draw Synaptic Connection Lines between nearby nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * (isDark ? 0.25 : 0.16);
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = isDark
                            ? `rgba(56, 189, 248, ${alpha})`
                            : `rgba(37, 99, 235, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw Interactive Lines to Mouse Cursor
            if (mouse.x !== null && mouse.y !== null) {
                for (let i = 0; i < nodes.length; i++) {
                    const dx = mouse.x - nodes[i].x;
                    const dy = mouse.y - nodes[i].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * (isDark ? 0.42 : 0.28);
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = isDark
                            ? `rgba(96, 165, 250, ${alpha})`
                            : `rgba(37, 99, 235, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            // Update & Draw Nodes
            nodes.forEach((node) => {
                node.update();
                node.draw(isDark);
            });

            // Update & Draw Floating AI Glyphs
            glyphs.forEach((glyph) => {
                glyph.update();
                glyph.draw(isDark);
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Pause when tab not visible to preserve GPU & battery
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isRunning = false;
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                isRunning = true;
                animate();
            }
        });
    }
});

