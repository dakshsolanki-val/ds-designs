/* ============================================
   DS DESIGNS — Shared Site Content
   Stores editable page content in localStorage and
   provides defaults for the homepage, about page,
   contact page, and footer.
   ============================================ */

const SITE_CONTENT_STORAGE_KEY = 'ds_designs_site_content';

const DEFAULT_SITE_CONTENT = {
  home: {
    hero: {
      eyebrow: 'Architecture & Interiors',
      title: 'Considered to the last line.',
      description: 'DS Designs creates homes, workplaces, and interiors across Gujarat — each one carried from first sketch to final fitting by the same standard of finish.'
    },
    philosophy: {
      eyebrow: 'Why we build the way we build',
      heading: "A project isn't finished when it's complete. It's finished when it's right.",
      intro: 'Every commission that comes through our studio — a home, an office, a single room — gets treated as a complete piece of work, not a line item.',
      paragraph: 'We design from the first conversation with the end walkthrough already in mind: will the client still love this in five years, not just on handover day?'
    },
    process: {
      eyebrow: 'How we work',
      heading: 'Five stages, one standard held throughout.',
      intro: "Our process doesn't shortcut at handover — aftercare is part of the scope, not an afterthought.",
      items: [
        { title: 'Listen', description: 'Brief, site study, and budget — we ask more questions before we draw a single wall.' },
        { title: 'Concept', description: 'Design development through sketches and models, refined against your actual life and use.' },
        { title: 'Detail', description: 'Working drawings and material specification — where most projects go wrong if rushed.' },
        { title: 'Build', description: 'On-site supervision throughout execution, not just drawings handed off to a contractor.' },
        { title: 'Handover & Aftercare', description: 'A full walkthrough, snag-list resolution, and a standing line open long after handover.' }
      ]
    },
    categories: {
      eyebrow: 'Browse by type',
      heading: 'Residential, commercial, and interiors — one standard across all three.'
    },
    featured: {
      eyebrow: 'Recent projects',
      heading: "A few rooms and buildings we're proud to have finished.",
      ctaText: 'View all projects'
    },
    testimonial: {
      eyebrow: 'In their words',
      quote: '“They treated our home like it was the only project on their desk — even long after handover.”',
      cite: '— Client, Courtyard Residence'
    },
    cta: {
      heading: 'Ready to bring your vision to life?',
      buttonText: 'Start a conversation'
    },
    heroImages: [
      'images/image1.png',
      'images/image2.jpg',
      'images/image3.JPG',
      'images/image4.jpg',
      'images/image5.jpg'
    ],
    heroCaptionLine1: 'Fig. 01 — Flagship Project',
    heroCaptionLine2: 'Bhavnagar, Gujarat',
    stats: [
      { value: '60+', label: 'Projects Delivered' },
      { value: '12', label: 'Years in Practice' },
      { value: '3', label: 'Cities Served' },
      { value: '100%', label: 'Site-Supervised Builds' }
    ],
    categoryImages: {
      Residential: ['images/hero.svg'],
      Commercial: ['images/hero.svg'],
      Interiors: ['images/hero.svg']
    }
  },
  about: {
    hero: {
      eyebrow: 'About the studio',
      title: "We'd rather finish six projects properly than start twelve."
    },
    story: {
      eyebrow: 'Our story',
      heading: 'It started with one house, finished properly.',
      paragraphs: [
        'DS Designs began with a single residential project — a house we were asked to "just help finish" after the original contractor walked away midway. We ended up redrawing half the plan, and the family ended up loving it more than what they\'d originally signed off on.',
        'Word travelled the way it usually does in this line of work — one finished room leading to the next client. What started as one house became a studio working across homes, offices, and interiors, but the instinct from that first project never changed: don\'t just complete the brief, finish it properly.'
      ]
    },
    team: {
      eyebrow: 'Who you\'ll work with',
      heading: 'A small studio, deliberately.',
      description: 'We keep the team small enough that the people who design your project are the same people who see it through.',
      members: [
        { image: 'images/hero.svg', name: 'Principal Architect', role: 'Founder & Design Lead' },
        { image: 'images/hero.svg', name: 'Senior Interior Designer', role: 'Interiors Lead' },
        { image: 'images/hero.svg', name: 'Site Supervisor', role: 'Execution & Quality' }
      ]
    },
    cta: {
      heading: "Curious if we're the right fit for your project?",
      buttonText: 'Get in touch'
    }
  },
  contact: {
    hero: {
      eyebrow: 'Get in touch',
      title: 'Tell us about the site, the brief, or just the idea.',
      subtitle: 'Get in touch with DS Designs to start a conversation about your architecture or interiors project.'
    },
    info: {
      email: 'auminterieurs@gmail.com',
      phone: '+91 9879960015',
      address: 'Rajkot, Gujarat, India',
      hours: 'Monday – Saturday, 10am – 7pm'
    }
  },
  footer: {
    description: 'An architecture and interior design studio working across residential, commercial, and interior projects in Gujarat.',
    email: 'auminterieurs@gmail.com',
    phone: '+91 9879960015',
    address: 'Rajkot, Gujarat, India',
    hours: 'Mon — Sat, 10am – 7pm',
    tagline: 'Architecture · Interiors · Planning'
  }
};

function mergeDeep(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return source === undefined ? target : source;
  const result = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    result[key] = mergeDeep(target[key], source[key]);
  }
  return result;
}

function normalizeSiteContent(content) {
  if (!content || typeof content !== 'object') return content;

  if (content?.home?.cta?.heading === 'Have a site, a brief, or just an idea?') {
    content.home.cta.heading = 'Ready to bring your vision to life?';
  }

  if (content?.contact?.info) {
    content.contact.info.email = 'auminterieurs@gmail.com';
    content.contact.info.phone = '+91 9879960015';
    content.contact.info.address = 'Rajkot, Gujarat, India';
  }

  if (content?.footer) {
    content.footer.email = 'auminterieurs@gmail.com';
    content.footer.phone = '+91 9879960015';
    content.footer.address = 'Rajkot, Gujarat, India';
  }

  return content;
}

function loadSiteContent() {
  let stored = null;
  try {
    const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch (err) {
    console.warn('Unable to read stored site content:', err);
  }
  const normalizedStored = normalizeSiteContent(stored || {});
  return mergeDeep(DEFAULT_SITE_CONTENT, normalizedStored);
}

function saveSiteContent(content) {
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (err) {
    console.error('Unable to save site content:', err);
    return false;
  }
}

function getSiteContent() {
  return SITE_CONTENT;
}

function setSiteContent(updatedContent) {
  Object.assign(SITE_CONTENT, mergeDeep(SITE_CONTENT, updatedContent));
  return saveSiteContent(SITE_CONTENT);
}

const SITE_CONTENT = loadSiteContent();

