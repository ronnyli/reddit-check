function pageDispatcher() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        let tab = tabs[0];
        let url = tab.url;
        if (url.indexOf('www.google') > -1) {
            parseGoogleResults();
        } else if (url.indexOf('duckduckgo') > -1) {
            parseDuckDuckGoResults();
        } else {
            parseDefault();
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

function parseDuckDuckGoResults(){
    chrome.tabs.executeScript({
        code: `document.getElementsByClassName('result__a');`
    }, function(href) {
        var loader = document.createElement('div');
        loader.className = 'loader';
        href.forEach(elem => {
            console.log(elem);
            // elem.insertAdjacentElement('afterend', loader);
        })
    });
}

function displayResults(href) {
    // given a list of hrefs, display the number of Thredd results on the page
    // use reduce instead of foreach to prevent sending too many simultaneous requests
    // https://www.heavymetalcoder.com/make-array-foreach-synchronous-even-with-an-asynchronous-body/
    href[0].reduce((accumulator, url) => {
        return accumulator
        .then(() => searchURL(url))
        .then(listing => {
            // TODO: append Thredd logo
            // TODO: open overlay.js when clicked
            const display_js = `
                var a = document.querySelectorAll('a[href="${url}"]');
                var existing_thredd = document.getElementById('${url}');
                if (!existing_thredd || existing_thredd.className !== 'thredd_results') {
                    var thredd_results = document.createElement('div');
                    thredd_results.id = '${url}';
                    thredd_results.setAttribute('class', 'thredd_results');
                    thredd_results.textContent = '${listing.length} Thredd results';
                    a.forEach(elem => elem.insertAdjacentElement('afterend', thredd_results));
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