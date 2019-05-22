const url_utils = require('./URL_utils');

function backgroundSnoowrap() {
    'use strict';
    var clientId = CLIENT_ID_DEV;
    var redirectUri = chrome.identity.getRedirectURL('provider_cb');
    var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
    // TODO: bogus userAgent
    var userAgent = chrome.runtime.id + ':' + 'v0.0.1' + ' (by /u/sirius_li)';

    const ONE_HOUR_MS = 1000 * 60 * 60;
    lscache.set('is_logged_in_reddit', null);
    let anonymous_requester = {};
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
              // anonymous_requester must be refreshed after 1 hour
              anonymous_requester.expiryTime = new Date().getTime() + ONE_HOUR_MS;
              const anonymousSnoowrap = new snoowrap({ accessToken: anonymousToken });
              anonymousSnoowrap.config({ proxies: false, requestDelay: 1000 });
              anonymous_requester.r = anonymousSnoowrap;
              return anonymousSnoowrap;
          });
    }

    function getSnoowrapRequester() {
        // return whatever snoowrap requester is available
        // create a new anonymous requester if needed
        return new Promise(function(resolve, reject) {
            if (lscache.get('is_logged_in_reddit')) {
                console.log('using logged in requester');
                resolve(snoowrap_requester);
            } else if (anonymous_requester.expiryTime &&
                new Date().getTime() < anonymous_requester.expiryTime) {
                console.log('using anonymous requester');
                resolve(anonymous_requester.r);
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
                    'edit',
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
                    r.getMe().then(u => lscache.set('reddit_username', u.name));
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

        getSubredditBatch: function(subreddit_ids, callback) {
            let unique_ids = [...new Set(subreddit_ids)];
            let batch_ids = [];
            let promises = [];
            while (unique_ids.length > 0) {
                batch_ids.push(unique_ids.shift());
                if (unique_ids.length == 0 || batch_ids.length >= 100) {
                    const ids_str = batch_ids.join(',');
                    batch_ids = [];
                    promises.push(
                        fetch('https://api.reddit.com/api/info.json?id=' + ids_str)
                        .then(response => response.json())
                        .then(resp => resp.data.children)
                        .then(listing => {
                            if (listing.length > 0) {
                                return listing.map(elem => elem.data);
                            } else {
                                return [];
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            return [];
                        })
                    );
                }
                if (unique_ids.length == 0) {
                    return Promise.all(promises)
                        .then(values => [].concat.apply([], values))
                        .then(subreddits => {
                            callback(subreddits);
                        });
                }
            }
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
                    callback(comment);
                })
                .catch(function(err) {
                    callback(err.toString());
                });
            }
        },

        removeReddit: function(id, replyable_content_type, callback) {
            getSnoowrapRequester()
            .then(r => {
                switch(replyable_content_type) {
                    case 'submission':
                        return r.getSubmission(id).delete().fetch();
                    case 'comment':
                        return r.getComment(id)
                            .delete()
                            .fetch()
                            .then(content => content.link_id)
                            .then(content_id => r.getSubmission(content_id).fetch());  // TODO: no need for getSubmission. just delete from lscache and in UI instead
                }
            }).then(submission => {
                switch(replyable_content_type) {
                    case 'submission':
                        SubmissionLscache.delete(id);
                        break;
                    case 'comment':
                        SubmissionLscache.update([submission]);
                        break;
                }
                callback('Success');
            }).catch(err => callback(err.toString()));
        },

        searchSubmissionsForURL: function(url) {
            // TODO: clean up search logic

            function writeQuery(url) {
                if (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) {
                    // Reddit search for youtube needs to be even more specific
                    // see: https://www.reddit.com/r/youtube/comments/6fhxnr/anyone_else_have_the_problem_of_this_forum_not/diid2b2
                    let video_id = url.split('v=')[1];
                    const ampersandPosition = video_id.indexOf('&');
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition);
                    }
                    return `url:${video_id} site:(youtube.com OR youtu.be)`;
                } else {
                    return `url:"${url}" OR selftext:"${url}"`;
                }
            }
            const query = writeQuery(url);
            const is_youtube = (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) ? true : false;

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
                const u = url_utils.trimURL(url);
                // Filter out NSFW results
                if (true) {  // TODO: convert this to an option
                    listing_filtered = listing.filter((el) => {return !el.over_18});
                }
                if (!is_youtube) {
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
                listing_filtered.map(elem => {
                    if (elem.url.indexOf(u) != -1) {
                        elem.thredd_result_type = 'link post';
                    } else {
                        elem.thredd_result_type = 'selfpost';
                    }
                })
                return listing_filtered;
              })
              .catch(error => {
                console.error(error);
                console.error('current time: ' + new Date().getTime().toString());
                if (lscache.get('is_logged_in_reddit')) {
                    console.error('using logged in requester. Expires:');
                    console.error(lscache.get('is_logged_in_reddit-cacheexpiration') * 1000 * 60);  // ms
                    // TODO: reset logged_in_reddit but only if error has status 403
                } else {
                    console.error('using anonymous_requester');
                    console.error(anonymous_requester);
                    anonymous_requester = {};  // reset to get a new one next time
                }
                return [];
              });
        },

        searchCommentsForURL: function(url) {
            // TODO: clean up search logic
            let is_youtube;
            let urls = [];
            if (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1) {
                is_youtube = true;
                urls = url_utils.getYoutubeURLs(url);
            } else {
                is_youtube = false;
                urls = [url];
            }
            const comment_api = 'https://api.pushshift.io/reddit/search/comment/?';
            const submission_api = 'https://api.pushshift.io/reddit/search/submission/?';
            const fields = ['author', 'body', 'created_utc', 'id', 'link_id', 'score'];
            let promises = [];
            let comments = [];

            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
            }

            urls.forEach(u => {
                promises.push(
                    fetch(comment_api + 'q="' + URI.encode(u) + '"&fields=' + fields.join(','))
                    .then(response => response.json())
                    .then(resp => resp.data)
                    .then(data => {
                        if (is_youtube) {
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
                    .then(data => data.map(elem => {
                        comments.push(elem);
                        return elem.link_id;  // array of submission IDs
                    }))
                    .catch(error => {
                        console.error(error);
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
                    // pushshift submission_api is not as up-to-date as Reddit's
                    // but the benefit is that there's only one API call
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
                el.thredd_result_type = 'comment';
                el.thredd_result_details = comments.find(comment => {
                    const submission_id = el.id.indexOf('_') != -1 ? el.id : 't3_' + el.id;
                    return comment.link_id == submission_id;
                });
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

module.exports = backgroundSnoowrap();
