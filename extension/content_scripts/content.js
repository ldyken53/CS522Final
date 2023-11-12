
//find all the image in answer feed,thumbnail and ad feeds and add blurclasses
var blurImage = function(){
    // $("img").each(function(index, element) {
    //     $(element).wrap('<div class=censoring-tool-bounding-box"></div>')
    // });
    $("img").each(function(index, element) {
        $(element).replaceWith(
            "<div class='censor-container'>" + element.outerHTML + "<div class='censor-overlay'><span class='censor-icon material-symbols-outlined'>visibility_off</span><span class='censor-title'>Content Warning - Adult</span><span class='censor-description'>This image has been hidden because it might contain adult content.</span><button class='censor-button'>Request uncensoring?</button></div></div>"
        );
    });
}

//find all the image in answer feed,thumbnail and ad feeds and remove blurclasses
var unblurImage=function(){
    $('.answer_body_preview').find("img").removeClass('blurimage');
    $('.ui_layout_thumbnail').removeClass('blurthumb');
    $('.HyperLinkFeedStory ').find("img").removeClass('blurimage');
    $('.hyperlink_image').removeClass('blurthumb');
}

var addListeners=function(){
    blurImage();
}

var removeListeners=function(){
    unblurImage();
}

//message listener for background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)    {
    if(request.command === 'init'){
        addListeners();
    }else{
        removeListeners();
    }
    sendResponse({result: "success"});
});

//on init perform based on chrome stroage value
window.onload=function(){  
    chrome.storage.sync.get('isCensoringEnabled', function(data) {
        if(data.isCensoringEnabled){
            addListeners();
        }else{
            removeListeners();
        } 
    });
}
