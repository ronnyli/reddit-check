var gUrlToAsyncMap = {}
var DEDUPE_KEY = "Dedupe:"
var POST_STORAGE_KEY = "Posts:"
var COMMENT_STORAGE_KEY = "Comments:"

// update on URL update
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    console.log('onUpdated: ' + tabId)
    changeAction(tab)
});

// update on selection change
chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
    console.log('onSelectionChanged: ' + tabId)
    chrome.tabs.getSelected(null, function(tab){
        changeAction(tab)
    });
});

function changeAction(tab) {
    if (lscache.get(DEDUPE_KEY + tab.url + tab.id) != null) {
        return // dupe
    }
    lscache.set(DEDUPE_KEY + tab.url + tab.id, "", 2)
    isBlacklisted(tab, disableBadge, getURLInfo)
}

function getYoutubeURLs(url){
    var gotVidId = false;
    var video_id = '';
    var urls = []
    if (url.indexOf('v=') != -1) {
        var video_id = url.split('v=')[1];
        if (video_id != "")
              gotVidId = true;
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
              video_id = video_id.substring(0, ampersandPosition);
        }
    }
    if (gotVidId) {
        var prefixes = [
            'www.youtube.com/watch?v=',
            'www.youtu.be/',
        ];
        prefixes.forEach(function(prefix) {
			if (prefix + video_id != url)
				urls.push(prefix + video_id);
		});
    }
    return urls;
}

function constructURLs(url){
    if (url.indexOf('http') == -1) {
        return []
    }
    // TODO: keep everything after the first instance of '://'
    var url_without_protocol = url.split('://')[1];
    var urls = [url_without_protocol];
    if (url.indexOf('youtube.com') != -1) {
        urls = urls.concat(getYoutubeURLs(url));
    }
    return urls;
}


// get URL info json
function getURLInfo(tab){
    var url = tab.url
    var posts = lscache.get(POST_STORAGE_KEY + url)
    if (posts != null) {
        console.log('cached.')
        updateBadge(posts.length, tab);
        return;
    } else {
        console.log('getURLInfo: calling reddit API')
        snoo.searchRedditForURL(url, function(listing) {
            updateBadge(listing.length, tab);
            lscache.set(POST_STORAGE_KEY + url, listing, 5);
        });
    }
}

function disableBadge(tab){
    var title = "Blacklisted by you"
    var text = "-"
    var badgeColor = [175, 0, 0, 200] //red
    var alienIcon = { '19': "images/alien_apathy19.png", '38': "images/alien_apathy38.png" }
    setBadge(title, text, badgeColor, alienIcon, tab)
}

function updateBadge(numPosts, tab) {
    var noPostsColor = [175, 0, 0, 55]
    var green = [1, 175, 1, 255]

    var title = "Repost"
    var text = numPosts.toString()
    var badgeColor = green
    var alienIcon = { '19': "images/alien19.png", '38': "images/alien38.png" }
    if (numPosts == 0) {
        badgeColor = noPostsColor
        title = "Post link"
        alienIcon = { '19': "images/alien_apathy19.png", '38': "images/alien_apathy38.png" }
    }
    setBadge(title, text, badgeColor, alienIcon, tab)
}

function setBadge(title, text, badgeColor, alienIcon, tab) {
    var tabId = tab.id
    chrome.browserAction.setTitle({"title": title, "tabId": tabId})
    chrome.browserAction.setBadgeBackgroundColor({
        "color": badgeColor, 
        "tabId": tabId
    })
    chrome.browserAction.setBadgeText({
        "text": text,
        "tabId": tabId
    })
    chrome.browserAction.setIcon({
        "path": alienIcon,
        "tabId": tabId
    })
}

