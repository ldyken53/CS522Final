const password = 'password';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ password });
  console.log('Default password set to password');
  chrome.storage.sync.set({"locked": true, "blocking": false});
});
