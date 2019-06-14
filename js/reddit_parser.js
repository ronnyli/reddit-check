const snoo = require('./snoowrap_background');

function findLinksText(text) {
    links = [];
    URI.withinString(text, function(url) {
        links.push(url);
        return url;
    });
    return links;
}

function _parseReddit(content) {
    const fullname = content.name || 't1_' + content.id;
    const content_type = fullname.split('_')[0];
    let txt_promise;
    if (content_type == 't3') {
        if (content.domain) {  // link post
            txt_promise = snoo.getSnoowrapRequester()
            .then(r => r.getSubmission(fullname).fetch())
            .then(submission => {
                const replies = submission.replies.map(reply => reply.body);
                return replies.join(' ');
            });
        } else {  // selftext post
            text = content.selftext;
        }
    } else if (content_type == 't1') {  // comment
        text = content.body;
    }
    txt_promise = txt_promise || new Promise(resolve => resolve(text));
    return txt_promise
    .then(findLinksText)
    .then(links => links.map(link => {return {
        link: link,
        content: content
    }}));
}

function _groupby(arr, key) {
    return arr.reduce((acc, elem) => {
        acc[elem[key]] = acc[elem[key]] || [];
        acc[elem[key]].push(elem);
        return acc;
    }, Object.create(null));
}

function findLinks(listing) {
    let all_links = [];
    let listing_filtered = [];
    listing.map(elem => {
        const links = _parseReddit(elem);  // [{link: link, content: elem}]
        links.length > 0 ? listing_filtered.push(elem) : undefined;
        links.forEach(link => {
            all_links.push(link);
        });
    });
    return _groupby(all_links, key='link');
}

exports.findLinks = findLinks;
