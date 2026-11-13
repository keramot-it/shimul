const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

// Keep the chosen theme across visits, including in browsers with blocked storage.
const themeButton = document.querySelector('.theme-toggle');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#17271f' : '#f8f7f1';
}
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('shimul-theme', next); } catch {}
  syncThemeButton();
});
syncThemeButton();

const clock = document.querySelector('.local-time');
const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true,
});
function updateClock() {
  clock.textContent = `${timeFormat.format(new Date()).toUpperCase()} · GMT+6`;
}
updateClock();
setInterval(updateClock, 60000);

function closeMenu({ restoreFocus = false } = {}) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu({ restoreFocus: true });
});
document.addEventListener('click', (event) => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 681px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

const toast = document.querySelector('.toast');
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

document.querySelector('.copy-button').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('assaduzzaman.shimul@gmail.com');
    notify('Email address copied. Say hello!');
  } catch {
    notify('You can select the email address to copy it.');
  }
});

document.querySelector('.save-contact').addEventListener('click', () => {
  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0', 'N:Shimul;Asaduzzaman;;;',
    'FN:Asaduzzaman Shimul', 'TEL;TYPE=CELL:+8801609810274',
    'EMAIL:assaduzzaman.shimul@gmail.com',
    'URL:https://www.facebook.com/assaduzzaman.shimul.5',
    'END:VCARD', '',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Asaduzzaman-Shimul.vcf';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  notify('Contact card downloaded.');
});

document.querySelector('#year').textContent = new Date().getFullYear();
const progress = document.querySelector('.reading-progress');
const floatingWhatsApp = document.querySelector('.floating-whatsapp');
const contactSection = document.querySelector('#contact');
let scheduled = false;
function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
  floatingWhatsApp.classList.toggle('is-visible', window.scrollY > 650 && contactSection.getBoundingClientRect().top > innerHeight * .8);
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));

  // Content stays visible by default; animate only after it enters the viewport.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches) {
        entry.target.animate([
          { opacity: .55, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.about-layout, .quick-facts, .education-item, .world-card, .gallery-card, .future-layout, .future-steps, .faq-layout, .message-panel').forEach((element) => revealObserver.observe(element));
}

// Native dialog provides keyboard focus containment and Escape handling.
const photoDialog = document.querySelector('.photo-dialog');
const photoLinks = [...document.querySelectorAll('[data-photo]')];
const photos = photoLinks.map((link) => ({
  src: link.getAttribute('href'),
  alt: link.querySelector('img').alt,
  caption: link.querySelector('h3').textContent,
}));
let photoIndex = 0;
let photoOpener;
function displayPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  const image = photoDialog.querySelector('.lightbox-image');
  image.src = photo.src;
  image.alt = photo.alt;
  photoDialog.querySelector('.lightbox-caption').textContent = photo.caption;
  photoDialog.querySelector('.lightbox-counter').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
}
photoLinks.forEach((link, index) => link.addEventListener('click', (event) => {
  if (typeof photoDialog.showModal !== 'function') return;
  event.preventDefault();
  photoOpener = link;
  displayPhoto(index);
  photoDialog.showModal();
  document.body.classList.add('photo-open');
}));
photoDialog.querySelector('.lightbox-close').addEventListener('click', () => photoDialog.close());
photoDialog.querySelector('.lightbox-prev').addEventListener('click', () => displayPhoto(photoIndex - 1));
photoDialog.querySelector('.lightbox-next').addEventListener('click', () => displayPhoto(photoIndex + 1));
photoDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    displayPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
photoDialog.addEventListener('click', (event) => {
  if (event.target !== photoDialog) return;
  const box = photoDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) photoDialog.close();
});
photoDialog.addEventListener('close', () => {
  document.body.classList.remove('photo-open');
  photoOpener?.focus({ preventScroll: true });
});

// Prepare a draft locally. Nothing is sent until the visitor chooses an app.
const messageForm = document.querySelector('#message-form');
const messageResult = document.querySelector('#message-result');
const nameInput = document.querySelector('#sender-name');
const messageInput = document.querySelector('#sender-message');
messageForm.addEventListener('input', () => {
  nameInput.setCustomValidity('');
  messageInput.setCustomValidity('');
  messageResult.hidden = true;
});
messageForm.addEventListener('change', () => { messageResult.hidden = true; });
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const topic = document.querySelector('#message-topic').value;
  nameInput.setCustomValidity(name ? '' : 'Please enter your name.');
  messageInput.setCustomValidity(message.length >= 5 ? '' : 'Please write a message of at least 5 characters.');
  if (!messageForm.reportValidity()) return;
  const body = `Hi Shimul,\n\n${message}\n\nFrom: ${name}\nAbout: ${topic}`;
  document.querySelector('#whatsapp-draft').href = `https://wa.me/8801609810274?text=${encodeURIComponent(body)}`;
  document.querySelector('#email-draft').href = `mailto:assaduzzaman.shimul@gmail.com?subject=${encodeURIComponent(`${topic} — ${name}`)}&body=${encodeURIComponent(body)}`;
  messageResult.hidden = false;
  messageResult.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'nearest' });
  document.querySelector('#whatsapp-draft').focus({ preventScroll: true });
});
