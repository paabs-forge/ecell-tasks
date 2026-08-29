/* E-Cell landing page interactions */
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
  });

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  const setActive = id => navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
});
