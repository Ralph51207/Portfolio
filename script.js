document.addEventListener('DOMContentLoaded', () => {
     const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) {
    document.body.classList.add('touch');
  } else {
    document.body.classList.add('no-touch');
  }

  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  
  const revealTargets = document.querySelectorAll('section, .projects li, .education-item');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(t => revealObserver.observe(t));
  } else {
    revealTargets.forEach(t => t.classList.add('visible'));
  }


  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));
  }

  
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-chart .chart-bar');
  if (skillsSection && skillBars.length) {
    if ('IntersectionObserver' in window) {
      const skillObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillBars.forEach(bar => {
              const percent = bar.getAttribute('data-percent') || '0';
              bar.style.width = percent + '%';
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      skillObs.observe(skillsSection);
    } else {
      skillBars.forEach(bar => bar.style.width = (bar.getAttribute('data-percent') || '0') + '%');
    }
  }

  // --- Project map toggle (mobile only) ---
  const projectItems = document.querySelectorAll('.project-item');
  if (isTouch && projectItems.length) {
    projectItems.forEach(item => {
      item.addEventListener('click', (e) => {
       
        if (e.target.closest('a')) return;

        
        projectItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });

        
        item.classList.toggle('open');
      });
    });

  
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-item')) {
        projectItems.forEach(item => item.classList.remove('open'));
      }
    });
  }

  
  const contactSection = document.getElementById('contact');
  if (isTouch && contactSection) {
    contactSection.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      contactSection.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#contact')) {
        contactSection.classList.remove('open');
      }
    });
  }
});

const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(33, 129, 146, 0.58)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(draw);
}
draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
