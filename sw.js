// Guarda la pantalla en el dispositivo para abrirla sin señal.
const CACHE = 'seguimiento-ciclo-v1';
const ARCHIVOS = [
  './', 'index.html', 'styles.css', 'app.js',
  'assets/img/iconSIMAIZ.png', 'assets/img/header-banner.png',
  'assets/fonts/Patria_Bold.woff2', 'assets/fonts/NotoSans-Regular.woff2', 'assets/fonts/NotoSans-SemiBold.woff2', 'assets/fonts/NotoSans-Bold.woff2',
  'assets/icons/menu-inicio.svg', 'assets/icons/menu-datos-tecnico.svg', 'assets/icons/menu-registro-comunidad.svg', 'assets/icons/menu-gestion-comunidad.svg',
  'assets/icons/menu-documental-rastreo.svg', 'assets/icons/menu-formatos.svg', 'assets/icons/menu-usuario.svg',
];

self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Red primero (para ver cambios publicados); si no hay señal, lo guardado.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
