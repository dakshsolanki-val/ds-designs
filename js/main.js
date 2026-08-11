/* ============================================
   DS DESIGNS — Shared front-end behaviour
   Reads from Supabase (DB.getProjects) when
   configured; falls back to static PROJECTS
   data when running locally without Supabase.
   ============================================ */

/* ---- Mobile nav toggle ---- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
}

/* ---- Render a project card ---- */
function projectCardHTML(p){
  return `
    <a class="project-card" href="project-detail.html?id=${p.id}">
      <div class="thumb reg-marks">
        <img src="${p.cover || 'images/hero.svg'}" alt="${p.title}" loading="lazy"
             onerror="this.src='images/hero.svg'">
        <div class="card-overlay"></div>
        <div class="card-caption">
          <h3>${p.title}</h3>
          <div class="card-meta">
            <span>${p.category}</span>
            <span>${p.year}</span>
          </div>
        </div>
      </div>
    </a>`;
}

/* ---- Home: featured projects (first 3) ---- */
async function renderFeatured(){
  const el = document.querySelector('#featured-grid');
  if(!el) return;
  const projects = await DB.getProjects();
  el.innerHTML = projects.slice(0, 3).map(projectCardHTML).join('');
}

function initHomePageContent(){
  const content = getSiteContent();

  const heroEyebrow = document.querySelector('#home-hero-eyebrow');
  if(heroEyebrow) heroEyebrow.textContent = content.home.hero?.eyebrow || heroEyebrow.textContent;

  const heroTitle = document.querySelector('#home-hero-title');
  if(heroTitle) heroTitle.textContent = content.home.hero?.title || heroTitle.textContent;

  const heroDescription = document.querySelector('#home-hero-description');
  if(heroDescription) heroDescription.textContent = content.home.hero?.description || heroDescription.textContent;

  const visionEyebrow = document.querySelector('#vision-eyebrow');
  if(visionEyebrow) visionEyebrow.textContent = content.home.philosophy?.eyebrow || visionEyebrow.textContent;

  const visionHeading = document.querySelector('#vision-heading');
  if(visionHeading) visionHeading.textContent = content.home.philosophy?.heading || visionHeading.textContent;

  const visionParagraph = document.querySelector('#vision-paragraph');
  if(visionParagraph) visionParagraph.textContent = content.home.philosophy?.paragraph || visionParagraph.textContent;

  const processEyebrow = document.querySelector('#process-eyebrow');
  if(processEyebrow) processEyebrow.textContent = content.home.process?.eyebrow || processEyebrow.textContent;

  const processHeading = document.querySelector('#process-heading');
  if(processHeading) processHeading.textContent = content.home.process?.heading || processHeading.textContent;

  const processIntro = document.querySelector('#process-intro');
  if(processIntro) processIntro.textContent = content.home.process?.intro || processIntro.textContent;

  const processItems = content.home.process?.items || [];
  const processTitles = document.querySelectorAll('.process-item h3');
  const processDescriptions = document.querySelectorAll('.process-item p');
  processTitles.forEach((node, idx) => {
    if(processItems[idx]?.title) node.textContent = processItems[idx].title;
  });
  processDescriptions.forEach((node, idx) => {
    if(processItems[idx]?.description) node.textContent = processItems[idx].description;
  });

  const categoryEyebrow = document.querySelector('#category-eyebrow');
  if(categoryEyebrow) categoryEyebrow.textContent = content.home.categories?.eyebrow || categoryEyebrow.textContent;

  const categoryHeading = document.querySelector('#category-heading');
  if(categoryHeading) categoryHeading.textContent = content.home.categories?.heading || categoryHeading.textContent;

  const featuredEyebrow = document.querySelector('#featured-eyebrow');
  if(featuredEyebrow) featuredEyebrow.textContent = content.home.featured?.eyebrow || featuredEyebrow.textContent;

  const featuredHeading = document.querySelector('#featured-heading');
  if(featuredHeading) featuredHeading.textContent = content.home.featured?.heading || featuredHeading.textContent;

  const featuredCta = document.querySelector('#featured-cta');
  if(featuredCta) featuredCta.textContent = content.home.featured?.ctaText || featuredCta.textContent;

  const testimonialEyebrow = document.querySelector('#testimonial-eyebrow');
  if(testimonialEyebrow) testimonialEyebrow.textContent = content.home.testimonial?.eyebrow || testimonialEyebrow.textContent;

  const testimonialQuote = document.querySelector('#testimonial-quote');
  if(testimonialQuote) testimonialQuote.textContent = content.home.testimonial?.quote || testimonialQuote.textContent;

  const testimonialCite = document.querySelector('#testimonial-cite');
  if(testimonialCite) testimonialCite.textContent = content.home.testimonial?.cite || testimonialCite.textContent;

  const ctaHeading = document.querySelector('#home-cta-heading');
  if(ctaHeading) ctaHeading.textContent = content.home.cta?.heading || ctaHeading.textContent;

  const ctaButton = document.querySelector('#home-cta-button');
  if(ctaButton) ctaButton.textContent = content.home.cta?.buttonText || ctaButton.textContent;
}

