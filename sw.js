// TINA Pet Spa – service worker
// 1) Lưu app vào máy để mở được khi mất mạng (luôn thử tải bản mới trước).
// 2) Nhận thông báo nhắc lịch: máy chủ chỉ gửi "tín hiệu", nội dung lấy từ Apps Script.
const CACHE = 'tina-web-v13';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});

/* ---------- Thông báo ---------- */
function idb(mode, fn) {
  return new Promise((res, rej) => {
    const r = indexedDB.open('tina-spa', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onerror = () => rej(r.error);
    r.onsuccess = () => {
      const t = r.result.transaction('kv', mode), st = t.objectStore('kv');
      const q = fn(st);
      t.oncomplete = () => res(q && q.result);
      t.onerror = () => rej(t.error);
    };
  });
}
const idbGet = k => idb('readonly', st => st.get(k));
const idbSet = (k, v) => idb('readwrite', st => st.put(v, k));

async function fetchNotices(cfg, since, endpoint) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(cfg.url, {
      method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'notices', key: cfg.key, since, endpoint })
    });
    const j = await r.json();
    return j.ok ? j.notices || [] : null;
  } catch (e) { return null; } finally { clearTimeout(timer); }
}

async function handlePush() {
  const cfg = await idbGet('tina-sync-cfg').catch(() => null);
  const since = Number(await idbGet('tina-push-seen').catch(() => 0)) || 0;
  const sub = await self.registration.pushManager.getSubscription().catch(() => null);
  let list = cfg && cfg.url && cfg.key ? await fetchNotices(cfg, since, sub && sub.endpoint) : null;
  const opts = { icon: 'icon-192.png', badge: 'icon-192.png', data: { url: './' } };
  if (!list || !list.length) {
    // iPhone bắt buộc phải hiện thông báo mỗi khi nhận tín hiệu
    return self.registration.showNotification('TINA Pet Spa', { ...opts, body: 'Có nhắc lịch mới – mở app để xem', tag: 'tina-generic' });
  }
  list = list.slice(-4);
  await idbSet('tina-push-seen', list[list.length - 1].at).catch(() => {});
  for (const n of list) {
    await self.registration.showNotification(n.title, { ...opts, body: n.body, tag: n.id });
  }
}

self.addEventListener('push', e => { e.waitUntil(handlePush()); });

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
