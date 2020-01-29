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
            if (listing.length > 0) {
                makeDisplay(listing);
            }
        });
    }
    renderCreatePost(encodedUrl);
}

function renderCreatePost(encodedUrl) {
    ReactDOM.render(
        React.createElement(CreatePost, {
            encodedUrl: encodedUrl
    }), document.getElementById('create-post'));
}

function renderPopupMenu() {
    ReactDOM.render(
        React.createElement(PopupMenu, {}),
        document.getElementById('popup-menu'));
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
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        let tab = tabs[0];
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

renderPopupMenu();
ReactDOM.render(
    React.createElement(Banner, {
        backgroundColor: 'red',
        bannerText: 'goLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ultrices auctor tellus, id rutrum lacus volutpat et. Cras tincidunt sem ac gravida porttitor. In quis lectus at lacus lacinia placerat non ac ante. Fusce quis enim sit amet est porttitor gravida quis ac eros. Duis efficitur orci mollis felis gravida convallis. Aenean hendrerit semper erat ut bibendum. Praesent diam dolor, sodales in urna non, rutrum feugiat dolor. Nunc rhoncus mi vel erat sodales,odbye'
    }),
    document.getElementById('banner'));
lscache.set('trigger_notification', false, 5);
