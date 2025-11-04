// Connect styles
import '../scss/main.scss';
import * as bodyScrollLock from 'body-scroll-lock';

console.log('MAIN OK', new Date().toISOString());
document.documentElement.setAttribute('data-js', 'on');

/* =============== helpers =============== */
const unlockScrollHard = () => {
  try {
    bodyScrollLock.clearAllBodyScrollLocks();
    bodyScrollLock.enableBodyScroll(document.body);
  } catch (_) {}
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
};

/* =============== Sidebar menu =============== */
const refsMenu = {
  openMenuBtn: document.querySelector('.js-menu-open'),
  closeMenuBtn: document.querySelector('.js-menu-close'), // оставляем ссылку, но слушатель не нужен
  overlayMenu: document.querySelector('.js-menu'),
};

const toggleMenu = () => {
  if (!refsMenu.openMenuBtn || !refsMenu.overlayMenu) return;

  const isMenuOpen =
    refsMenu.openMenuBtn.getAttribute('aria-expanded') === 'true' || false;

  refsMenu.openMenuBtn.setAttribute('aria-expanded', String(!isMenuOpen));
  refsMenu.overlayMenu.classList.toggle('is-open');

  // синхронизируем скролл с состоянием меню
  const scrollLockMethod = !isMenuOpen
    ? 'disableBodyScroll'
    : 'enableBodyScroll';
  bodyScrollLock[scrollLockMethod](document.body);

  // подстраховка: если меню закрыли — полностью снимаем блокировки
  if (isMenuOpen) unlockScrollHard();
};

refsMenu.openMenuBtn?.addEventListener('click', toggleMenu);

// закрыть меню при ресайзе на десктоп
window.matchMedia('(min-width: 1200px)').addEventListener('change', (event) => {
  if (!event.matches) return;
  refsMenu.overlayMenu?.classList.remove('is-open');
  refsMenu.openMenuBtn?.setAttribute('aria-expanded', 'false');
  unlockScrollHard();
});

// закрытие по клику на подложку ИЛИ по любому действию внутри .menu
refsMenu.overlayMenu?.addEventListener('click', (e) => {
  const clickedOutside = !e.target.closest('.menu');
  const clickedAction = e.target.closest('.js-menu-close, .menu a, .menu button');
  if (clickedOutside || clickedAction) {
    toggleMenu();
  }
});

// закрытие по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && refsMenu.overlayMenu?.classList.contains('is-open')) {
    toggleMenu();
  }
});

/* =============== Section switcher =============== */
const sidebar = document.getElementById('sidebar-menu');
const panels = Array.from(document.querySelectorAll('[data-section]'));
const menuLinks = () =>
  Array.from(sidebar.querySelectorAll('.menu-link[data-nav]'));

function showSection(name) {
  panels.forEach((p) => {
    p.hidden = p.dataset.section !== name;
  });

  menuLinks().forEach((link) => {
    const active = link.dataset.nav === name;
    link.classList.toggle('current', active);
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });

  const firstHeading = document.querySelector(
    `[data-section="${name}"] h1, [data-section="${name}"] h2, [data-section="${name}"] h3`
  );
  if (firstHeading) {
    firstHeading.tabIndex = -1;
    firstHeading.focus();
  }

  const targetHash = name === 'companies' ? '#companies' : '#';
  if (location.hash !== targetHash) history.replaceState(null, '', targetHash);
}

// клик по пунктам меню (SPA-навигация)
sidebar.addEventListener('click', (e) => {
  const link = e.target.closest('.menu-link[data-nav]');
  if (!link) return;
  e.preventDefault();

  // если мобильное меню открыто — корректно закрыть
  if (refsMenu.overlayMenu?.classList.contains('is-open')) {
    toggleMenu();
  }
  // на всякий — полностью снять лок скролла
  unlockScrollHard();

  showSection(link.dataset.nav);
  // optional: window.scrollTo({ top: 0, behavior: 'instant' });
});

// обработка хеша (прямой переход по #)
window.addEventListener('hashchange', () => {
  unlockScrollHard();
  const name = location.hash === '#companies' ? 'companies' : 'dashboard';
  showSection(name);
});

// стартовый показ
(function init() {
  const initial = location.hash === '#companies' ? 'companies' : 'dashboard';
  showSection(initial);
})();

/* =============== Back из Companies =============== */
// работает и для .companies-back (ссылка), и для .companies-back-btn (кнопка)
document.addEventListener('click', (e) => {
  const back = e.target.closest('.companies-back, .companies-back-btn');
  if (!back) return;
  e.preventDefault();

  if (refsMenu.overlayMenu?.classList.contains('is-open')) {
    toggleMenu();
  }
  unlockScrollHard();

  showSection('dashboard');
  history.replaceState(null, '', '#');
  // optional: window.scrollTo({ top: 0, behavior: 'instant' });
});
