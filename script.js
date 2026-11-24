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
      const bounds = link.getBoundingClientRect();
      const ring = document.createElement('div');
      ring.className = 'resume-transition-ring';
      ring.setAttribute('aria-hidden', 'true');
      ring.style.setProperty('--transition-x', `${bounds.left + bounds.width / 2}px`);
      ring.style.setProperty('--transition-y', `${bounds.top + bounds.height / 2}px`);
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
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach((target, index) => {
      target.classList.add('reveal-on-scroll');
      target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      revealObserver.observe(target);
    });
  }

  const portraitWrap = document.querySelector('.portrait-wrap');
  if (portraitWrap && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let dragOrigin = null;
    portraitWrap.addEventListener('pointermove', (event) => {
      const bounds = portraitWrap.getBoundingClientRect();
      portraitWrap.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
      portraitWrap.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
      portraitWrap.classList.add('is-hovered');
      if (dragOrigin) {
        const tiltX = Math.max(-16, Math.min(16, (event.clientY - dragOrigin.y) * -0.35));
        const tiltY = Math.max(-16, Math.min(16, (event.clientX - dragOrigin.x) * 0.35));
        portraitWrap.style.setProperty('--drag-rotate-x', `${tiltX}deg`);
        portraitWrap.style.setProperty('--drag-rotate-y', `${tiltY}deg`);
      }
    });
    portraitWrap.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      dragOrigin = { x: event.clientX, y: event.clientY };
      portraitWrap.classList.add('is-dragging');
      portraitWrap.setPointerCapture(event.pointerId);
    });
    const finishPortraitDrag = () => {
      dragOrigin = null;
      portraitWrap.classList.remove('is-dragging');
      portraitWrap.style.setProperty('--drag-rotate-x', '0deg');
      portraitWrap.style.setProperty('--drag-rotate-y', '0deg');
    };
    portraitWrap.addEventListener('pointerup', finishPortraitDrag);
    portraitWrap.addEventListener('pointercancel', finishPortraitDrag);
    portraitWrap.addEventListener('pointerleave', () => {
      if (!dragOrigin) portraitWrap.classList.remove('is-hovered');
    });
  }

  // Pixel art and movement behavior follow adryd325/oneko.js (MIT): https://github.com/adryd325/oneko.js
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const neko = document.createElement('button');
    neko.id = 'oneko';
    neko.type = 'button';
    neko.setAttribute('aria-label', 'Wake the sleeping cat');
    neko.setAttribute('aria-pressed', 'false');
    document.body.appendChild(neko);

    const portrait = document.querySelector('.portrait-frame');
    let nekoX = 32;
    let nekoY = 32;
    let awake = false;
    let mouseX = 0;
    let mouseY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 10;
    const sprites = {
      idle: [[-3, -3]], alert: [[-7, -3]],
      scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
      scratchWallN: [[0, 0], [0, -1]], scratchWallS: [[-7, -1], [-6, -2]],
      scratchWallE: [[-2, -2], [-2, -3]], scratchWallW: [[-4, 0], [-4, -1]],
      tired: [[-3, -2]], sleeping: [[-2, 0], [-2, -1]],
      N: [[-1, -2], [-1, -3]], NE: [[0, -2], [0, -3]],
      E: [[-3, 0], [-3, -1]], SE: [[-5, -1], [-5, -2]],
      S: [[-6, -3], [-7, -2]], SW: [[-5, -3], [-6, -1]],
      W: [[-4, -2], [-4, -3]], NW: [[-1, 0], [-1, -1]]
    };

    const setSprite = (name, frame) => {
      const sprite = sprites[name][frame % sprites[name].length];
      neko.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    };
    const resetIdle = () => { idleAnimation = null; idleAnimationFrame = 0; };
    const placeAsleepOnPortrait = () => {
      if (!portrait || awake) return;
      const bounds = portrait.getBoundingClientRect();
      nekoX = bounds.right - 26;
      nekoY = bounds.bottom - 28;
      neko.style.left = `${nekoX - 16}px`;
      neko.style.top = `${nekoY - 16}px`;
    };
    placeAsleepOnPortrait();
    setSprite('sleeping', 0);
    window.addEventListener('resize', placeAsleepOnPortrait);
    window.addEventListener('scroll', placeAsleepOnPortrait, { passive: true });

    neko.addEventListener('click', (event) => {
      event.stopPropagation();
      awake = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      neko.setAttribute('aria-label', 'The cat is following your cursor');
      neko.setAttribute('aria-pressed', 'true');
    });

    const idle = () => {
      idleTime += 1;
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const available = ['sleeping', 'scratchSelf'];
        if (nekoX < 32) available.push('scratchWallW');
        if (nekoY < 32) available.push('scratchWallN');
        if (nekoX > window.innerWidth - 32) available.push('scratchWallE');
        if (nekoY > window.innerHeight - 32) available.push('scratchWallS');
        idleAnimation = available[Math.floor(Math.random() * available.length)];
      }

      if (idleAnimation === 'sleeping') {
        if (idleAnimationFrame < 8) setSprite('tired', 0);
        else setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdle();
      } else if (idleAnimation && idleAnimation.startsWith('scratch')) {
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdle();
      } else {
        setSprite('idle', 0);
        return;
      }
      idleAnimationFrame += 1;
    };

    window.addEventListener('pointermove', (event) => {
      if (!awake) return;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    window.setInterval(() => {
      frameCount += 1;
      if (!awake) {
        setSprite('sleeping', frameCount);
        return;
      }
      const diffX = nekoX - mouseX;
      const diffY = nekoY - mouseY;
      const distance = Math.hypot(diffX, diffY);
      if (distance < nekoSpeed || distance < 48) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;
      if (idleTime > 1) {
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7) - 1;
        return;
      }

      let direction = diffY / distance > .5 ? 'N' : '';
      direction += diffY / distance < -.5 ? 'S' : '';
      direction += diffX / distance > .5 ? 'W' : '';
      direction += diffX / distance < -.5 ? 'E' : '';
      setSprite(direction, frameCount);
      nekoX -= diffX / distance * nekoSpeed;
      nekoY -= diffY / distance * nekoSpeed;
      nekoX = Math.min(Math.max(16, nekoX), Math.max(16, window.innerWidth - 16));
      nekoY = Math.min(Math.max(16, nekoY), Math.max(16, window.innerHeight - 16));
      neko.style.left = `${nekoX - 16}px`;
      neko.style.top = `${nekoY - 16}px`;
    }, 100);
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
