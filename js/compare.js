/* ═══════════════════════════════════════════════════════
   MYINSURANCEBRO — COMPARISON ENGINE

   Three modes, driven by the dataset in policy-data.js:
     Explore   — filter chips over a grid of plan cards
     Compare   — up to 3 plans side by side, best value per row starred
     Deep dive — the full plain-English review of a single plan

   Below the modes sit the premium illustrations, the insurer
   league table and the scoring methodology.

   State is mirrored into the URL hash so a view can be linked to.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof policyData === 'undefined') return;

  var root = document.getElementById('compare');
  if (!root) return;

  /* ── DOM ────────────────────────────────────────────── */
  var el = {
    productBtns: root.querySelectorAll('[data-product]'),
    modeBtns: root.querySelectorAll('[data-mode]'),
    panels: {
      explore: document.getElementById('cmpExplore'),
      compare: document.getElementById('cmpCompare'),
      deepdive: document.getElementById('cmpDeepdive')
    },
    filters: document.getElementById('cmpFilters'),
    grid: document.getElementById('cmpGrid'),
    matrixHost: document.getElementById('cmpMatrixHost'),
    deepPicker: document.getElementById('cmpDeepPicker'),
    deepBody: document.getElementById('cmpDeepBody'),
    premiumHost: document.getElementById('cmpPremiumHost'),
    premiumNote: document.getElementById('cmpPremiumNote'),
    leagueHost: document.getElementById('cmpLeagueHost'),
    methodHost: document.getElementById('cmpMethodHost'),
    tray: document.getElementById('cmpTray'),
    trayCount: document.getElementById('cmpTrayCount'),
    trayChips: document.getElementById('cmpTrayChips'),
    trayGo: document.getElementById('cmpTrayGo')
  };

  var MAX_COMPARE = 3;

  var state = {
    product: 'term',
    mode: 'explore',
    personas: [],   // active persona filter keys
    needs: [],      // active need filter keys
    selected: [],   // plan ids staged for the matrix
    deepId: null
  };

  /* ═══════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════ */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Resolves dotted keys like "metrics.csr" against a plan. */
  function get(obj, path) {
    return String(path).split('.').reduce(function (acc, part) {
      return (acc == null) ? undefined : acc[part];
    }, obj);
  }

  function icon(name) {
    return '<svg class="icon"><use href="#i-' + name + '"></use></svg>';
  }

  /* ── Insurer branding ───────────────────────────────────
     Every tile resolves through policyData.brands, so the same insurer
     looks identical on a plan card, in the matrix head, in the tray and
     in the league table.

     Logos sit on a white plate rather than straight on the page: most of
     these files carry their own coloured background and were drawn for a
     light surface, so on the dark theme an unplated logo either vanishes
     or glares. An insurer with no logo file falls back to the coloured
     monogram, which is why the accent stays in the registry.

     The image is always alt="" — everywhere we render one, the insurer's
     name is already in the adjacent text, and a real alt just makes a
     screen reader announce the brand twice. `cls` is the existing tile
     class for the context, so the CSS sizing rules keep working. */
  function brandTile(insurer, cls, extraStyle) {
    var brand = policyData.brandFor(insurer);

    if (!brand.logo) {
      return '<span class="' + cls + '" style="background:' + esc(brand.accent) +
        (extraStyle || '') + '">' + esc(brand.initials) + '</span>';
    }

    return '<span class="' + cls + ' has-logo"' +
      (extraStyle ? ' style="' + extraStyle.replace(/^;\s*/, '') + '"' : '') + '>' +
      '<img class="brand-logo" src="assets/logos/' + esc(brand.logo) +
      '" alt="" loading="lazy" decoding="async"></span>';
  }

  /* Indian digit grouping — 1,13,250 rather than 113,250. */
  function inr(value) {
    return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  /* Same grouping, but keeps a fractional part where one exists — complaint
     rates like 2.77 must not be rounded to 3, since the whole point of the
     row is that lower is better. */
  function num(value) {
    return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  function crore(value) {
    if (value == null) return '—';
    return value >= 1000
      ? '₹' + inr(Math.round(value)) + ' Cr'
      : '₹' + Number(value).toFixed(2).replace(/\.00$/, '') + ' Cr';
  }

  function fmt(value, type) {
    if (value == null || value === '') return '—';
    switch (type) {
      case 'score': return Number(value).toFixed(1);
      case 'percent': return Number(value).toFixed(2) + '%';
      case 'number': return num(value);
      case 'x': return Number(value).toFixed(2) + 'x';
      case 'crore': return crore(value);
      case 'rupee': return '₹' + inr(value);
      case 'years': return value === 1 ? '1 year' : value + ' years';
      case 'bool':
        return value
          ? '<span class="cmp-yes">' + icon('check') + ' Yes</span>'
          : '<span class="cmp-no">' + icon('x') + ' No</span>';
      default: return esc(value);
    }
  }

  function plansFor(product) {
    return policyData.products[product].plans;
  }

  function planById(id) {
    return policyData.planById[id];
  }

  /* ── Need filters, defined per product ──────────────── */
  var NEEDS = {
    term: [
      { key: 'cheap', label: 'Easy on a first salary', test: function (p) { return p.premiums.m30 <= 21000; } },
      { key: 'boost', label: 'Cover grows at life events', test: function (p) { return !!p.lifeStageBoost; } },
      { key: 'pause', label: 'Can pause premiums', test: function (p) { return !!p.premiumBreak; } },
      { key: 'exit', label: 'Exit with premiums back', test: function (p) { return !!p.smartExit; } },
      { key: 'ci', label: 'Critical illness built in', test: function (p) { return /built in/i.test(p.criticalIllness || ''); } }
    ],
    health: [
      { key: 'seniors', label: 'Best for senior parents', test: function (p) { return p.waiting.ped <= 2; } },
      { key: 'family', label: 'Good value for a family', test: function (p) { return p.premiums.family <= 26000; } },
      { key: 'consumables', label: 'Consumables included', test: function (p) { return /base/i.test(p.consumables || ''); } },
      { key: 'network', label: 'Widest hospital network', test: function (p) { return (p.metrics.network || 0) >= 16000; } },
      { key: 'noroom', label: 'No room rent limit', test: function (p) { return /^no limit/i.test(p.roomRent || ''); } }
    ]
  };

  function activeNeedTests() {
    return NEEDS[state.product].filter(function (n) {
      return state.needs.indexOf(n.key) !== -1;
    });
  }

  function filteredPlans() {
    var tests = activeNeedTests();
    return plansFor(state.product).filter(function (p) {
      var personaOk = !state.personas.length || state.personas.some(function (k) {
        return (p.bestFor || []).indexOf(k) !== -1;
      });
      // Need chips are cumulative — a plan must satisfy every one selected.
      var needsOk = tests.every(function (n) { return n.test(p); });
      return personaOk && needsOk;
    }).sort(function (a, b) { return b.score - a.score; });
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — FILTER CHIPS
     ═══════════════════════════════════════════════════════ */
  function renderFilters() {
    /* Each chip set is a labelled group, so a screen reader announces
       "Life stage, group" rather than a bare run of toggle buttons.
       .filter-group is display:contents — the chips must stay flex items
       of .cmp-filters or each set would wrap as a block on mobile. */
    var html = '<div class="filter-group" role="group" aria-labelledby="cmpPersonaLabel">' +
      '<span class="filter-label" id="cmpPersonaLabel">Life stage</span>';

    policyData.personas.forEach(function (p) {
      var on = state.personas.indexOf(p.key) !== -1;
      html += '<button type="button" class="chip" data-filter="persona" data-key="' + p.key + '"' +
        ' aria-pressed="' + on + '">' + esc(p.label) + ' <span style="opacity:.6">' + esc(p.age) + '</span></button>';
    });

    html += '</div><div class="filter-group" role="group" aria-labelledby="cmpNeedLabel">' +
      '<span class="filter-label" id="cmpNeedLabel" style="margin-left:var(--space-4)">What matters</span>';

    NEEDS[state.product].forEach(function (n) {
      var on = state.needs.indexOf(n.key) !== -1;
      html += '<button type="button" class="chip" data-filter="need" data-key="' + n.key + '"' +
        ' aria-pressed="' + on + '">' + esc(n.label) + '</button>';
    });

    html += '</div>';

    if (state.personas.length || state.needs.length) {
      html += '<button type="button" class="chip-clear" data-filter="clear">Clear filters</button>';
    }

    el.filters.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — EXPLORE GRID
     ═══════════════════════════════════════════════════════ */
  function planCard(plan) {
    var isSelected = state.selected.indexOf(plan.id) !== -1;
    var metrics = state.product === 'term'
      ? [
        { label: 'Claims paid', value: plan.metrics.csr.toFixed(2) + '%' },
        { label: 'Complaints', value: plan.metrics.complaints.toFixed(2) },
        { label: '30M / year', value: '₹' + inr(plan.premiums.m30) }
      ]
      : [
        { label: 'Claims paid', value: plan.metrics.csr.toFixed(2) + '%' },
        { label: 'Hospitals', value: inr(plan.metrics.network) },
        { label: 'PED wait', value: plan.waiting.ped + ' yrs' }
      ];

    var html = '<article class="plan-card' + (isSelected ? ' selected' : '') + '" data-plan="' + plan.id + '">';

    if (plan.tagline) {
      html += '<span class="plan-tagline">' + esc(plan.tagline) + '</span>';
    }

    html += '<div class="plan-card-top">' +
      brandTile(plan.insurer, 'plan-monogram') +
      '<div><span class="plan-insurer">' + esc(plan.insurerShort) + '</span>' +
      '<div class="plan-name">' + esc(plan.name) + '</div></div>' +
      '<div class="plan-score"><div class="plan-score-value">' + plan.score.toFixed(1) + '</div>' +
      '<div class="plan-score-max">out of 5</div></div>' +
      '</div>';

    html += '<p class="plan-sub">' + esc(plan.subtitle) + '</p>';

    html += '<div class="plan-metrics">';
    metrics.forEach(function (m) {
      html += '<div><div class="plan-metric-label">' + esc(m.label) + '</div>' +
        '<div class="plan-metric-value">' + esc(m.value) + '</div></div>';
    });
    html += '</div>';

    html += '<div class="plan-tags">';
    (plan.tags || []).forEach(function (t) {
      html += '<span class="plan-tag">' + esc(t) + '</span>';
    });
    html += '</div>';

    html += '<div class="plan-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-action="select" data-plan="' + plan.id + '"' +
      ' aria-pressed="' + isSelected + '">' + icon(isSelected ? 'check' : 'plus') +
      ' ' + (isSelected ? 'Added' : 'Compare') + '</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-action="deep" data-plan="' + plan.id + '">' +
      'Full review</button>' +
      '</div>';

    html += '</article>';
    return html;
  }

  function renderGrid() {
    var plans = filteredPlans();

    if (!plans.length) {
      el.grid.innerHTML = '<div class="cmp-empty">' + icon('search') +
        '<h3 style="margin:var(--space-4) 0 var(--space-2)">No plan matches every filter</h3>' +
        '<p>Try removing one — or talk to an advisor and we will find the closest fit.</p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-filter="clear" ' +
        'style="margin-top:var(--space-5)">Clear filters</button></div>';
      return;
    }

    el.grid.innerHTML = plans.map(planCard).join('');
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — COMPARE MATRIX
     ═══════════════════════════════════════════════════════ */
  function renderMatrix() {
    var plans = state.selected.map(planById).filter(Boolean);

    if (plans.length < 2) {
      el.matrixHost.innerHTML = '<div class="cmp-empty">' + icon('layers') +
        '<h3 style="margin:var(--space-4) 0 var(--space-2)">Pick at least two plans</h3>' +
        '<p>Head back to Explore and hit <strong>Compare</strong> on the plans you are weighing up. ' +
        'You can line up to ' + MAX_COMPARE + ' side by side.</p>' +
        '<button type="button" class="btn btn-primary btn-sm" data-goto="explore" ' +
        'style="margin-top:var(--space-5)">Browse plans</button></div>';
      return;
    }

    var rows = policyData.compareRows[state.product];
    var numeric = ['score', 'percent', 'number', 'x', 'crore', 'rupee', 'years'];

    var html = '<div class="cmp-matrix-wrap"><table class="cmp-matrix"><thead><tr>' +
      '<th scope="col">Compare</th>';

    plans.forEach(function (p) {
      html += '<th scope="col"><div class="cmp-col-head">' +
        brandTile(p.insurer, 'plan-monogram') +
        '<div><span class="plan-insurer">' + esc(p.insurerShort) + '</span>' +
        '<div class="plan-name">' + esc(p.name) + '</div></div>' +
        '</div></th>';
    });

    html += '</tr></thead><tbody>';

    rows.forEach(function (row) {
      var values = plans.map(function (p) { return get(p, row.key); });

      // Best-in-column highlighting, only where a direction is defined
      // and the values are actually comparable numbers that differ.
      var bestIdx = [];
      if (row.better && numeric.indexOf(row.type) !== -1) {
        var nums = values.map(function (v) {
          return (v == null || v === '') ? null : Number(v);
        });
        var valid = nums.filter(function (n) { return n != null && !isNaN(n); });
        if (valid.length > 1) {
          var best = row.better === 'high' ? Math.max.apply(null, valid) : Math.min.apply(null, valid);
          var allSame = valid.every(function (n) { return n === valid[0]; });
          if (!allSame) {
            nums.forEach(function (n, i) { if (n === best) bestIdx.push(i); });
          }
        }
      }

      html += '<tr><th scope="row"><span class="cmp-row-label">' + esc(row.label);
      if (row.help) {
        html += '<span class="cmp-help" tabindex="0" role="img" aria-label="' + esc(row.help) +
          '" title="' + esc(row.help) + '">?</span>';
      }
      html += '</span></th>';

      values.forEach(function (v, i) {
        var cls = bestIdx.indexOf(i) !== -1 ? ' class="cmp-cell-best"' : '';
        html += '<td' + cls + '>' + fmt(v, row.type) + '</td>';
      });

      html += '</tr>';
    });

    html += '</tbody></table>';
    html += '<p class="cmp-matrix-note">★ marks the strongest value in that row across the plans you are comparing. ' +
      'It is a comparison between these plans only — not an industry benchmark. ' +
      esc(policyData.meta.period) + ' figures. Premiums are illustrations, not quotes.</p>';
    html += '</div>';

    html += '<div style="display:flex; gap:var(--space-4); flex-wrap:wrap; margin-top:var(--space-6)">' +
      '<a href="#cta" class="btn btn-primary">Get advice on these plans</a>' +
      '<button type="button" class="btn btn-ghost" data-goto="explore">Add another plan</button>' +
      '</div>';

    el.matrixHost.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — DEEP DIVE
     ═══════════════════════════════════════════════════════ */
  function renderDeepPicker() {
    el.deepPicker.innerHTML = plansFor(state.product).map(function (p) {
      var on = p.id === state.deepId;
      return '<button type="button" class="chip" data-action="deep" data-plan="' + p.id + '"' +
        ' aria-pressed="' + on + '" style="justify-content:flex-start">' +
        brandTile(p.insurer, 'plan-monogram', '; width:26px; height:26px') +
        esc(p.name) + '</button>';
    }).join('');
  }

  function list(items, iconName, colour) {
    return '<div class="pr-list">' + items.map(function (t) {
      return '<div class="pr-list-item"><span class="pr-list-icon ' + colour + '">' +
        icon(iconName) + '</span><span>' + esc(t) + '</span></div>';
    }).join('') + '</div>';
  }

  function renderDeepDive() {
    // The id must belong to the product currently on screen. A term plan has
    // no `waiting` block and a health plan has no `solvency`, so rendering
    // one under the other's layout throws and aborts the whole render pass.
    var plan = planById(state.deepId);
    if (!plan || plan.category !== state.product) {
      plan = plansFor(state.product)[0];
    }
    if (!plan) return;
    state.deepId = plan.id;

    var stats = state.product === 'term'
      ? [
        ['Claims settled', plan.metrics.csr.toFixed(2) + '%'],
        ['Complaints / 10k', plan.metrics.complaints.toFixed(2)],
        ['Solvency', plan.metrics.solvency.toFixed(2) + 'x'],
        ['Cover available', plan.coverRange],
        ['Entry age', plan.entryAge],
        ['Term', plan.tenure]
      ]
      : [
        ['Claims settled', plan.metrics.csr.toFixed(2) + '%'],
        ['Complaints / 10k', plan.metrics.complaints.toFixed(2)],
        ['Cashless hospitals', inr(plan.metrics.network)],
        ['Sum insured', plan.coverRange],
        ['PED waiting', plan.waiting.ped + ' years'],
        ['Room rent', plan.roomRent]
      ];

    var html = '<div class="policy-review-panel" style="max-width:none">';

    html += '<div class="pr-header">' +
      brandTile(plan.insurer, 'pr-insurer-logo plan-monogram') +
      '<div class="pr-header-text"><h3>' + esc(plan.insurer) + ' ' + esc(plan.name) + '</h3>' +
      '<div class="pr-subtitle">' + esc(plan.subtitle) + '</div></div></div>';

    html += '<div class="pr-stats">' + stats.map(function (s) {
      return '<div class="pr-stat"><div class="pr-stat-label">' + esc(s[0]) + '</div>' +
        '<div class="pr-stat-value">' + esc(s[1]) + '</div></div>';
    }).join('') + '</div>';

    /* Claim settlement bar */
    html += '<div class="pr-section"><div class="pr-section-title">' + icon('trending-up') +
      ' Claim settlement record</div>' +
      '<div class="pr-csr-bar"><div class="pr-csr-fill" style="width:' + plan.metrics.csr + '%"></div></div>' +
      '<div class="pr-csr-value"><span>' + esc(policyData.products[state.product].csrLabel) + '</span>' +
      '<strong>' + plan.metrics.csr.toFixed(2) + '%</strong></div></div>';

    html += '<div class="pr-section"><div class="pr-section-title">' + icon('sparkles') +
      ' What this plan gives you</div>' + list(plan.features, 'check', 'green') + '</div>';

    html += '<div class="pr-section"><div class="pr-section-title">' + icon('check-circle') +
      ' Covered</div>' + list(plan.covered, 'check', 'green') + '</div>';

    html += '<div class="pr-section"><div class="pr-section-title">' + icon('alert-triangle') +
      ' Not covered</div>' + list(plan.notCovered, 'x', 'red') + '</div>';

    if (plan.riders && plan.riders.length) {
      html += '<div class="pr-section"><div class="pr-section-title">' + icon('layers') +
        ' Riders you can add</div><div class="pr-riders">' +
        plan.riders.map(function (r) {
          return '<span class="pr-rider-tag">' + esc(r) + '</span>';
        }).join('') + '</div></div>';
    }

    html += '<div class="pr-section"><div class="pr-pros-cons">' +
      '<div class="pr-pros"><h4>' + icon('check-circle') + ' What we like</h4>' +
      list(plan.pros, 'check', 'green') + '</div>' +
      '<div class="pr-cons"><h4>' + icon('alert-triangle') + ' What to watch</h4>' +
      list(plan.cons, 'x', 'red') + '</div></div></div>';

    html += '<div class="pr-verdict"><h4>' + icon('scale') + ' Our verdict</h4>' +
      '<p>' + esc(plan.verdict) + '</p>' +
      '<span class="pr-score">' + icon('star') + ' Myinsurancebro score ' + plan.score.toFixed(1) + ' / 5</span>' +
      '</div>';

    html += '<div class="pr-cta"><p>Want to know whether this is the right plan for your situation?</p>' +
      '<a href="#cta" class="btn btn-primary btn-lg">Talk to the Chief Advisor</a></div>';

    html += '</div>';

    el.deepBody.innerHTML = html;
    renderDeepPicker();
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — PREMIUM ILLUSTRATIONS
     ═══════════════════════════════════════════════════════ */
  function renderPremiums() {
    var profile = policyData.profiles[state.product];
    var plans = plansFor(state.product);

    el.premiumNote.textContent = profile.assumption;

    var html = '<div class="premium-table-wrap"><table class="premium-table"><thead><tr>' +
      '<th scope="col">Profile</th>';
    plans.forEach(function (p) {
      html += '<th scope="col"><span class="premium-brand">' +
        brandTile(p.insurer, 'brand-tile xs') + esc(p.insurerShort) + '</span></th>';
    });
    html += '</tr></thead><tbody>';

    profile.rows.forEach(function (row) {
      var values = plans.map(function (p) { return p.premiums[row.key]; });
      var valid = values.filter(function (v) { return typeof v === 'number'; });
      var min = valid.length ? Math.min.apply(null, valid) : null;

      html += '<tr><th scope="row">' + esc(row.label) + '</th>';
      values.forEach(function (v) {
        if (typeof v !== 'number') { html += '<td>—</td>'; return; }
        html += '<td' + (v === min ? ' class="cheapest"' : '') + '>₹' + inr(v) + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table></div>';

    html += '<p class="cmp-matrix-note" style="background:none; padding-left:0">';
    if (state.product === 'health') {
      html += '<strong>Read this before comparing the numbers:</strong> every plan above is quoted at ₹15 lakh ' +
        'sum insured except SBI General, which is quoted at ₹50 lakh — its minimum base cover. ' +
        'Its column is therefore not like-for-like with the rest. ';
    }
    html += 'Premiums are indicative illustrations for the stated profile and include GST. They are not quotes — ' +
      'your own premium depends on your age, health, city and underwriting.</p>';

    el.premiumHost.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — INSURER LEAGUE TABLE
     ═══════════════════════════════════════════════════════ */
  function renderLeague() {
    var rows = policyData.companies[state.product];
    var isTerm = state.product === 'term';

    var html = '<div class="league">' +
      '<div class="league-row head">' +
      '<span>#</span><span class="league-head-insurer">Insurer</span><span>Score</span>' +
      '<span class="hide-sm">Claims settled</span>' +
      '<span class="hide-sm">' + (isTerm ? 'Solvency' : 'Complaints / 10k') + '</span>' +
      '</div>';

    rows.forEach(function (c, i) {
      var pct = (c.score / 5) * 100;
      html += '<div class="league-row">' +
        '<span class="league-rank">' + (i + 1) + '</span>' +
        '<div class="league-brand">' + brandTile(c.name, 'brand-tile') +
        '<div class="league-brand-text"><div class="league-name">' + esc(c.name) + '</div>' +
        '<div class="league-bar"><span data-width="' + pct.toFixed(1) + '"></span></div></div></div>' +
        '<span><strong>' + c.score.toFixed(2) + '</strong></span>' +
        '<span class="hide-sm">' + c.csr.toFixed(2) + '%</span>' +
        '<span class="hide-sm">' +
        (isTerm ? c.solvency.toFixed(2) + 'x' : c.complaints.toFixed(2)) +
        '</span></div>';
    });

    html += '</div>';
    html += '<p class="cmp-matrix-note" style="background:none; padding-left:0">' +
      esc(policyData.meta.period) + ' · ' + esc(policyData.meta.source) + '. ' +
      'Some insurers appear here but have no plan in the list above — that means we rate the company ' +
      'but do not currently recommend a specific plan from it.</p>';

    el.leagueHost.innerHTML = html;
    animateBars();
  }

  /* Bars fill once the table scrolls into view. */
  function animateBars() {
    var bars = el.leagueHost.querySelectorAll('.league-bar span');
    if (!('IntersectionObserver' in window)) {
      bars.forEach(function (b) { b.style.width = b.dataset.width + '%'; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var b = entry.target;
        b.style.width = b.dataset.width + '%';
        io.unobserve(b);
      });
    }, { threshold: 0.2 });
    bars.forEach(function (b) { io.observe(b); });
  }

  /* ═══════════════════════════════════════════════════════
     RENDER — METHODOLOGY
     ═══════════════════════════════════════════════════════ */
  function methodGrid(items) {
    return '<div class="methodology">' + items.map(function (m) {
      return '<div class="method-card"><div class="method-weight">' + m.weight + '%</div>' +
        '<h4>' + esc(m.label) + '</h4><p>' + esc(m.note) + '</p></div>';
    }).join('') + '</div>';
  }

  function renderMethodology() {
    var headStyle = 'font-size:var(--text-sm); text-transform:uppercase; letter-spacing:.06em;' +
      ' color:var(--color-text-secondary); margin:var(--space-8) 0 var(--space-2)';

    var html = '<h4 style="' + headStyle + '; margin-top:0">Scoring an individual plan</h4>' +
      methodGrid(policyData.methodology.plan);

    html += '<h4 style="' + headStyle + '">Scoring the insurer behind it</h4>' +
      methodGrid(policyData.methodology.company[state.product]);

    el.methodHost.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════
     COMPARE TRAY
     ═══════════════════════════════════════════════════════ */
  function renderTray() {
    var count = state.selected.length;
    el.tray.classList.toggle('open', count > 0 && state.mode !== 'compare');

    el.trayCount.innerHTML = '<strong>' + count + '</strong> of ' + MAX_COMPARE + ' selected';

    el.trayChips.innerHTML = state.selected.map(function (id) {
      var p = planById(id);
      if (!p) return '';
      var brand = policyData.brandFor(p.insurer);
      var face = brand.logo
        ? '<img class="brand-logo" src="assets/logos/' + esc(brand.logo) + '" alt="" decoding="async">'
        : esc(brand.initials);

      // The title carries the insurer here, since the tray shows the mark alone.
      return '<span class="cmp-tray-chip' + (brand.logo ? ' has-logo' : '') + '"' +
        (brand.logo ? '' : ' style="background:' + esc(brand.accent) + '"') +
        ' title="' + esc(p.insurer + ' ' + p.name) + '">' + face +
        '<button type="button" data-action="unselect" data-plan="' + p.id +
        '" aria-label="Remove ' + esc(p.name) + ' from comparison">×</button></span>';
    }).join('');

    el.trayGo.disabled = count < 2;
    el.trayGo.style.opacity = count < 2 ? '.5' : '1';
  }

  /* Repaints one card's selected state in place. Re-rendering the whole
     grid here would throw away the focused element on every click, which
     makes the grid unusable by keyboard. */
  function paintCardState(id) {
    var card = el.grid.querySelector('.plan-card[data-plan="' + id + '"]');
    if (!card) return;

    var on = state.selected.indexOf(id) !== -1;
    card.classList.toggle('selected', on);

    var btn = card.querySelector('[data-action="select"]');
    if (!btn) return;
    btn.setAttribute('aria-pressed', on);
    btn.innerHTML = icon(on ? 'check' : 'plus') + ' ' + (on ? 'Added' : 'Compare');
  }

  function toggleSelect(id) {
    var i = state.selected.indexOf(id);
    var dropped = null;

    if (i !== -1) {
      state.selected.splice(i, 1);
    } else {
      if (state.selected.length >= MAX_COMPARE) {
        // Oldest out, newest in — less annoying than refusing the click.
        dropped = state.selected.shift();
      }
      state.selected.push(id);
    }

    paintCardState(id);
    if (dropped) paintCardState(dropped);

    renderTray();
    if (state.mode === 'compare') renderMatrix();
    syncHash();
  }

  function deselect(id) {
    var i = state.selected.indexOf(id);
    if (i === -1) return;
    state.selected.splice(i, 1);
    paintCardState(id);
    renderTray();
    if (state.mode === 'compare') renderMatrix();
    syncHash();
  }

  /* ═══════════════════════════════════════════════════════
     MODE / PRODUCT SWITCHING
     ═══════════════════════════════════════════════════════ */
  function setMode(mode, opts) {
    state.mode = mode;

    el.modeBtns.forEach(function (b) {
      var on = b.dataset.mode === mode;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });

    Object.keys(el.panels).forEach(function (key) {
      el.panels[key].classList.toggle('active', key === mode);
    });

    if (mode === 'compare') renderMatrix();
    if (mode === 'deepdive') renderDeepDive();

    renderTray();
    syncHash();

    if (opts && opts.scroll) {
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setProduct(product) {
    if (state.product === product) return;
    state.product = product;

    // Selections and filters are product-specific — reset rather than
    // carry a term plan into a health comparison.
    state.selected = [];
    state.needs = [];
    state.deepId = plansFor(product)[0].id;

    el.productBtns.forEach(function (b) {
      var on = b.dataset.product === product;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });

    renderAll();
  }

  function renderAll() {
    renderFilters();
    renderGrid();
    renderMatrix();
    renderDeepDive();
    renderPremiums();
    renderLeague();
    renderMethodology();
    renderTray();
    syncHash();
  }

  /* ═══════════════════════════════════════════════════════
     URL HASH — deep-linkable state
     Format: #compare/term/explore?persona=genz
     ═══════════════════════════════════════════════════════ */
  var suppressHash = false;

  function syncHash() {
    if (suppressHash) return;
    if (location.hash.indexOf('#compare') !== 0) return;

    var hash = '#compare/' + state.product + '/' + state.mode;
    var params = [];
    if (state.personas.length) params.push('persona=' + state.personas.join(','));
    if (state.mode === 'compare' && state.selected.length) params.push('plans=' + state.selected.join(','));
    if (state.mode === 'deepdive' && state.deepId) params.push('plan=' + state.deepId);
    if (params.length) hash += '?' + params.join('&');

    history.replaceState(null, '', hash);
  }

  function readHash() {
    var raw = location.hash;
    if (raw.indexOf('#compare') !== 0) return false;

    suppressHash = true;

    var parts = raw.slice(1).split('?');
    var path = parts[0].split('/');
    var query = {};
    (parts[1] || '').split('&').forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split('=');
      query[kv[0]] = decodeURIComponent(kv[1] || '');
    });

    if (path[1] && policyData.products[path[1]]) state.product = path[1];

    if (query.persona) {
      state.personas = query.persona.split(',').filter(function (k) {
        return policyData.personas.some(function (p) { return p.key === k; });
      });
    }
    if (query.plans) {
      state.selected = query.plans.split(',')
        .filter(function (id) {
          var p = planById(id);
          return p && p.category === state.product;
        })
        .slice(0, MAX_COMPARE);
    }
    var deep = query.plan && planById(query.plan);
    if (deep && deep.category === state.product) state.deepId = deep.id;

    el.productBtns.forEach(function (b) {
      var on = b.dataset.product === state.product;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });

    var mode = path[2];
    if (mode && el.panels[mode]) state.mode = mode;

    suppressHash = false;
    return true;
  }

  /* ═══════════════════════════════════════════════════════
     EVENTS
     ═══════════════════════════════════════════════════════ */
  el.productBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setProduct(btn.dataset.product); });
  });

  el.modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setMode(btn.dataset.mode); });
  });

  /* Arrow-key navigation across both segmented tab groups. */
  root.querySelectorAll('.segmented[role="tablist"]').forEach(function (group) {
    group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      next.click();
    });
  });

  /* One delegated handler for chips, cards and tray buttons. */
  root.addEventListener('click', function (e) {
    var target = e.target.closest('[data-action], [data-filter], [data-goto]');
    if (!target) return;

    /* Filters */
    var filter = target.dataset.filter;
    if (filter === 'clear') {
      state.personas = [];
      state.needs = [];
      renderFilters();
      renderGrid();
      syncHash();
      return;
    }
    if (filter === 'persona' || filter === 'need') {
      var bucket = filter === 'persona' ? state.personas : state.needs;
      var key = target.dataset.key;
      var idx = bucket.indexOf(key);
      if (idx === -1) bucket.push(key); else bucket.splice(idx, 1);
      renderFilters();
      renderGrid();
      syncHash();
      return;
    }

    /* Jump between modes */
    if (target.dataset.goto) {
      setMode(target.dataset.goto);
      return;
    }

    /* Plan actions */
    var action = target.dataset.action;
    var id = target.dataset.plan;

    if (action === 'select') { toggleSelect(id); return; }
    if (action === 'unselect') { deselect(id); return; }
    if (action === 'deep') {
      state.deepId = id;
      setMode('deepdive');
      return;
    }
  });

  el.trayGo.addEventListener('click', function () {
    if (state.selected.length < 2) return;
    setMode('compare', { scroll: true });
  });

  /* Persona section → jump into Explore with that filter applied.
     The scroll itself is left to the smooth-scroll handler in main.js,
     which knows to offset for the fixed navbar. */
  document.querySelectorAll('[data-persona-jump]').forEach(function (link) {
    link.addEventListener('click', function () {
      state.personas = [link.dataset.personaJump];
      state.needs = [];
      renderFilters();
      renderGrid();
      setMode('explore');
    });
  });

  window.addEventListener('hashchange', function () {
    if (readHash()) {
      renderAll();
      setMode(state.mode);
    }
  });

  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  state.deepId = plansFor(state.product)[0].id;
  readHash();
  renderAll();
  setMode(state.mode);
})();
