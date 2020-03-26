function pageDispatcher() {
    chrome.storage.sync.get('disable_link_preview', function(settings) {
        if (!settings['disable_link_preview']) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                let tab = tabs[0];
                let url = tab.url;
                if (url.indexOf('www.google') > -1) {
                    parseGoogleResults();
                } else if (url.indexOf('duckduckgo.com') > -1) {
                    parseDuckDuckGoResults();
                } else if (url.indexOf('reddit.com') > -1) {
                    // do nothing because obviously the links are being discussed on Reddit
                } else if (url.indexOf('http') > -1) {
                    parseDefault();
                }
            });
        }
    });
}

function parseDefault() {
    chrome.tabs.executeScript({
        file: `js/page/parse/default.js`
    }, displayResults);
}

function parseGoogleResults() {
    chrome.tabs.executeScript({
        file: `js/page/parse/google.js`
    }, displayResults);
}

function parseDuckDuckGoResults() {
    chrome.tabs.executeScript({
        file: `js/page/parse/duckduckgo.js`
    }, displayResults);
}

function displayResults(href) {
    // given a list of hrefs, display the number of Thredd results on the page
    // use reduce instead of foreach to prevent sending too many simultaneous requests
    // https://www.heavymetalcoder.com/make-array-foreach-synchronous-even-with-an-asynchronous-body/
    href[0].reduce((accumulator, url) => {
        return accumulator
        .then(() => searchURL(url))
        .then(listing => {
            const display_js = `
                var a = document.querySelectorAll('a[href="${url}"]');
                var existing_thredd = document.getElementById('${url}');
                if ((!existing_thredd || existing_thredd.className !== 'thredd_results')
                    && ${listing.length} > 0) {
                    var thredd_results = document.createElement('span');
                    thredd_results.id = '${url}';
                    thredd_results.setAttribute('class', 'thredd_results');
                    thredd_results.setAttribute('style', 'margin-left: 1%; position: relative; padding-bottom: 0.5em;');
                    // Reset CSS
                    // https://perishablepress.com/a-killer-collection-of-global-css-reset-styles/
                    thredd_results.style.verticalAlign = 'baseline';
                    thredd_results.style.float = 'none';
                    thredd_results.style.fontWeight = 'inherit';
                    thredd_results.style.fontFamily = 'inherit';
                    thredd_results.style.fontStyle = 'inherit';
                    thredd_results.style.fontSize = '100%';
                    thredd_results.style.border = '0 none';
                    thredd_results.style.outline = '0';
                    thredd_results.title = '${listing.length} Thredd results!';
                    var thredd_logo = document.createElement('img');
                    thredd_logo.src = chrome.extension.getURL("images/thredd256.png");;
                    thredd_logo.setAttribute('style', 'display: inline; height: 1em!important; width: auto;');
                    thredd_results.appendChild(thredd_logo);
                    var thredd_num = document.createElement('strong');
                    // Thredd-specific styles
                    thredd_num.style.background = 'rgb(236, 19, 19)';
                    thredd_num.style.borderRadius = '20%/40%';
                    thredd_num.style.color = 'white';
                    thredd_num.style.display = 'inline';
                    thredd_num.style.fontSize = '0.6em';
                    thredd_num.style.marginRight = '0.5%';
                    thredd_num.style.padding = '0.25em';
                    thredd_num.style.textAlign = 'center';
                    thredd_num.textContent = ' ${listing.length}';
                    thredd_results.appendChild(thredd_num);
                    a.forEach(elem => elem.appendChild(thredd_results));
                }
            `;
            chrome.tabs.executeScript({
                code: display_js
            });
        });
    }, Promise.resolve());
}

module.exports = {
    pageDispatcher: pageDispatcher
};
