

function parseCurrentUrl(callback) {
    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    callback(query)
}

function iterateComments(index, comment, archived, parent_ids=[]) {
    var commentHTML = renderComment(comment, archived, parent_ids);

    if (comment.replies.length > 0) {
        commentHTML += `<ul>`;
        $.each(comment.replies, (index, child) =>{
            if (parent_ids.length < child.depth) {
                parent_ids = parent_ids.concat(comment.id)
            } else {
                parent_ids = parent_ids.slice(0, child.depth)
            }
            commentHTML += iterateComments(index, child, archived, parent_ids);
        });
        commentHTML += `</ul>`;
    }
    commentHTML += '</li>';
    return commentHTML;
}

function renderComment(comment, archived, parent_ids) {
    return `
    <li class="s136il31-0 cMWqxb" id="${comment.id}-collapsed" tabindex="-1" style="display:none">
        <div class="Comment ${comment.id} c497l3-5 MAIAY">
            <button class="${comment.id} c497l3-0 jtKgEe">
                <i class="icon icon-expand qjrkk1-0 JnYFK"></i>
            </button>
            <div class="c497l3-4 bWacBs">
                <div class="c497l3-3 cFXBbI">
                    <div>
                        <a class="s1461iz-1 RVnoX" href="https://www.reddit.com/user/${comment.author}" target="_blank">${comment.author}</a>
                    </div>
                    <span class="h5svje-0 cFQOcm">${numToString(comment.score)} points</span>
                    <span class="h5svje-0 cFQOcm"> &middot; </span>
                    <a class="s17xjtj0-13 hsxhRU" href="https://www.reddit.com/${comment.permalink}" id="CommentTopMeta--Created--t1_e7i7pcvinOverlay" rel="nofollow" target="_blank">
                        <span>${getAge(comment.created_utc)}</span>
                    </a>
                </div>
            </div>
        </div>
    </li>
    <li id='${comment.id}' class="s136il31-0 cMWqxb" tabindex="-1">
        <div class="fxv3b9-1 jDSCcP">
            <div class="fxv3b9-2 czhQfm">
                <div class="${comment.id} fxv3b9-0 efNcNS"><i class="threadline"></i></div>
            </div>
        </div>
        <div class="Comment ${comment.id} c497l3-5 MAIAY">
            <div class="c497l3-2 eUvHWc">
                <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="upvote" aria-pressed="false" data-click-id="upvote">
                    <div class="_3wVayy5JvIMI67DheMYra2 dplx91-0 buaDRo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA _39UOLMgvssWenwbRxz_iEn"></i></div>
                </button>
                <button class="cYUyoUM3wmgRXEHv1LlZv" aria-label="downvote" aria-pressed="false" data-click-id="downvote">
                    <div class="jR747Vd1NbfaLusf5bHre s1y8gf4b-0 hxcKpF"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC _2GCoZTwJW7199HSwNZwlHk"></i></div>
                </button>
            </div>
            <div class="c497l3-4 jHfOJm">
                <span class="s1dqr9jy-0 imyGpC">level 1</span>
                <div class="c497l3-3 clkVGJ s17xjtj0-21 heFPGG">
                    <div class="wx076j-0 hPglCh">
                        <a class="s1461iz-1 RVnoX" href="https://www.reddit.com/user/${comment.author}" target="_blank">${comment.author}</a>
                    </div>
                    <span class="h5svje-0 cFQOcm">${numToString(comment.score)} points</span>
                    <span class="h5svje-0 cFQOcm"> &middot; </span>
                    <a class="s17xjtj0-13 hsxhRU" href="https://www.reddit.com/${comment.permalink}" id="CommentTopMeta--Created--t1_e7i7pcvinOverlay" rel="nofollow" target="_blank">
                        <span>${getAge(comment.created_utc)}</span>
                    </a>
                </div>
                <div>
                    <div class="c497l3-6 eCeBkc s1hmcfrd-0 ckueCN">
                        ${comment.body_html}
                    </div>
                    <div>
                        <div class="s5kaj4p-8 dtnsqo">
                            ${archived ? "":
                                `<button class="s5kaj4p-9 hNSNDN reply_button">
                                    <i class="icon icon-comment _3ch9jJ0painNf41PmU4F9i s5kaj4p-0 domCcm"></i>Reply
                                </button>`
                            }
                            <div id="t1_e7i7pcv-comment-share-menu">
                                <button class="s5kaj4p-9 hNSNDN">Share</button>
                            </div>
                            <button class="s5kaj4p-9 hNSNDN">Report</button>
                            <button class="s5kaj4p-9 hNSNDN">Save</button>
                            <button class="s5kaj4p-9 hNSNDN">Give gold</button>
                        </div>
                    </div>
                    <form></form>
                </div>
            </div>
            <form></form>
        </div>`
    // missing </li> tag because I need to delay closing until later
    ;
}

