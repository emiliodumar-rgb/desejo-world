/* ═══════════════════════════════════════════════════
   DESÉJO — WEB 3 SCRIPT
   Every block no-ops if its element isn't on the page.
   ═══════════════════════════════════════════════════ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const coarse = matchMedia('(hover: none), (max-width: 760px)').matches;

/* ── MELBOURNE CLOCK ─────────────────────────────── */
(function () {
  const outs = $$('.clock');
  if (!outs.length) return;
  const fmt = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne', hour: '2-digit', minute: '2-digit',
    second: '2-digit', hour12: false, timeZoneName: 'short'
  });
  function tick() {
    const parts = fmt.formatToParts(new Date());
    const get = t => (parts.find(p => p.type === t) || {}).value || '';
    const zone = get('timeZoneName').replace(/[^A-Z]/g, '') || 'AEST';
    const time = `${get('hour')}:${get('minute')}:${get('second')}`;
    outs.forEach(o => {
      o.innerHTML =
        `<span class="long">Currently: Melbourne, Australia ${time} ${zone}</span>` +
        `<span class="short">Melbourne ${time}</span>`;
    });
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── LANDING: whole page enters, with a soft fade ── */
(function () {
  const splash = $('#splash');
  if (!splash) return;
  const v = $('video', splash);
  if (v && matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause();

  function go(e) {
    if (e) e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = splash.getAttribute('href'); }, 480);
  }
  splash.addEventListener('click', go);
  document.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(e); });
})();

/* ── HEADER: tuck the wordmark in once scrolled ──── */
(function () {
  if (!$('.hdr')) return;
  let last = scrollY;
  const set = () => {
    const y = scrollY, b = document.body.classList;
    b.toggle('scrolled', y > 60);
    if (Math.abs(y - last) > 6) { b.toggle('going-down', y > last); last = y; }
  };
  set();
  addEventListener('scroll', set, { passive: true });
})();

/* ── HOME STRIP: drag, arrows, trackpad ──────────── */
(function () {
  const strip = $('#strip');
  if (!strip) return;
  const prev = $('.arrow.prev'), next = $('.arrow.next');

  function arrows() {
    const max = strip.scrollWidth - strip.clientWidth - 2;
    if (prev) prev.disabled = strip.scrollLeft <= 2;
    if (next) next.disabled = strip.scrollLeft >= max;
  }
  const by = dir => strip.scrollBy({ left: dir * strip.clientWidth * .7, behavior: 'smooth' });
  if (prev) prev.addEventListener('click', () => by(-1));
  if (next) next.addEventListener('click', () => by(1));
  strip.addEventListener('scroll', arrows, { passive: true });
  addEventListener('resize', arrows);
  addEventListener('load', arrows);
  arrows();

  // click-and-drag on desktop; a real drag swallows the click so you don't
  // fall into a project by accident
  if (coarse) return;
  let down = false, startX = 0, startL = 0, moved = 0;
  strip.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = 0; startX = e.clientX; startL = strip.scrollLeft;
  });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) strip.classList.add('dragging');
    strip.scrollLeft = startL - dx;
  });
  addEventListener('pointerup', () => {
    down = false;
    setTimeout(() => strip.classList.remove('dragging'), 0);
  });
  strip.addEventListener('click', e => { if (moved > 5) e.preventDefault(); }, true);
})();

/* ── PROJECTS: grid / list / all ─────────────────── */
(function () {
  const btns = $$('.views button');
  if (!btns.length) return;
  const views = $$('.view');

  function show(name, remember) {
    if (!views.some(v => v.dataset.view === name)) name = 'grid';
    views.forEach(v => { v.hidden = v.dataset.view !== name; });
    btns.forEach(b => b.classList.toggle('on', b.dataset.view === name));
    document.body.classList.toggle('list-on', name === 'list');
    if (remember) {
      try { localStorage.setItem('desejo-view', name); } catch (e) {}
      history.replaceState(null, '', '#' + name);
    }
  }
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.view, true)));

  let start = location.hash.slice(1);
  if (!start) { try { start = localStorage.getItem('desejo-view') || 'grid'; } catch (e) { start = 'grid'; } }
  show(start, false);
  addEventListener('hashchange', () => show(location.hash.slice(1), false));
})();

/* ── PROJECTS LIST: full-screen frame on hover ───── */
(function () {
  const list = $('#proj-list'), shot = $('#full-shot');
  if (!list || !shot || coarse) return;
  const img = $('img', shot);
  const rows = $$('.proj-row', list);
  addEventListener('load', () => rows.forEach(r => { new Image().src = r.dataset.shot; }));
  rows.forEach(r => r.addEventListener('mouseenter', () => { img.src = r.dataset.shot; shot.classList.add('on'); }));
  list.addEventListener('mouseleave', () => shot.classList.remove('on'));
})();

/* ── PROJECT PAGE: videos play when seen, tap for sound ── */
(function () {
  const vids = $$('.cols video');
  if (!vids.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: .25 });
  vids.forEach(v => {
    io.observe(v);
    v.addEventListener('click', () => { v.muted = !v.muted; if (v.paused) v.play(); });
  });
})();

