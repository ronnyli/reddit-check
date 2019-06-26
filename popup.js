const { PopupResults } = require('./js/react-components/popup_results');
const url_utils = require('./js/URL_utils');

// parse json data
function parsePosts(globalPage, tab) {
    const url = tab.url;

    const encodedUrl = encodeURIComponent(url);
    const redditPosts = lscache.get(URL_STORAGE_KEY + url);

    if (redditPosts != null && redditPosts != []) {
        $("div#timeout").hide(0);
        const listing = SubmissionCollectionLscache.get(url);
        renderHeader(listing, encodedUrl);
        if (listing.length > 0) {
            makeDisplay(listing);
        }
    } else {
        // redditPosts can be empty if the entry expired in lscache
        globalPage.getURLInfo(tab)
        .then(function(listing) {
            $("div#timeout").hide(0);
            return listing;
        })
        .then(function(listing) {
            renderHeader(listing, encodedUrl);
            if (listing.length > 0) {
                makeDisplay(listing);
            }
        });
    }
}

function renderHeader(redditPosts, encodedUrl) {
    $("header").append(`
        <div class="header">
            <img src="/images/thredd_reverse.png" height="14px" class="page-header s6tnjvv-7 dScugc">
            <div class="header-content">
                <div class="header-text">
                    ${redditPosts.length == 0 ? `
                        <p class="s6tnjvv-14 bPUliZ">
                            No posts found for this page. Click the button to make one!
                        </p>
                    ` : `
                        <p class="s6tnjvv-14 bPUliZ">
                            ${redditPosts.length} Reddit posts are discussing this page!
                        </p>
                        <p class="s6tnjvv-14 bPUliZ">
                            Click a post below to see what people are saying or Create a Post of your own!
                        </p>
                    `}
                </div>
                <a class="s6tnjvv-17 cvgsde pbxmwi-2 bmmzQa" href="https://www.reddit.com/submit?url=${encodedUrl}" target="_blank" rel="noopener noreferrer">
                    Create Post
                </a>
            </div>
        </div>
    `);
}

function makeDisplay(redditPosts) {
    ReactDOM.render(
        React.createElement(PopupResults, {
            posts: redditPosts
    }), document.getElementById('links'));
}

function buildCommentUrl(permalink) {
    var uri = new URI("comment.html")
    var query = {
        'id': permalink.id,
        'num_comments': permalink.num_comments
    }
    return uri.search(query);
}
global.buildCommentUrl = buildCommentUrl;

chrome.runtime.getBackgroundPage(function (global) {
    chrome.tabs.getSelected(null, function(tab){
        url_utils.getTabUrl(function(url) {
            const fake_tab = {
                url:url,
                id: tab.id
            };
            isBlacklisted(fake_tab,
                function(input) {
                    $("div#blacklisted").show(0)
                    $("div#timeout").hide(0);
                },
                function (input) {
                    $("div#blacklisted").hide(0)
                    parsePosts(global, fake_tab)
            });
        });
    });
});

