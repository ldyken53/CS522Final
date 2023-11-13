var checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

var changePassword = document.getElementById("changePassword");
changePassword.onclick = async function (evt) {
  if (!inpLock.checked) {
    var password = document.getElementById("password");
    chrome.storage.sync.set({"password": password.value});
    alert("Password changed!");
    password.value = "";
  } else {
    alert("Must be unlocked to change password!");
  }
}

var clearHistory = document.getElementById("clearHistory");
clearHistory.onclick = async function (evt) {
  if (!inpLock.checked) {
    chrome.storage.local.clear();
    alert("History cleared!");
  } else {
    alert("Must be unlocked to clear history!");
  }
}

var viewHistory = document.getElementById("viewHistory");
viewHistory.onclick = async function (evt) {
  if (!inpLock.checked) {
    chrome.storage.local.get(null, function(all) {
        var newWindow = window.open("","Test","width=2000,height=1000,scrollbars=1,resizable=1");
        var html = "<html><head></head><body><b>" + JSON.stringify(all) + "</b> </body></html>";
        newWindow .document.open()
        newWindow .document.write(html)
        newWindow .document.close()
    });
  } else {
    alert("Must be unlocked to view history!");
  }
}

var inpLock = document.getElementById("inpLock");
chrome.storage.sync.get("locked", ({locked}) => {
  inpLock.checked = locked;
});
inpLock.onchange = async function (evt) {
  if (!inpLock.checked) {
    var pass = prompt("Enter password:");
    chrome.storage.sync.get("password", ({ password }) => {
      if (pass != password) {
        alert("Password incorrect!");
        inpLock.checked = true;
      } else {
        chrome.storage.sync.set({"locked": false});
      }
    });
  } else {
    chrome.storage.sync.set({"locked": true});
  }
}

var blockSlider = document.getElementById("slider");
chrome.storage.sync.get("blocking", ({blocking}) => {
  blockSlider.checked = blocking;
});
blockSlider.onchange = async function (evt) {
  if (!blockSlider.checked) {
    if (inpLock.checked) {
      alert("Must be unlocked to turn off content blocking!");
      blockSlider.checked = true;
    } else {
      chrome.storage.sync.set({"blocking": false});
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: unblurContent
      });
    }
  } else {
    chrome.storage.sync.set({"blocking": true});
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: blurContent
    });
  }
}

function blurContent() {
  const violenceWords = ["gun", "soldier", "shooter", "kill", "tank", "troop", "bodies"];
  const adultWords = ["sex", "naked", "breast"];
  const medicalWords = ["blood", "ray", "mri", "doctor", "needle", "nurse", "hospital"];
  const racyWords = ["bikini", "lingerie", "underwear", "leggings"];
  const spoofWords = ["meme"];
  function addBlockText(element, blockText, id) {
    var parentPosition = $(element).parent().css('position');
    if (parentPosition !== 'relative' && parentPosition !== 'absolute' && parentPosition !== 'fixed') {
        $(element).parent().css('position', 'relative');
    }
    var agreeButton = $(`<button id=agree${id} class="agree-button">Agree</button>`);
    var disagreeButton = $(`<button id=disagree${id} class="disagree-button">Disagree</button>`);
    agreeButton.css({"background-color": "green", "color": "white", "border-radius": "2px","margin-left": "2px", "height": "30px", "width": "100px"});
    disagreeButton.css({"background-color": "red", "color": "white", "border-radius": "2px", "margin-left": "2px", "height": "30px", "width": "100px"});
    
    // Append buttons to the parent container
    $(element).before(agreeButton);
    $(element).before(disagreeButton);
    $(element).before(blockText);
    $(`#agree${id}`).click(function() {
      chrome.storage.local.get(id, (obj) => {
        alert("Agreement recorded!");
        var newLog = obj;
        newLog[id]["feedback"] = "agree";
        chrome.storage.local.set(newLog);
      });
    });
    $(`#disagree${id}`).click(function() {
      chrome.storage.local.get(id, (obj) => {
        alert("Disagreement recorded!");
        var newLog = obj;
        newLog[id]["feedback"] = "disagree";
        chrome.storage.local.set(newLog);
      });
    });
  }
  $('img').each(function() {
    if (this.alt) {
      if (violenceWords.some((word) => this.alt.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "image",
          "content": "violence",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(0deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This image has been blocked for violent content</h3>');
        addBlockText(this, blockText, id);
      } else if (adultWords.some((word) => this.alt.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "image",
          "content": "adult",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(190deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This image has been blocked for adult content</h3>');
        addBlockText(this, blockText, id);
      } else if (medicalWords.some((word) => this.alt.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "image",
          "content": "medical",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(90deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This image has been blocked for medical content</h3>');
        addBlockText(this, blockText, id);
      } else if (racyWords.some((word) => this.alt.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "image",
          "content": "racy",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(270deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This image has been blocked for racy content</h3>');
        addBlockText(this, blockText, id);
      } else if (spoofWords.some((word) => this.alt.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "image",
          "content": "spoof",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(60deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This image has been blocked for spoof content</h3>');
        addBlockText(this, blockText, id);
      }
    }
  });
  $('p').each(function() {
    if (this.innerHTML) {
      if (violenceWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "text",
          "content": "violence",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(0deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This text has been blocked for violent content</h3>');
        addBlockText(this, blockText, id);
      } else if (adultWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "text",
          "content": "adult",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(190deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This text has been blocked for adult content</h3>');
        addBlockText(this, blockText, id);
      } else if (medicalWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "text",
          "content": "medical",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(90deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This text has been blocked for medical content</h3>');
        addBlockText(this, blockText, id);
      } else if (racyWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "text",
          "content": "racy",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(270deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This text has been blocked for racy content</h3>');
        addBlockText(this, blockText, id);
      } else if (spoofWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
        var jsonLog = {
          "type": "text",
          "content": "spoof",
          "time": new Date().toISOString(),
          "feedback": "none",
          "url": window.location.href
        };
        var id = Date.now().toString();
        var event = {};
        event[id] = jsonLog;
        chrome.storage.local.set(event);
        $(this).css('filter', 'blur(20px) sepia(100%) hue-rotate(60deg) saturate(900%)');
        var blockText = $('<h3 class="block-text">This text has been blocked for spoof content</h3>');
        addBlockText(this, blockText, id);
      }
    }
  });
  
}

var unblurContent=function(){
  $('.block-text').remove();
  $('.agree-button').remove();
  $('.disagree-button').remove();
  $('img').each(function() {
    $(this).css('filter', 'none');
  });
  $('p').each(function() {
    $(this).css('filter', 'none');
  });
}

var categories = {
  "adult": true,
  "violence": true,
  "racy": true,
  "medical": false,
  "spoof": false
};
Object.keys(categories).forEach((category) => {
  var check = document.getElementById(category);
  chrome.storage.sync.get(category, (obj) => {
    check.checked = obj[category];
    categories[category] = obj[category];
  });
  check.onchange = async function (evt) {
    if (!check.checked) {
      if (inpLock.checked) {
        alert("Must be unlocked to unblock a category!");
        check.checked = true;
      } else {
        categories[category] = false;
        chrome.storage.sync.set(categories);
      }
    } else {
      categories[category] = true;
      chrome.storage.sync.set(categories);
    }
  }
});