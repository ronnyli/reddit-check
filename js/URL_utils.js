function trimURL(url, http_only){
    let trimmed;
    const is_youtube_video = (url.indexOf('youtube.com') != -1 && url.indexOf('v=') != -1);
    if (url.indexOf('http') == -1) {
        trimmed = url;
    } else {
        trimmed = url.split('://')[1];
    }
    if (http_only || is_youtube_video) {
        // only trim http and nothing else
        return trimmed;
    } else {
    return trimmed
        .split('#')[0]
        .split('?')[0];
    }
}

function getYoutubeURLs(url){
    var gotVidId = false;
    var video_id = '';
    var urls = []
    if (url.indexOf('v=') != -1) {
        var video_id = url.split('v=')[1];
        if (video_id != "")
              gotVidId = true;
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
              video_id = video_id.substring(0, ampersandPosition);
        }
    }
    if (gotVidId) {
        var prefixes = [
            'www.youtube.com/watch?v=',
            'youtu.be/'
        ];
        prefixes.forEach(function(prefix) {
			urls.push(prefix + video_id);
		});
    }
    return urls;
}

function getCanonicalUrl(callback) {
    chrome.tabs.executeScript({
        code: `document.querySelector("link[rel='canonical']").href;`
    }, function(results) {
        if (chrome.runtime.lastError) {
            callback(null);
        } else {
            const canonical_url = results ? results[0] : null;
            callback(canonical_url);
        }
    });
};

function getTabUrl(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        let tab = tabs[0];
        let url_raw = tab.url;
        if (url_raw.indexOf('?') == -1 && url_raw.indexOf('#') == -1) {
            callback(url_raw);
        } else {
            getCanonicalUrl(canonical_url => {
                canonical_url ? callback(canonical_url) : callback(url_raw);
            });
        }
    });
}

exports.trimURL = trimURL;
exports.getCanonicalUrl = getCanonicalUrl;
exports.getTabUrl = getTabUrl;
exports.getYoutubeURLs = getYoutubeURLs;
