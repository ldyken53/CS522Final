const color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({isCensoringEnabled: true}, function() {
    console.log("Censor image is on");
  });
});

// chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//   chrome.declarativeContent.onPageChanged.addRules([{
//     // conditions: [new chrome.declarativeContent.PageStateMatcher({
//     //   pageUrl: {hostEquals: 'www.quora.com'},
//     // })
//     // ],
//     actions: [new chrome.declarativeContent.ShowPageAction()]
//   }]);
// });
