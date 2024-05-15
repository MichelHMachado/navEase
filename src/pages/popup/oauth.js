chrome.runtime.sendMessage({
  type: 'oauth',
  url: window.location.href,
});

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'SENDING_ACCESS_TOKEN') {
    setTimeout(() => {
      window.close();
    }, 1000);
  }
  console.log('message in ouath.js: ', message);
});