function initHomeCarousel(){
  const content = getSiteContent();
  const defaultHeroImages = [
    'images/image1.png',
    'images/image2.jpg',
    'images/image3.JPG',
    'images/image4.jpg',
    'images/image5.jpg'
  ];
  const heroImages = Array.isArray(content.home.heroImages) && content.home.heroImages.length > 0
    ? content.home.heroImages
    : defaultHeroImages;
  const carousel = document.querySelector('#home-carousel');
  if(!carousel) return;

  const resolvedHeroImages = heroImages.map((src) => {
    if (typeof src !== 'string') return '';
    if (src.includes('image1')) return 'images/image1.png';
    if (src.includes('image2')) return 'images/image2.jpg';
    if (src.includes('image3')) return 'images/image3.JPG';
    if (src.includes('image4')) return 'images/image4.jpg';
    if (src.includes('image5')) return 'images/image5.jpg';
    return src;
  }).filter(Boolean);

  const finalHeroImages = resolvedHeroImages.length > 0 ? resolvedHeroImages : defaultHeroImages;

  const carouselImages = Array.from(carousel.querySelectorAll('.carousel-image'));
  if (carouselImages.length === 0) {
    carousel.innerHTML = finalHeroImages.map((src, idx) => 
      `<img class="carousel-image ${idx === 0 ? 'active' : ''}" src="${src}" alt="Featured DS Designs project ${idx + 1}">`
    ).join('');
  } else {
    carouselImages.forEach((img, idx) => {
      const src = finalHeroImages[idx] || '';
      if (src) {
        img.setAttribute('src', src);
      }
      img.setAttribute('alt', `Featured DS Designs project ${idx + 1}`);
    });
  }

  const activeImages = Array.from(carousel.querySelectorAll('.carousel-image'));
  if(carouselImages.length === 0) return;

  let current = 0;
  const updateCarousel = () => {
    carouselImages.forEach((img, idx) => {
      const isActive = idx === current;
      img.classList.toggle('active', isActive);
      img.style.opacity = isActive ? '1' : '0';
      img.style.zIndex = isActive ? '1' : '0';
    });
  };

  updateCarousel();

  if (window.__homeCarouselInterval) {
    clearInterval(window.__homeCarouselInterval);
  }

  // Rotate images every 5 seconds
  window.__homeCarouselInterval = window.setInterval(() => {
    current = (current + 1) % carouselImages.length;
    updateCarousel();
  }, 5000);
}

function initSiteFooter(){
  const content = getSiteContent();
  const footerEmail = document.querySelectorAll('#footer-email');
  const footerPhone = document.querySelectorAll('#footer-phone');
  const footerAddress = document.querySelectorAll('#footer-address');
  const footerHours = document.querySelectorAll('#footer-hours');
  const footerDescription = document.querySelectorAll('#footer-description');
  const footerTagline = document.querySelectorAll('#footer-tagline');

  footerEmail.forEach(el => { if(el.tagName === 'A') el.href = `mailto:${content.footer.email}`; el.textContent = content.footer.email; });
  footerPhone.forEach(el => { if(el.tagName === 'A') el.href = `tel:${content.footer.phone}`; el.textContent = content.footer.phone; });
  footerAddress.forEach(el => { el.textContent = content.footer.address; });
  footerHours.forEach(el => { el.textContent = content.footer.hours; });
  footerDescription.forEach(el => { el.textContent = content.footer.description; });
  footerTagline.forEach(el => { el.textContent = content.footer.tagline; });
}

