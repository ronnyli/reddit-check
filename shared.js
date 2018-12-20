function isBlacklisted(tab, actionOnTrue, actionOnElse) {
    var url = tab.url
    chrome.storage.sync.get(['blacklist', 'blacklist_edited'], function (storageMap) {
        var isBlocked = false
        if ((!storageMap['blacklist_edited']) || storageMap['blacklist']){
            var list = storageMap['blacklist'] || [];
            if (!storageMap['blacklist_edited']) {
                // add default blacklist items
                list.push('www.google', 'mail.google');
            }
            for (var i=0; i<list.length; ++i) {
                if (url.indexOf(list[i]) > -1) {
                    isBlocked = true
                    break
                }
            }
        } 
        if (isBlocked) {
            actionOnTrue(tab)
        } else {
            actionOnElse(tab)
        }
    });
}

function getAge(created_utc) {
    var now = new Date();
    var date_now = new Date(now.getUTCFullYear(), now.getUTCMonth(),
        now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var date_entry = new Date(created_utc*1000).getTime();
    var one_day = 86400000; // milliseconds per day
    var days = (date_now - date_entry) / one_day;
    var age = days.toFixed(1) + " days ago";
    return age;
}

function numToString(score) {
    const thousands = score / 1000;
    if ((thousands / 1000) >= 1) {
        return `${(thousands / 1000).toFixed(1)}m`
    } else if (thousands >= 1) {
        return `${thousands.toFixed(1)}k`
    } else {
        return score.toString();
    }
}
