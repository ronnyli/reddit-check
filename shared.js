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
    const now_date = moment.utc();
    const created_date = moment.unix(created_utc).utc();
    const age = moment.preciseDiff(created_date, now_date, true);
    if (age['firstDateWasLater']) {
        return 'Just Now';
    } else {
        let max_index = -1;
        let max_unit = 'seconds';
        let max_num = 0;
        Object.keys(age).forEach(function(key) {
            switch (key) {
                case 'years':
                    date_index = 5;
                    break;
                case 'months':
                    date_index = 4;
                    break;
                case 'days':
                    date_index = 3;
                    break;
                case 'hours':
                    date_index = 2;
                    break;
                case 'minutes':
                    date_index = 1;
                    break;
                case 'seconds':
                    date_index = 0;
                    break;
            }
            if (age[key] > 0 && date_index > max_index) {
                max_index = date_index;
                max_unit = key;
                max_num = age[key];
            }
        })
        const pluralized = max_num == 1 ? max_unit.substring(0, max_unit.length - 1) : max_unit;
        return max_num.toString() +
            ' ' +
            pluralized +
            ' ' +
            'ago';
    }
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
