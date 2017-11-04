function interactSnoowrap() {
    var snoo_json;
    var snoowrap_requester;
    var reddit_user;

    function setSnoowrap(snoo_json) {
        snoowrap_requester = new snoowrap({
            userAgent: snoo_json.userAgent,
            clientId: snoo_json.clientId,
            clientSecret: '',
            refreshToken: snoo_json.refreshToken
        });
        snoowrap_requester.getMe().then(u => {
            reddit_user = u;
            console.log(u);
        });
        return;
    }

    return {
        isLoggedIn: function (callback) {
            snoo_json = lscache.get('snoowrap_requester_json');
            if (snoo_json) {
                setSnoowrap(snoo_json);
                callback();
            } else {
                this.getSnoowrap(function() {
                    this.isLoggedIn(callback)
                });
            }
        },

        getSnoowrap: function (callback) {
            chrome.runtime.sendMessage({
                'action' : 'getSnoowrap',
                'interactive' : true
            }, callback)
        },

        snoowrap_requester: snoowrap_requester
    }
}

$(document).ready(function(){
    var snoo = interactSnoowrap();
    snoo.isLoggedIn(
        function() {
            snoowrap_requester.getSubmission(
                function() {
                    var uri = new URI(window.location.href);
                    return uri.search(true).id;
                }())
        })

    $("#close").click(function() {
      window.close();
    });
});
