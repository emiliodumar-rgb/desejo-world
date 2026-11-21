/* ═══════════════════════════════════════════════════════
   DESÉJO — SHARED SITE SCRIPT
   Loaded on every page. Individual blocks below no-op safely
   if the page doesn't contain the element they target.
   ═══════════════════════════════════════════════════════ */

/* ── CURSOR: static wave mark, follows pointer, no shape animation ── */
(function () {
  const cur = document.getElementById('cur');
  if (!cur) return;
  let mx = 0, my = 0, cx = 0, cy = 0, started = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!started) { cx = mx; cy = my; started = true; }
  });
  (function tick() {
    cx += (mx - cx) * .16;
    cy += (my - cy) * .16;
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  })();

  // Text/button hover — cursor settles to ink.
  // Delegated on document so it also catches project tiles that get
  // rendered later by the projects-data.js grid builders below.
  const HOVER_SEL = 'a:not(.g-slide a), button:not(.gal-hint), .btn, .proj';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) document.body.classList.add('cl');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL) && !e.relatedTarget?.closest(HOVER_SEL)) document.body.classList.remove('cl');
  });
})();

/* ── REVEAL ON SCROLL ── */
(function () {
  const els = document.querySelectorAll('.r');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  els.forEach(el => obs.observe(el));
})();

/* ── HOME CAROUSEL: drag + seamless infinite loop (home.html hero) ── */
(function () {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const SLIDE_COUNT = gallery.dataset.setSize ? parseInt(gallery.dataset.setSize, 10) : 10;
  let setWidth = 0, isDragging = false, startX = 0, startScroll = 0;

  function calcSetWidth() {
    const slides = gallery.querySelectorAll('.g-slide');
    let w = 0;
    for (let i = 0; i < SLIDE_COUNT; i++) w += slides[i].offsetWidth + 6;
    return w;
  }
  function initGallery() {
    setWidth = calcSetWidth();
    const slides = gallery.querySelectorAll('.g-slide');
    let offset = 0;
    for (let i = 0; i < SLIDE_COUNT; i++) offset += slides[i].offsetWidth + 8;
    gallery.scrollLeft = offset;
  }
  window.addEventListener('load', initGallery);
  setTimeout(initGallery, 300);

  gallery.addEventListener('scroll', () => {
    if (!setWidth) return;
    if (gallery.scrollLeft <= 2) gallery.scrollLeft = setWidth + gallery.scrollLeft;
    else if (gallery.scrollLeft >= setWidth * 2 - 2) gallery.scrollLeft = gallery.scrollLeft - setWidth;
  }, { passive: true });

  gallery.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    startScroll = gallery.scrollLeft;
    gallery.classList.add('dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    gallery.scrollLeft = startScroll - (e.pageX - startX);
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    gallery.classList.remove('dragging');
  });

  function slideStep() {
    const first = gallery.querySelector('.g-slide');
    return first ? first.offsetWidth + 8 : 348;
  }
  const galLeft = document.getElementById('gal-left');
  const galRight = document.getElementById('gal-right');
  if (galLeft) galLeft.addEventListener('click', () => gallery.scrollBy({ left: -slideStep(), behavior: 'smooth' }));
  if (galRight) galRight.addEventListener('click', () => gallery.scrollBy({ left: slideStep(), behavior: 'smooth' }));
})();

/* ── LIGHTBOX (used on project.html galleries) ── */
const DesejoLightbox = (function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return null;
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let slides = [];
  let index = 0;

  function show() {
    const s = slides[index];
    if (!s) return;
    lbImg.src = s.src;
    lbCap.textContent = s.caption || '';
  }
  function open(list, startIndex) {
    slides = list;
    index = startIndex || 0;
    show();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lbPrev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; show(); });
  lbNext.addEventListener('click', () => { index = (index + 1) % slides.length; show(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') { index = (index - 1 + slides.length) % slides.length; show(); }
    if (e.key === 'ArrowRight') { index = (index + 1) % slides.length; show(); }
  });
  let touchX = 0;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { index = dx < 0 ? (index + 1) % slides.length : (index - 1 + slides.length) % slides.length; show(); }
    else if (Math.abs(dx) < 5) close();
  });

  return { open, close };
})();

