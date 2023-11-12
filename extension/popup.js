// Initialize button with users' preferred color
const changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', ({ color }) => {
  console.log(color);
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
  chrome.storage.sync.get('password', ({ password }) => {
    console.log(password);
  });
}

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
    }
  } else {
    chrome.storage.sync.set({"blocking": true});
  }
}

var categories = {
  "adult": true,
  "violence": true,
  "racy": true,
  "medical": false,
  "spoof": false
};
Object.keys(categories).forEach((category) => {
  console.log(category);
  var check = document.getElementById(category);
  chrome.storage.sync.get(category, (obj) => {
    console.log(category, obj);
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