const menu = document.querySelector('.menu-capsule');
const indicator = menu?.querySelector('.menu-indicator');
const items = menu ? [...menu.querySelectorAll('[data-nav-item]')] : [];
let currentItem = items[0];

function placeIndicator(item, animate = true) {
  if (!menu || !indicator || !item) return;

  if (!animate) indicator.style.transition = 'none';
  indicator.style.width = `${item.offsetWidth}px`;
  indicator.style.transform = `translateX(${item.offsetLeft}px)`;

  if (!animate) {
    indicator.getBoundingClientRect();
    indicator.style.removeProperty('transition');
  }
}

function showIndicator(item) {
  const isVisible = menu?.classList.contains('indicator-visible');
  currentItem = item;
  placeIndicator(item, isVisible);
  requestAnimationFrame(() => menu?.classList.add('indicator-visible'));
}

items.forEach((item) => {
  item.addEventListener('mouseenter', () => showIndicator(item));
  item.addEventListener('focus', () => showIndicator(item));
});

menu?.addEventListener('mouseleave', () => menu.classList.remove('indicator-visible'));
menu?.addEventListener('focusout', (event) => {
  if (!menu.contains(event.relatedTarget)) menu.classList.remove('indicator-visible');
});

window.addEventListener('resize', () => placeIndicator(currentItem, false));
placeIndicator(currentItem, false);

const identity = document.querySelector('.identity');

if (document.querySelector('.opening')) {
  identity?.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    if (window.location.hash) {
      history.replaceState(history.state, '', window.location.pathname + window.location.search);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  });
}
