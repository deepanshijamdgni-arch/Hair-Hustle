/* ===================================================
   HAIR HUSTLE — JavaScript
   Features: Navbar, Mobile Menu, Slider, Form 
   Validation, Back-to-Top, Scroll Reveal, Counters
   =================================================== */

/* ── Navbar: sticky on scroll ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        backToTop?.classList.toggle('show', window.scrollY > 400);
    });
}

/* ── Hamburger / Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

/* ── Back To Top ── */
const backToTop = document.getElementById('backToTop');
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Scroll Reveal ── */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
}
initScrollReveal();

/* ── Animated Counters ── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

/* ── Testimonial Slider ── */
function initSlider(trackSelector, options = {}) {
    const track = document.querySelector(trackSelector);
    if (!track) return;
    const slides = track.querySelectorAll('.testimonial-slide');
    const total = slides.length;
    if (total === 0) return;
    let current = 0;
    let autoplay;

    const dots = document.querySelectorAll(options.dotsSelector || '.dot');
    const prevBtn = document.querySelector(options.prevSelector || '.slider-btn.prev');
    const nextBtn = document.querySelector(options.nextSelector || '.slider-btn.next');

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        autoplay = setInterval(next, 4500);
    }
    function stopAuto() {
        clearInterval(autoplay);
    }

    nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => (touchStartX = e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    });

    goTo(0);
    startAuto();
}

initSlider('.testimonial-track');

/* ── Product Filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        productCards.forEach(card => {
            const show = cat === 'all' || card.dataset.category === cat;
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.display = show ? 'block' : 'none';
                if (show) {
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                }
            }, 200);
        });
    });
});

/* ── Product Modal ── */
const modalOverlay = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');

function openModal(data) {
    if (!modalOverlay) return;
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalPrice').textContent = data.price;
    document.getElementById('modalDesc').textContent = data.desc;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
}
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

document.querySelectorAll('.product-card[data-name]').forEach(card => {
    card.addEventListener('click', () => openModal({
        img: card.querySelector('img')?.src || '',
        name: card.dataset.name,
        price: card.dataset.price,
        desc: card.dataset.desc,
    }));
});

/* ── Contact Form Validation ── */
const contactForm = document.getElementById('contactForm');
const successPopup = document.getElementById('successPopup');

function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
}
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(fieldId + 'Error');
    if (field) field.classList.remove('error');
    if (err) err.classList.remove('show');
}

contactForm?.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el.id));
});

contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || name.length < 2) {
        showError('name', 'Please enter your full name.'); valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Please enter a valid email address.'); valid = false;
    }
    if (phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) {
        showError('phone', 'Please enter a valid phone number.'); valid = false;
    }
    if (!message || message.length < 10) {
        showError('message', 'Message must be at least 10 characters.'); valid = false;
    }

    if (valid) {
        contactForm.reset();
        successPopup.classList.add('show');
        setTimeout(() => successPopup.classList.remove('show'), 4000);
    }
});

/* ── Parallax Hero (subtle) ── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const offset = window.scrollY * 0.25;
        heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
}
