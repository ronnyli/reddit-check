function getSubmission(id, callback)  {
    chrome.runtime.sendMessage({
        'action' : 'getSubmission',
        'id' : id
    }, callback)
}

function getCurrentUserName(callback)  {
    chrome.runtime.sendMessage({
        'action' : 'getCurrentUserName'
    }, callback)
}

function parseCurrentUrl(callback) {
    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    callback(query)
}

// Nested comments don't expand (only top-level comments)

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
    return `<li id='comment_${comment.id}'>
    <div class='collapsible-header'>
    <div class='score'>${comment.score}</div>
    ${comment.body}
    <div class='age'> ${comment.replies.length} comments,
     &nbsp;&nbsp;u/${comment.author}
    </div>
    ${archived ? "": "<a class='reply_button' href='#'>REPLY</a>"}
    </div>`
    // missing </li> tag because I need to delay closing until later
    ;
}

function makeDisplay(submission) {
    var redditComments = submission.comments;
    var archived = submission.archived;

    $.each(redditComments, function(index, comment) {
        $("#comments").append(
            iterateComments(index, comment, archived)
        );
    });
    $('.collapsible').collapsible();

    $('.reply_button').click(function() {console.log('hi')});
}

function checkLoginStatus() {

}

function renderReplyComment(comment_id) {
    return `
        <textarea id="reply_${comment_id}" class="materialize-textarea reply_box"></textarea>
        <label for="reply_${comment_id}">Add a reply</label>`;
}

$(document).ready(function(){
    $("#close").click(function() {
      window.close();
    });

    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    $("#title").append(query.title);

    parseCurrentUrl(function(query) {
        var submission = lscache.get("Comments:" + query.id);

        if (query.num_comments > 0) {
            $("#no_results").hide();
            if (submission != null) {
                makeDisplay(submission);
            } else {
                getSubmission(query.id, makeDisplay);
            }
        }

        // TODO: render the top-level reply box
        // makeTopLevelCommentBox(submission.archived);
    });

});
