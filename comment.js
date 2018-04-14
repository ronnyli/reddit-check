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

const iterateComments = (index, comment) => {
    let commentHTML = renderComment(index, comment);

    if (comment.replies.length > 0) {
        commentHTML += "<ul>";
        $.each(comment.replies, (index, comment) =>{
            commentHTML += iterateComments(index, comment);
        });
        // comment.replies.forEach((element,index) => {
            
        // });

        // for (let i = 0; i < comment.replies.length; i++) {

        // }

        commentHTML += "</ul>";
    }

    return commentHTML;
}

const renderComment = (comment) => {
    // return `<li>${comment.score}</li>
    //     dsfskfl
    // `
    return "<li>"+
    "<div class='score'>"+comment.score+"</div>"+
    comment.body+
    "<div class='age'>" + comment.replies.length + " comments,"+
     "&nbsp;&nbsp;u/" + comment.author +
    "</div>"+
    "</li>"
}


function makeDisplay(redditComments) {
    $.each(redditComments, function(index, comment) {
        $("#links").append(
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
