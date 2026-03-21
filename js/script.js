/**
 * High-End Portfolio - JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay for the glow to create a trailing effect
        cursorGlow.style.left = `${posX}px`;
        cursorGlow.style.top = `${posY}px`;
        
        // Advanced Parallax Effect for Background Elements
        const moveX = (posX / window.innerWidth - 0.5) * 40;
        const moveY = (posY / window.innerHeight - 0.5) * 40;
        
        document.querySelectorAll('.blob').forEach((blob, index) => {
            const speed = index === 0 ? 1 : -1.5;
            blob.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
        
        document.querySelectorAll('#particles div').forEach((particle, index) => {
            const speed = (index % 5) * 0.5;
            particle.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });

    // Add hover effect to interactive elements & Advanced 3D Tilt
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    const tiltElements = document.querySelectorAll('.hover-tilt, .stat-card, .project-card, .skill-box');
    
    [...interactiveElements, ...tiltElements].forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // True JS 3D Perspective Tilt calculations
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -12; // 12deg max rotation
            const rotateY = ((x - centerX) / centerX) * 12;
            
            // Set transition to 0s during move for instant magnetic tracking
            el.style.transition = 'none';
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // Add a dynamic glare effect
            let glare = el.querySelector('.glare');
            if(!glare) {
                glare = document.createElement('div');
                glare.classList.add('glare');
                glare.style.position = 'absolute';
                glare.style.top = '0'; glare.style.left = '0';
                glare.style.width = '100%'; glare.style.height = '100%';
                glare.style.pointerEvents = 'none';
                glare.style.borderRadius = 'inherit';
                glare.style.zIndex = '10';
                el.appendChild(glare);
            }
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;
        });
        
        el.addEventListener('mouseleave', () => {
            // Restore transition for smooth snap back
            el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            const glare = el.querySelector('.glare');
            if(glare) glare.style.background = 'none';
        });
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // --- Button Ripple Effect ---
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-span');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // --- Animated Typing Effect ---
    const typingText = document.getElementById('typingText');
    const roles = ["Full Stack Developer", "MERN + AI"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function typeEffect() {
        if (!typingText) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50; // faster when deleting
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100; // normal speed when typing
        }

        // Handle word completion
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingDelay = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typingDelay);
    }

    if (typingText) {
        setTimeout(typeEffect, 1000); // Start effect after 1s
    }

    // Initialize the Intersection Observer for animations
    initScrollAnimations();
    initNavbarLogic();
    initProjectFiltering();
    initFormValidation();
    initParticles();
    initBubbles();
    
}); // End DOMContentLoaded

// --- Navbar & Scroll Logic ---
function initNavbarLogic() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-links li a');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section, header');

    // Sticky Navbar & Active Links
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        // Navbar blur effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }

        // Active section link
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Back to top functionality
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// --- Project Filtering ---
function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-card.item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// --- Form Validation ---
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            clearError(messageInput);
        }

        if (isValid) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                })
            })
            .then(res => {
                if(!res.ok) throw new Error('Failed to send');
                return res.json();
            })
            .then(data => {
                submitBtn.innerHTML = `<span>${data.message || 'Sent!'}</span> <i class="fas fa-check"></i>`;
                submitBtn.classList.remove('btn-primary');
                submitBtn.style.background = '#00f3ff';
                form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.add('btn-primary');
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            })
            .catch(err => {
                console.error('Backend Error:', err);
                submitBtn.innerHTML = '<span>Server Error</span> <i class="fas fa-times"></i>';
                submitBtn.style.background = '#ff3366'; // Red
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        }
    });

    function showError(input, message) {
        input.classList.add('invalid');
        const errorElement = document.getElementById(`${input.id}Error`);
        if (errorElement) errorElement.textContent = message;
    }

    function clearError(input) {
        input.classList.remove('invalid');
        const errorElement = document.getElementById(`${input.id}Error`);
        if (errorElement) errorElement.textContent = '';
    }

    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => clearError(input));
        }
    });
}

// --- Minimal Particle System ---
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Create simple glowing divs
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = i % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.style.background}`;
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Simple float animation 
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s infinite linear alternate`;
        
        container.appendChild(particle);
    }
}

function initScrollAnimations() {
    // Reveal animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // If it's a progress bar, animate its width
                if (entry.target.classList.contains('skills')) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
                
                // If it contains counters, animate them
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    animateCounters(counters);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach(el => observer.observe(el));
}

function animateCounters(counters) {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            
            // Calculate increment
            const inc = target / 50; // The smaller the divider, the faster it counts
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// --- Dynamic Bubble Animation System ---
function initBubbles() {
    const bubblesContainer = document.createElement('div');
    bubblesContainer.id = 'bubbles-container';
    bubblesContainer.style.position = 'fixed';
    bubblesContainer.style.top = '0';
    bubblesContainer.style.left = '0';
    bubblesContainer.style.width = '100vw';
    bubblesContainer.style.height = '100vh';
    bubblesContainer.style.overflow = 'hidden';
    bubblesContainer.style.pointerEvents = 'none';
    bubblesContainer.style.zIndex = '-1'; // True Background layer
    document.body.appendChild(bubblesContainer);

    const bubbleCount = 20;
    const colors = ['rgba(0, 243, 255, 0.4)', 'rgba(188, 19, 254, 0.4)'];
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 80 + 20; // 20px to 100px
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        bubble.style.position = 'absolute';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.border = `2px solid ${color}`;
        bubble.style.borderRadius = '50%';
        bubble.style.boxShadow = `inset 0 0 15px ${color}, 0 0 10px ${color.replace('0.4', '0.2')}`;
        bubble.style.background = `radial-gradient(ellipse at center, ${color.replace('0.4', '0.1')} 0%, rgba(0,0,0,0) 70%)`;
        
        // Random starting positions
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.bottom = `-${size + 50}px`; 
        
        // Animation config
        const duration = Math.random() * 20 + 15; // 15s to 35s rising time
        const delay = Math.random() * 10;
        
        // Add CSS mapped animation
        bubble.style.animation = `bubble-rise ${duration}s ${delay}s infinite ease-in, bubble-sway ${Math.random() * 5 + 4}s infinite ease-in-out alternate`;
        
        bubblesContainer.appendChild(bubble);
    }
}
