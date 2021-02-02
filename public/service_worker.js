self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      return fetch('/api/user//add_push_subscription', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(subscription.endpoint)
      });
    })
  );
});


self.addEventListener('notificationclick', function(event) {
  const url = event.notification.data.url;
  console.log('On notification click: ', event.notification);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});