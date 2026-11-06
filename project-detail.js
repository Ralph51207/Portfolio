/*
 * Add future project photos by placing them in projects/images/ and listing
 * their relative paths in the matching project's images array below.
 * Example: images: ['projects/images/smartposrestu-1.jpg']
 */
const projects = {
  'black-pig': {
    title: 'Black Pig Samgyupsal',
    category: 'Business · Operations',
    description: 'A local samgyupsal restaurant in Mandurriao, Iloilo City, where I gained hands-on experience in data entry and operations.',
    details: ['Data Encoder, May 2023 – November 2023', 'Operations Manager, December 2023 – December 2024'],
    images: [],
    icon: '🍽️'
  },
  smartposrestu: {
    title: 'SmartPOSRestu',
    category: 'Restaurant software',
    description: 'A point-of-sale project for restaurant service and order management.',
    details: ['Restaurant point-of-sale project'],
    images: [],
    icon: '▦'
  },
  'ice-cream-inventory': {
    title: 'Ice Cream Shop Inventory',
    category: 'Inventory management',
    description: 'An inventory project for tracking stock and supplies for an ice cream shop.',
    details: ['Inventory tracking project'],
    images: [],
    icon: '◈'
  },
  'task-manager': {
    title: 'Task Manager App',
    category: 'Productivity',
    description: 'A productivity tracker concept for organizing tasks and keeping everyday work moving.',
    details: ['Personal project'],
    images: [],
    icon: '✓'
  },
  portfolio: {
    title: 'Personal Portfolio',
    category: 'Web design',
    description: 'A responsive portfolio that brings together my background, experience, skills, and work in one place.',
    details: ['Responsive portfolio website'],
    images: [],
    icon: '</>'
  },
  'barbeque-guys': {
    title: 'The Barbeque Guys',
    category: 'Local business',
    description: 'A barbecue restaurant in Jaro, Iloilo City.',
    details: ['Local restaurant in Jaro, Iloilo City'],
    images: [],
    icon: '♨'
  },
  invisai: {
    title: 'InvisAI',
    category: 'Thesis · AI security',
    description: 'InvisAI: A Context-Specific Universal Adversarial Pertubation as a Defense Mechanism against CLIP-based GenAI via Semantic Feature Disruption: Cross-Platform Image Protection.',
    details: ['Thesis project', 'Context-specific universal adversarial perturbation', 'Semantic feature disruption for cross-platform image protection'],
    images: [],
    icon: '◌'
  },
  resumatch: {
    title: 'ResuMatch',
    category: 'NLP · Recruitment',
    description: 'An NLP-based system that computes compatibility between resumes and job descriptions using TF-IDF and cosine similarity, built with a Flask backend and a simple web frontend.',
    details: ['Natural language processing', 'TF-IDF and cosine similarity', 'Flask backend with a web frontend'],
    images: [],
    icon: '▤'
  },
  'black-pig-pos': {
    title: 'Black Pig POS',
    category: 'Restaurant operations',
    description: 'A restaurant-focused point-of-sale concept inspired by the day-to-day needs of a samgyupsal business.',
    details: ['Restaurant-focused point-of-sale concept'],
    images: [],
    icon: '▦'
  }
};

const container = document.querySelector('#project-content');
const project = projects[new URLSearchParams(window.location.search).get('id')];
const year = document.querySelector('#year');
document.documentElement.classList.add('motion-enabled');

if (year) year.textContent = String(new Date().getFullYear());

if (container && project) {
  document.title = `${project.title} | Ralph Martin Chua`;

  const galleryItems = project.images.length
    ? project.images.map((src, index) => `
        <figure class="gallery-item">
          <img src="${src}" alt="${project.title} project sample ${index + 1}" loading="lazy">
          <figcaption>Project image ${String(index + 1).padStart(2, '0')}</figcaption>
        </figure>`).join('')
    : Array.from({ length: 3 }, (_, index) => `
        <div class="gallery-placeholder" aria-label="Project sample image ${index + 1} coming soon">
          <span class="placeholder-icon">${project.icon}</span>
          <span>Project preview</span>
          <small>Sample image coming soon</small>
          <b>${String(index + 1).padStart(2, '0')}</b>
        </div>`).join('');

  container.innerHTML = `
    <section class="project-intro">
      <p class="eyebrow">${project.category}</p>
      <h1>${project.title}</h1>
    <p class="project-description">${project.description}</p>
    </section>
    <section class="project-gallery" aria-label="${project.title} project images">
      ${galleryItems}
    </section>
    <section class="project-overview">
      <div><p class="eyebrow">Overview</p><h2>About this project</h2></div>
      <ul>${project.details.map((detail) => `<li>${detail}</li>`).join('')}</ul>
    </section>
    <a class="return-link" href="index.html#projects">← Back to all projects</a>`;
} else if (container) {
  container.innerHTML = `
    <p class="eyebrow">Project not found</p>
    <h1>This project isn’t available.</h1>
    <p class="project-description">Choose a project from the portfolio to see its details.</p>
    <a class="return-link" href="index.html#projects">← Back to all projects</a>`;
}

const motionTargets = document.querySelectorAll(
  '.project-intro, .gallery-item, .gallery-placeholder, .project-overview, .return-link'
);

if ('IntersectionObserver' in window) {
  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  motionTargets.forEach((target, index) => {
    target.classList.add('reveal-on-scroll');
    target.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
    motionObserver.observe(target);
  });
}
