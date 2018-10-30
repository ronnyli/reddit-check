// parse json data
function parsePosts(globalPage, tab) {
    var url = tab.url
    var title = tab.title
    var encodedUrl = encodeURIComponent(url)

    $("div#timeout").hide(0);
    var redditPosts = lscache.get(globalPage.POST_STORAGE_KEY + tab.url)
    if (redditPosts != null && redditPosts != []) {
        processPosts(redditPosts, encodedUrl, title)
    } else {
        // TODO: modify this else statement since it uses the old way of getting redditPosts
        var promises = globalPage.gUrlToAsyncMap[tab.url]
        redditPosts = []
        if (promises != null) {
            Promise.all(promises).then(values => {
                console.log("values " + JSON.stringify(values))
                values.forEach(function(jsonData) { 
                    redditPosts = redditPosts.concat(jsonData.data.children)
                });
                processPosts(redditPosts, encodedUrl, title)
            });
        }
    }
}

function processPosts(redditPosts, encodedUrl, title) {
    if (redditPosts.length === 0) {
        $("#data").append("<span id='title'>"+cropTitle(title)+"</span>&nbsp;&nbsp;&nbsp;");

        $("#data").append("<span><a title='Post to reddit'"+
            " href='post.html'>Post</a></span>");

        $("#links").append("<span>No posts found for this page. Click the button to make one!</span>")
        return;
    }
    makeDisplay(redditPosts, encodedUrl, title)
}

function makeDisplay(redditPosts, encodedUrl, title) {
    var resubmitUrl = "https://www.reddit.com/submit?resubmit=true&url=" + encodedUrl;
    redditPosts.sort(comparePosts)
    var permalinks = [];
    for( var i=0; entry = redditPosts[i]; i++) {
            permalinks[i] = {
                id: entry.id,
                link: entry.permalink,
                title: entry.title,
                score: entry.score+"",
                created_utc: entry.created_utc,
                comments: entry.num_comments+"",
                subreddit: entry.subreddit_name_prefixed,
                author: entry.author
            };
    }

    // showPosts:
    title = cropTitle(title);
    $("#data").append("<span id='title'>"+title+"</span>&nbsp;&nbsp;&nbsp;");
    
    $("#data").append("<span><a title='Post to reddit'"+
        " href='post.html'>Repost</a></span>");
    
    $.each(permalinks, postHtml);
}

function oldPostHtml(index, permalink) {
    $("#links").append(`
        <li>
            <div class='score'>${numToString(permalink.score)}</div>
            <a href='${buildCommentUrl(permalink)}' title='${permalink.link}'>${permalink.title}</a>
            <div class='age'>${getAge(permalink.created_utc)}
                &nbsp;&nbsp;${numToString(permalink.comments)} comments
                &nbsp;&nbsp;<a href='http://www.reddit.com/${permalink.subreddit}' target='_blank'>${permalink.subreddit}</a>
                &nbsp;&nbsp;u/${permalink.author}
            </div>
        </li>`
    );
}

function postHtml(index, permalink) {
    $("#links").append(`
        <div style="max-width: 100%;">
            <div>
                <div class="scrollerItem Post ${permalink.id}" id="${permalink.id}" tabindex="-1">
                    <div class="scrollerItem-content">
                        <div class="upvote-downvote-outer">
                            <div class="upvote-downvote-border">
                                <div class="upvote-downvote-inner">
                                    <button class="vote-arrow" aria-label="upvote" aria-pressed="false" data-click-id="upvote">
                                        <div class="upvote-arrow">
                                            <i class="small material-icons upvote-arrow-icon">arrow_drop_up</i>
                                        </div>
                                    </button>
                                    <div class="score" style="color: rgb(26, 26, 27);">${numToString(permalink.score)}</div>
                                    <button class="vote-arrow" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
                                        <div class="downvote-arrow">
                                            <i class="small material-icons downvote-arrow-icon">arrow_drop_down</i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="item-info">
                            <div class="item-info-content">
                                <div class="item-description" data-click-id="body">
                                    <div>
                                        <span class="item-title">
                                            <a data-click-id="body" href="${buildCommentUrl(permalink)}">
                                                <h2>${permalink.title}</h2>
                                            </a>
                                        </span>
                                    </div>
                                    <div class="item-source">
                                        <a class="subreddit" data-click-id="subreddit" href="http://www.reddit.com/${permalink.subreddit}" target="_blank">${permalink.subreddit}</a>
                                        <span role="presentation"> &middot; </span>
                                        <span class="posted-by">Posted by</span>
                                        <div class="user">
                                            <a class="user-link" href="https://www.reddit.com/user/${permalink.author}" target="_blank">u/${permalink.author}</a>
                                            <div id="UserInfoTooltip--${permalink.id}"></div>
                                        </div>
                                        <a class="age" data-click-id="timestamp" href="${buildCommentUrl(permalink)}" id="PostTopMeta--Created--false--${permalink.id}" rel="nofollow noopener">${getAge(permalink.created_utc)}</a>
                                    </div>
                                    <div></div>
                                </div>
                                <div class="col-right">
                                    <a rel="nofollow" data-click-id="comments" data-test-id="comments-page-link-num-comments" class="comments-page-link" href="${buildCommentUrl(permalink)}">
                                        <i class="tiny material-icons" role="presentation">mode_comment</i>
                                        <span>${numToString(permalink.comments)}</span>
                                    </a>
                                    <div></div>
                                    <div>
                                        <button class="more-options" aria-expanded="false" aria-haspopup="true" aria-label="more options" id="${permalink.id}-overflow-menu">
                                            <i class="small material-icons more-options-icon">more_horiz</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
}

function buildCommentUrl(permalink) {
    var uri = new URI("comment.html")
    var query = {
        'id': permalink.id,
        'num_comments': permalink.comments,
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
       
document.addEventListener('DOMContentLoaded',function () {
    $("#close").click(function() {
      window.close();
    });
});

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

