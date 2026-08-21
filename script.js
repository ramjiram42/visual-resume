// TechnePlus Executive Visual Resume Controller
// Fully animated interactive narrative, slide deck, & profile widgets

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCursorSpotlight();
    initTypingCarousel();
    initScrollAnimations();
    initSkillsLoader();
    initPitchDeckStoryboard();
    initProjectFilter();
    initMobileDrawer();
    initHeroParallaxTilt();
    initAutomationCardTilt();
    initCertCardsTilt();
});

/**
 * Reading progress bar tracker
 */
function initScrollProgress() {
    const scrollBar = document.getElementById('scroll-progress');
    if (!scrollBar) return;
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollBar.style.width = `${progress}%`;
    });
}

/**
 * Cursor follower spotlights projection
 */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;
    
    document.addEventListener('mousemove', (e) => {
        spotlight.style.opacity = '1';
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });
}

/**
 * Typing loop subtitle text carousel
 */
function initTypingCarousel() {
    const span = document.getElementById('typing-span');
    if (!span) return;
    
    const roles = [
        "Forward Deployed Engineer",
        "PMP® Project Manager",
        "CSPO® Product Owner",
        "Microsoft Tech Trainer",
        "Future CTO"
    ];
    
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    
    function cycle() {
        const currentRole = roles[roleIdx];
        
        if (deleting) {
            span.innerHTML = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            span.innerHTML = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }
        
        let speed = deleting ? 30 : 60;
        
        if (!deleting && charIdx === currentRole.length) {
            speed = 2200; // Pause at full string
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 500; // Delay before next
        }
        
        setTimeout(cycle, speed);
    }
    
    setTimeout(cycle, 600);
}

/**
 * Scroll triggers fade-in and timeline indicator highlights
 */
function initScrollAnimations() {
    const aosItems = document.querySelectorAll('[data-aos]');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.hertz-nav-link, .link-item');
    const timelineIndicators = document.querySelectorAll('.timeline-indicator');
    
    // Inject active animation style rules
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-active');
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });
    
    aosItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Immediately reveal elements in or near initial viewport so they are never invisible on page open
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            item.classList.add('fade-in-active');
        }
        observer.observe(item);
    });
    
    window.addEventListener('scroll', () => {
        let currentSec = '';
        const scrollPos = window.scrollY + 180;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSec = section.getAttribute('id');
            }
        });
        
        if (currentSec) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSec}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Timeline dot nodes trigger crossing viewport center
        timelineIndicators.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top < window.innerHeight * 0.5) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });
    });
}

/**
 * Skills fill animation triggers on visibility
 */
function initSkillsLoader() {
    const skillsSection = document.getElementById('skills');
    const fills = document.querySelectorAll('.skills-score-fill');
    
    if (!skillsSection) return;
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fills.forEach(fill => {
                    fill.style.transform = 'scaleX(1)';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(skillsSection);
}

/**
 * Animated Candidate Pitch Deck Storyboard / Slide Deck logic
 * Supports vertical tab-clicking, next/prev slide buttons, dot-clicking,
 * and automatic rotation (which stops on user interaction).
 */
function initPitchDeckStoryboard() {
    const tabs = document.querySelectorAll('.pitch-tab-btn');
    const contents = document.querySelectorAll('.pitch-step-content');
    const dots = document.querySelectorAll('.slide-dot');
    const btnNext = document.getElementById('slide-next');
    const btnPrev = document.getElementById('slide-prev');
    
    if (tabs.length === 0) return;
    
    let activeStepNum = 1;
    let autoRotationTimer = setInterval(autoRotate, 8000); // 8-second slide intervals
    
    function showStep(stepNum) {
        // Update Left Tabs
        tabs.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-step')) === stepNum) {
                btn.classList.add('active');
            }
        });
        
        // Update Slide Content
        contents.forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('id') === `step-${stepNum}`) {
                content.classList.add('active');
            }
        });
        
        // Update Slide Indicator Dots
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.getAttribute('data-slide')) === stepNum) {
                dot.classList.add('active');
            }
        });
        
        activeStepNum = stepNum;
    }
    
    function autoRotate() {
        let nextStep = activeStepNum + 1;
        if (nextStep > tabs.length) nextStep = 1;
        showStep(nextStep);
    }
    
    function stopAutoRotation() {
        if (autoRotationTimer) {
            clearInterval(autoRotationTimer);
            autoRotationTimer = null;
        }
    }
    
    // Tab Clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            stopAutoRotation();
            const selectedStep = parseInt(tab.getAttribute('data-step'));
            showStep(selectedStep);
        });
    });
    
    // Indicator Dots Clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoRotation();
            const selectedStep = parseInt(dot.getAttribute('data-slide'));
            showStep(selectedStep);
        });
    });
    
    // Next Button Click
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            stopAutoRotation();
            let nextStep = activeStepNum + 1;
            if (nextStep > tabs.length) nextStep = 1;
            showStep(nextStep);
        });
    }
    
    // Previous Button Click
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            stopAutoRotation();
            let prevStep = activeStepNum - 1;
            if (prevStep < 1) prevStep = tabs.length;
            showStep(prevStep);
        });
    }
}