function initHomeStats(){
  const content = getSiteContent();
  const stats = content.home.stats || [];
  const statNodes = document.querySelectorAll('.vision-stats div');
  statNodes.forEach((node, idx) => {
    if(!stats[idx]) return;
    const value = node.querySelector('b');
    const label = node.querySelector('span');
    if(value) value.textContent = stats[idx].value;
    if(label) label.textContent = stats[idx].label;
  });
}

function initAboutPageContent(){
  const content = getSiteContent();

  const heroEyebrow = document.querySelector('#about-hero-eyebrow');
  if(heroEyebrow) heroEyebrow.textContent = content.about.hero?.eyebrow || heroEyebrow.textContent;

  const heroTitle = document.querySelector('#about-hero-title');
  if(heroTitle) heroTitle.textContent = content.about.hero?.title || heroTitle.textContent;

  const storyEyebrow = document.querySelector('#about-story-eyebrow');
  if(storyEyebrow) storyEyebrow.textContent = content.about.story?.eyebrow || storyEyebrow.textContent;

  const storyHeading = document.querySelector('#about-story-heading');
  if(storyHeading) storyHeading.textContent = content.about.story?.heading || storyHeading.textContent;

  const storyParagraphs = content.about.story?.paragraphs || [];
  const storyCopyParagraphs = document.querySelectorAll('#about-story-copy > p');
  storyCopyParagraphs.forEach((node, idx) => {
    if(storyParagraphs[idx]) node.textContent = storyParagraphs[idx];
  });

  const teamEyebrow = document.querySelector('#about-team-eyebrow');
  if(teamEyebrow) teamEyebrow.textContent = content.about.team?.eyebrow || teamEyebrow.textContent;

  const teamHeading = document.querySelector('#about-team-heading');
  if(teamHeading) teamHeading.textContent = content.about.team?.heading || teamHeading.textContent;

  const teamDescription = document.querySelector('#about-team-description');
  if(teamDescription) teamDescription.textContent = content.about.team?.description || teamDescription.textContent;

  const ctaHeading = document.querySelector('#about-cta-heading');
  if(ctaHeading) ctaHeading.textContent = content.about.cta?.heading || ctaHeading.textContent;

  const ctaButton = document.querySelector('#about-cta-button');
  if(ctaButton) ctaButton.textContent = content.about.cta?.buttonText || ctaButton.textContent;
}

function initAboutTeam(){
  const grid = document.querySelector('#team-grid');
  if(!grid) return;
  const content = getSiteContent();
  const team = content.about.team?.members || content.about.team || [];
  grid.innerHTML = team.map(member => `
    <div class="team-card">
      <div class="thumb"><img src="${member.image || 'images/hero.svg'}" alt="${member.name || 'Team member'}"></div>
      <h3>${member.name}</h3>
      <span class="role">${member.role}</span>
    </div>
  `).join('');
}

function initContactContent(){
  const content = getSiteContent();
  const heroTitle = document.querySelector('#contact-hero-title');
  if(heroTitle) heroTitle.textContent = content.contact.hero?.title || content.contact.heroTitle || heroTitle.textContent;
  const heroSubtitle = document.querySelector('#contact-hero-subtitle');
  if(heroSubtitle) heroSubtitle.textContent = content.contact.hero?.subtitle || content.contact.heroSubtitle || heroSubtitle.textContent;
  const contactEmail = document.querySelector('#contact-info-email');
  const contactPhone = document.querySelector('#contact-info-phone');
  const contactAddress = document.querySelector('#contact-info-address');
  const contactHours = document.querySelector('#contact-info-hours');

  if(contactEmail) { contactEmail.href = `mailto:${content.contact.info?.email || content.contact.email}`; contactEmail.textContent = content.contact.info?.email || content.contact.email; }
  if(contactPhone) { contactPhone.href = `tel:${content.contact.info?.phone || content.contact.phone}`; contactPhone.textContent = content.contact.info?.phone || content.contact.phone; }
  if(contactAddress) contactAddress.textContent = content.contact.info?.address || content.contact.address;
  if(contactHours) contactHours.textContent = content.contact.info?.hours || content.contact.hours;
}

