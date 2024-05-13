chrome.runtime.sendMessage({
  type: 'oauth',
  url: window.location.href,
});

window.close();
