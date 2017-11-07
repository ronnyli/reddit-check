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

$(document).ready(function(){
    $("#close").click(function() {
      window.close();
    });

    parseCurrentUrl(function(query) {
        if (query.num_comments > 0) {
            $("#no_results").hide();
            getSubmissionComments(query.id, function(comments) {
                console.log(comments);
            })
        }
    });
});