/* ── PROJECT PAGE: lightbox ──────────────────────── */
(function () {
  const lb = $('#lb');
  if (!lb) return;
  const imgs = $$('.cols img');
  // reading order: top of the page down, left to right (measured on open,
  // since the layout differs between phone and desktop)
  function order() {
    imgs.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return Math.abs(ra.top - rb.top) > 40 ? ra.top - rb.top : ra.left - rb.left;
    });
  }
  const big = $('img', lb), count = $('.lb-count', lb);
  let i = -1;

  function open(n) {
    i = (n + imgs.length) % imgs.length;
    big.src = imgs[i].dataset.full || imgs[i].currentSrc || imgs[i].src;
    big.alt = imgs[i].alt;
    count.textContent = `${i + 1} / ${imgs.length}`;
    lb.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('on');
    document.documentElement.style.overflow = '';
    i = -1;
  }
  imgs.forEach(im => im.addEventListener('click', () => { order(); open(imgs.indexOf(im)); }));
  $('.lb-zone.p', lb).addEventListener('click', () => open(i - 1));
  $('.lb-zone.n', lb).addEventListener('click', () => open(i + 1));
  $('.lb-close', lb).addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (i < 0) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(i - 1);
    if (e.key === 'ArrowRight') open(i + 1);
  });
  // swipe on phones
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) open(i + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();

/* ── ABOUT: page-wide image reveals ──────────────── */
(function () {
  const layer = $('#page-shot');
  if (!layer) return;
  const img = $('img', layer);
  const triggers = $$('[data-shot]');
  let active = null;
  addEventListener('load', () => triggers.forEach(t => { new Image().src = t.dataset.shot; }));

  const clear = () => triggers.forEach(t => { t.classList.remove('is-open'); t.setAttribute('aria-expanded', 'false'); });
  function close() { layer.classList.remove('on'); clear(); active = null; }

  triggers.forEach(t => {
    t.setAttribute('aria-expanded', 'false');
    t.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      if (active === t) { close(); return; }
      clear();
      img.src = t.dataset.shot;
      img.alt = t.dataset.alt || '';
      layer.classList.add('on');
      t.classList.add('is-open');
      t.setAttribute('aria-expanded', 'true');
      active = t;
    });
  });
  document.addEventListener('click', () => { if (active) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) close(); });
})();

/* ── ABOUT: services disclosure ──────────────────── */
(function () {
  const btn = $('#svc-toggle'), panel = $('#svc-panel');
  if (!btn || !panel) return;
  let open = false;
  const set = () => { panel.style.maxHeight = open ? panel.firstElementChild.offsetHeight + 'px' : '0px'; };
  btn.addEventListener('click', () => { open = !open; btn.setAttribute('aria-expanded', String(open)); set(); });
  addEventListener('resize', () => { if (open) set(); });
})();

/* ── ABOUT: fit the pronunciation to the width ───── */
(function () {
  const phon = $('#phon');
  if (!phon) return;
  function fit() {
    const avail = phon.clientWidth;
    if (avail <= 0) return;
    phon.style.fontSize = '100px';
    const natural = phon.scrollWidth;
    if (natural) phon.style.fontSize = (100 * avail / natural) + 'px';
  }
  fit();
  addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();


/* ── CONTACT FORM ────────────────────────────────── */
/* Posts to the Google Apps Script from Web 1, which emails the enquiry.
   The script can't answer cross-origin, so the request goes out "no-cors":
   we only hear back if the network itself fails. */
(function () {
  const form = $('#cform');
  if (!form) return;
  const done = $('#cform-done');
  const msg = $('.cform-msg', form);
  const btn = $('.send', form);
  const val = n => (form.elements[n] ? form.elements[n].value.trim() : '');

  // arriving from a project page: start the message for them
  const re = new URLSearchParams(location.search).get('re');
  if (re && !val('message')) form.elements.message.value = re + '. ';

  function say(text, bad) { msg.textContent = text; msg.classList.toggle('err', !!bad); }
  function finish() {
    form.hidden = true;
    done.hidden = false;
    done.focus();
  }

  form.addEventListener('input', e => {
    const f = e.target.closest('.fld');
    if (f) f.classList.remove('bad');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (val('website')) { finish(); return; }          // a bot filled the hidden field

    const need = ['name', 'email'].filter(n => !form.elements[n].checkValidity() || !val(n));
    $$('.fld', form).forEach(f => f.classList.remove('bad'));
    need.forEach(n => form.elements[n].closest('.fld').classList.add('bad'));
    if (need.length) { say('Just need your name and an email so we can write back.', true); form.elements[need[0]].focus(); return; }

    const after = $$('input[name="after"]:checked', form).map(c => c.value);
    const data = {
      // "Name" keeps the old script working; the new one reads the two below
      'Name': val('name') + (val('brand') ? ', ' + val('brand') : ''),
      'Contact name': val('name'),
      'Brand': val('brand'),
      'Email': val('email'),
      'What are we making': after.length ? after.join(', ') : 'Not sure yet',
      'How we connected': val('found'),
      'Location': val('where'),
      'Date': val('when'),
      'Additional notes': val('message') || 'None',
      'Source': 'desejo'
    };

    btn.disabled = true;
    say('Sending...');
    fetch(form.dataset.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(finish).catch(() => {
      btn.disabled = false;
      say('Hmm, that didn’t send. Try again, or email hello@desejo.world.', true);
    });
  });
})();
