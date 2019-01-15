// parse json data
function parsePosts(globalPage, tab) {
    var url = tab.url
    var title = tab.title
    var encodedUrl = encodeURIComponent(url)

    var redditPosts = lscache.get(URL_STORAGE_KEY + tab.url);
    if (redditPosts != null && redditPosts != []) {
        $("div#timeout").hide(0);
        processPosts(
            SubmissionCollectionLscache.get(tab.url),
            encodedUrl,
            title
        );
    } else {
        // redditPosts can be empty if the entry expired in lscache
        globalPage.getURLInfo(tab)
        .then(function(listing) {
            $("div#timeout").hide(0);
            return listing;
        })
        .then(function(listing) {
            processPosts(
                listing,
                encodedUrl,
                title
            );
        });
    }
}

function processPosts(redditPosts, encodedUrl, title) {
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
    if (redditPosts.length === 0) {
        return;
    } else {
        $('#links').addClass('links-background');
    }
    makeDisplay(redditPosts)
}

function makeDisplay(redditPosts) {
    redditPosts.sort(comparePosts)
    const posts = redditPosts.map((post) => {
        const submissionModel = new ContentModel(post);
        submissionModel.replyable_content_type = 'submission';
        return React.createElement(SubmissionPopup,
            Object.assign({key: post.id}, submissionModel));
    });
    ReactDOM.render(React.createElement('div', null, posts),
        document.getElementById('links'));
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

function comparePosts(postA, postB) {
    return postB.score - postA.score
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

