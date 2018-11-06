function loginContextMenu(first_run=false) {
    const id = "login_logout";
    let properties = {
        "title": "Log In",
        "contexts": ["browser_action"],
        "onclick": function() {
            snoo.logInReddit(true, console.log);
        }
    };
    if (first_run) {
        properties['id'] = id;
        chrome.contextMenus.create(properties);
    } else {
        chrome.contextMenus.update(id, properties);
    }
    return;
}

function logoutContextMenu(first_run=false) {
    snoo.getCurrentUserName(function(username) {
        const id = "login_logout";
        let properties = {
            "title": "Sign Out from " + username,
            "contexts": ["browser_action"],
            "onclick": function() {
                lscache.set('snoowrap_requester_json', null);
                loginContextMenu(first_run=false);
            }
        };
        if (first_run) {
            properties['id'] = id;
            chrome.contextMenus.create(properties);
        } else {
            chrome.contextMenus.update(id, properties);
        }
        return;
    });
}

if (lscache.get('snoowrap_requester_json')) {
    logoutContextMenu(first_run=true);
} else {
    loginContextMenu(first_run=true);
}

const donateMenuId = chrome.contextMenus.create({
    "title": "Donate",
    "contexts": ["browser_action"],
    "onclick": function() {
        const paypalURL = "https://www.paypal.me/ThreddExtension";
        $("<a>")
        .attr("href", paypalURL)
        .attr("target", "_blank")[0]
        .click();
    }
});
