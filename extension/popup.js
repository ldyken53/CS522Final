// Initialize button with users' preferred color
const changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get('color', ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

var checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

/**
 * Enabling logic here ->
 */

// Get State of toggle button
var isExtensionEnabledSwitch = document.getElementById('isEnabled');

//on init update the UI checkbox based on storage
chrome.storage.sync.get('isCensoringEnabled', function(data) {
  isExtensionEnabledSwitch.checked=data.isCensoringEnabled;
});

isExtensionEnabledSwitch.onchange = function(element) {
  let value = this.checked;

  //update the extension storage value
  chrome.storage.sync.set({'isCensoringEnabled': value}, function() {
    console.log('The value is'+ value);
  });

  //Pass init or remove message to content script 
  if(value){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "init", isCensoringEnabled: value}, function(response) {
                    console.log(response.result);
                });
    });
  }else{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "remove", isCensoringEnabled: value}, function(response) {
                    console.log(response.result);
      });
    });
  }

};