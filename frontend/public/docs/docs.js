/* NairaStable Documentation – Navigation */

const PAGES = [
  { id: 'intro',      title: 'Introduction',                section: 'Getting Started' },
  { id: 'concepts',   title: 'Core Concepts',               section: 'Getting Started' },
  { id: 'userguide',  title: 'User Guide',                  section: 'Using NairaStable' },
  { id: 'liquidity',  title: 'Providing Liquidity',         section: 'Using NairaStable' },
  { id: 'liquidations', title: 'Liquidations',              section: 'Using NairaStable' },
  { id: 'developer',  title: 'Developer Integration',       section: 'Build with nNGN' },
  { id: 'fintech',    title: 'Fintech & Non-Web3',          section: 'Build with nNGN' },
  { id: 'oracle',     title: 'Oracle Architecture',         section: 'Protocol Deep Dive' },
  { id: 'reference',  title: 'Contract Reference',          section: 'Protocol Deep Dive' },
  { id: 'roadmap',    title: 'Roadmap',                     section: 'About' },
];

let current = 0;

function showPage(index) {
  if (index < 0 || index >= PAGES.length) return;

  // Hide all
  document.querySelectorAll('.doc-page').forEach(el => el.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + PAGES[index].id);
  if (target) target.classList.add('active');

  // Sidebar active state
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.classList.toggle('active', i === index);
    if (i === index) link.scrollIntoView({ block: 'nearest' });
  });

  // Breadcrumb
  const crumb = document.getElementById('current-section');
  if (crumb) crumb.textContent = PAGES[index].title;

  // Prev / Next buttons
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  if (prev) prev.disabled = index === 0;
  if (next) {
    next.disabled = index === PAGES.length - 1;
    next.className = 'nav-btn' + (index < PAGES.length - 1 ? ' primary' : '');
  }

  // Next label
  const nextInfo = document.getElementById('next-info');
  if (nextInfo) {
    nextInfo.textContent = index < PAGES.length - 1
      ? 'Up next: ' + PAGES[index + 1].title
      : '';
  }

  // Page counter
  const indicator = document.getElementById('page-indicator');
  if (indicator) indicator.textContent = `${index + 1} of ${PAGES.length}`;

  // URL hash (no scroll jump)
  history.replaceState(null, '', '#' + PAGES[index].id);

  // Scroll content to top
  const content = document.querySelector('.content');
  if (content) content.scrollTo({ top: 0, behavior: 'instant' });
  window.scrollTo({ top: 0, behavior: 'instant' });

  current = index;
}

function buildSidebar() {
  const navList = document.getElementById('nav-list');
  if (!navList) return;
  navList.innerHTML = '';

  const sections = {};
  PAGES.forEach((page, index) => {
    if (!sections[page.section]) {
      sections[page.section] = document.createElement('li');
      sections[page.section].className = 'nav-section';
      sections[page.section].innerHTML =
        `<div class="nav-section-title">${page.section}</div>` +
        `<ul class="nav-sub-list" id="sec-${page.section.replace(/\W+/g, '-')}"></ul>`;
      navList.appendChild(sections[page.section]);
    }
    const subList = sections[page.section].querySelector('.nav-sub-list');
    const li = document.createElement('li');
    li.className = 'nav-item';
    const link = document.createElement('span');
    link.className = 'nav-link' + (index === 0 ? ' active' : '');
    link.textContent = page.title;
    link.dataset.index = index;
    link.addEventListener('click', () => {
      showPage(parseInt(link.dataset.index));
      closeSidebar();
    });
    li.appendChild(link);
    subList.appendChild(li);
  });
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();

  // Prev / Next
  document.getElementById('prev-btn').addEventListener('click', () => showPage(current - 1));
  document.getElementById('next-btn').addEventListener('click', () => showPage(current + 1));

  // Mobile hamburger
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle) toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') showPage(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   showPage(current - 1);
  });

  // Hash-based routing
  const hash = window.location.hash.slice(1);
  const idx = PAGES.findIndex(p => p.id === hash);
  showPage(idx >= 0 ? idx : 0);
});