function backgroundSnoowrap() {
    'use strict';
    var clientId = 'JM8JSElud0Rm1g';
    var redirectUri = chrome.identity.getRedirectURL('provider_cb');
    var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
    // TODO: bogus userAgent
    var userAgent = chrome.runtime.id + ':' + 'v0.0.1' + ' (by /u/sirius_li)'

    var snoowrap_requester_json = lscache.get('snoowrap_requester_json');
    var snoowrap_requester = setSnoowrapFromJson(snoowrap_requester_json);

    var anonymous_requester;

    function setSnoowrapFromJson(snoo_json) {
        if (snoo_json) {
            return new snoowrap({
                userAgent: snoo_json.userAgent,
                clientId: snoo_json.clientId,
                clientSecret: '',
                refreshToken: snoo_json.refreshToken
            });
        } else {
            return null;
        }
    }

    return {

        logInReddit: function(interactive, callback) {
            // In case we already have a snoowrap requester cached, simply return it.
            if (lscache.get('snoowrap_requester_json')) {
                callback('Success');
                return;
            }

            var authenticationUrl = snoowrap.getAuthUrl({
                clientId: clientId,
                scope: ['identity', 'read', 'submit'],
                redirectUri: redirectUri,
                permanent: true,
                state: 'fe211bebc52eb3da9bef8db6e63104d3' // TODO: bogus state
            });

            var options = {
                'interactive': interactive,
                'url': authenticationUrl
            }
            chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
                if (chrome.runtime.lastError) {
                    new Error(chrome.runtime.lastError);
                }

                var matches = redirectUri.match(redirectRe);
                if (matches && matches.length > 1) {
                    var code = new URL(redirectUri).searchParams.get('code');
                    setSnoowrapFromAuthCode(code);
                } else {
                    new Error('Invalid redirect URI');
                }
            });

            function setSnoowrapFromAuthCode(auth_code) {
                var snoowrap_promise = snoowrap.fromAuthCode({
                    code: auth_code,
                    userAgent: userAgent,
                    clientId: clientId,
                    redirectUri: redirectUri
                });
                snoowrap_promise.then(r => {
                    lscache.set('snoowrap_requester_json', r);
                    snoowrap_requester_json = JSON.stringify(r);
                    snoowrap_requester = r;
                    callback('Success');
                });
            }
        },

        submitPost: function(subreddit, title, url, callback) {
            snoowrap_requester.submitLink({
                subredditName: subreddit,
                title: title,
                url: url
            })
            .then(function(submission) {
                callback('Success');
            })
            .catch(function(err) {
                callback(err.toString());
            });
        },

        getCurrentUserName: function(callback) {
            try {
                snoowrap_requester.getMe()
                .then(u => callback(u.name));
            } catch(err) {
                callback(err.toString());
            }
        },

        searchSubreddits: function(query, callback) {
            snoowrap_requester.searchSubreddits({
                'query': query
            }).then(subreddits => callback(subreddits));
        },

        getSubmission: function(id, callback) {
            var requester;
            if (snoowrap_requester) {
                console.log('using logged in requester');
                requester = snoowrap_requester;
            } else if (anonymous_requester) {
                console.log('using anonymous requester');
                requester = anonymous_requester;
            }

            requester.getSubmission(id)
            .fetch()
            .then(submission => {
                lscache.set(COMMENT_STORAGE_KEY + id, submission);
                callback(submission);
            });
        },

        leaveComment: function(id, text, replyable_content_type, callback) {
            if (replyable_content_type == 'submission') {
                snoowrap_requester.getSubmission(id)
                .reply(text)
                .then(() => callback('Success'))
                .catch(function(err) {
                    callback(err.toString())
                });
            } else if (replyable_content_type == 'comment') {
                snoowrap_requester.getComment(id)
                .reply(text)
                .then(() => callback('Success'))
                .catch(function(err) {
                    callback(err.toString())
                });
            }
        },

        searchRedditForURL: function(url, callback) {
            var requester;
            if (snoowrap_requester) {
                console.log('using logged in requester');
                requester = snoowrap_requester;
            } else if (anonymous_requester) {
                console.log('using anonymous requester');
                requester = anonymous_requester;
            }

            var urls = constructURLs(url);
            // search for multiple URLs by using url:(link1 OR link2 OR...)
            // Do not include http[s]:// or Reddit will return an error
            // see this query for an example https://www.reddit.com/search?q=url%3A%28imgur.com%2FhyLlADL+OR+en.wikipedia.org%2Fwiki%2FBankruptcy_barrel+OR+en.wikipedia.org%2Fwiki%2FExertional_rhabdomyolysis%29&restrict_sr=&sort=relevance&t=all
            var urls_query = '(' + urls.join(' OR ') + ')';

            requester.search({
                query: "url:" + urls_query,
                restrictSr: false,
                time: 'all',
                sort: 'relevance',
                syntax: 'lucene'
              })
              .then(listing => {
                let listing_filtered = listing;
                // Filter out NSFW results
                if (true) {  // TODO: convert this to an option
                    listing_filtered = listing.filter((el) => {return !el.over_18});
                }
                return listing_filtered;
              });
        },

        searchPushshiftForURL: function(url, callback) {
            const comment_api = 'https://api.pushshift.io/reddit/search/comment/?';
            const submission_api = 'https://api.pushshift.io/reddit/search/submission/?';

            var urls = constructURLs(url);

            let promises = [];

            urls.forEach(u => {
                promises.push(
                    fetch(comment_api + 'q=' + u)
                    .then(response => response.json())
                    .then(resp => resp.data)
                    .then(data => data.map(elem => elem.link_id))  // array of submission IDs
                    .catch(error => {
                        console.log(error);
                        return [];
                    })
                    // .then(ids => ids.toString())
                );
            });

            Promise.all(promises)
            .then(values => [].concat.apply([], values))
            // TODO: cannot pass an empty array to the below API call. Still returns values
            .then(ids => fetch(submission_api + 'ids=' + ids.toString()))
            .then(response => response.json())
            .then(resp => resp.data)
            .then(console.log);
        },

        fetchAnonymousToken: function() {
            const form = new FormData();
            form.set('grant_type', 'https://oauth.reddit.com/grants/installed_client');
            form.set('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
            return fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'post',
                body: form,
                headers: { authorization: `Basic ${btoa(clientId + ':')}` },
                credentials: 'omit',
            }).then(response => response.text())
              .then(JSON.parse)
              .then(tokenInfo => tokenInfo.access_token)
              .then(anonymousToken => {
                  const anonymousSnoowrap = new snoowrap({ accessToken: anonymousToken });
                  anonymousSnoowrap.config({ proxies: false, requestDelay: 1000 });
                  anonymous_requester = anonymousSnoowrap;
                  lscache.set('anonymous_requester_json', anonymousSnoowrap);
                  console.log('Got anonymous snoowrap requester');
              });
        }
    }
}

var snoo = backgroundSnoowrap();
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
    }
}

chrome.runtime.onMessage.addListener(onRequest);
