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
                <a class="s6tnjvv-17 cvgsde pbxmwi-2 bmmzQa" href="post.html">
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
    makeDisplay(redditPosts, encodedUrl, title)
}

function makeDisplay(redditPosts, encodedUrl, title) {
    var resubmitUrl = "https://www.reddit.com/submit?resubmit=true&url=" + encodedUrl;
    redditPosts.sort(comparePosts)
    $.each(redditPosts, postHtml);
}

function postHtml(index, permalink) {
    $("#links").append(`
        <div style="max-width: 100%;">
            <div>
                <div class="scrollerItem Post ${permalink.id} s9fusyd-17 eHSpeV s1ukwo15-0 RqhAo" id="${permalink.id}" tabindex="-1">
                    <div class="scrollerItem-content YA9IzN0YR-G5_oD5EUydl">
                        <div class="upvote-downvote-outer _3YgWdffoKyCp7UaGAEQpoo">
                            <div class="upvote-downvote-border s9fusyd-4 cRuhKC">
                                <div class="upvote-downvote-inner s9fusyd-3 iJSWiv">
                                </div>
                            </div>
                        </div>
                        <div class="item-info _1poyrkZ7g36PawDueRza-J s9fusyd-1 hnnoJG">
                            <div class="item-info-content WnMeTcero48dKo501T-19">
                                <div class="item-description s9fusyd-8 hgDRGI" data-click-id="body">
                                    <div class="s56cc5r-1 jhlfXq">
                                        <span class="item-title y8HYJ-y_lTUHkQIc1mdCq">
                                            <a class="SQnoC3ObvgnGjWt90zD9Z" data-click-id="body" href="${buildCommentUrl(permalink)}">
                                                <h2 class="s56cc5r-0 jpXBut">${permalink.title}</h2>
                                            </a>
                                        </span>
                                    </div>
                                    <div class="item-source _3AStxql1mQsrZuUIFP9xSg s9fusyd-9 TFJUf">
                                        <a class="subreddit s1i3ufq7-0 bsfRLa" data-click-id="subreddit" href="http://www.reddit.com/${permalink.subreddit_name_prefixed}" target="_blank">${permalink.subreddit_name_prefixed}</a>
                                        <span class="s106g12-0 hFyNNd" role="presentation"> &middot; </span>
                                        <span class="posted-by _2fCzxBE1dlMh4OFc7B3Dun">Posted by</span>
                                        <div class="user wx076j-0 hPglCh">
                                            <a class="user-link _2tbHP6ZydRpjI44J3syuqC s1461iz-1 gWXVVu" href="https://www.reddit.com/user/${permalink.author}" target="_blank">u/${permalink.author}</a>
                                            <div id="UserInfoTooltip--${permalink.id}"></div>
                                        </div>
                                        <a class="age _3jOxDPIQ0KaOWpzvSQo-1s" data-click-id="timestamp" href="${buildCommentUrl(permalink)}" id="PostTopMeta--Created--false--${permalink.id}" rel="nofollow noopener">${getAge(permalink.created_utc)}</a>
                                    </div>
                                    <div></div>
                                </div>
                                <div class="col-right s9fusyd-11 fZehHr">
                                    <a rel="nofollow" data-click-id="comments" data-test-id="comments-page-link-num-comments" class="comments-page-link _1UoeAeSRhOKSNdY_h3iS1O _1Hw7tY9pMr-T1F4P1C-xNU s9fusyd-13 dQlfjM" href="${buildCommentUrl(permalink)}">
                                        <i class="icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC" role="presentation"></i>
                                        <span class="FHCV02u6Cp2zYL0fhQPsO">${numToString(permalink.num_comments)}</span>
                                    </a>
                                    <div class="s9fusyd-12 gXQfqP s1o43ulv-1 fGjVuX"></div>
                                    <div>
                                        <button class="more-options s6epw68-15 jxTuag mpc6lx-1 iheKDM" aria-expanded="false" aria-haspopup="true" aria-label="more options" id="${permalink.id}-overflow-menu">
                                            <i class="icon icon-menu mpc6lx-2 ebwjqI"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    let $vote_container = $('#' + permalink.id).find('.upvote-downvote-inner');
        upvote_button = new upvoteButtonTemplate($vote_container, permalink, 'submission');
        score = new scoreTemplate($vote_container, permalink);
        downvote_button = new downvoteButtonTemplate($vote_container, permalink, 'submission');
    upvote_button.init();
    score.init(score.getStatus(permalink), permalink.score);
    downvote_button.init();
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

