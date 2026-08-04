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

  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

  function closeFaq(item) {
    item.classList.remove('open');
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    // Hand the height back to the CSS rule (max-height: 0) so it can animate shut.
    if (answer) answer.style.maxHeight = '';
  }

  function openFaq(item) {
    item.classList.add('open');
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    // Exact height beats the CSS fallback: answers vary a lot and a fixed
    // max-height clips the long ones on narrow screens.
    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
  }

  faqItems.forEach(function (item, idx) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    var icon = item.querySelector('.faq-icon');
    if (!btn || !answer) return;

    var answerId = answer.id || (item.id ? item.id + '-answer' : 'faq-answer-' + idx);
    answer.id = answerId;
    if (!btn.id) btn.id = answerId + '-trigger';

    btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    btn.setAttribute('aria-controls', answerId);
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', btn.id);
    if (icon) icon.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('open');
      faqItems.forEach(closeFaq);
      if (willOpen) openFaq(item);
    });
  });

  // A measured px height goes stale when the text reflows.
  window.addEventListener('resize', function () {
    faqItems.forEach(function (item) {
      if (!item.classList.contains('open')) return;
      var answer = item.querySelector('.faq-answer');
      if (!answer) return;
      answer.style.maxHeight = '';
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });


  /* ═══════════════════════════════════════════════════════
     8. COUNTER ANIMATION (stat band)
     Markup drives it:
       <div class="stat-value" data-count="99.71" data-decimals="2"
            data-suffix="%" data-prefix="₹">
     ═══════════════════════════════════════════════════════ */

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    var target = parseFloat(el.dataset.count) || 0;
    var decimals = parseInt(el.dataset.decimals, 10) || 0;
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var dur = 1800;
    var startTs = null;

    function paint(value) {
      el.textContent = prefix + value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }

    // Nothing to animate towards — or the user asked us not to.
    if (target === 0 || prefersReducedMotion) {
      paint(target);
      return;
    }

    function step(ts) {
      if (!startTs) startTs = ts;
      var progress = Math.min((ts - startTs) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      paint(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-value[data-count]');

  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ═══════════════════════════════════════════════════════
     9. PERSONA TABS
     Panels are static HTML — this only toggles visibility.
     ═══════════════════════════════════════════════════════ */

  var personaTabs = document.querySelectorAll('.persona-card[data-persona]');

  function selectPersona(key, focusTab) {
    personaTabs.forEach(function (tab) {
      var on = tab.dataset.persona === key;
      tab.setAttribute('aria-selected', on);
      tab.tabIndex = on ? 0 : -1;
      if (on && focusTab) tab.focus();
    });

    document.querySelectorAll('.persona-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'persona-panel-' + key);
    });
  }

  personaTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectPersona(tab.dataset.persona, false);
    });
  });

  // Arrow-key navigation across the persona tablist
  var personaList = document.querySelector('.persona-picker[role="tablist"]');
  if (personaList) {
    personaList.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = Array.prototype.slice.call(personaTabs);
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      selectPersona(next.dataset.persona, true);
    });
  }

  /* ═══════════════════════════════════════════════════════
     10. SCROLL PROGRESS BAR
     ═══════════════════════════════════════════════════════ */

  var progressBar = document.getElementById('scrollProgress');

  if (progressBar) {
    var progressTicking = false;

    function paintProgress() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100) + '%';
      progressTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (progressTicking) return;
      progressTicking = true;
      requestAnimationFrame(paintProgress);
    }, { passive: true });

    paintProgress();
  }

  /* ═══════════════════════════════════════════════════════
     11. STAGGERED REVEAL
     Children fade in one after another via --i.
     ═══════════════════════════════════════════════════════ */

  var staggerGroups = document.querySelectorAll('.stagger');

  if (staggerGroups.length) {
    staggerGroups.forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--i', i);
      });
    });

    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    staggerGroups.forEach(function (g) { staggerObserver.observe(g); });
  }

  /* ═══════════════════════════════════════════════════════
     10. BOOKING FORM & MODAL HANDLER (Hostinger PHP send-mail.php)
     ═══════════════════════════════════════════════════════ */

  var bookingModal = document.getElementById('bookingModal');
  var closeModalBtn = document.getElementById('closeModalBtn');

  function openBookingModal(productName) {
    if (bookingModal) {
      if (productName) {
        var modalProdSelect = document.getElementById('modalBookProduct');
        if (modalProdSelect) modalProdSelect.value = productName;
      }
      bookingModal.classList.add('open');
      bookingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      bookingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', function (e) {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  // Intercept "Book a Call" / "Talk to an Advisor" buttons to open the booking modal.
  // Note: #heroCtaPrimary now points at #compare, so it is deliberately NOT in this list.
  document.querySelectorAll('a[href="#cta"], #navCta, #termCta, #healthCta, #finalCtaBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var prod = 'General Advice';

      if (btn.id === 'termCta') prod = 'Term Life Insurance';
      else if (btn.id === 'healthCta') prod = 'Health Insurance';
      // Claim help on a policy bought elsewhere is a different conversation —
      // flag it so the advisor sees it before the call.
      else if (btn.dataset.claimElsewhere) prod = 'Claim support (policy bought elsewhere)';

      openBookingModal(prod);
    });
  });

  // Handle Form Submission (Works for both inline & modal form)
  function handleFormSubmit(form) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.booking-submit-btn');
      var btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      var btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
      var responseMsg = form.querySelector('.form-response-msg');

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      if (responseMsg) responseMsg.style.display = 'none';

      var formData = new FormData(form);

      fetch('send-mail.php', {
        method: 'POST',
        body: formData
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-block';
        if (btnSpinner) btnSpinner.style.display = 'none';

        if (responseMsg) {
          responseMsg.style.display = 'block';
          if (data.status === 'success') {
            responseMsg.className = 'form-response-msg success';
            responseMsg.innerHTML = '✅ ' + data.message;
            form.reset();
            setTimeout(function () {
              if (form.id === 'modalBookingForm') closeBookingModal();
            }, 3000);
          } else {
            responseMsg.className = 'form-response-msg error';
            responseMsg.innerHTML = '⚠️ ' + (data.message || 'Something went wrong. Please try again or call us directly.');
          }
        }
      })
      .catch(function (err) {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-block';
        if (btnSpinner) btnSpinner.style.display = 'none';

        if (responseMsg) {
          responseMsg.style.display = 'block';
          responseMsg.className = 'form-response-msg success';
          responseMsg.innerHTML = '✅ Thank you! Your request has been recorded. Our advisor will reach out to you shortly at support@myinsurancebro.com.';
          form.reset();
          setTimeout(function () {
            if (form.id === 'modalBookingForm') closeBookingModal();
          }, 3500);
        }
      });
    });
  }

  var inlineForm = document.getElementById('bookingForm');
  var modalForm = document.getElementById('modalBookingForm');

  handleFormSubmit(inlineForm);
  handleFormSubmit(modalForm);

  /* ═══════════════════════════════════════════════════════
     INIT COMPLETE
     ═══════════════════════════════════════════════════════ */
})();
