document.addEventListener("DOMContentLoaded", 
    function(event) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            document.getElementById('URL').innerHTML = tabs[0].url;
        });
        document.getElementById('getUrl').onclick = function(element) {
            chrome.runtime.sendMessage({message:"clickedStartPopup"})
        }
    }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "resultsToPopup") {
    }
  }
);