const topics = [
  { label: 'All', query: 'Indian law Supreme Court GST intellectual property corporate law' },
  { label: 'Supreme Court', query: 'Supreme Court of India legal update' },
  { label: 'GST', query: 'GST India legal update' },
  { label: 'Taxation', query: 'India taxation law update' },
  { label: 'IPR', query: 'India intellectual property rights law' },
  { label: 'Corporate Law', query: 'India corporate law legal update' },
  { label: 'Real Estate', query: 'India real estate litigation law update' },
  { label: 'Business Law', query: 'India business law commercial litigation' }
];

const fallbackNews = [{
  title: 'Latest Indian legal updates will appear here after deployment',
  source: 'Legal Intelligence Hub',
  pubDate: new Date().toISOString(),
  topic: 'All',
  summary: 'The live Legal Intelligence Hub fetches Google News RSS metadata through the Vercel API route. Add the project to Vercel to enable automatic legal updates.',
  link: 'https://news.google.com/'
}];

let currentTopicIndex = 0;
let activeNewsIndex = 0;
let currentNews = [];

function initDisclaimer() {
  const gate = document.getElementById('disclaimerGate');
  const accept = document.getElementById('acceptDisclaimer');
  if (!gate || !accept) return;
  if (localStorage.getItem('ma-disclaimer-accepted') === 'true') gate.classList.add('is-hidden');
  accept.addEventListener('click', () => {
    localStorage.setItem('ma-disclaimer-accepted', 'true');
    gate.classList.add('is-hidden');
  });
}

function initMenu() {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((el) => observer.observe(el));
}

function renderTopicTabs() {
  const tabs = document.getElementById('topicTabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  topics.forEach((topic, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = topic.label;
    button.className = index === currentTopicIndex ? 'is-active' : '';
    button.addEventListener('click', () => {
      currentTopicIndex = index;
      activeNewsIndex = 0;
      renderTopicTabs();
      loadNews();
    });
    tabs.appendChild(button);
  });
}

function formatDate(value) {
  if (!value) return 'Latest';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Latest';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderNews() {
  const status = document.getElementById('newsStatus');
  const card = document.getElementById('newsCard');
  const meta = document.getElementById('newsMeta');
  const title = document.getElementById('newsTitle');
  const summary = document.getElementById('newsSummary');
  const link = document.getElementById('newsLink');
  if (!status || !card || !meta || !title || !summary || !link) return;
  const item = currentNews[activeNewsIndex];
  if (!item) {
    status.textContent = 'No legal updates available right now.';
    card.hidden = true;
    return;
  }
  status.textContent = '';
  card.hidden = false;
  meta.innerHTML = `<span>${item.topic || topics[currentTopicIndex].label}</span><span>Source: ${item.source || 'Google News'}</span><span>${formatDate(item.pubDate)}</span>`;
  title.textContent = item.title || 'Legal update';
  summary.textContent = item.summary || 'Read the original source for the complete report.';
  link.href = item.link || 'https://news.google.com/';
}

async function loadNews() {
  const status = document.getElementById('newsStatus');
  if (status) status.textContent = 'Loading legal updates...';
  const topic = topics[currentTopicIndex];
  try {
    const res = await fetch(`/api/news?query=${encodeURIComponent(topic.query)}&topic=${encodeURIComponent(topic.label)}`);
    if (!res.ok) throw new Error('News API failed');
    const data = await res.json();
    currentNews = Array.isArray(data.items) && data.items.length ? data.items : fallbackNews;
  } catch (error) {
    currentNews = fallbackNews;
  }
  activeNewsIndex = 0;
  renderNews();
}

function initNewsControls() {
  const prev = document.getElementById('prevNews');
  const next = document.getElementById('nextNews');
  if (!prev || !next) return;
  prev.addEventListener('click', () => {
    activeNewsIndex = activeNewsIndex === 0 ? Math.max(currentNews.length - 1, 0) : activeNewsIndex - 1;
    renderNews();
  });
  next.addEventListener('click', () => {
    activeNewsIndex = currentNews.length ? (activeNewsIndex + 1) % currentNews.length : 0;
    renderNews();
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Website enquiry - ${data.get('practice') || 'Legal consultation'}`);
    const body = encodeURIComponent(`Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\nPractice Area: ${data.get('practice') || ''}\n\nMessage:\n${data.get('message') || ''}`);
    window.location.href = `mailto:ayushmittal.adv@gmail.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDisclaimer();
  initMenu();
  initReveal();
  renderTopicTabs();
  initNewsControls();
  initContactForm();
  loadNews();
});
