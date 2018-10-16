

function isLoggedIn($this, callback) {
    // TODO: need to generalize this function b/c it needs to at least work with top-level comment box as well
    // TODO: or I could handle this logic in background.js (wrapping every function that requires login by default)
    const snoo_json = lscache.get('snoowrap_requester_json');
    if (snoo_json) {
        var comment_id = $this.closest('li').attr('id');
        const $form = $this.siblings('form');
        displayReplyComment(comment_id, $form, 'comment');
    } else {
        callback();
    }
}

function parseCurrentUrl(callback) {
    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    callback(query)
}

function iterateComments(index, comment, archived) {
    var commentHTML = renderComment(comment, archived);

    if (comment.replies.length > 0) {
        commentHTML += `
            <div class="collapsible-body">
                <div class="row">
                    <div class="col s12 m12">
                        <ul class="collapsible" data-collapsible="collapsible">`;
        $.each(comment.replies, (index, comment) =>{
            commentHTML += iterateComments(index, comment, archived);
        });

        commentHTML += `
                        </ul>
                    </div>
                </div>
            </div>`;
    }
    commentHTML += '</li>';
    return commentHTML;
}

function renderComment(comment, archived) {
    return `<li id='${comment.id}'>
    <div class='collapsible-header'>
    <div class='score'>${comment.score}</div>
    ${comment.body}
    <div class='age'> ${comment.replies.length} comments,
     &nbsp;&nbsp;u/${comment.author}
    </div>
    ${archived ? "": "<a class='reply_button' href='#'>REPLY</a>"}
    <form></form>
    </div>`
    // missing </li> tag because I need to delay closing until later
    ;
}

function makeDisplay(submission) {
    var redditComments = submission.comments;
    var archived = submission.archived;
    var submission_id = submission.id;

    if (archived) {
        $("#archived").show();
    }

    if (redditComments.length > 0) {
        $("#no_results").hide();

        $.each(redditComments, function(index, comment) {
            $("#comments").append(
                iterateComments(index, comment, archived)
            );
        });
        $('.collapsible').collapsible();

        $('.reply_button').click(function() {
            const $this = $( this );
            isLoggedIn($this, function() {
                logInReddit(function(status) {
                    console.log('Login status: ' + status);
                    isLoggedIn($this, function() {
                        $("#status").append("<span>Problem logging in. Try again.</span>");
                    })
                });
            });
        });
    }

    if (!archived) {
        // TODO: unify log-in logic that is getting a bit out of hand
        const $form = $('#reply_post');
        if (lscache.get('snoowrap_requester_json') == null) {
            $form.click(function () {
                logInReddit(function(status) {
                    console.log('Login status: ' + status);
                })
            });
        }
        displayReplyComment(submission_id, $form, 'submission');
    }
    $('#post').append(renderPostContent(submission));
}

function displayReplyComment(comment_id, $form, replyable_content_type) {
    console.log('Reply to ' + comment_id);

    if ($form.children().length == 0) {
        $form.append(renderReplyComment(comment_id));
        // TODO: better handling of this function
        $('.cancel_reply').click(function(event) {
            event.preventDefault();
            $form.toggle();
        });
        // TODO: better handling of this function
        $form.submit(function(event) {
            event.preventDefault();
            leaveComment(comment_id,
                $(`#reply_${comment_id}`).val(),
                replyable_content_type,
                function (status) {
                if (status == 'Success') {
                    $form.hide(0);
                    // TODO: individual status div per reply box
                    $("#status").append("<span>Successful post</span>")
                } else {
                    // TODO: better error handling
                    $form.hide(0);
                    console.log('Status of failed post:');
                    console.log(status);
                }
            });
        });
    } else {
        $form.toggle();
    }
}

function renderReplyComment(comment_id) {
    return `
        <textarea id="reply_${comment_id}" class="materialize-textarea reply_box"></textarea>
        <label for="reply_${comment_id}">Add a reply</label>
        <button class="btn waves-effect waves-light" type="submit">REPLY</button>
        <button class="btn waves-effect waves-light transparent grey-text cancel_reply">CANCEL</button>`;
}

