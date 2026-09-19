document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Theme Toggle (Dark/Light)
     ========================================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check for saved theme preference or OS preference
  const savedTheme = localStorage.getItem('campusly_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcons('light');
  }
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('campusly_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
  
  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'ph ph-sun';
        } else {
          icon.className = 'ph ph-moon';
        }
      }
    });
  }

  /* ==========================================================================
     RTL Toggle
     ========================================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const htmlTag = document.documentElement;
  
  // Check saved RTL state
  const savedRTL = localStorage.getItem('campusly_rtl');
  if (savedRTL === 'true') {
    htmlTag.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  }
  
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRTL = htmlTag.getAttribute('dir') === 'rtl';
      if (isRTL) {
        htmlTag.removeAttribute('dir');
        document.body.classList.remove('rtl');
        localStorage.setItem('campusly_rtl', 'false');
      } else {
        htmlTag.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        localStorage.setItem('campusly_rtl', 'true');
      }
    });
  });

  /* ==========================================================================
     Mobile Navigation Drawer
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const navDrawer = document.querySelector('.nav-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  
  function openDrawer() {
    if (navDrawer) navDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeDrawer() {
    if (navDrawer) navDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  /* ==========================================================================
     Form Validation
     ========================================================================== */
  const forms = document.querySelectorAll('.validate-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        // Reset state
        input.classList.remove('error', 'success');
        const container = input.closest('.password-input-wrap') || input;
        const errorMsg = container.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
          errorMsg.style.display = 'none';
        }
        
        // Validation logic
        if (!input.value.trim()) {
          showError(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'Please enter a valid email');
          isValid = false;
        } else if (input.type === 'password' && input.value.length < 8) {
          showError(input, 'Password must be at least 8 characters');
          isValid = false;
        } else if (input.name === 'confirm_password') {
          const pwd = form.querySelector('input[name="password"]');
          if (pwd && input.value !== pwd.value) {
            showError(input, 'Passwords do not match');
            isValid = false;
          }
        } else if (input.type === 'checkbox' && !input.checked) {
          showError(input, 'You must accept the terms');
          isValid = false;
        } else {
          input.classList.add('success');
        }
      });
      
      if (isValid) {
        // Show success state (mocking submission)
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Success!';
        btn.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          form.reset();
          inputs.forEach(i => i.classList.remove('success'));
        }, 3000);
      }
    });
  });
  
  function showError(input, message) {
    input.classList.add('error');
    const container = input.closest('.password-input-wrap') || input;
    const errorMsg = container.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    } else {
      // Create error msg if it doesn't exist
      const msg = document.createElement('span');
      msg.className = 'form-error-msg';
      msg.textContent = message;
      msg.style.display = 'block';
      container.parentNode.insertBefore(msg, container.nextSibling);
    }
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /* ==========================================================================
     Password Visibility Toggle
     ========================================================================== */
  const passwordToggles = document.querySelectorAll('.password-toggle');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = btn.closest('.password-input-wrap');
      if (!wrap) return;
      const input = wrap.querySelector('input');
      if (!input) return;
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
      }
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

});

/* ==========================================================================
   Premium UI layer: scroll reveal, sticky nav, counters, interactive modules
   ========================================================================== */