/**
 * Filter project lists
 */
function initProjectFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filterVal = tab.getAttribute('data-filter');
            
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.97)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Mobile nav toggle drawers
 */
function initMobileDrawer() {
    const toggle = document.querySelector('.nav-toggle-hertz') || document.querySelector('.nav-toggle');
    const linksList = document.querySelector('.nav-links-hertz') || document.querySelector('.nav-links');
    const userPill = document.querySelector('.nav-user-pill');
    
    if (toggle && linksList) {
        toggle.addEventListener('click', () => {
            linksList.classList.toggle('nav-links-open');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
        
        linksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                linksList.classList.remove('nav-links-open');
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    if (userPill) {
        userPill.addEventListener('click', () => {
            const targetSection = document.getElementById('about');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * 3D Interactive Mouse Parallax & Tilt Effect for Hero Cards
 */
function initHeroParallaxTilt() {
    const heroSection = document.querySelector('.section-hero-hertz');
    const leftCard = document.querySelector('.hero-3d-robot-card');
    const rightCard = document.querySelector('.hertz-floating-profile-card');
    
    if (!heroSection || !leftCard || !rightCard) return;
    
    heroSection.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = heroSection.getBoundingClientRect();
        const xVal = (e.clientX - left - width / 2) / (width / 2);
        const yVal = (e.clientY - top - height / 2) / (height / 2);
        
        leftCard.style.transform = `perspective(1000px) rotateY(${xVal * 5}deg) rotateX(${-yVal * 5}deg) translateZ(8px)`;
        rightCard.style.transform = `perspective(1000px) rotateY(${xVal * 7}deg) rotateX(${-yVal * 7}deg) translateZ(12px)`;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        leftCard.style.transform = '';
        rightCard.style.transform = '';
    });
}

/**
 * 3D Mouse Parallax Tilt for AI Core Graphic Card
 */
function initAutomationCardTilt() {
    const card = document.querySelector('.ai-core-graphical-card');
    if (!card) return;
    
    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const xVal = (e.clientX - left - width / 2) / (width / 2);
        const yVal = (e.clientY - top - height / 2) / (height / 2);
        
        card.style.transform = `perspective(800px) rotateY(${xVal * 8}deg) rotateX(${-yVal * 8}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
}

/**
 * 3D Mouse Tilt for Certification Cards
 */
function initCertCardsTilt() {
    const certCards = document.querySelectorAll('.graphical-cert-card');
    
    certCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const xVal = (e.clientX - left - width / 2) / (width / 2);
            const yVal = (e.clientY - top - height / 2) / (height / 2);
            
            card.style.transform = `perspective(600px) rotateY(${xVal * 5}deg) rotateX(${-yVal * 5}deg) translateY(-6px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
