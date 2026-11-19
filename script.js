document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('motion-enabled');

  const loader = document.querySelector('.site-loader');
  if (loader) {
    const removeLoader = () => loader.remove();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      removeLoader();
    } else {
      loader.addEventListener('animationend', (event) => {
        if (event.animationName === 'loader-exit') removeLoader();
      });
      window.setTimeout(removeLoader, 2200);
    }
  }

  const resumeLinks = document.querySelectorAll('a[href="resume.html"]');
  resumeLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      const ring = document.createElement('div');
      ring.className = 'resume-transition-ring';
      ring.setAttribute('aria-hidden', 'true');
      document.body.classList.add('resume-transitioning');
      document.body.appendChild(ring);
      ring.addEventListener('animationend', (animationEvent) => {
        if (animationEvent.animationName === 'resume-ring-expand') window.location.href = link.href;
      }, { once: true });
    });
  });

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
