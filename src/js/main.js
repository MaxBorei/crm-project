// Commect styles
import '../scss/main.scss';
import * as bodyScrollLock from 'body-scroll-lock';

console.log('MAIN OK', new Date().toISOString());
document.documentElement.setAttribute('data-js', 'on');

// Sidebar menu
const refsMenu = {
  openMenuBtn: document.querySelector('.js-menu-open'),
  closeMenuBtn: document.querySelector('.js-menu-close'), // оставим ссылку, но без прямого слушателя
  overlayMenu: document.querySelector('.js-menu'),
};

const toggleMenu = () => {
  if (!refsMenu.openMenuBtn || !refsMenu.overlayMenu) return;

  const isMenuOpen =
    refsMenu.openMenuBtn.getAttribute('aria-expanded') === 'true' || false;

  refsMenu.openMenuBtn.setAttribute('aria-expanded', String(!isMenuOpen));
  refsMenu.overlayMenu.classList.toggle('is-open');

  const scrollLockMethod = !isMenuOpen
    ? 'disableBodyScroll'
    : 'enableBodyScroll';
  bodyScrollLock[scrollLockMethod](document.body);
};

refsMenu.openMenuBtn?.addEventListener('click', toggleMenu);

// Close the mobile menu on wider screens if the device orientation changes
window.matchMedia('(min-width: 1200px)').addEventListener('change', event => {
  if (!event.matches) return;
  refsMenu.overlayMenu?.classList.remove('is-open');
  refsMenu.openMenuBtn?.setAttribute('aria-expanded', 'false');
  bodyScrollLock.enableBodyScroll(document.body);
});

// ===== Section switcher =====
const sidebar = document.getElementById('sidebar-menu');
const panels = Array.from(document.querySelectorAll('[data-section]'));
const menuLinks = () =>
  Array.from(sidebar.querySelectorAll('.menu-link[data-nav]'));

function showSection(name) {
  panels.forEach(p => {
    p.hidden = p.dataset.section !== name;
  });

  menuLinks().forEach(link => {
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

// Клик по меню (делегирование)
sidebar.addEventListener('click', e => {
  const link = e.target.closest('.menu-link[data-nav]');
  if (!link) return;

  e.preventDefault();

  // если меню открыто на мобилке — корректно закроем через toggleMenu()
  if (refsMenu.overlayMenu?.classList.contains('is-open')) {
    toggleMenu();
  }

  showSection(link.dataset.nav);
});

// Обработка хеша
window.addEventListener('hashchange', () => {
  const name = location.hash === '#companies' ? 'companies' : 'dashboard';
  showSection(name);
});

// Стартовый показ
(function init() {
  const initial = location.hash === '#companies' ? 'companies' : 'dashboard';
  showSection(initial);
})();

// Кнопка "назад" в Companies (если используешь .companies-back-btn)
document.addEventListener('click', e => {
  if (!e.target.closest('.companies-back-btn')) return;
  showSection('dashboard');
  if (location.hash) history.replaceState(null, '', '#');
});

// === Делегирование на оверлее ===
// 1) клик по подложке (вне .menu) — закрыть
// 2) клик по кресту/любой ссылке/кнопке внутри меню — тоже закрыть
refsMenu.overlayMenu?.addEventListener('click', e => {
  const clickedOutside = !e.target.closest('.menu');
  const clickedAction = e.target.closest('.js-menu-close, .menu a, .menu button');
  if (clickedOutside || clickedAction) {
    toggleMenu();
  }
});

// Закрытие по Esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && refsMenu.overlayMenu?.classList.contains('is-open')) {
    toggleMenu();
  }
});
