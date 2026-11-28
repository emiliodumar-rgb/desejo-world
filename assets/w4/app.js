/* ═══════════════════════════════════════════════════
   DESÉJO — WEB 4 SCRIPT
   Every block no-ops if its element isn't on the page.
   ═══════════════════════════════════════════════════ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

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
      o.innerHTML = `<span class="long">Currently Melbourne, ${time} ${zone}</span>` +
                    `<span class="short">Melbourne ${time}</span>`;
    });
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── WORDMARK: write it in on the first visit ────── */
(function () {
  const pen = $('.hdr .mark .pen');
  if (!pen || !document.body.classList.contains('writing')) return;
  const done = () => document.body.classList.remove('writing');
  pen.addEventListener('animationend', () => setTimeout(done, 250));
  setTimeout(done, 3200);                     // in case the animation never runs
})();

/* ── HEADER: white bar once you're into the page ─── */
(function () {
  const hero = $('.hero');
  const set = () => {
    const limit = hero ? hero.offsetHeight - 100 : 30;
    document.body.classList.toggle('scrolled', scrollY > limit);
  };
  set();
  addEventListener('scroll', set, { passive: true });
  addEventListener('resize', set);
})();

/* ── MOBILE MENU ─────────────────────────────────── */
(function () {
  const open = $('.menu-btn'), close = $('.sheet-close');
  if (!open) return;
  const set = v => { document.body.classList.toggle('menu-open', v); open.setAttribute('aria-expanded', String(v)); };
  open.addEventListener('click', () => set(true));
  if (close) close.addEventListener('click', () => set(false));
  $$('.sheet a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();

/* ── VIDEOS: only play what's on screen ──────────── */
(function () {
  const vids = $$('video[data-auto], .cols video');
  if (!vids.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !reduce) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: .2 });
  vids.forEach(v => io.observe(v));
  $$('.cols video').forEach(v => v.addEventListener('click', () => { v.muted = !v.muted; if (v.paused) v.play(); }));
})();

/* ── PROJECT PAGE: lightbox ──────────────────────── */
(function () {
  const lb = $('#lb');
  if (!lb) return;
  const imgs = $$('.cols img');
  const big = $('img', lb), count = $('.lb-count', lb);
  let i = -1;
  function order() {
    imgs.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return Math.abs(ra.top - rb.top) > 40 ? ra.top - rb.top : ra.left - rb.left;
    });
  }
  function open(n) {
    i = (n + imgs.length) % imgs.length;
    big.src = imgs[i].dataset.full || imgs[i].currentSrc || imgs[i].src;
    big.alt = imgs[i].alt;
    count.textContent = `${i + 1} / ${imgs.length}`;
    lb.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() { lb.classList.remove('on'); document.documentElement.style.overflow = ''; i = -1; }
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
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) open(i + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();

/* ── FOOTER: fit the pronunciation, and its picture ── */
(function () {
  const phon = $('#phon'), shot = $('#phon-shot');
  if (!phon) return;
  function fit() {
    const avail = phon.parentElement.clientWidth -
      parseFloat(getComputedStyle(phon.parentElement).paddingLeft) -
      parseFloat(getComputedStyle(phon.parentElement).paddingRight);
    if (avail <= 0) return;
    // measure the words themselves, not the full-width button around them
    phon.style.fontSize = '100px';
    phon.style.display = 'inline-block';
    phon.style.width = 'auto';
    const natural = phon.getBoundingClientRect().width;
    phon.style.display = phon.style.width = '';
    if (natural) phon.style.fontSize = Math.floor(100 * avail / natural * 0.995) + 'px';
  }
  fit();
  addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  if (!shot) return;
  addEventListener('load', () => { new Image().src = phon.dataset.shot; });
  phon.addEventListener('click', e => {
    e.stopPropagation();
    const on = !shot.classList.contains('on');
    if (on) $('img', shot).src = phon.dataset.shot;
    shot.classList.toggle('on', on);
    phon.classList.toggle('is-open', on);
    phon.setAttribute('aria-expanded', String(on));
  });
  document.addEventListener('click', () => { shot.classList.remove('on'); phon.classList.remove('is-open'); });
})();

/* ── FORMS (contact + residency) ─────────────────── */
/* Both post to the Google Apps Script that emails Emilio. The script can't
   answer cross-origin, so the request goes "no-cors": we only hear back if
   the network itself fails. */
$$('form.cform').forEach(form => {
  const done = form.parentElement.querySelector('.cform-done');
  const msg = $('.cform-msg', form);
  const btn = $('.send', form);
  const val = n => (form.elements[n] ? form.elements[n].value.trim() : '');
  const picked = n => $$(`input[name="${n}"]:checked`, form).map(c => c.value);

  const re = new URLSearchParams(location.search).get('re');
  if (re && form.elements.message && !val('message')) form.elements.message.value = re + '. ';

  const say = (t, bad) => { msg.textContent = t; msg.classList.toggle('err', !!bad); };
  const finish = () => { store.clear(); form.hidden = true; done.hidden = false; done.focus(); };

  const KEY = 'desejo-draft-' + form.dataset.kind;
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
  const saved = store.get();
  if (saved) {
    Object.keys(saved.f || {}).forEach(n => {
      const el = form.elements[n];
      if (el && !(el instanceof RadioNodeList) && el.type !== 'checkbox' && !el.value) el.value = saved.f[n];
    });
    (saved.c || []).forEach(k => {
      const [n, v] = k.split('\u0000');
      $$(`input[name="${n}"]`, form).forEach(c => { if (c.value === v) c.checked = true; });
    });
  }
  const saveDraft = () => {
    const f = {};
    ['name', 'brand', 'email', 'when', 'where', 'message', 'found'].forEach(n => { if (val(n)) f[n] = val(n); });
    const c = $$('input[type="checkbox"]:checked', form).map(x => x.name + '\u0000' + x.value);
    store.set({ f, c });
  };

  form.addEventListener('input', e => { const f = e.target.closest('.fld'); if (f) f.classList.remove('bad'); saveDraft(); });
  form.addEventListener('change', saveDraft);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (val('website')) { finish(); return; }

    const need = ['name', 'email'].filter(n => !form.elements[n].checkValidity() || !val(n));
    $$('.fld', form).forEach(f => f.classList.remove('bad'));
    need.forEach(n => form.elements[n].closest('.fld').classList.add('bad'));
    if (need.length) { say('Just need your name and an email so we can write back.', true); form.elements[need[0]].focus(); return; }

    // contact: at least one "What are you after?" so we know where to start
    const afterSet = form.querySelector('input[name="after"]');
    if (form.dataset.kind === 'contact' && afterSet && !picked('after').length) {
      afterSet.closest('.fld').classList.add('bad');
      say('Pick at least one so we know where to start.', true);
      afterSet.focus();
      return;
    }

    let making = picked('after').join(', ') || 'Not sure yet';
    if (form.dataset.kind === 'residency') {
      making = 'The Residency' + [picked('season').join(', '), picked('cadence').join(', '), picked('length').join(', ')]
        .filter(Boolean).map(s => ' · ' + s).join('');
    }
    const data = {
      'Name': val('name') + (val('brand') ? ', ' + val('brand') : ''),
      'Contact name': val('name'),
      'Brand': val('brand'),
      'Email': val('email'),
      'What are we making': making,
      'How we connected': val('found'),
      'Location': val('where'),
      'Date': val('when'),
      'Additional notes': val('message') || 'None',
      'Source': 'desejo'
    };

    btn.disabled = true;
    say('Sending...');
    fetch(form.dataset.endpoint, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(finish).catch(() => {
      btn.disabled = false;
      const body = [
        'Name: ' + val('name'), val('brand') && 'Brand: ' + val('brand'), 'Email: ' + val('email'),
        'Looking for: ' + making, val('when') && 'When: ' + val('when'), val('where') && 'Where: ' + val('where'),
      ].filter(Boolean).join('\n') + (val('message') ? '\n\n' + val('message') : '');
      const href = 'mailto:hello@desejo.world?subject=' + encodeURIComponent('Enquiry from ' + (val('brand') || val('name'))) +
                   '&body=' + encodeURIComponent(body);
      msg.classList.add('err');
      msg.innerHTML = 'Hmm, that didn’t send (check your connection). <a class="u" href="' + href + '">Send it by email instead</a>, it’s all filled in.';
    });
  });
});

/* ── STUDIO: "What we do" opens in place ─────────── */
(function () {
  const btn = $('#svc-toggle'), panel = $('#svc-panel');
  if (!btn || !panel) return;
  let open = false;
  const set = () => { panel.style.maxHeight = open ? panel.firstElementChild.offsetHeight + 'px' : '0px'; };
  btn.addEventListener('click', () => { open = !open; btn.setAttribute('aria-expanded', String(open)); set(); });
  addEventListener('resize', () => { if (open) set(); });
})();

/* ── HOME: big wordmark in the middle, sliding up into the menu ── */
/* Progress runs from 0 (top of the page: logo large, centred on the
   video) to 1 (part-way down the video: logo at its menu size).
   The clock rides along just under the logo. */
(function () {
  if (!document.body.classList.contains('home')) return;
  const hero = $('.hero'), box = $('.hdr-c'), mark = $('.hdr-c .mark'), clock = $('.hdr-c .clock');
  if (!hero || !box || !mark || !clock) return;

  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let ticking = false;

  function update() {
    ticking = false;
    const big = innerWidth <= 760 ? 4 : 8;          // how much larger it starts
    const travel = hero.offsetHeight * .55;          // scroll distance to settle
    const p = ease(Math.min(1, Math.max(0, scrollY / travel)));
    const s = big + (1 - big) * p;

    const markH = mark.offsetHeight;
    const gap = parseFloat(getComputedStyle(box).rowGap) || 8;
    const total = markH * s + gap + clock.offsetHeight;
    const top = box.offsetTop;                       // its resting spot in the menu
    const dy = (1 - p) * (innerHeight / 2 - total / 2 - top);

    box.style.transform = `translateY(${dy}px)`;
    mark.style.transform = `scale(${s})`;
    clock.style.transform = `translateY(${markH * (s - 1)}px)`;
    // once it has settled into the menu, the logo works like it does on every other page
    const home = box.querySelector('.hdr-home');
    if (home) home.classList.toggle('docked', p > .9);
    const more = document.querySelector('.hero-more');
    if (more) {
      more.style.transform = clock.style.transform;
      more.style.opacity = Math.max(0, 1 - p * 3);
      more.style.pointerEvents = p > .25 ? 'none' : '';
    }
  }
  const homeLink = box.querySelector('.hdr-home');
  if (homeLink) homeLink.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
  });
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  addEventListener('load', update);
})();
