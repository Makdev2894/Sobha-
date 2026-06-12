// ─────────────────────────────────────────────────────────────
// Sobha World City Hoskote — Landing Page Script
//
// SETUP: After deploying your Google Apps Script web app, paste
// the URL below to enable lead capture.
// ─────────────────────────────────────────────────────────────
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybSQmQfpiVF0nZHQgDBbkRA5h65nwVNiEoFmWdpbJKtI6jOyQEt_RRK8dLRJ-zTaVj/exec';

// ── DOM References ────────────────────────────────────────────
var modal         = document.getElementById('popupModal');
var modalTitle    = document.getElementById('modalTitle');
var modalSubtitle = document.getElementById('modalSubtitle');
var modalFormType = document.getElementById('modalFormType');
var modalSubmitBtn = document.getElementById('modalSubmitBtn');
var popupForm     = document.getElementById('popupForm');
var heroForm      = document.getElementById('heroLeadForm');
var ctaForm       = document.getElementById('ctaLeadForm');
var navbar        = document.querySelector('.navbar');
var hamburger     = document.querySelector('.hamburger');
var mobileNav     = document.querySelector('.mobile-nav');

// ── Modal Contexts ────────────────────────────────────────────
var MODAL_CONTEXTS = {
    'enquiry': {
        title:    'Express Your Interest',
        subtitle: 'Register now for exclusive pre-launch pricing and priority allocation.',
        btnText:  'Submit Enquiry',
        type:     'popup-enquiry',
        download: null
    },
    'masterplan': {
        title:    'Download the Master Plan',
        subtitle: 'Share your details and the Sobha World City master plan will download instantly.',
        btnText:  'Download Master Plan',
        type:     'masterplan-request',
        download: { href: 'Master Plan.png', filename: 'Sobha-World-City-Master-Plan.png' }
    },
    'floorplans': {
        title:    'Download Floor Plans (Tentative)',
        subtitle: 'Share your details and the tentative floor plans will download instantly.',
        btnText:  'Download Floor Plans',
        type:     'floorplan-request',
        download: { href: 'Tentative Floor plans.pdf', filename: 'Sobha-One-World-Tentative-Floor-Plans.pdf' }
    },
    'gallery': {
        title:    'Download Gallery',
        subtitle: 'Share your details and the project gallery will download instantly.',
        btnText:  'Download Gallery',
        type:     'gallery-request',
        download: { href: 'Gallery.pdf', filename: 'Sobha-One-World-Gallery.pdf' }
    }
};

// ── Modal: Open / Close ───────────────────────────────────────
function openModal(context) {
    var ctx = MODAL_CONTEXTS[context] || MODAL_CONTEXTS['enquiry'];
    modalTitle.textContent     = ctx.title;
    modalSubtitle.textContent  = ctx.subtitle;
    modalSubmitBtn.textContent = ctx.btnText;
    modalFormType.value        = ctx.type;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('popupInteracted', '1');
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on overlay background click
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Close button (×)
document.querySelector('.modal-close').addEventListener('click', closeModal);

// ── CTA Button Interceptors ───────────────────────────────────
// All buttons with data-modal="enquiry" open the popup
document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(this.dataset.modal);
    });
});

// ── Auto-popup: 5 seconds after page load ────────────────────
if (!sessionStorage.getItem('popupInteracted')) {
    setTimeout(function () {
        if (!modal.classList.contains('active')) {
            openModal('enquiry');
        }
    }, 5000);
}

// ── Form Helpers ──────────────────────────────────────────────
// Indian mobile: 10 digits, starts with 6/7/8/9. Strips spaces, dashes, +91, leading 0.
function validatePhone(form) {
    var phoneEl = form.querySelector('input[name="phone"]');
    if (!phoneEl) return true;
    var raw = (phoneEl.value || '').replace(/[\s\-()]/g, '');
    raw = raw.replace(/^(\+?91|0)/, '');
    if (!/^[6-9]\d{9}$/.test(raw)) {
        phoneEl.setCustomValidity('Please enter a valid 10-digit Indian mobile number.');
        phoneEl.reportValidity();
        phoneEl.focus();
        return false;
    }
    phoneEl.setCustomValidity('');
    phoneEl.value = raw;
    return true;
}

// Clear custom validity as user types
document.querySelectorAll('input[name="phone"]').forEach(function (el) {
    el.addEventListener('input', function () { el.setCustomValidity(''); });
});

function collectFormData(form, formType) {
    var data = {
        formType: formType,
        source: window.location.href
    };
    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.name && el.name !== 'formType' && el.type !== 'submit') {
            data[el.name] = el.value;
        }
    }
    return data;
}

function showSuccess(container) {
    // Fire tracking before DOM mutation
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { 'send_to': 'G-QX01307QV4' });
        gtag('event', 'conversion', { 'send_to': 'AW-18033548473/Z4jJCJTeo6EcELm5iJdD' });
    }
    container.innerHTML =
        '<div class="form-success">' +
        '  <div class="success-icon">&#10003;</div>' +
        '  <h4>Thank You!</h4>' +
        '  <p>Our property consultant will reach out to you shortly.</p>' +
        '</div>';
}

function submitToSheet(data, submitBtn, successContainer) {
    submitBtn.disabled = true;
    var original = submitBtn.textContent;
    submitBtn.textContent = 'Submitting\u2026';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    })
    .then(function () {
        showSuccess(successContainer);
        // Trigger download if this context has a download asset
        var ctx = Object.values(MODAL_CONTEXTS).find(function (c) { return c.type === data.formType; });
        if (ctx && ctx.download) {
            var link = document.createElement('a');
            link.href = ctx.download.href;
            link.download = ctx.download.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        // Uncomment the line below once Google Ads conversion tracking is configured:
        // gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXXX/XXXXXXX' });
    })
    .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        alert('Something went wrong. Please try again or call us directly.');
    });
}

// ── Hero Form ─────────────────────────────────────────────────
if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validatePhone(this)) return;
        var data = collectFormData(this, 'hero');
        var btn = this.querySelector('[type="submit"]');
        submitToSheet(data, btn, this.closest('.hero-form-card'));
    });
}

// ── CTA Section Form ──────────────────────────────────────────
if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validatePhone(this)) return;
        var data = collectFormData(this, 'cta');
        var btn = this.querySelector('[type="submit"]');
        submitToSheet(data, btn, this.closest('.cta-form-container'));
    });
}

// ── Popup Form ────────────────────────────────────────────────
if (popupForm) {
    popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validatePhone(this)) return;
        var data = collectFormData(this, modalFormType.value);
        var btn = this.querySelector('[type="submit"]');
        submitToSheet(data, btn, this.closest('.modal-card'));
    });
}

// ── Smooth Scroll (navigation anchor links only) ──────────────
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            closeMobileNav();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ── Sticky Navbar ─────────────────────────────────────────────
window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ── Scroll Reveal ─────────────────────────────────────────────
(function () {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
})();

// ── Hamburger Menu ────────────────────────────────────────────
function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close mobile nav when clicking anywhere outside the navbar
document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
        closeMobileNav();
    }
});
