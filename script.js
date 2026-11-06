document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('motion-enabled');

  const revealTargets = document.querySelectorAll(
    '.section-heading, .about-copy, .about-facts, .timeline-card, .project-card, .skills-layout, .beyond-copy, .interest-list, .contact-panel'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach((target, index) => {
      target.classList.add('reveal-on-scroll');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      revealObserver.observe(target);
    });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        menuButton.focus();
      }
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
});
