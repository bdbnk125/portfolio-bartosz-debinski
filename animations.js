const opening = document.querySelector('.opening');
const hero = opening?.querySelector('h1');
const projectSlots = [...document.querySelectorAll('.project-slot')];
const lineRevealGroups = [
  document.querySelector('.about-copy'),
  document.querySelector('.contact-copy'),
].filter(Boolean);
const caseCopyHeaders = [...document.querySelectorAll('.case-heading-with-copy')];
const heroText = hero?.textContent.trim() || '';
let heroHasAnimated = false;
let resizeTimer;
const revealText = new WeakMap();
const revealedGroups = new WeakSet();

function splitHeroIntoLines() {
  if (!hero || !heroText) return 0;

  hero.classList.remove('hero-ready');
  hero.textContent = '';

  const words = heroText.split(/\s+/).map((word, index, allWords) => {
    const probe = document.createElement('span');
    probe.textContent = word;
    hero.append(probe);
    if (index < allWords.length - 1) hero.append(document.createTextNode(' '));
    return probe;
  });

  const lines = [];
  words.forEach((word) => {
    const top = Math.round(word.getBoundingClientRect().top);
    const currentLine = lines.at(-1);
    if (!currentLine || Math.abs(currentLine.top - top) > 2) lines.push({ top, words: [word.textContent] });
    else currentLine.words.push(word.textContent);
  });

  const fragment = document.createDocumentFragment();
  lines.forEach((line, index) => {
    const mask = document.createElement('span');
    const text = document.createElement('span');
    mask.className = 'hero-line';
    text.className = 'hero-line-inner';
    text.style.setProperty('--line-index', index);
    text.textContent = line.words.join(' ') + (index < lines.length - 1 ? ' ' : '');
    mask.append(text);
    fragment.append(mask);
  });

  hero.replaceChildren(fragment);
  opening?.style.setProperty('--hero-small-delay', `${740 + Math.max(lines.length - 1, 0) * 90 + 80}ms`);
  hero.classList.add('hero-ready');
  return lines.length;
}

function startHeroAnimation() {
  if (!opening || !hero) return;
  splitHeroIntoLines();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      opening.classList.add('hero-animated');
      heroHasAnimated = true;
    });
  });
}

function rebuildHeroAfterResize() {
  if (!heroHasAnimated) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    splitHeroIntoLines();
    opening?.classList.add('hero-animated');
  }, 120);
}

function observeProjects() {
  if (!projectSlots.length) return;

  if (!('IntersectionObserver' in window)) {
    projectSlots.forEach((slot) => slot.classList.add('project-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('project-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  projectSlots.forEach((slot, index) => {
    slot.style.setProperty('--project-delay', `${index % 2 === 1 ? 90 : 0}ms`);
    observer.observe(slot);
  });
}

function splitRevealTarget(target, startIndex = 0) {
  const originalText = revealText.get(target) ?? target.textContent.trim();
  revealText.set(target, originalText);
  target.classList.remove('line-reveal-ready');
  target.textContent = '';

  const words = originalText.split(/\s+/).map((word, index, allWords) => {
    const probe = document.createElement('span');
    probe.textContent = word;
    target.append(probe);
    if (index < allWords.length - 1) target.append(document.createTextNode(' '));
    return probe;
  });

  const lines = [];
  words.forEach((word) => {
    const top = Math.round(word.getBoundingClientRect().top);
    const currentLine = lines.at(-1);
    if (!currentLine || Math.abs(currentLine.top - top) > 2) lines.push({ top, words: [word.textContent] });
    else currentLine.words.push(word.textContent);
  });

  const fragment = document.createDocumentFragment();
  lines.forEach((line, index) => {
    const mask = document.createElement('span');
    const text = document.createElement('span');
    mask.className = 'line-reveal-mask';
    text.className = 'line-reveal-inner';
    text.style.setProperty('--reveal-index', startIndex + index);
    text.textContent = line.words.join(' ');
    mask.append(text);
    fragment.append(mask);
  });

  target.replaceChildren(fragment);
  target.classList.add('line-reveal-ready');
  return lines.length;
}

function prepareLineRevealGroup(group) {
  const targets = group.matches('.about-copy')
    ? [...group.querySelectorAll('.about-intro, .about-text p')]
    : [...group.querySelectorAll('.contact-title, .contact-steps p, .contact-email')];
  let lineIndex = 0;
  targets.forEach((target) => {
    lineIndex += splitRevealTarget(target, lineIndex);
  });
}

function observeLineRevealGroups() {
  if (!lineRevealGroups.length) return;

  lineRevealGroups.forEach(prepareLineRevealGroup);

  if (!('IntersectionObserver' in window)) {
    lineRevealGroups.forEach((group) => {
      group.classList.add('line-reveal-visible');
      revealedGroups.add(group);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('line-reveal-visible');
      revealedGroups.add(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  lineRevealGroups.forEach((group) => observer.observe(group));
}

function rebuildLineRevealsAfterResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    lineRevealGroups.forEach((group) => {
      prepareLineRevealGroup(group);
      if (revealedGroups.has(group)) group.classList.add('line-reveal-visible');
    });
    rebuildHeroAfterResize();
  }, 120);
}

function observeCaseCopy() {
  if (!caseCopyHeaders.length) return;

  if (!('IntersectionObserver' in window)) {
    caseCopyHeaders.forEach((header) => header.classList.add('case-copy-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('case-copy-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  caseCopyHeaders.forEach((header) => observer.observe(header));
}

document.fonts.ready.then(() => {
  startHeroAnimation();
  observeLineRevealGroups();
});
window.addEventListener('resize', lineRevealGroups.length ? rebuildLineRevealsAfterResize : rebuildHeroAfterResize);
observeProjects();
observeCaseCopy();
