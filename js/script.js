
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



    // 3. Initialize Cinematic Hero Animations (Wait for images to load)
    if (document.readyState === 'complete') {
        initHeroAnimations();
    } else {
        window.addEventListener('load', initHeroAnimations);
    }

    // 4. Scroll Animations (Desktop/Tablet)
    mm.add("(min-width: 769px)", () => {
        // Features Storytelling (Pin & Sequential Reveal)
        const featuresCards = gsap.utils.toArray('.feature-card');
        if (featuresCards.length > 0) {
            const featuresTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".features",
                    start: "top top",
                    end: "+=150%", // Keep it pinned for 1.5x screen height
                    pin: true,
                    scrub: 1
                }
            });

            // Make them all hidden initially
            gsap.set(featuresCards, { y: 100, opacity: 0 });

            // Reveal them sequentially based on scroll progress
            featuresCards.forEach((card, i) => {
                featuresTl.to(card, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, i * 0.5); // Stagger timing in the scrub timeline
            });
        }

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
            top: 80,
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
                top: 30,
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

        simpleFadeUp('.feature-card', '.features');
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
            top: 50,
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
        
        // 1. Initial State Setup
        gsap.set('.layer-bg, .layer-foreground', { opacity: 1 }); // base
        gsap.set('.layer-env', { opacity: 0, scale: 1.05 });
        gsap.set('.layer-subject', { opacity: 0, scale: 1.08, y: 30 });
        gsap.set('.layer-light', { opacity: 0 });
        gsap.set('.hero-eyebrow', { opacity: 0, y: 15 });
        gsap.set('.hero-title .line span', { opacity: 0, y: 60 });
        gsap.set('.hero-subtitle', { opacity: 0, y: 20 });
        gsap.set('.hero-btn', { opacity: 0, y: 20 });
        gsap.set('.navbar', { opacity: 0, y: -20 });

        if (isReducedMotion) {
            const overlay = document.querySelector('.intro-overlay');
            if (overlay) gsap.set(overlay, { display: 'none' });

            gsap.to('.layer-env, .layer-subject, .layer-light, .hero-eyebrow, .hero-title .line span, .hero-subtitle, .hero-btn, .navbar', {
                opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out", stagger: 0.1
            });
            return;
        }

        // 2. Exact Choreographed Entrance Timeline
        const heroTl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" }
        });

        heroTl
            // 0.15s -> Environment
            .to('.layer-env', { opacity: 1, scale: 1, duration: 1.5 }, 0.15)
            // 0.35s -> Athlete & Light
            .to('.layer-subject', { opacity: 1, scale: 1, y: 0, duration: 1.5 }, 0.35)
            .to('.layer-light', { opacity: 1, duration: 1.5 }, 0.35)
            // 0.60s -> Eyebrow
            .to('.hero-eyebrow, .navbar', { opacity: 1, y: 0, duration: 0.8 }, 0.60)
            // 0.80s -> Main Headline (Staggered)
            .to('.hero-title .line span', { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, 0.80)
            // 1.10s -> Subtitle
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, 1.10)
            // 1.35s -> CTA
            .to('.hero-btn', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 1.35)
            .add(() => {
                // 3. Subtle Continuous Breathing (Starts after entrance)
                gsap.to('.layer-subject', {
                    y: 8,
                    duration: 4,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }, 1.6);

        // Preloader Overlay Sequence
        const introTl = gsap.timeline({
            onComplete: () => {
                const overlay = document.querySelector('.intro-overlay');
                if(overlay) overlay.style.display = 'none';
                heroTl.play(); // Start hero animation right after preloader finishes fading out
            }
        });

        introTl
            .to('.intro-logo', { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to('.intro-logo', { opacity: 0, duration: 0.5, delay: 0.5, ease: "power2.in" })
            .to('.intro-overlay', { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2");


        // 4. Mouse Parallax (Desktop Only)
        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (isDesktop) {
            const bgXTo = gsap.quickTo(".layer-env", "x", {duration: 0.8, ease: "power3"});
            const bgYTo = gsap.quickTo(".layer-env", "y", {duration: 0.8, ease: "power3"});
            
            const subXTo = gsap.quickTo(".layer-subject", "x", {duration: 0.5, ease: "power3"});
            const subYTo = gsap.quickTo(".layer-subject", "y", {duration: 0.5, ease: "power3"});
            
            const lightXTo = gsap.quickTo(".layer-light", "x", {duration: 0.3, ease: "power3"});
            const lightYTo = gsap.quickTo(".layer-light", "y", {duration: 0.3, ease: "power3"});
            
            const fgXTo = gsap.quickTo(".layer-foreground", "x", {duration: 0.2, ease: "power3"});
            const fgYTo = gsap.quickTo(".layer-foreground", "y", {duration: 0.2, ease: "power3"});
            
            // Add slight parallax to text container for 3D feel
            const textXTo = gsap.quickTo(".hero-content-wrapper", "x", {duration: 0.6, ease: "power3"});
            const textYTo = gsap.quickTo(".hero-content-wrapper", "y", {duration: 0.6, ease: "power3"});

            document.querySelector('.hero').addEventListener("mousemove", (e) => {
                const { innerWidth, innerHeight } = window;
                const xNorm = (e.clientX / innerWidth) * 2 - 1;
                const yNorm = (e.clientY / innerHeight) * 2 - 1;

                // Subtle inverse movement
                bgXTo(-xNorm * 10);
                bgYTo(-yNorm * 10);
                
                // Subject moves slightly with mouse
                subXTo(xNorm * 15);
                subYTo(yNorm * 15);
                
                // Lighting and foreground move more drastically
                lightXTo(-xNorm * 25);
                lightYTo(-yNorm * 25);
                
                fgXTo(xNorm * 30);
                fgYTo(yNorm * 30);

                textXTo(xNorm * 5);
                textYTo(yNorm * 5);
            });
        }

        // 5. Scroll Exit Transition (Cinematic Fade/Scale)
        gsap.to('.hero-layers, .hero-content-wrapper', {
            scale: 0.96,
            y: -40,
            opacity: 0.85,
            ease: "none",
            scrollTrigger: { 
                trigger: ".hero", 
                start: "top top", 
                end: "bottom top", 
                scrub: true 
            }
        });
        
        // Deep fade to black just before next section takes over completely
        gsap.to('.hero', {
            opacity: 0,
            ease: "power2.in",
            scrollTrigger: { 
                trigger: ".hero", 
                start: "center top", 
                end: "bottom top", 
                scrub: true 
            }
        });
    }

    // ==========================================================================
    // 6. Mobile Menu Toggle with GSAP
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (hamburger && menuOverlay) {
        let isMenuOpen = false;
        
        // GSAP Timeline for Menu Animation
        const menuTl = gsap.timeline({ paused: true });
        
        menuTl.to(menuOverlay, {
            autoAlpha: 1, // handles visibility and opacity
            duration: 0.4,
            ease: "power2.inOut"
        })
        .to(menuLinks, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=0.2");

        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            hamburger.classList.toggle('active', isMenuOpen);
            
            if (isMenuOpen) {
                lenis.stop(); // Prevent scrolling while menu is open
                menuTl.play();
            } else {
                lenis.start();
                menuTl.reverse();
            }
        }

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }
});
