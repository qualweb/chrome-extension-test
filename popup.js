(async () => {
  function load() {
    const getUrl = document.getElementById('getUrl');
    getUrl.onclick = function(element) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        document.getElementById('url').innerHTML = "URL: " + tabs[0].url;
        const puppeteer = require('puppeteer');
        puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' })
          .then(browser => {
            browser.pages()
              .then(pages => {
                document.getElementById('n_pages').innerHTML = 'Nº of pages: ' + pages.length;
              });
          })      
      });
    };
  }
  
  load();
})();