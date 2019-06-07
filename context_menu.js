function loginContextMenu(first_run=false) {
    if (chrome.contextMenus) {
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
}

function logoutContextMenu(first_run=false) {
    if (chrome.contextMenus) {
        snoo.getCurrentUserName(function(username) {
            const id = "login_logout";
            let properties = {
                "title": "Sign Out from " + username,
                "contexts": ["browser_action"],
                "onclick": function() {
                    lscache.set('is_logged_in_reddit', null);
                    loginContextMenu(first_run=false);
                }
            };
            if (first_run) {
                properties['id'] = id;
                chrome.contextMenus.create(properties);
            } else {
                chrome.contextMenus.update(id, properties);
            }
            setTimeout(function() {
                // access token expires in an hour
                loginContextMenu(first_run=false);
            }, (1000 * 60 * 59));  // 59 minutes
            return;
        });
    }
}

if (lscache.get('is_logged_in_reddit')) {
    logoutContextMenu(first_run=true);
} else {
    loginContextMenu(first_run=true);
}

if (chrome.contextMenus) {
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
}
