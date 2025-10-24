// Service Worker para GeraMapa PWA
// Estratégia: Stale While Revalidate (mostra cache + atualiza em background)

const CACHE_NAME = 'geramapa-v1.0.0';
const STATIC_CACHE = 'geramapa-static-v1.0.0';
const DYNAMIC_CACHE = 'geramapa-dynamic-v1.0.0';

// Recursos para cache inicial (críticos para funcionamento offline)
const STATIC_ASSETS = [
  '/geramapa/',
  '/geramapa/src/index.html',
  '/geramapa/src/styles.css',
  '/geramapa/src/app.js',
  '/geramapa/src/map.js',
  '/geramapa/src/ai.js',
  '/geramapa/src/storage.js',
  '/geramapa/src/layout-algorithm.js',
  '/geramapa/src/marker-system.js',
  '/geramapa/src/new-layout-handler.js',
  '/geramapa/src/libs/cytoscape.min.js',
  '/geramapa/src/libs/marked.min.js',
  '/geramapa/src/libs/jspdf.min.js',
  '/geramapa/manifest.json',
  '/geramapa/icons/icon-192x192.png',
  '/geramapa/icons/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cacheando recursos estáticos...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service Worker instalado e recursos cacheados!');
        return self.skipWaiting(); // Ativar imediatamente
      })
      .catch((error) => {
        console.error('[SW] Erro ao cachear recursos:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remover caches antigos
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker ativado!');
        return self.clients.claim(); // Controlar todas as páginas imediatamente
      })
  );
});

// Estratégia de fetch: Stale While Revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições de extensões do Chrome
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Ignorar requisições de APIs externas (fetch sempre da rede)
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Se falhar (offline), tentar cache
          return caches.match(request);
        })
    );
    return;
  }
  
  // Stale While Revalidate para recursos locais
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        // Buscar da rede em background e atualizar cache
        const fetchPromise = fetch(request).then((networkResponse) => {
          // Só cachear respostas válidas
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((error) => {
          console.log('[SW] Fetch falhou, usando cache:', request.url);
          return cachedResponse; // Fallback para cache se fetch falhar
        });
        
        // Retornar cache imediatamente (se existir), atualizar em background
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Listener para sincronização em background (futuro)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-maps') {
    event.waitUntil(
      // Implementar sincronização de mapas salvos quando voltar online
      Promise.resolve()
    );
  }
});

// Listener para notificações push (futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/geramapa/icons/icon-192x192.png',
    badge: '/geramapa/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'geramapa-notification',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('GeraMapa', options)
  );
});

// Log de erros
self.addEventListener('error', (event) => {
  console.error('[SW] Erro no Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Promise rejeitada não tratada:', event.reason);
});

console.log('[SW] Service Worker carregado!');

