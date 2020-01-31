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
               let act= new ACTRules.ACTRules();
               act.execute({},pages[0],[]).then(result =>{
                  document.getElementById('n_pages').innerHTML = 'Nº of pages: teste ' + JSON.stringify(result);
                })
                
              });
          })      
      });
    };
  }
  
  load();
})();