function appendComment(index, comment, archived, $element) {
    $element.append(iterateComments(index, comment, archived));

    $('.reply_button').off('click').click(function() {
        const $this = $( this );
        logInReddit(function(status) {
            var comment_id = $this.closest('li').attr('id');
            const $form = $this.parents().eq(1).siblings('form');;
            displayReplyComment(comment_id, $form, 'comment');
        });
    });
    $('.threadline').off('click').click(function() {
        const comment_id = $( this ).parent()[0].classList[0];
        $('#' + comment_id).hide();
        $('#' + comment_id + '-collapsed').show();
    });
    $('.icon-expand').off('click').click(function() {
        const comment_id = $( this ).parent()[0].classList[0];
        $('#' + comment_id).show();
        $('#' + comment_id + '-collapsed').hide();
    });

    $('.ckueCN a').each(function () {
        $( this ).attr('title', $( this ).attr('href'));
    });
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
            appendComment(index, comment, archived, $('#comments'));
        });
    }

    if (!archived) {
        const $form = $('#reply_post');
        $form.click(function () {
            logInReddit(status => {});
        });
        displayReplyComment(submission_id, $form, 'submission');
    }
    $('#post').append(renderPostContent(submission));
    $('.ckueCN a').each(function () {
        $( this ).attr('title', $( this ).attr('href'));
    });
}

function displayReplyComment(comment_id, $form, replyable_content_type) {
    console.log('Reply to ' + comment_id);

    if ($form.children().length == 0) {
        $form.append(renderReplyComment(comment_id, replyable_content_type));
        const converter = new Markdown.getSanitizingConverter();
        const editor = new Markdown.Editor(converter, '-' + comment_id);
        editor.run();
        // TODO: better handling of this function
        $('.cancel_reply').click(function(event) {
            const $this = $( this );
            event.preventDefault();
            $this.closest('form').toggle();
        });
        // TODO: better handling of this function
        $form.submit(function(event) {
            event.preventDefault();
            leaveComment(comment_id,
                $(`#wmd-input-${comment_id}`).val(),
                replyable_content_type,
                function (response) {
                    if (response.id) {
                        $form.hide(0);
                        const parent_id = comment_id;
                        let $parent;
                        if (replyable_content_type == 'comment') {
                            if ($('#' + parent_id).children('ul').length == 0) {
                                $('#' + parent_id).append('<ul></ul>');
                            }
                            $parent = $('#' + parent_id).children('ul');
                        } else if (replyable_content_type == 'submission') {
                            $parent = $('#comments');
                        }
                        appendComment(-1, response, false, $parent);
                        // TODO: individual status div per reply box
                        $("#status").html("<span>Successful post</span>")
                    } else {
                        // TODO: better error handling
                        $form.hide(0);
                        $("#status").html(`<span>${response}</span>`);
                        console.log('Status of failed post:');
                        console.log(response);
                }
            });
        });
    } else {
        $form.toggle();
    }
}

function renderReplyComment(comment_id, replyable_content_type) {
    return `
        <div id="wmd-button-bar-${comment_id}"></div>
        <textarea id="wmd-input-${comment_id}" class="wmd-input" placeholder="Write your comment here using Markdown. You'll see a live preview of how your comment will look below this box."></textarea>
        <div class="jvfwx7-0 gJASDC">
            <div class="s1ly6fn0-7 dxkxnq">
                <div class="s1htkqit-0 dkOnao">
                    <div class="s1l8ionp-0 dmKBhh">
                        <div class="s1ly6fn0-0 knfJib">
                            Live Preview
                        </div>
                    </div>
                </div>
                <div class="s1ly6fn0-9 btsuju">
                    <div id="wmd-preview-${comment_id}" class="wmd-panel wmd-preview"></div>
                </div>
            </div>
        </div>
        <div class="s1htkqit-4 kALOUK">
            <button class="s1htkqit-1 htkhll" type="submit">Reply</button>
            ${replyable_content_type=='comment' ? `
                <button class="s1htkqit-3 lcYWzy cancel_reply" type="reset">
                    CANCEL
                </button>`: ''
            }
        </div>
        `;
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
                ${submission.selftext_html ? `
                    <div class="s1knm1ot-5 gGDEPn s1hmcfrd-0 ckueCN">
                        ${submission.selftext_html}
                    </div>
                    `: ""
                }
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
                            <span class="FHCV02u6Cp2zYL0fhQPsO">${numToString(submission.num_comments)} comments</span>
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
                    <div class="t4Hq30BDzTeJ85vREX7_M"><span>${Math.floor(submission.upvote_ratio * 100)}% Upvoted</span></div>
                </div>
            </div>
        </div>
    </div>`
}

$(document).ready(function(){
    $("#archived").hide();

    var window_url = new URI(window.location.href);
    var query = window_url.search(true);

    parseCurrentUrl(function(query) {
        var submission = lscache.get("Submission:" + query.id);
        if ((submission.comments && submission.comments.length > 0) ||
             query.num_comments === 0) {
            makeDisplay(submission);
        } else {
            getSubmission(query.id, makeDisplay);
        }
    });

});