function renderPostContent(submission) {
    return `
    <div class="s1knm1ot-9 jcdeKe _2rszc84L136gWQrkwH6IaM Post ${submission.id}  s1r9phcq-0 kpzJdf" id="${submission.id}" tabindex="-1">
        <div data-test-id="post-content">
            <div class="_1KNG36IrXcP5X-eLQsMjZb">
                <div class="_23h0-EcaBUorIHC-JZyh6J" style="width: 40px; border-left: 4px solid transparent;">
                    <div class="s1loulka-0 glokqy">
                        <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="upvote" aria-pressed="false" data-click-id="upvote" id="vote-button-${submission.id}">
                            <div class="_2q7IQ0BUOWeEZoeAxN555e dplx91-0 buaDRo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div>
                        </button>
                        <div class="_1rZYMD_4xY3gRcSS3p8ODO" style="color: rgb(26, 26, 27);">${numToString(submission.score)}</div>
                        <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
                            <div class="_1iKd82bq_nqObFvSH1iC_Q s1y8gf4b-0 hxcKpF"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div>
                        </button>
                    </div>
                </div>
                <div class="s11bh4ne-0 kESrVn">
                    <div class="cZPZhMe-UCZ8htPodMyJ5">
                        <div class="_3AStxql1mQsrZuUIFP9xSg nU4Je7n-eSXStTBAPMYt8">
                            <a class="s1i3ufq7-0 bsfRLa" data-click-id="subreddit" href="http://www.reddit.com/${submission.subreddit_name_prefixed}" target="_blank">${submission.subreddit_name_prefixed}</a>
                                <span class="gc8rbp-0 hFyNNd" role="presentation"> &middot; </span>
                                <span class="_2fCzxBE1dlMh4OFc7B3Dun">Posted by</span>
                            <div class="wx076j-0 hPglCh">
                                <a class="_2tbHP6ZydRpjI44J3syuqC s1461iz-1 gWXVVu" href="https://www.reddit.com/user/${submission.author}" target="_blank">u/${submission.author}</a>
                            </div>
                            <div class="_3jOxDPIQ0KaOWpzvSQo-1s" data-click-id="timestamp" id="PostTopMeta--Created--true--${submission.id}">${getAge(submission.created_utc)}</div>
                        </div>
                    </div>
                </div>
                <div class="_1rcejqgj_laTEewtp2DbWG s1knm1ot-0 cKmWbx">
                    <span class="y8HYJ-y_lTUHkQIc1mdCq">
                        <h2 class="s56cc5r-0 lpvuFi" data-redditstyle="true">${submission.title}</h2>
                    </span>
                </div>
                <div class="s1knm1ot-5 gGDEPn s1hmcfrd-0 ckueCN">
                    ${submission.selftext_html}
                </div>
                <!-- IF THIS IS A LINK POST THEN THE BELOW DIV IS NECESSARY ELSE OMIT -->
                ${submission.url ? `
                    <div class="jlrhi6-1 bMGQBc">
                        <a class="b5szba-0 jJNEjo" href="${submission.url}" target="_blank">${submission.url.substring(0, 16)}...
                            <i class="icon icon-outboundLink jlrhi6-0 esUKm"></i>
                        </a>
                    </div>
                    `: ""
                }
                <div class="_1hwEKkB_38tIoal6fcdrt9">
                    <div class="_3-miAEojrCvx_4FQ8x3P-s s1o44igr-2 hbJPLi">
                        <div class="_1UoeAeSRhOKSNdY_h3iS1O _3m17ICJgx45k_z-t82iVuO _2qww3J5KKzsD7e5DO0BvvU">
                            <i class="icon icon-comment _3ch9jJ0painNf41PmU4F9i _3DVrpDrMM9NLT6TlsTUMxC" role="presentation"></i>
                            <span class="FHCV02u6Cp2zYL0fhQPsO">${numToString(submission.comments.length)} comments</span>
                        </div>
                        <div class="s1o44igr-1 hNfrQO" id="${submission.id}-overlay-share-menu">
                            <button class="s1o44igr-0 hlpDWs" data-click-id="share">
                                <i class="icon icon-share xwmljjCrovDE5C9MasZja _1GQDWqbF-wkYWbrpmOvjqJ"></i>
                                <span class="_6_44iTtZoeY6_XChKt5b0">share</span>
                            </button>
                        </div>
                        <button class="s1afabjy-1 hbyVDo b1zwxr-0 hxpTao" role="menuitem">
                            <div class="s1vspxim-0 cpAOsy"><i class="icon icon-save s1lfar2u-2 fIkQLB"></i></div>
                            <span class="s1vspxim-1 iDplM">save</span>
                        </button>
                        <button class="s1afabjy-1 jqIcAC b1zwxr-0 hxpTao" role="menuitem">
                            <div class="s1vspxim-0 cpAOsy"><i class="icon icon-gild s1lfar2u-5 zIdCy">
                                <span class="i729lw-0 ebGXPK"></span></i>
                            </div>
                            <span class="s1vspxim-1 iDplM">Give gold</span>
                        </button>
                        <button class="s1afabjy-1 jqIcAC b1zwxr-0 hxpTao" role="menuitem">
                            <div class="s1vspxim-0 cpAOsy"><i class="icon icon-hide s1lfar2u-0 ksuhiV"></i></div>
                            <span class="s1vspxim-1 iDplM">hide</span>
                        </button>
                        <button class="s1afabjy-1 jqIcAC b1zwxr-0 hxpTao" role="menuitem">
                            <div class="s1vspxim-0 cpAOsy"><i class="icon icon-report _1MDjRAzxk1RSTB12748O1v s1lfar2u-1 jdmklb"><span class="i729lw-0 ebGXPK"></span></i></div>
                            <span class="s1vspxim-1 iDplM">report</span>
                        </button>
                        <div class="pemb51-1 btPZYI"></div>
                        <div>
                            <button class="s1lfar2u-14 ksTfYp mpc6lx-1 iheKDM" aria-expanded="false" aria-haspopup="true" aria-label="more options" id="${submission.id}-overlay-overflow-menu">
                                <i class="icon icon-menu mpc6lx-2 ebwjqI"></i>
                            </button>
                        </div>
                        <div class="_21pmAV9gWG6F_UKVe7YIE0"></div>
                    </div>
                    <div class="t4Hq30BDzTeJ85vREX7_M"><span>${Math.floor(submission.upvote_ratio)}% Upvoted</span></div>
                </div>
            </div>
        </div>
    </div>`
}

$(document).ready(function(){
    $("#close").click(function() {
      window.close();
    });

    $("#archived").hide();

    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    $("#title").append(query.title);

    parseCurrentUrl(function(query) {
        var submission = lscache.get("Comments:" + query.id);
        if (submission != null) {
            makeDisplay(submission);
        } else {
            getSubmission(query.id, makeDisplay);
        }
    });

});
