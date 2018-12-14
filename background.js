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
            'youtu.be/'
        ];
        prefixes.forEach(function(prefix) {
			if (prefix + video_id != url)
				urls.push(prefix + video_id);
		});
    }
    return urls;
}

function trimURL(url){
    return url.split('://')[1].split('?')[0];
}


// get URL info json
function getURLInfo(tab){
    var url = tab.url
    var posts = lscache.get(URL_STORAGE_KEY + url)
    if (posts != null) {
        console.log('getURLInfo: cached.')
        updateBadge(posts.length, tab);
        return;
    } else {
        console.log('getURLInfo: calling reddit API')
        return Promise.all([snoo.searchCommentsForURL(url), snoo.searchSubmissionsForURL(url)])
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

function disableBadge(tab){
    var title = "Blacklisted by you"
    var text = "-"
    var badgeColor = [175, 0, 0, 200] //red
    var alienIcon = { '19': "images/alien_apathy19.png", '38': "images/alien_apathy38.png" }
    setBadge(title, text, badgeColor, alienIcon, tab)
}

function updateBadge(numPosts, tab) {
    var title = numPosts.toString() + " Results Found!"
    var text = numPosts.toString()
    var badgeColor = null;  // use default badge color
    var alienIcon = { '19': "images/alien19.png", '38': "images/alien38.png" }
    if (numPosts == 0) {
        return;
    }
    setBadge(title, text, badgeColor, alienIcon, tab)
}

function setBadge(title, text, badgeColor, alienIcon, tab) {
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
    var userAgent = chrome.runtime.id + ':' + 'v0.0.1' + ' (by /u/sirius_li)';

    let anonymous_requester;
    let snoowrap_requester;

    function fetchAnonymousToken() {
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
              // anonymous_requester must be refreshed after 1 hour
              lscache.set('anonymous_requester_json', anonymousSnoowrap, 59);
              return anonymous_requester;
          });
    }

    function getSnoowrapRequester() {
        // return whatever snoowrap requester is available
        // create a new anonymous requester if needed
        return new Promise(function(resolve, reject) {
            if (lscache.get('is_logged_in_reddit')) {
                console.log('using logged in requester');
                resolve(snoowrap_requester);
            } else if (lscache.get('anonymous_requester_json')) {
                console.log('using anonymous requester');
                resolve(anonymous_requester);
            } else {
                console.log('anonymous requester expired. Fetching new one...');
                resolve(fetchAnonymousToken());
            }
        })
    }

    return {

        logInReddit: function(interactive, callback) {
            // In case we already have a snoowrap requester cached, simply return it.
            if (lscache.get('is_logged_in_reddit')) {
                callback('Success');
                return;
            }

            var authenticationUrl = snoowrap.getAuthUrl({
                clientId: clientId,
                scope: [
                    //'edit',
                    'identity',
                    'read',
                    //'report',
                    'save',
                    'submit',
                    'vote'
                ],
                redirectUri: redirectUri,
                permanent: false,
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
                }).then(r => {
                    lscache.set('is_logged_in_reddit', true, 59);
                    snoowrap_requester = r;
                    logoutContextMenu(first_run=false);
                    return 'Success'
                }).catch(err => {
                    lscache.set('is_logged_in_reddit', null);
                    console.error(err);
                    loginContextMenu(first_run=false);
                    return err.toString();
                });
                // popup window closes before callback can run so this
                // will throw the following error:
                // Unhandled rejection Error: Attempting to use a disconnected port object
                // It's okay though because the login was successful
                snoowrap_promise.then(status => callback(status));
            }
        },

        submitPost: function(subreddit, title, url, callback) {
            snoowrap_requester.submitLink({
                subredditName: subreddit,
                title: title,
                url: url
            }).fetch()
            .then(function(submission) {
                // add submission to lscache
                chrome.tabs.query({
                    // It's possible for the user to tweak the URL
                    // so get the one from the address bar
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    var tab = tabs[0];
                    var url_raw = tab.url;
                    SubmissionLscache.insert([submission], url_raw);
                });
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
            getSnoowrapRequester()
            .then(r => r.getSubmission(id).fetch())
            .then(submission => {
                SubmissionLscache.update([submission])
                callback(submission);
            });
        },

        leaveComment: function(id, text, replyable_content_type, callback) {
            if (replyable_content_type == 'submission') {
                snoowrap_requester.getSubmission(id)
                .reply(text)
                .then(comment => {
                    // inject comment into submission object
                    let submission = lscache.get(SUBMISSION_STORAGE_KEY + id);
                    submission.num_comments += 1;
                    submission.comments.push(comment);
                    SubmissionLscache.update([submission]);
                    // TODO: increment number of comments on comment.html
                    callback(comment);
                })
                .catch(function(err) {
                    callback(err.toString());
                });
            } else if (replyable_content_type == 'comment') {
                snoowrap_requester.getComment(id)
                .reply(text)
                .then(comment => {
                    // inject comment into submission object
                    const submission_id = comment.link_id.split('_')[1];
                    let submission = lscache.get(SUBMISSION_STORAGE_KEY + submission_id);
                    submission.num_comments += 1;
                    function findParent(entry) {
                        if (entry.name == comment.parent_id) {
                            entry.replies.push(comment);
                            return true;
                        } else {
                            return entry.replies.filter(findParent);
                        }
                    }
                    let parent_comment = submission.comments.filter(findParent)[0];
                    SubmissionLscache.update([submission]);
                    // TODO: increment number of comments on comment.html
                    callback(comment);
                })
                .catch(function(err) {
                    callback(err.toString());
                });
            }
        },

        searchSubmissionsForURL: function(url) {
            // TODO: clean up search logic

            // if (url.indexOf('http') == -1) {
            //     urls = [];  // TODO: return a Promise so we don't waste our time
            // }

            function writeQuery(url) {
                if (url.indexOf('http') == -1) {
                    return [];
                } else if (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) {
                    // Reddit search for youtube needs to be even more specific
                    // see: https://www.reddit.com/r/youtube/comments/6fhxnr/anyone_else_have_the_problem_of_this_forum_not/diid2b2
                    let video_id = url.split('v=')[1];
                    const ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                    return `url:${video_id} site:(youtube.com OR youtu.be)`;
                } else {
                    const trimmed_url = trimURL(url);
                    return `url:"${trimmed_url}" OR selftext:"${trimmed_url}"`;
                }
            }
            const query = writeQuery(url);
            // TODO: need a better name...
            const is_fancy_url = (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) ? true : false;

            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
            }

            return getSnoowrapRequester()
              .then(r => r.search({
                query: query,
                restrictSr: false,
                time: 'all',
                sort: 'relevance',
                syntax: 'lucene'
              }))
              .then(listing => {
                let listing_filtered = listing;
                // Filter out NSFW results
                if (true) {  // TODO: convert this to an option
                    listing_filtered = listing.filter((el) => {return !el.over_18});
                }
                if (!is_fancy_url) {
                    const u = trimURL(url);
                    const too_much = new RegExp(escapeRegExp(u) + '/?\\w');
                    const basic = new RegExp(escapeRegExp(u));
                    listing_filtered = listing_filtered.filter(elem => {
                        return (
                            basic.test(elem.url) && !too_much.test(elem.url)
                        ) || (
                            basic.test(elem.selftext_html) && !too_much.test(elem.selftext_html)
                        );
                    });
                }
                return listing_filtered;
              });
        },

        searchCommentsForURL: function(url) {
            // TODO: clean up search logic
            let is_fancy_url;
            let urls = [];
            if (url.indexOf('http') == -1) {
                urls = [];  // TODO: return a Promise so we don't waste our time
            } else if (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) {
                is_fancy_url = true;  // TODO: re-name at some point
                urls = getYoutubeURLs(url);
            } else {
                is_fancy_url = false;
                urls = [trimURL(url)];
            }
            const comment_api = 'https://api.pushshift.io/reddit/search/comment/?';
            const submission_api = 'https://api.pushshift.io/reddit/search/submission/?';
            const fields = ['link_id', 'body'];
            let promises = [];

            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
            }

            urls.forEach(u => {
                promises.push(
                    fetch(comment_api + 'q="' + URI.encode(u) + '"&fields=' + fields.join(','))
                    .then(response => response.json())
                    .then(resp => resp.data)
                    .then(data => {
                        if (is_fancy_url) {
                            return data;
                        } else {
                            const too_much = new RegExp(escapeRegExp(u) + '/?\\w');
                            const basic = new RegExp(escapeRegExp(u));
                            return data.filter(elem => {
                                // Must match URL but not go over
                                return (basic.test(elem.body) && !too_much.test(elem.body));
                            });
                        }
                    })
                    .then(data => data.map(elem => elem.link_id))  // array of submission IDs
                    .catch(error => {
                        console.log(error);
                        return [];
                    })
                );
            });

            return Promise.all(promises)
            .then(values => [].concat.apply([], values))
            .then(ids => {
                if (ids.length == 0) {
                    throw new Error('aborting pushshift api call');
                    return [];
                } else {
                    // TODO: pushshift submission_api is not as up-to-date as Reddit's
                    return fetch(submission_api + 'ids=' + ids.toString());
                }
            })
            .then(response => response.json())
            .then(resp => resp.data)
            .then(listing => {
                let listing_filtered = listing;
                // Filter out NSFW results
                if (true) {  // TODO: convert this to an option
                    listing_filtered = listing.filter((el) => {return !el.over_18});
                }
                return listing_filtered;
            })
            .then(listing => listing.map(function(el) {
                if (el.subreddit_type === 'user') {
                    el.subreddit_name_prefixed = el.subreddit.replace('_', '/');
                    return el;
                } else {
                    el.subreddit_name_prefixed = 'r/' + el.subreddit;
                    return el;
                }
            }))
            .catch(error => {
                if (error.message === 'aborting pushshift api call') {
                    return [];
                } else {
                    throw error;
                }
            });
        },

        saveReddit: function(id, save_type, replyable_content_type, callback) {
            getSnoowrapRequester()
            .then(r => {
                switch(replyable_content_type) {
                    case 'submission':
                        return r.getSubmission(id);
                    case 'comment':
                        return r.getComment(id);
                }
            }).then(content => {
                switch(save_type) {
                    case 'save':
                        return content.save();
                    case 'unsave':
                        return content.unsave();
                }
            }).then(content => content.fetch())
            .then(content => {
                const newdata = {
                    saved: content.saved,
                };
                const submission_id = content.link_id || content.id;
                let submission = SubmissionLscache.get(submission_id);
                switch (replyable_content_type) {
                    case 'submission':
                        Object.assign(submission, newdata);
                        SubmissionLscache.update([submission]);
                        break;
                    case 'comment':
                        SubmissionLscache.updateComment(submission, content.id, newdata);
                        break;
                }
                return content
            }).then(content => callback('Success'))
            .catch(function(err) {
                callback(err.toString());
            });
        },

        voteReddit: function(id, vote_type, replyable_content_type, callback) {
            getSnoowrapRequester()
            .then(r => {
                switch(replyable_content_type) {
                    case 'submission':
                        return r.getSubmission(id);
                        break;
                    case 'comment':
                        return r.getComment(id);
                        break;
                }
            }).then(content => {
                switch(vote_type) {
                    case 'upvote':
                        return content.upvote();
                        break;
                    case 'unvote':
                        return content.unvote();
                        break;
                    case 'downvote':
                        return content.downvote();
                        break;
                }
            }).then(content => content.fetch())
            .then(content => {
                // update current data with new scores
                const newdata = {
                    likes: content.likes,
                    score: content.score,
                    downs: content.downs,
                    ups: content.ups,
                    upvote_ratio: content.upvote_ratio
                };
                const submission_id = content.link_id || content.id;
                let submission = SubmissionLscache.get(submission_id);
                switch (replyable_content_type) {
                    case 'submission':
                        Object.assign(submission, newdata);
                        SubmissionLscache.update([submission]);
                        break;
                    case 'comment':
                        SubmissionLscache.updateComment(submission, content.id, newdata);
                        break;
                }
                return content
            }).then(content => callback('Success'))
            .catch(function(err) {
                console.error(err);
                callback(err.toString());
            });
        },

        fetchAnonymousToken: fetchAnonymousToken,

        getSnoowrapRequester: getSnoowrapRequester
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
    } else if (request.action == 'voteReddit') {
        snoo.voteReddit(request.id,
            request.vote_type,
            request.replyable_content_type,
            callback);
        return true;
    } else if (request.action == 'saveReddit') {
        snoo.saveReddit(request.id,
            request.save_type,
            request.replyable_content_type,
            callback);
        return true;
    }
}

chrome.runtime.onMessage.addListener(onRequest);
