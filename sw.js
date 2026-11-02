// Deixa o TemAí? abrir sem internet. Arquivos do próprio site: busca a versão nova na rede
// e, sem rede, usa a última guardada. Fontes do Google: guardadas depois da primeira vez.
// Firebase e login do Google passam direto (o próprio Firebase guarda os dados no aparelho).
const VERSAO = 'temai-2026.11.02-2';
const FONTES = 'temai-fontes';
const BASE = new URL('./', self.location).href;
const ESSENCIAIS = ['./', 'index.html', 'firebase.js', 'config.js', 'manifest.webmanifest', 'icons/favicon.svg', 'icons/icon-192.png'];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSAO)
      .then((c) => c.addAll(ESSENCIAIS.map((p) => new Request(p, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('temai-') && k !== VERSAO && k !== FONTES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin && url.href.startsWith(BASE)) ev.respondWith(redePrimeiro(req));
  else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') ev.respondWith(guardadoPrimeiro(req));
});

async function redePrimeiro(req) {
  const cache = await caches.open(VERSAO);
  try {
    const resp = await fetch(req, { cache: 'no-cache' });
    if (resp && resp.ok && resp.type === 'basic') cache.put(req, resp.clone());
    return resp;
  } catch (erro) {
    const guardado = (await cache.match(req, { ignoreSearch: true }))
      || (req.mode === 'navigate' ? (await cache.match('./')) || (await cache.match('index.html')) : undefined);
    if (guardado) return guardado;
    throw erro;
  }
}

async function guardadoPrimeiro(req) {
  const cache = await caches.open(FONTES);
  const guardado = await cache.match(req);
  if (guardado) return guardado;
  const resp = await fetch(req);
  if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
  return resp;
}
