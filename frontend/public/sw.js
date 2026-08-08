self.addEventListener('push', (event) => {
  let data = { title: 'GrowTrack Pro', body: 'Tenés una novedad en tu cultivo.' };
  try {
    data = event.data.json();
  } catch (e) {
    // si no viene como JSON, usamos el default de arriba
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
