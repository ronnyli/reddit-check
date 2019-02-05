// parse json data
function parsePosts(globalPage, tab) {
    let window_url = new URI(window.location.href);
    const query = window_url.search(true);
    const url = query.override_url || tab.url;

    const encodedUrl = encodeURIComponent(url);
    const redditPosts = lscache.get(URL_STORAGE_KEY + url);

    if (redditPosts != null && redditPosts != []) {
        $("div#timeout").hide(0);
        const listing = SubmissionCollectionLscache.get(url);
        renderHeader(listing, encodedUrl);
        renderRefinedSearch(tab_url=tab.url, window_url=window_url);
        makeDisplay(listing);
    } else {
        // redditPosts can be empty if the entry expired in lscache
        globalPage.getURLInfo(tab, query.override_url)
        .then(function(listing) {
            $("div#timeout").hide(0);
            return listing;
        })
        .then(function(listing) {
            renderHeader(listing, encodedUrl);
            if (listing.length > 0) {
                renderRefinedSearch(tab_url=tab.url, window_url=window_url);
                makeDisplay(listing);
            }
        });
    }
}

function renderRefinedSearch(tab_url, window_url) {
    if ((tab_url.indexOf('youtube.com') == -1) && (tab_url.indexOf('?') != -1)) {
        $('#links').before(`
            <a id="refine-search" class="links-background s1461iz-1 RVnoX"
               href="#" target="_self"
               title="Search for your exact URL">
                Refine Search
            </a>
        `);
        $('#refine-search').click(() => {
            SubmissionCollectionLscache.remove(tab_url);
            window_url.setSearch('override_url', tab_url);
            window.open(window_url.toString(), '_self');
        })
    }
}

function renderHeader(redditPosts, encodedUrl) {
    $("header").append(`
        <div class="header">
            <span class="page-header s6tnjvv-7 dScugc">Home</span>
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
        'num_comments': permalink.num_comments,
        'title': cropTitle(permalink.title)
    }
    return uri.search(query);
}

function cropTitle(title) {
    var maxTitleLength = 30;
    if (title.length > maxTitleLength)
        title = title.substring (0, maxTitleLength) + "...";
    return title;
}

chrome.runtime.getBackgroundPage(function (global) {
    chrome.tabs.getSelected(null, function(tab){
        isBlacklisted(tab,
            function(input) {
                $("div#blacklisted").show(0)
                $("div#timeout").hide(0);
            },
            function (input) {
                $("div#blacklisted").hide(0)
                parsePosts(global, tab)
            });
    });
});

