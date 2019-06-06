const url_utils = require('./js/URL_utils');
const page = require('./js/page/page');

// Bug with lscache when Thredd is updated:
// pre-existing cached items lose the -cacheexpiration suffix so
// lscache doesn't know to flush them
lscache.flush();

// update on URL update
chrome.tabs.onUpdated.addListener(function(tabId, changeinfo, tab) {
    const url = tab.url;
    if (url !== undefined && changeinfo.status == "complete") {
        // Put changeAction in this conditional to prevent it from firing
        // multiple times per tab
        // Source: https://stackoverflow.com/a/6168149/10928982
        changeAction(tab);
    }
});

// update on selection change
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        changeAction(tabs[0]);
    });
});

function changeAction(tab) {
    // Determine whether notificationPopup() should run
    // Leave this logic outside of url_utils.getTabUrl so it runs
    // before notificationPopup() has a chance to evaluate
    if (tab.url.indexOf('www.google') > -1) {
        lscache.set('google_search', true, 5);
    } else if (lscache.get('google_search')) {
        lscache.set('google_search', false, 5);
        lscache.set('trigger_notification', true, 5);
    }
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
    page.pageDispatcher(tab.url);
}

function getURLInfo(tab, override_url){
    const url = override_url || tab.url;
    if (tab.url.indexOf('http') == -1) {
        return new Promise(function(resolve, reject) {
            resolve([]);
        });
    } else {
        return searchURL(url)
        .then(listing => {
            updateBadge(listing.length, tab);
            notificationPopup(listing.length);
        })
    }
}
global.getURLInfo = getURLInfo;

function searchURL(url_raw) {
    var posts = lscache.get(URL_STORAGE_KEY + url_raw);
    if (posts != null) {
        return new Promise(function(resolve, reject) {
            resolve(SubmissionCollectionLscache.get(url_raw) || []);
        });
    } else {
        const trimmed_url = url_utils.trimURL(url_raw, http_only=true);
        return Promise.all([
            snoo.searchCommentsForURL(trimmed_url),
            snoo.searchSubmissionsForURL(trimmed_url)])
        .then(values => {
            return [].concat.apply([], values);
        })
        .then(function(listing) {
            SubmissionLscache.insert(listing, url_raw);
            return listing;
        });
    }
}
global.searchURL = searchURL;

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

function notificationPopup(num_results) {
    chrome.storage.sync.get('disable_popup_notification', function(settings) {
        if (!(settings['disable_popup_notification'])) {
            if (lscache.get('trigger_notification')) {
                lscache.set('trigger_notification', false, 5);
                if (num_results) {
                    chrome.notifications.create('thredd_notification', {
                        type: "basic",
                        title: "Thredd found results!",
                        message: "Open up Thredd to find out what other people have learned",
                        iconUrl: "images/thredd128.png"
                    })
                }
            }
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
