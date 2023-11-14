async function blurContent() {
    await chrome.storage.sync.get(null, function(all) {
      console.log(all);
      var adult = all["adult"];
      var violence = all["violence"];
      var medical = all["medical"];
      var racy = all["racy"];
      var spoof = all["spoof"];
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
      if (all["image"]) {
        $('img').each(function() {
          if (this.alt) {
            if (violence && violenceWords.some((word) => this.alt.toLowerCase().includes(word))) {
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
            } else if (adult && adultWords.some((word) => this.alt.toLowerCase().includes(word))) {
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
            } else if (medical && medicalWords.some((word) => this.alt.toLowerCase().includes(word))) {
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
            } else if (racy && racyWords.some((word) => this.alt.toLowerCase().includes(word))) {
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
            } else if (spoof && spoofWords.some((word) => this.alt.toLowerCase().includes(word))) {
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
      }
      if (all["text"]) {
        $('p').each(function() {
          if (this.innerHTML) {
            if (violence && violenceWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
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
            } else if (adult && adultWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
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
            } else if (medical && medicalWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
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
            } else if (racy && racyWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
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
            } else if (spoof && spoofWords.some((word) => this.innerHTML.toLowerCase().includes(word))) {
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
  

window.onload = function () {
    chrome.storage.sync.get("blocking", ({blocking}) => {
    //   blockSlider.checked = blocking;
    // });
    // chrome.storage.sync.get('blocking', function (data) {
      alert('test', String(blocking));
      console.log('gere')
      console.log(blocking);
      if (blocking) {
        blurContent()
      } else {
        unblurContent()
      }
    })
  }