(function () {
  'use strict';

  // Flag JS availability so CSS can switch fade-ups to scroll-triggered reveals
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.animate-fade-up');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Navbar scroll state ---------- */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var ticking = false;
    function apply() {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    }
    apply();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    }, { passive: true });
  }

  /* ---------- Animated stat counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      if (reduceMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      var duration = 1500;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { obs.observe(el); });
  }

  onReady(function () {
    initReveal();
    initNavbar();
    initCounters();
  });
})();

/* ==========================================================================
   Interactive: Admissions Readiness Scorecard (index.html)
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('scorecard');
    if (!root) return;

    var dial = root.querySelector('.dial-value');
    var numberEl = root.querySelector('.dial-number');
    var tierEl = root.querySelector('.score-tier');
    var noteEl = root.querySelector('.score-note');
    var resetBtn = root.querySelector('.quiz-reset');
    var steps = Array.prototype.slice.call(root.querySelectorAll('.quiz-step'));

    var CIRC = 2 * Math.PI * 82; // r = 82 in the markup
    if (dial) {
      dial.setAttribute('stroke-dasharray', CIRC);
      dial.setAttribute('stroke-dashoffset', CIRC);
    }

    var tiers = [
      {
        min: 0,
        label: 'Getting started',
        note: 'Answer a few questions and we will map where your application stands today.'
      },
      {
        min: 1,
        label: 'Early stage',
        note: 'There is real ground to cover, and plenty of runway to cover it. A strategy session would focus first on your school list and narrative.'
      },
      {
        min: 45,
        label: 'Developing',
        note: 'Your foundation is forming. Sharpening your essays and tightening your list is where the next points come from.'
      },
      {
        min: 65,
        label: 'Competitive',
        note: 'You are tracking well against admitted-student profiles. Targeted essay work and interview prep would push you into the top band.'
      },
      {
        min: 82,
        label: 'Standout',
        note: 'You are in strong shape for selective schools. Our work would be about protecting your edge: polish, positioning and early-round strategy.'
      }
    ];

    function tierFor(score) {
      var chosen = tiers[0];
      tiers.forEach(function (t) { if (score >= t.min) chosen = t; });
      return chosen;
    }

    function readScore() {
      var total = 0;
      var answered = 0;
      var breakdown = {};

      steps.forEach(function (step) {
        var selected = step.querySelector('.chip.selected');
        var key = step.getAttribute('data-metric');
        var weight = parseFloat(step.getAttribute('data-weight') || '20');
        if (selected) {
          answered++;
          var v = parseFloat(selected.getAttribute('data-value')); // 0..1
          total += v * weight;
          breakdown[key] = v;
        } else {
          breakdown[key] = 0;
        }
      });

      return { score: Math.round(total), answered: answered, breakdown: breakdown };
    }

    function render() {
      var result = readScore();
      var score = result.score;

      if (dial) {
        dial.setAttribute('stroke-dashoffset', CIRC - (CIRC * score) / 100);
      }

      if (numberEl) {
        var from = parseInt(numberEl.textContent, 10) || 0;
        animateNumber(numberEl, from, score);
      }

      var tier = result.answered === 0 ? tiers[0] : tierFor(score);
      if (tierEl) tierEl.textContent = tier.label;
      if (noteEl) noteEl.textContent = tier.note;

      // Sub-metric bars
      root.querySelectorAll('[data-bar]').forEach(function (bar) {
        var key = bar.getAttribute('data-bar');
        var pct = Math.round((result.breakdown[key] || 0) * 100);
        var fill = bar.querySelector('i');
        var label = bar.querySelector('[data-bar-value]');
        if (fill) fill.style.width = pct + '%';
        if (label) label.textContent = pct + '%';
      });
    }

    function animateNumber(el, from, to) {
      var duration = 600;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * eased);
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    root.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var row = chip.closest('.chip-row');
        if (row) {
          row.querySelectorAll('.chip').forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
          });
        }
        chip.classList.add('selected');
        chip.setAttribute('aria-pressed', 'true');
        render();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        root.querySelectorAll('.chip').forEach(function (c) {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        render();
      });
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   Interactive: Application Timeline Explorer (home2.html)
   ========================================================================== */
