chrome.runtime.sendMessage({
  type: 'oauth',
  url: window.location.href,
});

setTimeout(() => {
  window.close();
}, 1000);
