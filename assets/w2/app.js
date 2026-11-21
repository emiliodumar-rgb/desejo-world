/* ═══════════════════════════════════════════════════
   DESÉJO — WEB 2 SCRIPT
   Every block no-ops safely if its element isn't on
   the page.
   ═══════════════════════════════════════════════════ */

/* ── MELBOURNE CLOCK ─────────────────────────────── */
(function () {
  const out = document.getElementById('clock');
  if (!out) return;

  function tick() {
    const parts = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Melbourne',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    }).formatToParts(new Date());

    const get = t => (parts.find(p => p.type === t) || {}).value || '';
    const zone = get('timeZoneName').replace(/[^A-Z]/g, '') || 'AEST';
    out.textContent =
      `Currently: Melbourne, Australia ${get('hour')}:${get('minute')}:${get('second')} ${zone}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── MOBILE: + reveals the links, nothing behind them ─ */
(function () {
  const plus = document.getElementById('nav-plus');
  if (!plus) return;

  plus.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    plus.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close again once a link is taken, or if the viewport grows past mobile
  document.querySelectorAll('.hdr-nav a').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      plus.setAttribute('aria-expanded', 'false');
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      document.body.classList.remove('nav-open');
      plus.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── PRONUNCIATION: fit the line to the viewport ── */
(function () {
  const phon = document.getElementById('phon');
  if (!phon) return;

  // scale the line so it spans the full width, whatever the viewport
  function fit() {
    const style = getComputedStyle(phon);
    const avail = phon.clientWidth
      - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    if (avail <= 0) return;

    phon.style.fontSize = '100px';
    const natural = phon.scrollWidth;
    if (!natural) return;

    phon.style.fontSize = (100 * avail / natural) + 'px';
  }

  fit();
  window.addEventListener('resize', fit);
  // re-measure once the webfont lands, since metrics shift
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

})();

/* ── ABOUT: page-wide image reveals ──────────────── */
/* Several triggers share one layer, so only ever one image is up
   and the most recent click wins. */
(function () {
  const layer = document.getElementById('page-shot');
  if (!layer) return;

  const img = layer.querySelector('img');
  const triggers = Array.from(document.querySelectorAll('[data-shot]'));
  if (!triggers.length) return;

  let active = null;

  window.addEventListener('load', () => {
    triggers.forEach(t => { new Image().src = t.dataset.shot; });
  });

  function clear() {
    triggers.forEach(t => {
      t.classList.remove('is-open');
      t.setAttribute('aria-expanded', 'false');
    });
  }

  function close() {
    layer.classList.remove('on');
    clear();
    active = null;
  }

  triggers.forEach(t => {
    t.setAttribute('aria-expanded', 'false');
    t.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      if (active === t) { close(); return; }

      clear();                       // hand over: the last click owns the layer
      img.src = t.dataset.shot;
      img.alt = t.dataset.alt || '';
      layer.classList.add('on');
      t.classList.add('is-open');
      t.setAttribute('aria-expanded', 'true');
      active = t;
    });
  });

  document.addEventListener('click', () => { if (active) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── ABOUT: services disclosure ──────────────────── */
(function () {
  const btn = document.getElementById('svc-toggle');
  const panel = document.getElementById('svc-panel');
  if (!btn || !panel) return;

  const inner = panel.firstElementChild;
  let open = false;

  function setHeight() {
    panel.style.maxHeight = open ? inner.offsetHeight + 'px' : '0px';
  }

  btn.addEventListener('click', () => {
    open = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    setHeight();
  });

  // keep the panel honest if the copy reflows
  window.addEventListener('resize', () => { if (open) setHeight(); });
})();

/* ── LANDING: one frame at a time ────────────────── */
(function () {
  const stage = document.getElementById('stage');
  if (!stage) return;

  const frames = Array.from(stage.querySelectorAll('.reveal'));
  if (!frames.length) return;

  const coarse = window.matchMedia('(hover: none), (max-width: 860px)').matches;
  let idx = 0;

  function showOnly(el) {
    frames.forEach(f => { if (f !== el) f.classList.remove('on'); });
    el.classList.add('on');
  }

  /* ---------- mobile / touch: timed crossfade ---------- */
  if (coarse) {
    stage.classList.add('is-cycle');
    frames[0].classList.add('on');
    let i = 0;
    setInterval(() => {
      const current = frames[i];
      i = (i + 1) % frames.length;
      frames[i].classList.add('on');
      setTimeout(() => current.classList.remove('on'), 450);
    }, 4000);
    return;
  }

  /* ---------- desktop: swap on cursor travel ---------- */
  const STEP = 180;                 // px of travel before the frame changes
  let lastX = null, lastY = null, travelled = 0;

  function place(el, x, y) {
    const w = el.offsetWidth || 260;
    const h = el.offsetHeight || 340;
    const pad = 14;
    const left = Math.max(pad, Math.min(x - w / 2, window.innerWidth - w - pad));
    const top = Math.max(pad, Math.min(y - h / 2, window.innerHeight - h - pad));
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function step(x, y) {
    const el = frames[idx % frames.length];
    idx++;
    place(el, x, y);
    showOnly(el);
  }

  window.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    if (lastX === null) { lastX = x; lastY = y; return; }

    travelled += Math.hypot(x - lastX, y - lastY);
    lastX = x; lastY = y;

    if (travelled >= STEP) {
      travelled = 0;
      step(x, y);
    }
  }, { passive: true });

  // open on a frame so the page is never blank, and leave it up until the
  // cursor moves, which keeps it clickable
  window.addEventListener('load', () => {
    step(window.innerWidth / 2, window.innerHeight / 2);
  });
})();

/* ── PROJECT INDEX: full-screen image on hover ───── */
(function () {
  const list = document.getElementById('proj-list');
  const shot = document.getElementById('full-shot');
  if (!list || !shot) return;
  if (window.matchMedia('(hover: none), (max-width: 860px)').matches) return;

  const img = shot.querySelector('img');
  const rows = Array.from(list.querySelectorAll('.proj-row'));

  // warm the cache so the first hover doesn't flash empty
  window.addEventListener('load', () => {
    rows.forEach(r => { if (r.dataset.shot) new Image().src = r.dataset.shot; });
  });

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.shot;
      if (!src) return;
      img.src = src;
      shot.classList.add('on');
    });
  });

  list.addEventListener('mouseleave', () => shot.classList.remove('on'));
})();
