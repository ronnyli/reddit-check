

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
