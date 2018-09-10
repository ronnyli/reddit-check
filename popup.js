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
    var now = new Date();
    var date_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), 
        now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()); 
    var date_entry; 
    var one_day = 86400000; // milliseconds per day
    var resubmitUrl = "https://www.reddit.com/submit?resubmit=true&url=" + encodedUrl;
    redditPosts.sort(comparePosts)
    var permalinks = [];
    for( var i=0; entry = redditPosts[i]; i++) {
            date_entry = new Date(entry.created_utc*1000).getTime();
            permalinks[i] = {
                id: entry.id,
                link: entry.permalink,
                title: entry.title,
                score: entry.score+"",
                age: (date_now-date_entry)/one_day,
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
            <div class='score'>${permalink.score}</div>
            <a href='${buildCommentUrl(permalink)}' title='${permalink.link}'>${permalink.title}</a>
            <div class='age'>${getAge(permalink.age)}
                &nbsp;&nbsp;${permalink.comments} comments
                &nbsp;&nbsp;<a href='http://www.reddit.com/${permalink.subreddit}' target='_blank'>${permalink.subreddit}</a>
                &nbsp;&nbsp;u/${permalink.author}
            </div>
        </li>`
    );
}

function postHtml(index, permalink) {
    $("#links").append(`
        <div style="">
            <div>
                <div class="scrollerItem ky6nl9-18 ekZcUT Post ${permalink.id}  b0pisp-0 bcykdr" id="${permalink.id}" tabindex="-1">
                    <div class="YA9IzN0YR-G5_oD5EUydl">
                        <div class="_3YgWdffoKyCp7UaGAEQpoo">
                            <div class="ky6nl9-4 hPvHME">
                                <div class="ky6nl9-2 imqJCn">
                                    <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="upvote" aria-pressed="false" data-click-id="upvote">
                                        <div class="_3wVayy5JvIMI67DheMYra2 dplx91-0 hsuuJr">
                                            <i class="small material-icons _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn">arrow_drop_up</i>
                                        </div>
                                    </button>
                                    <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
                                        <div class="jR747Vd1NbfaLusf5bHre s1y8gf4b-0 kHKydv">
                                            <i class="small material-icons ZyxIIl4FP5gHGrJDzNpUC _2GCoZTwJW7199HSwNZwlHk">arrow_drop_down</i>
                                        </div>
                                    </button>
                                </div>
                                <div class="ky6nl9-3 jpXmlO">
                                    <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="upvote" aria-pressed="false" data-click-id="upvote">
                                        <div class="_2q7IQ0BUOWeEZoeAxN555e dplx91-0 hsuuJr">
                                            <i class="small material-icons _2Jxk822qXs4DaXwsN7yyHA">arrow_drop_up</i>
                                        </div>
                                    </button>
                                    <div class="_1rZYMD_4xY3gRcSS3p8ODO" style="color: rgb(26, 26, 27);">${permalink.score}</div>
                                    <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
                                        <div class="_1iKd82bq_nqObFvSH1iC_Q s1y8gf4b-0 kHKydv">
                                            <i class="small material-icons ZyxIIl4FP5gHGrJDzNpUC">arrow_drop_down</i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="_1poyrkZ7g36PawDueRza-J ky6nl9-1 hOHJXs">
                            <div class="WnMeTcero48dKo501T-19">
                                <div class="ky6nl9-9 kPovga" data-click-id="body">
                                    <div class="s5kz2p-1 gXkDPp">
                                        <span class="y8HYJ-y_lTUHkQIc1mdCq">
                                            <a data-click-id="body" class="SQnoC3ObvgnGjWt90zD9Z" href="${buildCommentUrl(permalink)}">
                                                <h2 class="s5kz2p-0 fNQhzP">${permalink.title}</h2>
                                            </a>
                                        </span>
                                        <div class="_1wrPey753PxLyLbB0NCEZP"></div>
                                    </div>
                                    <div class="_1xomvNxK4aHGoGa-YDw1Mc">
                                        <span class="h5svje-0 cFQOcm">${permalink.score} points</span>
                                        <span class="h5svje-0 cFQOcm"> · </span>
                                        <span class="h5svje-0 cFQOcm">${permalink.comments} comment(s)</span>
                                        <span class="h5svje-0 cFQOcm"> · </span>
                                        <a href="http://www.reddit.com/${permalink.subreddit}" target="_blank">
                                            <span class="h5svje-0 cFQOcm">${permalink.subreddit}</span>
                                        </a>
                                        <span class="h5svje-0 cFQOcm"> Posted by </span>
                                        <a class="_2tbHP6ZydRpjI44J3syuqC s1461iz-0 fpcrlm" data-click-id="user" href="https://www.reddit.com/user/${permalink.author}" target="_blank">u/${permalink.author}</a>
                                    </div>
                                    <div class="_3AStxql1mQsrZuUIFP9xSg ky6nl9-10 bLCqLa">
                                        <a class="s1i3ufq7-0 bsfRLa" data-click-id="subreddit" href="http://www.reddit.com/${permalink.subreddit}" target="_blank">${permalink.subreddit}</a>
                                        <span class="s1dvci6o-0 hYPqQt" role="presentation"> &middot; </span>
                                        <span class="_2fCzxBE1dlMh4OFc7B3Dun">Posted by</span>
                                        <div class="wx076j-0 hPglCh">
                                            <a class="_2tbHP6ZydRpjI44J3syuqC s1461iz-1 gWXVVu" href="https://www.reddit.com/user/${permalink.author}" target="_blank">u/${permalink.author}</a>
                                            <div id="UserInfoTooltip--${permalink.id}"></div>
                                        </div>
                                        <a class="_3jOxDPIQ0KaOWpzvSQo-1s" data-click-id="timestamp" href="${buildCommentUrl(permalink)}" id="PostTopMeta--Created--false--${permalink.id}" rel="nofollow noopener">${getAge(permalink.age)}</a>
                                    </div>
                                    <div class="ky6nl9-11 gaQWhZ"></div>
                                </div>
                                <div class="ky6nl9-12 kKLlzI">
                                    <a rel="nofollow" data-click-id="comments" data-test-id="comments-page-link-num-comments" class="_1UoeAeSRhOKSNdY_h3iS1O _1Hw7tY9pMr-T1F4P1C-xNU ky6nl9-14 bLBpaK" href="${buildCommentUrl(permalink)}">
                                        <i class="small material-icons _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC" role="presentation">mode_comment</i>
                                        <span class="FHCV02u6Cp2zYL0fhQPsO">${permalink.comments}</span>
                                    </a>
                                    <div class="ky6nl9-13 cNPySB s1myzq5k-1 cJDeHo"></div>
                                    <div>
                                        <button class="s9zeh3a-14 ecIAkj yla1lg-1 ejDVeC" aria-expanded="false" aria-haspopup="true" aria-label="more options" id="${permalink.id}-overflow-menu">
                                            <i class="small material-icons yla1lg-2 dBJXeP">more_horiz</i>
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

function getAge (days) {
    var age = days.toFixed(1) + " days ago";
    return age;
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