function initContactHeroRotation(){
  const heroTitle = document.querySelector('#contact-hero-title');
  if(!heroTitle) return;

  const phrases = [
    'Tell us about your project.',
    'Let\'s create something exceptional together.',
    'Share your vision with us.',
    'What\'s the next big thing you\'re building?',
    'Let\'s turn your ideas into reality.'
  ];

  let index = Math.floor(Math.random() * phrases.length);
  heroTitle.textContent = phrases[index];

  setInterval(() => {
    index = (index + 1) % phrases.length;
    heroTitle.textContent = phrases[index];
  }, 7000);
}

function initCategoryImageRotation(){
  const tiles = document.querySelectorAll('.category-tile img[data-rotate-images]');
  tiles.forEach(img => {
    const raw = img.dataset.rotateImages;
    if(!raw) return;
    let images;
    try { images = JSON.parse(raw); } catch (err) { return; }
    if(!images.length) return;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % images.length;
      img.src = images[idx];
    }, 5000);
  });
}

/* ---- Home: category tiles ---- */
async function renderCategoryTiles(){
  const el = document.querySelector('#category-tiles');
  if(!el) return;
  const projects = await DB.getProjects();
  const content = getSiteContent();
  const cats = ['Residential','Commercial','Interiors'];
  el.innerHTML = cats.map(cat => {
    const categoryImages = content.home.categoryImages[cat] || [];
    const cover = categoryImages[0]
                || (projects.find(p => p.category === cat) || {}).cover
                || 'images/hero.svg';
    const rotateAttr = categoryImages.length > 1
      ? `data-rotate-images='${JSON.stringify(categoryImages).replace(/'/g, '&#39;')}'`
      : '';
    return `
      <a class="category-tile" href="projects.html?category=${cat}">
        <img src="${cover}" ${rotateAttr} alt="${cat} projects" loading="lazy" onerror="this.src='images/hero.svg'">
        <div class="overlay"></div>
        <div class="label">
          <h3>${cat}</h3>
          <span>View projects →</span>
        </div>
      </a>`;
  }).join('');
}

/* ---- Gallery: full grid + filters ---- */
async function renderGallery(){
  const grid = document.querySelector('#project-grid');
  if(!grid) return;

  const allProjects = await DB.getProjects();
  const buttons     = document.querySelectorAll('.filter-btn');

  function draw(category){
    const list = category === 'All'
      ? allProjects
      : allProjects.filter(p => p.category === category);
    grid.innerHTML = list.length
      ? list.map(projectCardHTML).join('')
      : `<p style="color:var(--ink-soft);grid-column:1/-1;padding:2rem 0;">No ${category} projects yet.</p>`;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      draw(btn.dataset.filter);
    });
  });

  // Pre-select filter from URL, e.g. projects.html?category=Residential
  const params = new URLSearchParams(window.location.search);
  const pre    = params.get('category');
  const match  = pre && [...buttons].find(b => b.dataset.filter === pre);
  if(match){
    buttons.forEach(b => b.classList.remove('active'));
    match.classList.add('active');
    draw(pre);
  } else {
    draw('All');
  }
}

