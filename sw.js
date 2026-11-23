// 아이폰 홈 화면 웹앱용 오프라인 캐시.
// - 화면(index.html): 인터넷이 되면 항상 새로 받아서(업데이트 반영), 안 되면 저장해 둔 것으로 열기
// - 그 외 파일(js·css·글꼴·아이콘): 한 번 받으면 저장해 두고 그대로 사용 (파일 이름에 버전이 붙어 있어 안전)
const CACHE = 'gwangeuk-v1';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './icons/icon-180.png'])).catch(() => {}));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./', copy));
        return res;
      }).catch(() => caches.match('./')),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })),
  );
});
