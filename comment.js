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

function makeDisplay(redditComments) {
    $.each(redditComments, function(index, comment) {
        $("#links").append(
            "<li>"+
            "<div class='score'>"+comment.score+"</div>"+
            comment.body+
            "</li>"
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