/* ---- Project detail page ---- */
async function renderDetail(){
  const root = document.querySelector('#detail-root');
  if(!root) return;

  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const project = await DB.getProject(id);

  if(!project){
    root.innerHTML = `
      <div class="wrap section">
        <p class="eyebrow">Not found</p>
        <h2>We couldn't find that project.</h2>
        <p><a class="back-link" href="projects.html">← Back to all projects</a></p>
      </div>`;
    return;
  }

  document.title = `${project.title} — DS Designs`;

  const galleryImgs = project.images.filter(u => u && u !== project.cover);

  root.innerHTML = `
    <div class="detail-hero reg-marks">
      <img src="${project.cover || 'images/hero.svg'}" alt="${project.title}"
           onerror="this.src='images/hero.svg'">
    </div>
    <div class="wrap section" style="padding-top:2.4rem;">
      <p class="eyebrow">${project.category}</p>
      <h1 style="font-style:italic; font-size:clamp(2rem,4vw,3.2rem); margin-top:0.6rem;">${project.title}</h1>
      <p style="max-width:560px; color:var(--ink-soft); margin-top:1rem;">${project.brief}</p>

      <dl class="detail-meta">
        <div><dt>Location</dt><dd>${project.location}</dd></div>
        <div><dt>Area</dt><dd>${project.specs.area}</dd></div>
        <div><dt>Duration</dt><dd>${project.specs.duration}</dd></div>
        <div><dt>Scope</dt><dd>${project.specs.scope}</dd></div>
      </dl>

      <div class="detail-body">
        <div class="story">
          <p class="eyebrow">The thinking</p>
          ${(project.story || []).map(para => `<p>${para}</p>`).join('')}
        </div>
        <div>
          <p class="eyebrow">Quick facts</p>
          <p style="color:var(--ink-soft); font-size:0.95rem; margin-top:1rem;">
            Completed ${project.year} in ${project.location}.<br>
            ${project.specs.scope}.
          </p>
        </div>
      </div>

      ${galleryImgs.length ? `
        <div class="detail-gallery">
          ${galleryImgs.map(img => `
            <img src="${img}" alt="${project.title}" loading="lazy"
                 onerror="this.src='images/hero.svg'">`).join('')}
        </div>` : ''}

      <p style="margin-top:3rem;"><a class="back-link" href="projects.html">← Back to all projects</a></p>
    </div>`;
}

/* ---- Contact form ---- */
function initContactHeroRotation(){
  const heroTitle = document.querySelector('#contact-hero-title');
  if(!heroTitle) return;

  const phrases = [
    'Tell us about your project.',
    'Let\'s create something exceptional together.',
    'Share your vision with us.',
    'What\'s the next big thing you\'re building?',
    'Let\'s turn your ideas into reality.'
  ];

  let index = Math.floor(Math.random() * phrases.length);
  heroTitle.textContent = phrases[index];

  setInterval(() => {
    index = (index + 1) % phrases.length;
    heroTitle.textContent = phrases[index];
  }, 7000);
}

function initContactForm(){
  const form   = document.querySelector('#contact-form');
  if(!form) return;
  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data    = new FormData(form);
    const name    = (data.get('name')    || '').trim();
    const email   = (data.get('email')   || '').trim();
    const message = (data.get('message') || '').trim();
    const phone   = (data.get('phone')   || '').trim();
    const projectType = (data.get('projectType') || '').trim();

    if(!name || !email || !message){
      status.textContent = 'Please fill in your name, email, and message.';
      status.className   = 'form-status err';
      return;
    }

    if (submitButton) submitButton.disabled = true;
    status.textContent = 'Sending your message...';
    status.className   = 'form-status';

    try {
      const inquiryPayload = {
        name,
        email,
        phone,
        projectType,
        message,
        source: 'DS Designs website'
      };

      if (CONTACT_FORM_ENDPOINT) {
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(inquiryPayload)
        });

        if (!response.ok) {
          throw new Error('The form service did not accept the submission.');
        }
      } else if (DB && typeof DB.createContactInquiry === 'function') {
        await DB.createContactInquiry(inquiryPayload);
      } else {
        const subject = encodeURIComponent(`New inquiry from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nProject Type: ${projectType || 'Not provided'}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:${CONTACT_FORM_EMAIL}?subject=${subject}&body=${body}`;
      }

      status.textContent = `Thanks, ${name}. We'll be in touch at ${email} shortly.`;
      status.className   = 'form-status ok';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Sorry, something went wrong while sending your message. Please email us directly at auminterieurs@gmail.com.';
      status.className   = 'form-status err';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function setYear(){
  const el = document.querySelector('#year');
  if(el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  await Promise.all([
    renderFeatured(),
    renderCategoryTiles(),
    renderGallery(),
    renderDetail()
  ]);
  initHomePageContent();
  initHomeCarousel();
  initCategoryImageRotation();
  initHomeStats();
  initAboutPageContent();
  initAboutTeam();
  initContactContent();
  initContactHeroRotation();
  initSiteFooter();
  initContactForm();
  setYear();
});

