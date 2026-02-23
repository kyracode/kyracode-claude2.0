// ============================================================
// KYRAJOLLY.COM — main.js v3
// Includes: nav, fade-in, year filter, topic filter,
//           genre filter, and date sorting (newest/oldest)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ─── Sticky nav ─────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Active nav link ────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ─── Mobile hamburger ───────────────────────────────────
  const ham      = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  if (ham && mobileNav) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // ─── Fade-in on scroll ──────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }), { threshold: 0.08 });
    fadeEls.forEach(el => obs.observe(el));
  }

  // ─── Helper: sort items in a container by data-date ─────
  // direction: 'newest' = descending, 'oldest' = ascending
  function sortByDate(container, direction) {
    if (!container) return;
    const items = Array.from(container.children);
    items.sort((a, b) => {
      const dateA = a.dataset.date || '0000-00';
      const dateB = b.dataset.date || '0000-00';
      return direction === 'newest'
        ? dateB.localeCompare(dateA)
        : dateA.localeCompare(dateB);
    });
    items.forEach(item => container.appendChild(item));
  }

  // ─── Sort buttons (book reviews + film reviews) ──────────
  // Works for any .sort-btn with data-sort="newest" or "oldest"
  // paired with a grid that has an id (book-grid, film-grid, etc.)
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Find sibling sort buttons and deactivate them
      const siblings = btn.closest('div, section, main')
        ? btn.parentElement.querySelectorAll('.sort-btn')
        : document.querySelectorAll('.sort-btn');
      siblings.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const direction = btn.dataset.sort;
      if (!direction) return;

      // Sort whichever grid is on this page
      const grid = document.querySelector('#book-grid, #film-grid, #finance-feed');
      sortByDate(grid, direction);
    });
  });

  // ─── Film year filter (films.html) ──────────────────────
  const yearBtns    = document.querySelectorAll('.year-btn[data-year]');
  const filmEntries = document.querySelectorAll('.film-entry');

  if (yearBtns.length && filmEntries.length) {
    const filmContainer = document.querySelector('.film-entry')?.parentElement;

    yearBtns.forEach(btn => btn.addEventListener('click', () => {
      // Only handle year buttons (not sort buttons)
      yearBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const year = btn.dataset.year;
      filmEntries.forEach(entry => {
        entry.style.display = (year === 'all' || entry.dataset.year === year) ? 'grid' : 'none';
      });
    }));

    // Film sort buttons (inside year-filter on films.html)
    document.querySelectorAll('.year-btn[data-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.year-btn[data-sort]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sortByDate(filmContainer, btn.dataset.sort);
      });
    });
  }

  // ─── Topic pill filter (finance.html) ───────────────────
  const topicPills = document.querySelectorAll('.topic-pill[data-topic]');
  const postItems  = document.querySelectorAll('.post-item[data-topic]');
  if (topicPills.length && postItems.length) {
    topicPills.forEach(pill => pill.addEventListener('click', () => {
      topicPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const topic = pill.dataset.topic;
      postItems.forEach(post => {
        post.style.display = (topic === 'all' || post.dataset.topic === topic) ? '' : 'none';
      });
    }));
  }

  // ─── Genre pill filter (book-reviews + film-reviews) ────
  const genrePills  = document.querySelectorAll('.genre-pill[data-genre]');
  const reviewCards = document.querySelectorAll('[data-genre]:not(.genre-pill)');
  if (genrePills.length) {
    genrePills.forEach(pill => pill.addEventListener('click', () => {
      genrePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const genre = pill.dataset.genre;
      reviewCards.forEach(card => {
        card.style.display = (genre === 'all' || card.dataset.genre === genre) ? '' : 'none';
      });
    }));
  }

  // ─── Default sort: newest first on page load ─────────────
  // Runs automatically for any grid with sortable items
  const autoSortGrid = document.querySelector('#book-grid, #film-grid');
  if (autoSortGrid) sortByDate(autoSortGrid, 'newest');

  const financeFeed = document.querySelector('#finance-feed');
  if (financeFeed) sortByDate(financeFeed, 'newest');

  const filmContainer = document.querySelector('.film-entry')?.parentElement;
  if (filmContainer) sortByDate(filmContainer, 'newest');

});
