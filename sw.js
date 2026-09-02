const CACHE='marinafit-v78';
const ASSETS=['./','./index.html','./styles.css','./publish-fix.css','./mobile-fix.css','./assessment.css','./training.css','./improvements.css','./app.js','./training.js','./manifest.webmanifest','./assets/marinafit-icon-192.png','./assets/marinafit-icon-512.png','./assets/exercise-atlas-v1.png','./assets/exercise-push-atlas-v1.png','./assets/exercise-pull-atlas-v1.png','./assets/exercise-legs-atlas-v1.png','./assets/exercise-core-atlas-v1.png','./assets/exercise-motion-push-v1.png','./assets/exercise-motion-pull-v1.png','./assets/exercise-motion-legs-v1.png','./assets/exercise-motion-core-v1.png','./assets/exercise-motion-shoulders-v1.png','./assets/exercise-academy-push-arms-v1.png','./assets/exercise-academy-back-shoulders-v1.png','./assets/exercise-academy-legs-v1.png','./assets/exercise-calisthenics-push-pull-v1.png','./assets/exercise-calisthenics-legs-core-v1.png','./assets/exercise-pilates-mat-v1.png','./assets/exercise-diastasis-gentle-v3.png','./assets/exercise-elastics-v1.png','./assets/exercise-academy-complete-v1.png','./assets/exercise-academy-arms-v1.png','./assets/exercise-calisthenics-complete-v1.png','./assets/exercise-care-foundations-v1.png','./assets/exercise-toe-taps-v5.png','./assets/exercise-care-mobility-v1.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
