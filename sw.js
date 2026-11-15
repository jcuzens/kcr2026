// sw.js — the page's service worker (built into the site root by
// build_page.py, published as a 4th artifact). It is the only code that runs
// with the page closed: a push message becomes a notification, and a click
// focuses the open page or opens the site. The push payload is
// {n, title, text} from the push worker (push/worker.js).
"use strict";
self.addEventListener("push", (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch (err) {
    d = { title: e.data ? e.data.text() : "" };
  }
  const n = d.n != null ? String(d.n) : "";
  const title = d.title || (n ? "Class " + n + " is up next" : "Show update");
  e.waitUntil(self.registration.showNotification(title, {
    body: d.text || "",
    tag: "kcr2026" + (n ? "-" + n : ""),
    data: { url: self.location.origin + "/" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.location.origin + "/";
  e.waitUntil(self.clients.matchAll({ type: "window" }).then((ws) => {
    for (const w of ws) { w.focus(); return; }
    return self.clients.openWindow(url);
  }));
});
