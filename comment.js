function getSubmissionComments(id, callback)  {
    chrome.runtime.sendMessage({
        'action' : 'getSubmissionComments',
        'id' : id
    }, callback)
}

function parseCurrentUrl(callback) {
    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    callback(query)
}

// Nested comments don't expand (only top-level comments)

function iterateComments(index, comment) {
    var commentHTML = renderComment(comment);

    if (comment.replies.length > 0) {
        commentHTML += `
            <div class="collapsible-body">
                <div class="row">
                    <div class="col s12 m12">
                        <ul class="collapsible" data-collapsible="accordion">`;
        $.each(comment.replies, (index, comment) =>{
            commentHTML += iterateComments(index, comment);
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

function renderComment(comment) {
    // return `<li>${comment.score}</li>
    //     dsfskfl
    // `
    return "<li>"+
    "<div class='collapsible-header'>"+
    "<div class='score'>"+comment.score+"</div>"+
    comment.body+
    "<div class='age'>" + comment.replies.length + " comments,"+
     "&nbsp;&nbsp;u/" + comment.author +
    "</div>"+
    "</div>"
}


function makeDisplay(redditComments) {
    $.each(redditComments, function(index, comment) {
        $("#comments").append(
            iterateComments(index, comment)
        );
    });
}

$(document).ready(function(){
    $("#close").click(function() {
      window.close();
    });

    var window_url = new URI(window.location.href);
    var query = window_url.search(true);
    $("#title").append(query.title);

    parseCurrentUrl(function(query) {
        if (query.num_comments > 0) {
            $("#no_results").hide();
            var comments = lscache.get("Comments:" + query.id);
            if (comments != null) {
                makeDisplay(comments);
            } else {
                getSubmissionComments(query.id, makeDisplay);
            }
        }
    });
});
