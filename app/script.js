const BASE_PATH = location.pathname.split('/')[1]
  ? `/${location.pathname.split('/')[1]}`
  : '';

async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

async function init() {
    // 1. Cargar header y footer primero
    await loadComponent("header", `${BASE_PATH}/components/header.html`);
    await loadComponent("footer", `${BASE_PATH}/components/footer.html`);

    // 2. Ahora SÍ existen en el DOM
    const burger = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const section = link.getAttribute('data-link');

            // Si estás en index
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === `${BASE_PATH}/`) {
            window.location.hash = section;
            } else {
            // Si estás en una página de proyecto
            window.location.href = `${BASE_PATH}/index.html#${section}`;
            }
        });
    });

  initCarousel();
  initReveal();
  cargarServicios();
}

init();

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('carouselDots');
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
    resetTimer();
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => goTo(current + 1));

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  resetTimer();
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}

async function cargarServicios() {
  try {

    const API_URL = "https://script.google.com/macros/s/AKfycbwhxfvOVW1skbyuUtoloap1sFj_BIaLuyToC9TK7s8i3DGSY2yNfOby4_bBqrmcVihi3w/exec";

    const response = await fetch(`${API_URL}?sheet=servicios`);
    const servicios = await response.json();

    const container = document.getElementById('serviciosContainer');

    
    if (!container) return; // 👈 ESTA LÍNEA SOLUCIONA TODO

    container.innerHTML = servicios.map(servicio => `
      <div class="servicio-item reveal">
        <div class="servicio-num">${servicio.numero}</div>
        <div class="servicio-name">${servicio.titulo}</div>
        <p class="servicio-desc">${servicio.descripcion}</p>
      </div>
    `).join('');

    // Re-aplicar animación reveal
    initReveal();

  } catch (error) {
    console.error('Error cargando servicios:', error);
  }
}

cargarServicios();