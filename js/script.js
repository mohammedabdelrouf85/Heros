// Custom Text Splitter Utility
function splitTextIntoWords(element) {
    if (!element) return;
    const text = element.innerText;
    element.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        const span = document.createElement('span');
        span.innerText = word + (index < words.length - 1 ? '\u00A0' : ''); // Add non-breaking space
        wordDiv.appendChild(span);
        element.appendChild(wordDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Setup GSAP MatchMedia for responsiveness
    let mm = gsap.matchMedia();

    // Split Hero Title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        splitTextIntoWords(heroTitle);
    }

    // 3. Initialize Cinematic Hero Animations
    initHeroAnimations();

    // 4. Scroll Animations (Desktop/Tablet)
    mm.add("(min-width: 769px)", () => {
        // Features Stagger
        gsap.from('.feature-card', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%",
            }
        });

        // Zones Stagger
        gsap.from('.zone-card', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".zones-grid",
                start: "top 80%",
            }
        });

        // Pricing Cards
        gsap.from('.price-card', {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".pricing-grid",
                start: "top 80%",
            }
        });
    });

    // Mobile Animations (Simplified)
    mm.add("(max-width: 768px)", () => {
        // (Hero mobile parallax moved to initHeroAnimations)


        const simpleFadeUp = (targets, trigger) => {
            gsap.from(targets, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: trigger,
                    start: "top 85%"
                }
            });
        };

        simpleFadeUp('.feature-card', '.features-grid');
        simpleFadeUp('.zone-card', '.zones-grid');
        simpleFadeUp('.price-card', '.pricing-grid');
    });

    // 5. Counters Animation
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
        const text = counter.innerText;
        const numberMatch = text.match(/[\d,.]+/);
        if (!numberMatch) return;
        
        const numberStr = numberMatch[0].replace(/,/g, '');
        const targetNumber = parseFloat(numberStr);
        const prefix = text.split(numberMatch[0])[0];
        const suffix = text.split(numberMatch[0])[1];
        
        counter.innerText = prefix + '0' + suffix;

        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: targetNumber,
                    duration: 2,
                    ease: "power3.out",
                    snap: { innerHTML: targetNumber % 1 === 0 ? 1 : 0.1 },
                    onUpdate: function() {
                        counter.innerText = prefix + this.targets()[0].innerHTML + suffix;
                    }
                });
            }
        });
    });

    // 6. Section Headers Reveal
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: header,
                start: "top 85%"
            }
        });
    });

    // VIP Services Reveal
    gsap.from('.vip-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.vip-content',
            start: "top 85%"
        }
    });

    // Navbar Scroll Effect via ScrollTrigger
    ScrollTrigger.create({
        start: "top -50px",
        onUpdate: (self) => {
            const navbar = document.querySelector('.navbar');
            if (self.direction === 1 || self.progress > 0) {
                navbar.classList.add('scrolled');
            }
            if (self.progress === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Supplements Section Animations
    function initSupplementAnimations() {
        // Stagger reveal the cards
        gsap.from('.supp-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".supplements-grid",
                start: "top 80%"
            }
        });

        // Image pop out and scale
        gsap.fromTo('.supp-img', 
            { scale: 0.85, opacity: 0, y: 20 },
            { 
                scale: 1, 
                opacity: 1, 
                y: 0,
                duration: 1, 
                stagger: 0.2, 
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: ".supplements-grid",
                    start: "top 80%"
                },
                onComplete: () => {
                    // Floating animation (yoyo) on the wrapper to prevent fighting with mouse parallax
                    gsap.to('.supp-image-wrapper', {
                        y: "-=15",
                        duration: 3,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut",
                        stagger: 0.5
                    });
                }
            }
        );

        // Mouse Parallax for Desktop (respects prefers-reduced-motion via matchMedia logic if needed)
        if (window.matchMedia("(min-width: 769px) and (prefers-reduced-motion: no-preference)").matches) {
            const suppSection = document.querySelector('.supplements');
            if (suppSection) {
                suppSection.addEventListener('mousemove', (e) => {
                    const rect = suppSection.getBoundingClientRect();
                    const x = e.clientX - rect.left - (rect.width / 2);
                    const y = e.clientY - rect.top - (rect.height / 2);
                    
                    const xAxis = x / 40; // Max ~15px
                    const yAxis = y / 40; // Max ~15px

                    gsap.to('.supp-img', {
                        x: xAxis,
                        y: yAxis,
                        rotateY: xAxis / 1.5,
                        rotateX: -yAxis / 1.5,
                        duration: 1,
                        ease: "power2.out"
                    });
                });
                
                suppSection.addEventListener('mouseleave', () => {
                    gsap.to('.supp-img', {
                        x: 0,
                        y: 0,
                        rotateY: 0,
                        rotateX: 0,
                        duration: 1.5,
                        ease: "power3.out"
                    });
                });
            }
        }
    }

    if (document.querySelector('.supplements')) {
        initSupplementAnimations();
    }


    // 7. Countdown Timer
    const offerEndDate = new Date();
    offerEndDate.setDate(offerEndDate.getDate() + 3);
    offerEndDate.setHours(offerEndDate.getHours() + 12);

    function updateCountdown() {
        const countdownEl = document.getElementById('countdown');
        if(!countdownEl) return;
        
        const now = new Date();
        const diff = offerEndDate - now;

        if (diff <= 0) {
            countdownEl.innerHTML = "انتهى العرض";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');
        
        if(dEl) dEl.innerText = days.toString().padStart(2, '0');
        if(hEl) hEl.innerText = hours.toString().padStart(2, '0');
        if(mEl) mEl.innerText = minutes.toString().padStart(2, '0');
        if(sEl) sEl.innerText = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Hero animations logic
    function initHeroAnimations() {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const introTl = gsap.timeline({
            onComplete: () => {
                const overlay = document.querySelector('.intro-overlay');
                if(overlay) overlay.style.display = 'none';
            }
        });

        gsap.set('.layer-bg', { opacity: 0 });
        gsap.set('.layer-env', { scale: 1.08, opacity: 0 });
        gsap.set('.layer-subject', { scale: 0.92, x: 40, opacity: 0 });
        gsap.set('.hero-subtitle, .hero-eyebrow, .hero-btn', { y: 20, opacity: 0 });
        gsap.set('.navbar', { y: -100, opacity: 0 });

        if (isReducedMotion) {
            introTl
                .to('.intro-logo', { opacity: 1, duration: 0.8, ease: "power2.out" })
                .to('.intro-logo', { opacity: 0, duration: 0.5, delay: 0.5, ease: "power2.in" })
                .to('.intro-overlay', { opacity: 0, duration: 0.8 }, "-=0.2")
                .to('.layer-bg, .layer-env, .layer-subject, .layer-gradient, .layer-particles', { opacity: 1, duration: 1 })
                .to('.hero-title .word span, .hero-subtitle, .hero-eyebrow, .hero-btn, .navbar', { opacity: 1, duration: 1 });
            return;
        }

        introTl
            .to('.intro-logo', { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to('.intro-logo', { opacity: 0, duration: 0.5, delay: 0.5, ease: "power2.in" })
            .to('.intro-overlay', { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
            .to('.layer-bg', { opacity: 1, duration: 1 }, "-=0.5")
            .to('.layer-env', { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.8")
            .to('.layer-subject', { scale: 1, x: 0, opacity: 1, duration: 1.4, ease: "power3.out" }, "-=1.2")
            .fromTo('.hero-title .word span', 
                { y: 60, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 
                "-=1.0"
            )
            .to('.hero-eyebrow, .hero-subtitle', { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6")
            .to('.hero-btn', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.6")
            .to('.navbar', { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5");

        gsap.to('.layer-subject', {
            y: 8,
            duration: 3.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 2
        });

        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (isDesktop) {
            const bgXTo = gsap.quickTo(".layer-env", "x", {duration: 0.6, ease: "power3"});
            const bgYTo = gsap.quickTo(".layer-env", "y", {duration: 0.6, ease: "power3"});
            const subXTo = gsap.quickTo(".layer-subject", "x", {duration: 0.4, ease: "power3"});
            const subYTo = gsap.quickTo(".layer-subject", "y", {duration: 0.4, ease: "power3"});
            const lightXTo = gsap.quickTo(".cursor-light", "left", {duration: 0.2, ease: "power3"});
            const lightYTo = gsap.quickTo(".cursor-light", "top", {duration: 0.2, ease: "power3"});

            gsap.to('.cursor-light', { opacity: 1, duration: 2, delay: 2 });

            document.querySelector('.hero').addEventListener("mousemove", (e) => {
                const { innerWidth, innerHeight } = window;
                const xNorm = (e.clientX / innerWidth) * 2 - 1;
                const yNorm = (e.clientY / innerHeight) * 2 - 1;

                bgXTo(-xNorm * 8);
                bgYTo(-yNorm * 8);
                subXTo(xNorm * 12);
                subYTo(yNorm * 12);
                lightXTo(e.clientX);
                lightYTo(e.clientY);
            });
        }

        gsap.to('.layer-env', {
            y: 50,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to('.layer-subject', {
            y: -30,
            scale: 0.95,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to('.hero-content-wrapper', {
            y: -50,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "center top", scrub: true }
        });
    }
});
