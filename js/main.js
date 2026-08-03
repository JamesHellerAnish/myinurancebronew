/* ═══════════════════════════════════════════════════════
   MYINSURANCEBRO — Main JavaScript
   Vanilla JS · No dependencies
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM References ────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const themeToggle = document.getElementById('themeToggle');

  /* ═══════════════════════════════════════════════════════
     1. NAVBAR — scroll effect + mobile menu
     ═══════════════════════════════════════════════════════ */

  // Scroll: transparent → solid
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // init

  // Mobile hamburger toggle
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  });

  // Close drawer on link click
  mobileDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ═══════════════════════════════════════════════════════
     2. DARK MODE TOGGLE
     ═══════════════════════════════════════════════════════ */

  const html = document.documentElement;
  const savedTheme = localStorage.getItem('mib-theme');

  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('mib-theme', next);
  });

  /* ═══════════════════════════════════════════════════════
     3. SMOOTH SCROLL for anchor links
     ═══════════════════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════════════════
     4. SCROLL-TRIGGERED FADE-UP ANIMATIONS
     ═══════════════════════════════════════════════════════ */

  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ═══════════════════════════════════════════════════════
     5. JOURNEY COMPARISON TABS
     ═══════════════════════════════════════════════════════ */

  const journeyTabs = document.querySelectorAll('.journey-tab');
  const journeyPanels = document.querySelectorAll('.journey-panel');

  journeyTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      journeyTabs.forEach(function (t) { t.classList.remove('active'); });
      journeyPanels.forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  /* ═══════════════════════════════════════════════════════
     6. TESTIMONIAL CAROUSEL
     ═══════════════════════════════════════════════════════ */

  const track = document.getElementById('reviewsTrack');
  const controls = document.getElementById('carouselControls');
  const cards = track.querySelectorAll('.review-card');
  let currentSlide = 0;
  let autoSlideTimer;
  let cardsPerView = 3;

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 576) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function getTotalSlides() {
    return Math.max(1, cards.length - cardsPerView + 1);
  }

  function buildDots() {
    controls.innerHTML = '';
    const total = getTotalSlides();
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('data-index', i);
      controls.appendChild(dot);
    }
  }

  function slideTo(index) {
    var total = getTotalSlides();
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentSlide = index;

    var card = cards[0];
    var gap = 24; // matches --space-6
    var cardWidth = card.offsetWidth + gap;
    track.style.transform = 'translateX(-' + (currentSlide * cardWidth) + 'px)';

    controls.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(function () {
      slideTo(currentSlide + 1);
    }, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  // Dot clicks
  controls.addEventListener('click', function (e) {
    var dot = e.target.closest('.carousel-dot');
    if (dot) {
      slideTo(parseInt(dot.getAttribute('data-index')));
      startAutoSlide();
    }
  });

  // Pause on hover
  var wrapper = document.getElementById('reviewsCarousel');
  wrapper.addEventListener('mouseenter', stopAutoSlide);
  wrapper.addEventListener('mouseleave', startAutoSlide);

  // Touch swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  wrapper.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  wrapper.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) slideTo(currentSlide + 1);
      else slideTo(currentSlide - 1);
    }
    startAutoSlide();
  }, { passive: true });

  function initCarousel() {
    cardsPerView = getCardsPerView();
    buildDots();
    if (currentSlide >= getTotalSlides()) currentSlide = 0;
    slideTo(currentSlide);
    startAutoSlide();
  }

  window.addEventListener('resize', function () {
    cardsPerView = getCardsPerView();
    buildDots();
    if (currentSlide >= getTotalSlides()) currentSlide = 0;
    slideTo(currentSlide);
  });

  initCarousel();

  /* ═══════════════════════════════════════════════════════
     7. FAQ ACCORDION
     ═══════════════════════════════════════════════════════ */

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });

      // Toggle current
      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ═══════════════════════════════════════════════════════
     8. POLICY WIDGET — 3-dropdown cascade + detailed review
     policyData is loaded from js/policy-data.js
     ═══════════════════════════════════════════════════════ */

  var policyProduct = document.getElementById('policyProduct');
  var policyInsurer = document.getElementById('policyInsurer');
  var policyName = document.getElementById('policyName');
  var policyDesc = document.getElementById('policyDescription');
  var reviewPanel = document.getElementById('policyReviewPanel');

  /* ── Render full policy review ──────────────────────── */
  function renderPolicyReview(policy) {
    var html = '';

    // Header
    html += '<div class="pr-header">';
    html += '  <div class="pr-insurer-logo">' + policy.icon + '</div>';
    html += '  <div class="pr-header-text">';
    html += '    <h3>' + policy.name + '</h3>';
    html += '    <p class="pr-subtitle">' + policy.subtitle + '</p>';
    html += '  </div>';
    html += '</div>';

    // Quick Stats
    html += '<div class="pr-stats">';
    html += '  <div class="pr-stat"><div class="pr-stat-label">Entry Age</div><div class="pr-stat-value">' + policy.stats.entryAge + '</div></div>';
    html += '  <div class="pr-stat"><div class="pr-stat-label">Sum Insured</div><div class="pr-stat-value">' + policy.stats.sumInsured + '</div></div>';
    html += '  <div class="pr-stat"><div class="pr-stat-label">Claim Ratio</div><div class="pr-stat-value">' + policy.stats.csr + '</div></div>';
    html += '  <div class="pr-stat"><div class="pr-stat-label">Starting From</div><div class="pr-stat-value">' + policy.stats.premium + '</div></div>';
    html += '</div>';

    // Key Features
    html += '<div class="pr-section">';
    html += '  <h4 class="pr-section-title"><span class="pr-icon">✨</span> Key Features</h4>';
    html += '  <div class="pr-list">';
    policy.features.forEach(function (f) {
      html += '<div class="pr-list-item"><span class="pr-list-icon green">✓</span><span>' + f + '</span></div>';
    });
    html += '  </div>';
    html += '</div>';

    // What's Covered
    html += '<div class="pr-section">';
    html += '  <h4 class="pr-section-title"><span class="pr-icon">🟢</span> What\'s Covered</h4>';
    html += '  <div class="pr-list">';
    policy.covered.forEach(function (c) {
      html += '<div class="pr-list-item"><span class="pr-list-icon green">●</span><span>' + c + '</span></div>';
    });
    html += '  </div>';
    html += '</div>';

    // What's NOT Covered
    html += '<div class="pr-section">';
    html += '  <h4 class="pr-section-title"><span class="pr-icon">🔴</span> What\'s NOT Covered (Key Exclusions)</h4>';
    html += '  <div class="pr-list">';
    policy.notCovered.forEach(function (n) {
      html += '<div class="pr-list-item"><span class="pr-list-icon red">✕</span><span>' + n + '</span></div>';
    });
    html += '  </div>';
    html += '</div>';

    // Claim Settlement Ratio
    html += '<div class="pr-section">';
    html += '  <h4 class="pr-section-title"><span class="pr-icon">📊</span> Claim Settlement Ratio</h4>';
    html += '  <div class="pr-csr-bar"><div class="pr-csr-fill" style="width:0%" data-target="' + policy.claimRatio + '"></div></div>';
    html += '  <div class="pr-csr-value"><span>Industry avg: 97.1% (term) / 88% (health)</span><strong>' + policy.claimRatio + '%</strong></div>';
    html += '</div>';

    // Pros & Cons
    html += '<div class="pr-section">';
    html += '  <h4 class="pr-section-title"><span class="pr-icon">⚖️</span> Pros & Cons</h4>';
    html += '  <div class="pr-pros-cons">';
    html += '    <div class="pr-pros"><h4>👍 Pros</h4><div class="pr-list">';
    policy.pros.forEach(function (p) {
      html += '<div class="pr-list-item"><span class="pr-list-icon green">✓</span><span>' + p + '</span></div>';
    });
    html += '    </div></div>';
    html += '    <div class="pr-cons"><h4>👎 Cons</h4><div class="pr-list">';
    policy.cons.forEach(function (c) {
      html += '<div class="pr-list-item"><span class="pr-list-icon red">✕</span><span>' + c + '</span></div>';
    });
    html += '    </div></div>';
    html += '  </div>';
    html += '</div>';

    // Comparison Table
    if (policy.table && policy.table.length > 0) {
      html += '<div class="pr-section">';
      html += '  <h4 class="pr-section-title"><span class="pr-icon">📋</span> How It Compares</h4>';
      html += '  <table class="pr-table"><thead><tr>';
      policy.table[0].forEach(function (h) { html += '<th>' + h + '</th>'; });
      html += '  </tr></thead><tbody>';
      for (var i = 1; i < policy.table.length; i++) {
        html += '<tr>';
        policy.table[i].forEach(function (cell) { html += '<td>' + cell + '</td>'; });
        html += '</tr>';
      }
      html += '  </tbody></table>';
      html += '</div>';
    }

    // Available Riders
    if (policy.riders && policy.riders.length > 0) {
      html += '<div class="pr-section">';
      html += '  <h4 class="pr-section-title"><span class="pr-icon">🔧</span> Available Riders (Add-ons)</h4>';
      html += '  <div class="pr-riders">';
      policy.riders.forEach(function (r) {
        html += '<span class="pr-rider-tag">' + r + '</span>';
      });
      html += '  </div>';
      html += '</div>';
    }

    // Verdict
    html += '<div class="pr-verdict">';
    html += '  <h4>🎯 Our Verdict</h4>';
    html += '  <p>' + policy.verdict + '</p>';
    html += '  <div class="pr-score">⭐ Myinsurancebro Score: ' + policy.score + '</div>';
    html += '</div>';

    // CTA
    html += '<div class="pr-cta">';
    html += '  <p>Want help choosing or buying this plan? Talk to our advisor for free.</p>';
    html += '  <a href="#cta" class="btn btn-primary btn-lg">Talk to an Advisor — It\'s Free</a>';
    html += '</div>';

    return html;
  }

  /* ── Helper: reset a dropdown ────────────────────────── */
  function resetDropdown(sel, placeholder) {
    sel.innerHTML = '<option value="" disabled selected>' + placeholder + '</option>';
    sel.disabled = true;
  }

  /* ── Event: Product changed → populate Insurer ───────── */
  policyProduct.addEventListener('change', function () {
    var product = this.value;
    var insurers = policyData[product].insurers;

    // Reset downstream
    resetDropdown(policyName, 'First select an insurer…');
    reviewPanel.style.display = 'none';
    reviewPanel.innerHTML = '';

    // Populate insurer dropdown
    policyInsurer.innerHTML = '<option value="" disabled selected>Select an insurer…</option>';
    Object.keys(insurers).forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      policyInsurer.appendChild(opt);
    });
    policyInsurer.disabled = false;

    policyDesc.textContent = 'Select an insurer and plan to read our detailed, plain-English review.';
  });

  /* ── Event: Insurer changed → populate Plan ──────────── */
  policyInsurer.addEventListener('change', function () {
    var product = policyProduct.value;
    var insurerName = this.value;
    var plans = policyData[product].insurers[insurerName];

    // Reset downstream
    reviewPanel.style.display = 'none';
    reviewPanel.innerHTML = '';

    // Populate plan dropdown
    policyName.innerHTML = '<option value="" disabled selected>Select a plan…</option>';
    plans.forEach(function (p, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = p.name;
      policyName.appendChild(opt);
    });
    policyName.disabled = false;

    // Auto-select if only one plan
    if (plans.length === 1) {
      policyName.value = '0';
      policyName.dispatchEvent(new Event('change'));
    } else {
      policyDesc.textContent = 'Select a plan above to read our detailed review.';
    }
  });

  /* ── Event: Plan changed → render review ─────────────── */
  policyName.addEventListener('change', function () {
    var product = policyProduct.value;
    var insurerName = policyInsurer.value;
    var index = parseInt(this.value);
    var policy = policyData[product].insurers[insurerName][index];

    policyDesc.textContent = policy.subtitle;

    // Render the review
    reviewPanel.innerHTML = renderPolicyReview(policy);
    reviewPanel.style.display = 'block';

    // Animate CSR bar
    setTimeout(function () {
      var csrFill = reviewPanel.querySelector('.pr-csr-fill');
      if (csrFill) {
        csrFill.style.width = csrFill.getAttribute('data-target') + '%';
      }
    }, 100);

    // Smooth scroll to review
    setTimeout(function () {
      var offset = navbar.offsetHeight + 16;
      var top = reviewPanel.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 200);
  });

  /* ═══════════════════════════════════════════════════════
     9. COUNTER ANIMATION (trust numbers)
     ═══════════════════════════════════════════════════════ */

  // Animate numbers when they enter viewport
  function animateCounter(el, target, suffix) {
    var start = 0;
    var dur = 2000;
    var startTs = null;

    function step(ts) {
      if (!startTs) startTs = ts;
      var progress = Math.min((ts - startTs) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString() + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ═══════════════════════════════════════════════════════
     INIT COMPLETE
     ═══════════════════════════════════════════════════════ */
})();