/* ── MOBILE NAV BURGER ── */
(function () {
  const nav = document.querySelector('nav');
  const burger = document.getElementById('nav-burger');
  if (!nav || !burger) return;

  function closeMenu() {
    nav.classList.remove('nav-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
})();

/* ── NAV ACTIVE STATE ── */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

/* ── PROJECT TILE MARKUP HELPER ──
   Used by the Projects archive grid. Label is brand name only,
   styled (via page-scoped CSS) to match the nav-link treatment. */
function desejoProjTile(p, href, extraClass) {
  return (
    '<a class="proj r' + (extraClass ? ' ' + extraClass : '') + '" href="' + href + '">' +
      '<div class="proj-thumb"><img src="' + p.thumb + '" alt="' + p.title + '" loading="lazy"></div>' +
      '<div class="proj-label"><span class="proj-title">' + p.title + '</span></div>' +
    '</a>'
  );
}

/* ── PROJECTS ARCHIVE: full grid ── */
(function () {
  const grid = document.getElementById('archive-projects-grid');
  if (!grid || !window.DESEJO_PROJECTS) return;
  grid.innerHTML = window.DESEJO_PROJECTS.map((p, i) =>
    desejoProjTile(p, 'project.html?slug=' + encodeURIComponent(p.slug), i > 0 ? 'd' + Math.min(i, 4) : '')
  ).join('');
})();

/* ── PROJECT DETAIL PAGE: render from ?slug= ── */
(function () {
  const root = document.getElementById('project-detail');
  if (!root || !window.DESEJO_PROJECTS) return;

  const slug = new URLSearchParams(location.search).get('slug');
  const list = window.DESEJO_PROJECTS;
  const project = list.find(p => p.slug === slug);

  if (!project) {
    root.innerHTML =
      '<div class="section">' +
        '<p class="eyebrow r in">Not found</p>' +
        '<p class="about-headline r in" style="margin-bottom:24px;">We couldn’t find that project.</p>' +
        '<a class="btn r in" href="projects.html">View all projects</a>' +
      '</div>';
    return;
  }

  document.title = project.title + ' — Déséjo';

  const idx = list.indexOf(project);
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];

  root.innerHTML =
    '<div class="proj-hero r in"><img src="' + project.hero + '" alt="' + project.title + '"></div>' +
    '<div class="section" style="padding-top:0;">' +
      '<div class="proj-meta r in">' +
        '<p class="proj-detail-title">' + project.title + '</p>' +
        '<p class="proj-detail-loc">' + project.location + (project.year ? ' — ' + project.year : '') + '</p>' +
        (project.description ? '<p class="proj-detail-desc">' + project.description + '</p>' : '') +
        (project.services && project.services.length ? '<p class="proj-detail-services">' + project.services.join(' · ') + '</p>' : '') +
      '</div>' +
      '<div class="proj-gallery">' +
        project.gallery.map((src, i) =>
          '<div class="proj-g-item r in" data-index="' + i + '"><img src="' + src + '" alt="' + project.title + '"></div>'
        ).join('') +
      '</div>' +
    '</div>' +
    '<div class="proj-nav">' +
      '<a href="project.html?slug=' + encodeURIComponent(prev.slug) + '">← ' + prev.title + '</a>' +
      '<a href="projects.html">All Projects</a>' +
      '<a href="project.html?slug=' + encodeURIComponent(next.slug) + '">' + next.title + ' →</a>' +
    '</div>';

  // Wire gallery images to the shared lightbox
  if (DesejoLightbox) {
    const items = root.querySelectorAll('.proj-g-item');
    const slides = project.gallery.map(src => ({ src: src, caption: project.title }));
    items.forEach((el, i) => {
      el.addEventListener('click', () => DesejoLightbox.open(slides, i));
    });
  }

  // Re-observe newly injected .r elements for the reveal animation
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  root.querySelectorAll('.r').forEach(el => obs.observe(el));
})();