(function () {
  'use strict';

  var PHASES = [
    {
      id: 'foundation',
      tab: 'Grade 9-10',
      tag: 'Phase 01 - Foundation',
      title: 'Build the profile before the deadlines exist',
      copy: 'The strongest applications are decided long before senior year. We help you choose courses, commit to a few activities with depth, and start a record of what you actually accomplish.',
      items: [
        ['Course strategy', 'Map a rigorous but survivable four-year schedule.'],
        ['Activity depth', 'Trade five shallow clubs for two you can lead.'],
        ['Reading habit', 'Build the vocabulary and voice that essays later rely on.']
      ],
      stat: ['2 - 3', 'activities we recommend going deep on']
    },
    {
      id: 'junior',
      tab: 'Junior Year',
      tag: 'Phase 02 - Positioning',
      title: 'Turn a profile into a position',
      copy: 'Junior year is when your academic record locks in and your story becomes visible. We define the angle admissions officers will remember you by.',
      items: [
        ['Testing plan', 'Decide test-optional vs. test-submit with real data.'],
        ['Narrative angle', 'Name the through-line connecting your interests.'],
        ['Recommenders', 'Identify and cultivate the two teachers who can vouch for it.']
      ],
      stat: ['70%', 'of your final academic record is set by June of junior year']
    },
    {
      id: 'summer',
      tab: 'Summer Sprint',
      tag: 'Phase 03 - The Sprint',
      title: 'The summer that decides your fall',
      copy: 'Students who draft in summer apply calmly in fall. We run an intensive cycle on your college list and personal statement while the pressure is still low.',
      items: [
        ['College list', 'Balance reach, target and likely schools with fit analysis.'],
        ['Personal statement', 'Brainstorm, outline and complete a real draft.'],
        ['Campus research', 'Gather the specifics that make supplements credible.']
      ],
      stat: ['1 draft', 'complete personal statement before senior year starts']
    },
    {
      id: 'senior',
      tab: 'Senior Fall',
      tag: 'Phase 04 - Execution',
      title: 'Submit with nothing left to chance',
      copy: 'Supplements, deadlines, financial aid forms and interviews all land at once. This is where our project management keeps a strong applicant from unravelling.',
      items: [
        ['Supplements', 'Tailored "Why us" essays for every school on the list.'],
        ['Early strategy', 'Choose ED, EA or REA based on your odds, not hype.'],
        ['Interview prep', 'Mock sessions with former admissions interviewers.']
      ],
      stat: ['12+', 'supplemental essays the average applicant writes']
    },
    {
      id: 'decision',
      tab: 'Decision Season',
      tag: 'Phase 05 - The Choice',
      title: 'Read the offers like an insider',
      copy: 'Acceptances are the beginning of a decision, not the end of one. We compare aid packages, weigh waitlist odds and help you commit with confidence.',
      items: [
        ['Offer comparison', 'Translate aid letters into true four-year cost.'],
        ['Waitlist moves', 'Write the letter of continued interest that gets read.'],
        ['Final choice', 'Match the offer to the life you want after graduation.']
      ],
      stat: ['98%', 'of our students place into a Top 50 school']
    }
  ];

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function init() {
    var root = document.getElementById('timeline-explorer');
    if (!root) return;

    var tabsWrap = root.querySelector('.tl-tabs');
    var panel = root.querySelector('.tl-panel');
    var progress = root.querySelector('.tl-progress i');
    if (!tabsWrap || !panel) return;

    // Build tabs
    PHASES.forEach(function (phase, i) {
      var btn = document.createElement('button');
      btn.className = 'tl-tab' + (i === 0 ? ' active' : '');
      btn.textContent = phase.tab;
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () { select(i); });
      tabsWrap.appendChild(btn);
    });

    function select(index) {
      var phase = PHASES[index];

      tabsWrap.querySelectorAll('.tl-tab').forEach(function (t, i) {
        t.classList.toggle('active', i === index);
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      if (progress) {
        progress.style.width = ((index + 1) / PHASES.length) * 100 + '%';
      }

      var itemsHtml = phase.items.map(function (item) {
        return '<div class="tl-item">' +
          '<i class="ph-fill ph-check-circle mark"></i>' +
          '<p><strong>' + esc(item[0]) + '</strong>' + esc(item[1]) + '</p>' +
          '</div>';
      }).join('');

      panel.innerHTML =
        '<div>' +
          '<span class="tl-phase-tag">' + esc(phase.tag) + '</span>' +
          '<h3>' + esc(phase.title) + '</h3>' +
          '<p style="color: var(--text-muted);">' + esc(phase.copy) + '</p>' +
          '<div class="stat-item" style="text-align: left; padding: 0; margin-top: var(--spacing-4);">' +
            '<div class="stat-value" style="font-size: 2.4rem;">' + esc(phase.stat[0]) + '</div>' +
            '<div class="stat-label" style="letter-spacing: 0.06em;">' + esc(phase.stat[1]) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tl-list">' + itemsHtml + '</div>';

      panel.classList.remove('swap');
      void panel.offsetWidth; // restart the entrance animation
      panel.classList.add('swap');
    }

    select(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
