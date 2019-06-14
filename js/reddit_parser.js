const snoo = require('./snoowrap_background');

function findLinksText(text) {

}

function _parseReddit(content) {
    const fullname = content.name || 't1_' + content.id;
    const content_type = fullname.split('_')[0];
    let text;
    if (content_type == 't3') {
        if (content.domain) {
            // link post
            // join top replies into single string
            snoo.getSubmission(id, submission => {
                const replies = submission.replies.map(reply => reply.body);
                text = replies.join(' ');
            });
            // findLinksText
        } else {
            text = content.selftext;
        }
    } else if (content_type == 't1') {
        text = content.body;
    }
    const links = findLinksText(text);
    return links.map(link => {return {
        link: link,
        fullname: fullname
    }});
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
        const links = _parseReddit(elem);  // [{link: link, fullname: elem.fullname}]
        links.length > 0 ? listing_filtered.push(elem) : undefined;
        links.forEach(link => {
            all_links.push(link);
        });
    });
    return _groupby(all_links, key='link');
}

exports.findLinks = findLinks;
