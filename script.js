// ===== MODO OSCURO =====
const root = document.documentElement;
const themeBtn = document.getElementById('btn-theme');

// Si el usuario no guardó preferencia, usa la del sistema
const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const startDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

if (startDark) {
  root.classList.add('dark');
  if (themeBtn) themeBtn.setAttribute('aria-pressed', 'true');
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    themeBtn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ===== VOLVER ARRIBA =====
const toTopBtn = document.getElementById('to-top');
if (toTopBtn) {
  const onScroll = () => {
    toTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FORMULARIO (opcional por página) =====
// En cada perfil, pon en el <form> un data-to con el correo: data-to="correo@ejemplo.com"
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = (form.nombre?.value || '').trim();
    const email   = (form.email?.value || '').trim();
    const mensaje = (form.mensaje?.value || '').trim();
    const status  = document.getElementById('form-status');

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nombre || !emailOK || !mensaje) {
      if (status) {
        status.textContent = 'Por favor completa todos los campos con un email válido.';
        status.style.color = 'crimson';
      }
      return;
    }

    if (status) {
      status.textContent = '¡Listo! Abriendo tu gestor de correo…';
      status.style.color = 'seagreen';
    }

    // Correo destino: toma del atributo data-to del formulario; si no, usa el tuyo por defecto
    const to = form.getAttribute('data-to') || 'pablodavidgomezv@gmail.com';
    const subject = encodeURIComponent(`Contacto CV — ${nombre}`);
    const body    = encodeURIComponent(`${mensaje}\n\n${nombre} — ${email}`);

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    form.reset();
  });
}




// ===== Acordeón (solo uno abierto) =====
const toggles = Array.from(document.querySelectorAll('.acc-toggle'));
const panels  = toggles.map(btn => document.getElementById(btn.getAttribute('aria-controls')));

// Cierra todas
function closeAll() {
  toggles.forEach((btn, i) => {
    btn.setAttribute('aria-expanded', 'false');
    if (panels[i]) panels[i].hidden = true;
  });
}

// Abrir una
function openOne(idx) {
  toggles[idx].setAttribute('aria-expanded', 'true');
  if (panels[idx]) panels[idx].hidden = false;
}

// Click: cierra otras y abre la seleccionada (o cierra si ya estaba abierta)
toggles.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    closeAll();
    if (!isOpen) openOne(idx);
  });
});

// Opcional: abre la primera por defecto
// if (toggles.length) openOne(0);
