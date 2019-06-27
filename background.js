const url_utils = require('./js/URL_utils');

// Bug with lscache when Thredd is updated:
// pre-existing cached items lose the -cacheexpiration suffix so
// lscache doesn't know to flush them
lscache.flush();

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
        file: 'overlay.js'
    });
});

// update on URL update
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    changeAction(tab)
});

// update on selection change
chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
    chrome.tabs.getSelected(null, function(tab){
        changeAction(tab)
    });
});

function changeAction(tab) {
    url_utils.getTabUrl(function(url) {
        if (lscache.get(DEDUPE_KEY + url + tab.id) != null) {
            const posts = lscache.get(URL_STORAGE_KEY + url);
            updateBadge(posts.length, tab);
            return // dupe
        }
        chrome.storage.sync.get('run_on_click', function(settings) {
            if (settings['run_on_click']) {
                setBadge(
                    'Click to search Thredd',
                    '?',
                    [150, 150, 150, 200],  // grey
                    tab);
            } else {
                const fake_tab = {
                    url: url,
                    id: tab.id
                };
                lscache.set(DEDUPE_KEY + url + tab.id, "", 2)
                isBlacklisted(fake_tab, disableBadge, getURLInfo)
            }
        });
    });
}

function getURLInfo(tab, override_url){
    const url = override_url || tab.url;
    var posts = lscache.get(URL_STORAGE_KEY + url);
    if (posts != null) {
        updateBadge(posts.length, tab);
        return new Promise(function(resolve, reject) {
            resolve(SubmissionCollectionLscache.get(url) || []);
        });
    } else if (tab.url.indexOf('http') == -1) {
        return new Promise(function(resolve, reject) {
            resolve([]);
        });
    } else {
        const trimmed_url = url_utils.trimURL(url, http_only=true);
        return Promise.all([
            snoo.searchCommentsForURL(trimmed_url),
            snoo.searchSubmissionsForURL(trimmed_url)])
        .then(values => {
            return [].concat.apply([], values);
        })
        .then(function(listing) {
            updateBadge(listing.length, tab);
            SubmissionLscache.insert(listing, url);
            return listing;
        });
    }
}
global.getURLInfo = getURLInfo;

function disableBadge(tab){
    var title = "Not running on this page"
    var text = "X"
    var badgeColor = [150, 150, 150, 200];  // grey
    setBadge(title, text, badgeColor, tab)
}

function updateBadge(numPosts, tab) {
    var title = numPosts.toString() + " Results Found!"
    var text = numPosts.toString()
    var badgeColor = [236, 19, 19, 200];  // red
    let flash = true;
    if (numPosts == 0) {
        text = '';
        title = 'Thredd';
        flash = false;
    }
    setBadge(title, text, badgeColor, tab, flash);
}

function setBadge(title, text, badgeColor, tab, flash=false) {
    var tabId = tab.id
    chrome.browserAction.setTitle({"title": title, "tabId": tabId})
    !badgeColor || chrome.browserAction.setBadgeBackgroundColor({
        "color": badgeColor, 
        "tabId": tabId
    })
    chrome.browserAction.setBadgeText({
        "text": text,
        "tabId": tabId
    })
    if (flash) {
        flashBadge(text, tabId);
    }
}

function flashBadge(text, tabId) {
    chrome.storage.sync.get('disable_flashing_notification', function(settings) {
        if (!(settings['disable_flashing_notification'])) {
            const flashInterval = setInterval(function() {
                setTimeout(function() {
                    chrome.browserAction.setBadgeText({
                        "text": text,
                        "tabId": tabId
                    });
                }, 333);
                chrome.browserAction.setBadgeText({
                    "text": '',
                    "tabId": tabId
                });
            }, 666);
            setTimeout(function() {
                clearInterval(flashInterval);
            }, 333 * 6);
        }
    });
}

global.snoo = require('./js/snoowrap_background');  // global to access snoo in other files
snoo.fetchAnonymousToken();

function onRequest(request, sender, callback) {
    console.log(request);
    if (request.action == 'logInReddit') {
        snoo.logInReddit(request.interactive, callback);
        return true;
    } else if (request.action == 'submitPost') {
        snoo.submitPost(request.subreddit, request.title, request.url, callback);
        return true;
    } else if (request.action == 'getCurrentUserName') {
        snoo.getCurrentUserName(callback);
        return true;
    } else if (request.action == 'searchSubreddits') {
        snoo.searchSubreddits(request.query, callback);
        return true;
    } else if (request.action == 'getSubmission') {
        snoo.getSubmission(request.id, callback);
        return true;
    } else if (request.action == 'leaveComment') {
        snoo.leaveComment(request.id,
            request.text,
            request.replyable_content_type,
            callback);
        return true;
    } else if (request.action == 'removeReddit') {
        snoo.removeReddit(request.id,
            request.replyable_content_type,
            callback);
        return true;
    } else if (request.action == 'saveReddit') {
        snoo.saveReddit(request.id,
            request.save_type,
            request.replyable_content_type,
            callback);
        return true;
    } else if (request.action == 'voteReddit') {
        snoo.voteReddit(request.id,
            request.vote_type,
            request.replyable_content_type,
            callback);
        return true;
    }
}

chrome.runtime.onMessage.addListener(onRequest);

/* Check whether new version is installed */
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install" || details.reason == 'update') {
        const uninstallGoogleFormLink = 'http://thredd.io/uninstall-survey/';
        /* If Chrome version supports it... */
        if (chrome.runtime.setUninstallURL) {
            chrome.runtime.setUninstallURL(uninstallGoogleFormLink);
        }
    }
    if (details.reason == 'install') {
        chrome.tabs.create({ url: 'http://thredd.io/thank-you/' });
    }
});
